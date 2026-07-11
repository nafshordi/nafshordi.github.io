#!/usr/bin/env python3
"""Prepare the privacy-screened professional record for the long public CV.

The source is the already-screened LaTeX extracted from the maintained CCV.
Its stale Publications section is deliberately removed: publications are built
independently by refresh_publications.py from arXiv/INSPIRE/ORCID.  The local
slide-file inventory is also deliberately absent; that material belongs in the
website's Talks page, not in the CV.
"""

from __future__ import annotations

import argparse
from pathlib import Path


PUBLICATIONS_MARKER = r"\recordsection{Publications}"
PRIVATE_MARKERS = (
    "Date of Birth",
    "Designated Group",
    "Canadian Residency Status",
    "Country of Citizenship",
    "Confirmation Number",
)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--screened-record", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()

    source = args.screened_record.read_text(encoding="utf-8")
    if PUBLICATIONS_MARKER not in source:
        raise SystemExit(f"Missing expected marker: {PUBLICATIONS_MARKER}")
    professional = source.split(PUBLICATIONS_MARKER, 1)[0].rstrip() + "\n"
    professional = professional.replace(
        r"\cvsection{Complete professional record}",
        r"\cvsection{Professional record}",
        1,
    )
    professional = professional.replace(
        "\\clearpage\n\\recordsection{Presentations}",
        r"\recordsection{Presentations}",
        1,
    )
    professional = professional.replace(
        r"\recordsection{Presentations}",
        "\\recordsection{Presentations}\n\\input{recent-presentations.tex}",
        1,
    )
    found = [marker for marker in PRIVATE_MARKERS if marker.casefold() in professional.casefold()]
    if found:
        raise SystemExit("Privacy check failed: " + ", ".join(found))
    if "Talks and outreach materials archive" in professional:
        raise SystemExit("The slide-file archive must not be embedded in the CV")

    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(professional, encoding="utf-8")
    print(f"Wrote {args.output} ({professional.count(chr(10))} lines)")


if __name__ == "__main__":
    main()
