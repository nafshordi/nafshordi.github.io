# Public CV source

This directory contains the privacy-safe source used for the PDFs published on
the website.

- `professional-record.tex` is generated from the already privacy-screened
  professional record. It intentionally stops before the stale publication
  section.
- `publications.tex` and `data/publications.json` come from the same
  arXiv/INSPIRE/ORCID refresh.
- `recent-presentations.tex` adds verified 2026 talks to the presentation
  section.
- The 570-file slide inventory is not embedded in the CV. It remains in
  `data/talks-catalog.json` for the website's Talks page, where duplicate file
  formats and archival material can be presented appropriately.

Refresh and build from the repository root:

```sh
python3 scripts/prepare_public_cv.py \
  --screened-record "/path/to/ccv-public-record.tex" \
  --output cv/professional-record.tex
python3 scripts/refresh_publications.py \
  --output data/publications.json \
  --latex-output cv/publications.tex
cd cv
PATH="/Library/TeX/texbin:$PATH" pdflatex -interaction=nonstopmode -halt-on-error niayesh-afshordi-cv-long.tex
```

After visual verification, copy `niayesh-afshordi-cv-long.pdf` to
`public/downloads/niayesh-afshordi-academic-cv.pdf` and to the maintained local
Job Applications folder.
