# Unified Dashboard — State Assembly Financial Tracker

A lightweight static dashboard that aggregates and visualises declared financial data (bank accounts, assets, loans) from State Legislative Assembly candidate affidavits. The site uses offline JSON/JS data exports and a simple static frontend for fast local preview and research-focused browsing.

## Features

- Overview map of India with interactive state navigation
- Per-state dashboard pages under the `dashboard/` folder
- Self-contained static assets: `hub.html`, `dashboard/*.html`, `dashboard/data/*.js`, `dashboard/common.*`
- Live coverage for selected states (data-ready): TN, KL, WB, AS, PY

## Quick Start

1. Open the site locally by opening `hub.html` in your browser (works for simple preview).
2. For a local static server (recommended), from the project root run:

```powershell
python -m http.server 8000
# or, with Node.js installed:
npx serve .
```

Then open `http://localhost:8000/hub.html` in your browser.

## Project Structure

- `hub.html` — Landing page with interactive India map and quick-select cards
- `dashboard/` — Per-state dashboard pages and shared assets
  - `index.html` — Dashboard entry (reads `?state=XX` query param)
  - `candidate.html`, `candidates.html`, `constituency.html`, `constituencies.html`, `parties.html`, `banks.html` — supporting pages
  - `common.css`, `common.js` — shared styles and client logic
  - `data/` — preprocessed JS data files (e.g. `tn_data.js`, `kl_data.js`, etc.)

## Live States

The map and quick-select currently link to dashboards for these states:

- Tamil Nadu (`TN`)
- Kerala (`KL`)
- West Bengal (`WB`)
- Assam (`AS`)
- Puducherry (`PY`)

## Data Sources & Notes

- Primary data is sourced from candidate affidavits and aggregated via MyNeta (https://myneta.info) and public Election Commission filings.
- All monetary and asset figures are self-declared by candidates and are unverified; treat the data as research-oriented.

## Contributing

If you'd like to add another state or update data files:

1. Add or update a `dashboard/data/<state>_data.js` file following the existing data shape.
2. Ensure `dashboard/index.html` can read the new `state` code via the `?state=XX` query parameter.
3. Send a PR or share the data file and a short README explaining the source and date.

## License & Attribution

This repository does not include a license by default. The data shown is attributed to MyNeta and the Election Commission of India; add an appropriate license file (e.g., `LICENSE`) if you intend to publish or redistribute code.

---

If you want, I can:

- add a permissive `LICENSE` (MIT) file,
- add a small preview script to validate `dashboard/index.html` for new states, or
- open a live-server preview for you now.

Feel free to tell me which you'd like next.
