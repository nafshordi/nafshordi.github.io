#!/usr/bin/env python3
"""Create a light-weight public index of a local talks archive.

The talk files stay in Dropbox.  This script only records safe display metadata
for talk decks and exported slide pages; it deliberately excludes package
contents and presentation asset folders.
"""

from __future__ import annotations

import argparse
import json
import re
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path


SUPPORTED = {
    ".pdf": "PDF",
    ".ppt": "PowerPoint",
    ".pptx": "PowerPoint",
    ".key": "Keynote",
    ".htm": "Web slides",
    ".html": "Web slides",
}
SKIP_DIRECTORIES = {".git", "node_modules", "__MACOSX"}


def display_title(path: Path) -> str:
    title = path.stem.replace("_", " ")
    title = re.sub(r"\s*-\s*copy$", "", title, flags=re.IGNORECASE)
    title = re.sub(r"\s+", " ", title).strip()
    return title or path.name


def category_for(relative_path: Path) -> str:
    return relative_path.parts[0] if len(relative_path.parts) > 1 else "General archive"


def record(path: Path, source: Path, is_directory: bool = False) -> dict[str, object]:
    relative_path = path.relative_to(source)
    extension = ".key" if is_directory else path.suffix.lower()
    year = next((match for match in re.findall(r"(?:19|20)\d{2}", str(relative_path)) if 1900 <= int(match) <= 2100), None)
    stat = path.stat()
    return {
        "title": display_title(path),
        "category": category_for(relative_path),
        "year": year,
        "format": SUPPORTED[extension],
        "path": relative_path.as_posix(),
        "modified": datetime.fromtimestamp(stat.st_mtime, tz=timezone.utc).date().isoformat(),
        "bytes": stat.st_size if not is_directory else None,
    }


def collect(source: Path) -> list[dict[str, object]]:
    items: list[dict[str, object]] = []
    for path in source.rglob("*"):
        relative = path.relative_to(source)
        if any(
            part in SKIP_DIRECTORIES
            or part.endswith("_files")
            or part.lower().endswith(".key") for part in relative.parts[:-1]
        ):
            continue
        if path.is_dir():
            if path.suffix.lower() == ".key":
                items.append(record(path, source, is_directory=True))
            continue
        suffix = path.suffix.lower()
        if suffix not in SUPPORTED:
            continue
        items.append(record(path, source))

    return sorted(
        items,
        key=lambda item: (
            str(item["category"]).casefold(),
            str(item["year"] or "0000"),
            str(item["title"]).casefold(),
        ),
        reverse=False,
    )


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", required=True, type=Path)
    parser.add_argument("--output", required=True, type=Path)
    args = parser.parse_args()

    source = args.source.expanduser().resolve()
    if not source.is_dir():
        raise SystemExit(f"Talks source is not a directory: {source}")
    talks = collect(source)
    payload = {
        "generated_at": datetime.now(tz=timezone.utc).replace(microsecond=0).isoformat(),
        "source_description": "Local My Talks archive (files remain in the source archive).",
        "count": len(talks),
        "by_format": dict(sorted(Counter(str(item["format"]) for item in talks).items())),
        "talks": talks,
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(json.dumps({"count": len(talks), "by_format": payload["by_format"]}, indent=2))


if __name__ == "__main__":
    main()
