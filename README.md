# Tilawat — Quran Recitation App (Taj Mushaf Format)

Recite, and the ayat appear on the Mushaf page **word by word**. A word is
revealed only when you recite it correctly — recite it wrong and nothing
further appears until you fix it. **No tajweed features for now** — just
recitation + visibility, as requested.

## The Mushaf

- **Format:** *Indopak 16 lines — Taj Company* mushaf, the whole Quran:
  **548 pages, 16 lines per page**, exactly like the printed Taj mushaf
  (bordered page, surah header, page number, manzil marker, ruled lines).
- **Font:** the actual **IndoPak Nastaleeq** font used for this mushaf
  (bundled in `public/fonts/`), so the script looks like the printed page.
- **Data:** word-by-word text with each word's real page & line, from the
  QUL (Quranic Universal Library by Tarteel) mushaf layout #7 — free.
- Everything is **100% free / open source**. No paid service anywhere.

## Screens

- **Dashboard** — streak, words today, accuracy, surahs in progress
- **Surahs** — all 114 surahs
- **Recite** — the Taj mushaf page; live word reveal with the mic;
  wrong word = red flash + recorded in your weak-words list
- **Progress** — per-surah progress, last 7 days, weak words
- **Settings** — speech engine, font size, theme, offline model

## Speech engines (dual mode)

- **Online:** Web Speech API (Chrome/Edge) — fast and accurate
- **Offline:** Whisper running on-device (beta) — download the model once
  (~150 MB) in Settings; after that, recognition works without internet
- The whole app is a **PWA**: after the first visit it opens offline,
  and all progress is stored on your device (IndexedDB)

## Run it

Easiest: double-click **`run.bat`** — or:

```bash
npm run dev   # then open http://localhost:3000 in Chrome
```

(Dependencies are already installed in the delivered ZIP.)

## Data files

- `src/data/surahs/surah-<n>.json` — per-surah words (Taj page/line)
- `src/data/surahs-meta.json` — metadata for all 114 surahs
- `src/data/mushaf-meta.json` — mushaf info (548 pages, 16 lines)
- `src/data/special-lines.json` — surah-name / basmala lines per page

## Credits

Quran layout data & IndoPak Nastaleeq font: QUL by Tarteel
(qul.tarteel.ai). Ayah audio: Alafasy via the free Islamic Network CDN.
