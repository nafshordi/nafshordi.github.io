#!/usr/bin/env python3
"""Check that every imported WordPress path resolves on a running preview."""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from urllib.parse import quote
from urllib.request import urlopen


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("base_url")
    parser.add_argument("content", type=Path)
    args = parser.parse_args()

    entries = json.loads(args.content.read_text())
    failures = []
    for entry in entries:
        path = quote(entry["path"], safe="/%")
        url = args.base_url.rstrip("/") + path
        try:
            with urlopen(url, timeout=15) as response:
                if response.status != 200:
                    failures.append({"path": entry["path"], "status": response.status})
        except Exception as exc:  # noqa: BLE001 - report each broken path
            failures.append({"path": entry["path"], "error": str(exc)})

    result = {"checked": len(entries), "failed": failures}
    print(json.dumps(result, indent=2, ensure_ascii=False))
    if failures:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
