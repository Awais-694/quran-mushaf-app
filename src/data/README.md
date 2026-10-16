# Data folder

| File | Kya hai |
|---|---|
| `surahs-meta.json` | Tamam **114 surahs** ka metadata (naam, ayat ki tadaad, Makki/Madani) — asal data, AlQuran Cloud se |
| `sample-surahs.json` | Basic version ki 5 surahs ka text (Uthmani) — sirf reference/testing ke liye |
| `surahs/` (Phase 1 me aayega) | Har surah ka **Indo-Pak script** text, ek file per surah: `surah-1.json` … `surah-114.json` — har file me basmala + ayahs (lafz-ba-lafz, page/juz ke saath). Bundled hoga taake offline chale. |
| `mushaf-layout.json` (Phase 1) | Har lafz ka mushaf page/line number — page bilkul chapay hue mushaf jaisa render karne ke liye |
