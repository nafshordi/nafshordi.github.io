#!/usr/bin/env python3
"""Build the public publication record from authoritative scholarly sources.

The arXiv author feed is the baseline because it is complete, public, and gives
stable paper identifiers and author order.  INSPIRE enriches those records with
journal/DOI metadata and contributes a small number of non-arXiv publications.
ORCID supplies author-maintained cross-disciplinary records that INSPIRE does
not cover.  Google Scholar is intentionally not scraped: it has no supported
public API and automated access is brittle.
"""

from __future__ import annotations

import argparse
import html
import json
import re
import time
import unicodedata
import urllib.error
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from datetime import date
from pathlib import Path
from typing import Any


ARXIV_QUERY = 'au:"Niayesh Afshordi"'
ARXIV_URL = (
    "https://export.arxiv.org/api/query?"
    + urllib.parse.urlencode(
        {
            "search_query": ARXIV_QUERY,
            "start": 0,
            "max_results": 250,
            "sortBy": "submittedDate",
            "sortOrder": "descending",
        }
    )
)
INSPIRE_AUTHOR_ID = "1023532"
INSPIRE_BAI = "N.Afshordi.1"
INSPIRE_URL = (
    "https://inspirehep.net/api/literature?"
    + urllib.parse.urlencode(
        {"q": f"a {INSPIRE_BAI}", "size": 250, "sort": "mostrecent"}
    )
)
ORCID_ID = "0000-0002-9940-7040"
ORCID_URL = f"https://pub.orcid.org/v3.0/{ORCID_ID}/works"
USER_AGENT = "nafshordi.com-publication-refresh/1.0 (mailto:nafshordi@pitp.ca)"

# ORCID has two older self-asserted records whose titles differ substantially
# from their arXiv records.  The stable ORCID put-codes avoid duplicate entries.
ORCID_ALIASES = {
    50260777: "1806.08822",
    50260779: "1710.09366",
}
ORCID_PUBLICATION_TYPES = {
    "book",
    "book-chapter",
    "conference-paper",
    "edited-book",
    "journal-article",
    "preprint",
}

ATOM_NS = {
    "atom": "http://www.w3.org/2005/Atom",
    "arxiv": "http://arxiv.org/schemas/atom",
    "opensearch": "http://a9.com/-/spec/opensearch/1.1/",
}


def fetch(url: str, accept: str) -> bytes:
    request = urllib.request.Request(
        url,
        headers={"Accept": accept, "User-Agent": USER_AGENT},
    )
    for attempt in range(3):
        try:
            with urllib.request.urlopen(request, timeout=45) as response:
                return response.read()
        except (urllib.error.URLError, TimeoutError):
            if attempt == 2:
                raise
            time.sleep(2**attempt)
    raise RuntimeError(f"Unable to fetch {url}")


def clean_text(value: Any) -> str:
    text = html.unescape(str(value or ""))
    text = "".join(character for character in text if not unicodedata.category(character).startswith("C") or character.isspace())
    return re.sub(r"\s+", " ", text).strip()


def normalize_title(value: str) -> str:
    text = clean_text(value)
    text = re.sub(r"\\(?:text|mathrm|rm|ensuremath|textquoteleft|textquoteright)", "", text)
    text = text.replace("\\Lambda", "Lambda")
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode("ascii")
    return re.sub(r"[^a-z0-9]+", "", text.casefold())


def normalize_doi(value: str | None) -> str | None:
    if not value:
        return None
    doi = clean_text(value).lower()
    doi = re.sub(r"^https?://(?:dx\.)?doi\.org/", "", doi)
    return doi or None


def normalize_arxiv(value: str | None) -> str | None:
    if not value:
        return None
    identifier = clean_text(value)
    identifier = re.sub(r"^https?://arxiv\.org/(?:abs|pdf)/", "", identifier)
    identifier = re.sub(r"\.pdf$", "", identifier)
    identifier = re.sub(r"v\d+$", "", identifier)
    return identifier or None


def date_from_orcid(value: dict[str, Any] | None) -> str | None:
    if not value or not value.get("year"):
        return None
    parts = [str(value["year"]["value"])]
    for key in ("month", "day"):
        part = value.get(key)
        if part and part.get("value"):
            parts.append(str(part["value"]).zfill(2))
        else:
            break
    return "-".join(parts)


def first_identifier(work: dict[str, Any], kind: str) -> str | None:
    identifiers = work.get("external-ids", {}).get("external-id", []) or []
    for identifier in identifiers:
        if clean_text(identifier.get("external-id-type")).casefold() == kind.casefold():
            return clean_text(identifier.get("external-id-value")) or None
    return None


