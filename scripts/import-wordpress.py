#!/usr/bin/env python3
"""Create a safe, portable content archive from a WordPress WXR export."""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path
from urllib.parse import urlparse

from lxml import etree


NAMESPACES = {
    "content": "http://purl.org/rss/1.0/modules/content/",
    "wp": "http://wordpress.org/export/1.2/",
}


def clean_html(value: str) -> str:
    """Drop executable/editor-only markup while preserving the authored article."""
    value = re.sub(r"<script\b[^>]*>.*?</script>", "", value, flags=re.I | re.S)
    value = re.sub(r"<style\b[^>]*>.*?</style>", "", value, flags=re.I | re.S)
    value = re.sub(r"<!--\s*/?wp:[\s\S]*?-->", "", value)
    value = re.sub(r"\[gallery[^\]]*\]", "", value, flags=re.I)
    value = re.sub(r"\[caption[^\]]*\]", "", value, flags=re.I)
    value = value.replace("[/caption]", "")
    return value.strip()


def path_from_link(link: str, post_type: str, slug: str) -> str:
    path = urlparse(link).path.strip("/")
    if path:
        return f"/{path}/"
    if post_type == "page" and slug == "welcome":
        return "/"
    return f"/{slug}/"


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path)
    parser.add_argument("destination", type=Path)
    args = parser.parse_args()

    tree = etree.parse(
        str(args.source), etree.XMLParser(recover=True, huge_tree=True)
    )
    items = tree.findall("./channel/item")
    content = []

    for item in items:
        post_type = item.findtext("wp:post_type", default="", namespaces=NAMESPACES)
        status = item.findtext("wp:status", default="", namespaces=NAMESPACES)
        if post_type not in {"page", "post"} or status != "publish":
            continue

        title = (item.findtext("title") or "Untitled").strip()
        slug = item.findtext("wp:post_name", default="", namespaces=NAMESPACES)
        link = item.findtext("link", default="")
        body = item.findtext("content:encoded", default="", namespaces=NAMESPACES)
        content.append(
            {
                "title": title,
                "slug": slug,
                "path": path_from_link(link, post_type, slug),
                "type": post_type,
                "date": item.findtext("wp:post_date", default="", namespaces=NAMESPACES)[:10],
                "html": clean_html(body),
            }
        )

    content.sort(key=lambda entry: (entry["type"], entry["date"], entry["title"]))
    args.destination.parent.mkdir(parents=True, exist_ok=True)
    args.destination.write_text(json.dumps(content, ensure_ascii=False, indent=2) + "\n")
    print(f"Wrote {len(content)} published pages and posts to {args.destination}")


if __name__ == "__main__":
    main()
