#!/usr/bin/env python3
"""Copy the publicly reachable WordPress attachment library into this project."""

from __future__ import annotations

import argparse
import concurrent.futures
import json
from pathlib import Path
from urllib.parse import unquote, urlparse
from urllib.request import Request, urlopen

from lxml import etree


NAMESPACES = {"wp": "http://wordpress.org/export/1.2/"}


def relative_path(url: str) -> Path | None:
    path = unquote(urlparse(url).path)
    marker = "/wp-content/uploads/"
    if marker not in path:
        return None
    return Path(path.split(marker, 1)[1])


def fetch(url: str, destination: Path) -> tuple[str, str]:
    if destination.exists() and destination.stat().st_size > 0:
        return (url, "existing")
    destination.parent.mkdir(parents=True, exist_ok=True)
    request = Request(url, headers={"User-Agent": "nafshordi-site-migration/1.0"})
    try:
        with urlopen(request, timeout=30) as response:
            destination.write_bytes(response.read())
        return (url, "downloaded")
    except Exception as exc:  # noqa: BLE001 - retain an actionable migration report
        if destination.exists():
            destination.unlink()
        return (url, f"error: {exc}")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path)
    parser.add_argument("media_directory", type=Path)
    parser.add_argument("report", type=Path)
    parser.add_argument("--workers", type=int, default=6)
    args = parser.parse_args()

    root = etree.parse(
        str(args.source), etree.XMLParser(recover=True, huge_tree=True)
    ).getroot()
    jobs: list[tuple[str, Path]] = []
    for item in root.findall("./channel/item"):
        post_type = item.findtext("wp:post_type", default="", namespaces=NAMESPACES)
        url = item.findtext("wp:attachment_url", default="", namespaces=NAMESPACES)
        path = relative_path(url)
        if post_type == "attachment" and path:
            jobs.append((url, args.media_directory / path))

    with concurrent.futures.ThreadPoolExecutor(max_workers=args.workers) as pool:
        results = list(pool.map(lambda job: fetch(*job), jobs))
    report = {
        "total": len(results),
        "downloaded": sum(status == "downloaded" for _, status in results),
        "existing": sum(status == "existing" for _, status in results),
        "failed": [{"url": url, "status": status} for url, status in results if status.startswith("error:")],
    }
    args.report.parent.mkdir(parents=True, exist_ok=True)
    args.report.write_text(json.dumps(report, indent=2) + "\n")
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