def inspire_author(author: dict[str, Any]) -> str:
    first = clean_text(author.get("first_name"))
    last = clean_text(author.get("last_name"))
    if first or last:
        return clean_text(f"{first} {last}")
    full = clean_text(author.get("full_name"))
    if "," in full:
        last, first = [part.strip() for part in full.split(",", 1)]
        return clean_text(f"{first} {last}")
    return full


def inspire_journal(metadata: dict[str, Any]) -> str | None:
    publications = metadata.get("publication_info") or []
    if not publications:
        return None
    publication = publications[0]
    journal = clean_text(publication.get("journal_title"))
    journal = re.sub(r"\.(?=[A-Z])", ". ", journal)
    volume = clean_text(publication.get("journal_volume"))
    locator = clean_text(publication.get("artid") or publication.get("page_start"))
    year = clean_text(publication.get("year"))
    citation = " ".join(bit for bit in (journal, volume) if bit)
    if locator:
        citation += (", " if citation else "") + locator
    if year:
        citation += f" ({year})"
    return citation or None


def arxiv_records(payload: bytes) -> tuple[list[dict[str, Any]], int]:
    root = ET.fromstring(payload)
    total_node = root.find("opensearch:totalResults", ATOM_NS)
    total = int(total_node.text) if total_node is not None and total_node.text else 0
    records: list[dict[str, Any]] = []
    for entry in root.findall("atom:entry", ATOM_NS):
        identifier = normalize_arxiv(entry.findtext("atom:id", default="", namespaces=ATOM_NS))
        if not identifier:
            continue
        authors = [
            clean_text(author.findtext("atom:name", default="", namespaces=ATOM_NS))
            for author in entry.findall("atom:author", ATOM_NS)
        ]
        authors = [author for author in authors if author]
        title = clean_text(entry.findtext("atom:title", default="", namespaces=ATOM_NS))
        submitted = clean_text(entry.findtext("atom:published", default="", namespaces=ATOM_NS))[:10]
        updated = clean_text(entry.findtext("atom:updated", default="", namespaces=ATOM_NS))[:10]
        doi = normalize_doi(entry.findtext("arxiv:doi", default="", namespaces=ATOM_NS))
        journal = clean_text(
            entry.findtext("arxiv:journal_ref", default="", namespaces=ATOM_NS)
        ) or None
        categories = [category.get("term", "") for category in entry.findall("atom:category", ATOM_NS)]
        records.append(
            {
                "title": title,
                "authors": authors,
                "publication_date": None,
                "arxiv_submitted_date": submitted,
                "updated_date": updated,
                "year": int(submitted[:4]),
                "publication_type": "journal-article" if journal or doi else "preprint",
                "journal": journal,
                "arxiv_id": identifier,
                "arxiv_url": f"https://arxiv.org/abs/{identifier}",
                "doi": doi,
                "doi_url": f"https://doi.org/{doi}" if doi else None,
                "categories": categories,
                "sources": ["arXiv"],
            }
        )
    return records, total


def read_inspire(payload: bytes) -> list[dict[str, Any]]:
    data = json.loads(payload)
    return data.get("hits", {}).get("hits", []) or []


def read_orcid(payload: bytes) -> list[dict[str, Any]]:
    return json.loads(payload).get("group", []) or []


def orcid_work_detail(put_code: int) -> dict[str, Any]:
    url = f"https://pub.orcid.org/v3.0/{ORCID_ID}/work/{put_code}"
    return json.loads(fetch(url, "application/json"))


def merge_records(
    records: list[dict[str, Any]],
    inspire_hits: list[dict[str, Any]],
    orcid_groups: list[dict[str, Any]],
) -> list[dict[str, Any]]:
    by_arxiv = {record["arxiv_id"]: record for record in records if record.get("arxiv_id")}
    by_doi = {record["doi"]: record for record in records if record.get("doi")}
    by_title = {normalize_title(record["title"]): record for record in records}

    for hit in inspire_hits:
        metadata = hit.get("metadata", {})
        arxiv = normalize_arxiv(
            (metadata.get("arxiv_eprints") or [{}])[0].get("value")
        )
        doi = normalize_doi((metadata.get("dois") or [{}])[0].get("value"))
        title = clean_text((metadata.get("titles") or [{}])[0].get("title"))
        record = (by_arxiv.get(arxiv) if arxiv else None) or (by_doi.get(doi) if doi else None)
        record = record or by_title.get(normalize_title(title))
        if record is None:
            year_value = metadata.get("preprint_date") or str(
                (metadata.get("publication_info") or [{}])[0].get("year") or ""
            )
            year = int(str(year_value)[:4]) if str(year_value)[:4].isdigit() else 0
            authors = [inspire_author(author) for author in metadata.get("authors", [])]
            record = {
                "title": title,
                "authors": [author for author in authors if author],
                "publication_date": str(year) if year else None,
                "arxiv_submitted_date": None,
                "updated_date": None,
                "year": year,
                "publication_type": "journal-article" if doi else "publication",
                "journal": inspire_journal(metadata),
                "arxiv_id": arxiv,
                "arxiv_url": f"https://arxiv.org/abs/{arxiv}" if arxiv else None,
                "doi": doi,
                "doi_url": f"https://doi.org/{doi}" if doi else None,
                "categories": (metadata.get("arxiv_eprints") or [{}])[0].get("categories", []),
                "sources": ["INSPIRE"],
            }
            records.append(record)
            if arxiv:
                by_arxiv[arxiv] = record
            if doi:
                by_doi[doi] = record
            by_title[normalize_title(title)] = record
        else:
            if "INSPIRE" not in record["sources"]:
                record["sources"].append("INSPIRE")
            record["doi"] = record.get("doi") or doi
            record["doi_url"] = (
                record.get("doi_url") or (f"https://doi.org/{doi}" if doi else None)
            )
            record["journal"] = inspire_journal(metadata) or record.get("journal")
            publications = metadata.get("publication_info") or []
            inspire_year = publications[0].get("year") if publications else None
            if not record.get("publication_date") and inspire_year:
                record["publication_date"] = str(inspire_year)
                record["year"] = int(inspire_year)
            if doi:
                by_doi[doi] = record

    for group in orcid_groups:
        summaries = group.get("work-summary") or []
        if not summaries:
            continue
        work = summaries[0]
        put_code = int(work.get("put-code"))
        work_type = clean_text(work.get("type"))
        if work_type not in ORCID_PUBLICATION_TYPES:
            continue
        title = clean_text(work.get("title", {}).get("title", {}).get("value"))
        doi = normalize_doi(first_identifier(work, "doi"))
        arxiv = normalize_arxiv(first_identifier(work, "arxiv"))
        alias = ORCID_ALIASES.get(put_code)
        record = (by_arxiv.get(alias) if alias else None)
        record = record or (by_arxiv.get(arxiv) if arxiv else None)
        record = record or (by_doi.get(doi) if doi else None)
        record = record or by_title.get(normalize_title(title))
        publication_date = date_from_orcid(work.get("publication-date"))
        journal = clean_text((work.get("journal-title") or {}).get("value")) or None

        if record is None:
            detail = orcid_work_detail(put_code)
            contributors = detail.get("contributors", {}).get("contributor", []) or []
            authors = [
                clean_text((contributor.get("credit-name") or {}).get("value"))
                for contributor in contributors
                if (contributor.get("contributor-attributes") or {}).get("contributor-role")
                in {None, "author"}
            ]
            authors = [author for author in authors if author]
            if not authors:
                authors = ["Niayesh Afshordi"]
            year = int(publication_date[:4]) if publication_date else 0
            record = {
                "title": title,
                "authors": authors,
                "publication_date": publication_date,
                "arxiv_submitted_date": None,
                "updated_date": None,
                "year": year,
                "publication_type": work_type,
                "journal": journal,
                "arxiv_id": arxiv,
                "arxiv_url": f"https://arxiv.org/abs/{arxiv}" if arxiv else None,
                "doi": doi,
                "doi_url": f"https://doi.org/{doi}" if doi else None,
                "categories": [],
                "sources": ["ORCID"],
            }
            records.append(record)
            if arxiv:
                by_arxiv[arxiv] = record
            if doi:
                by_doi[doi] = record
            by_title[normalize_title(title)] = record
        else:
            if "ORCID" not in record["sources"]:
                record["sources"].append("ORCID")
            if publication_date:
                record["publication_date"] = publication_date
                record["year"] = int(publication_date[:4])
            record["journal"] = record.get("journal") or journal
            record["doi"] = record.get("doi") or doi
            record["doi_url"] = (
                record.get("doi_url") or (f"https://doi.org/{doi}" if doi else None)
            )
            if doi:
                by_doi[doi] = record

    generated = date.today().isoformat()
    for record in records:
        record["date"] = record.get("publication_date") or record.get("arxiv_submitted_date")
        if record.get("publication_date") and record["publication_date"] > generated:
            record["status"] = "forthcoming"
        elif record.get("doi") or record.get("journal"):
            record["status"] = "published"
        else:
            record["status"] = "preprint"
        record["url"] = record.get("doi_url") or record.get("arxiv_url")
        record["sources"] = sorted(set(record["sources"]))

    records.sort(
        key=lambda record: (
            record.get("date") or "0000",
            record.get("arxiv_submitted_date") or "0000",
            normalize_title(record["title"]),
        ),
        reverse=True,
    )
    return records


LATEX_ESCAPES = {
    "\\": r"\textbackslash{}",
    "&": r"\&",
    "%": r"\%",
    "$": r"\$",
    "#": r"\#",
    "_": r"\_",
    "{": r"\{",
    "}": r"\}",
    "~": r"\textasciitilde{}",
    "^": r"\textasciicircum{}",
}


def latex_text(value: str) -> str:
    text = clean_text(value)
    replacements = {
        "Λ": "Lambda",
        "λ": "lambda",
        "Ω": "Omega",
        "ω": "omega",
        "–": "--",
        "—": "---",
        "−": "-",
        "’": "'",
        "“": "``",
        "”": "''",
    }
    for source, target in replacements.items():
        text = text.replace(source, target)
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode("ascii")
    return "".join(LATEX_ESCAPES.get(character, character) for character in text)


def publication_latex(records: list[dict[str, Any]], generated: str) -> str:
    lines = [
        r"\cvsection{Publications}",
        (
            r"{\small\color{muted}Complete public scholarly record refreshed "
            + latex_text(generated)
            + r" from arXiv, INSPIRE, and ORCID. DOI links point to the published version; "
            + r"arXiv links point to the open manuscript.}\par"
        ),
    ]
    grouped: dict[int, list[dict[str, Any]]] = {}
    for record in records:
        grouped.setdefault(int(record.get("year") or 0), []).append(record)
    number = 1
    for year in sorted(grouped, reverse=True):
        label = str(year) if year else "Other"
        lines.append(rf"\recordsubsection{{{label}}}")
        for record in grouped[year]:
            authors = record.get("authors") or ["Niayesh Afshordi"]
            if len(authors) > 12:
                author_text = ", ".join(authors[:8]) + ", et al."
                if not any("afshordi" in author.casefold() for author in authors[:8]):
                    author_text += " (including Niayesh Afshordi)"
            else:
                author_text = ", ".join(authors)
            title = str(record["title"])
            citation = f"{author_text}. {title}"
            if not title.endswith((".", "?", "!")):
                citation += "."
            if record.get("journal"):
                citation += f" {record['journal']}."
            links: list[str] = []
            if record.get("doi"):
                links.append(rf"\href{{{record['doi_url']}}}{{doi:{latex_text(record['doi'])}}}")
            if record.get("arxiv_id"):
                links.append(
                    rf"\href{{{record['arxiv_url']}}}{{arXiv:{latex_text(record['arxiv_id'])}}}"
                )
            rendered = latex_text(citation)
            if links:
                rendered += " " + r"\enspace".join(links)
            lines.append(rf"\recordnumbered{{{number}}}{{{rendered}}}")
            number += 1
    return "\n".join(lines) + "\n"


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", type=Path, default=Path("data/publications.json"))
    parser.add_argument("--latex-output", type=Path)
    args = parser.parse_args()

    arxiv_payload = fetch(ARXIV_URL, "application/atom+xml")
    inspire_payload = fetch(INSPIRE_URL, "application/json")
    orcid_payload = fetch(ORCID_URL, "application/json")
    records, arxiv_total = arxiv_records(arxiv_payload)
    records = merge_records(records, read_inspire(inspire_payload), read_orcid(orcid_payload))
    generated = date.today().isoformat()
    payload = {
        "generated_at": generated,
        "total_count": len(records),
        "arxiv_author_result_count": arxiv_total,
        "source_provenance": {
            "baseline": {
                "name": "arXiv",
                "query": ARXIV_QUERY,
                "url": ARXIV_URL,
            },
            "metadata_enrichment": {
                "name": "INSPIRE",
                "author_id": INSPIRE_AUTHOR_ID,
                "url": f"https://inspirehep.net/authors/{INSPIRE_AUTHOR_ID}",
            },
            "cross_disciplinary_supplement": {
                "name": "ORCID",
                "orcid": ORCID_ID,
                "url": f"https://orcid.org/{ORCID_ID}",
            },
            "manual_cross_check": {
                "name": "Google Scholar",
                "checked_at": generated,
                "url": "https://scholar.google.ca/citations?user=xWZGFlEAAAAJ",
                "observation": (
                    "The public profile exposed 200 rows across its paginated result set, "
                    "including duplicate versions, talks, translations, and research statements."
                ),
            },
            "note": (
                "Google Scholar is linked for discovery and citation counts and was manually "
                "cross-checked, but is not imported automatically because it has no supported "
                "public API and its result rows are not a deduplicated publication record."
            ),
        },
        "publications": records,
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    if args.latex_output:
        args.latex_output.parent.mkdir(parents=True, exist_ok=True)
        args.latex_output.write_text(publication_latex(records, generated), encoding="utf-8")
    print(json.dumps({"output": str(args.output), "total_count": len(records)}, indent=2))


if __name__ == "__main__":
    main()
