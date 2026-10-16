# Quran Recitation App — High-Level Plan & Design
### "Parhte jao, ayat khud nazar aati jayengi — online ho ya offline"

---

## 1. Vision

Ek professional, production-quality web app jo Quran ki tilawat sun kar
**lafz-ba-lafz** text reveal kare. Durust lafz → reveal. Galat lafz → koi
reveal nahi, galti record. App **PWA** hogi: mobile/laptop par install ho
jayegi aur **bina internet ke bhi chalegi** — tilawat, matching, progress,
sab offline.

**Display format: Mushaf page** — text waisa hi nazar aayega jaisa chapay
hue Quran (Indo-Pak script wale mushaf) me hota hai: page ka border, surah
header, page number, manzil/juz marker, aur lafz-ba-lafz reveal usi page
ke andar.

**Budget rule: sab kuch 100% FREE.** Koi paid API, paid service ya paid
feature istemal nahi hoga (Section 5.1 dekhein).

**Scope rule (user ka faisla, 2026-10-12):** Abhi **sirf parhna aur
visible hona** — yani tilawat sun kar lafz-ba-lafz reveal. **Tajweed
waghera abhi shamil NAHI hai** — woh baad ke phase me aayegi, jab user
kahega. Is build me tajweed se mutalliq koi feature nahi banega.

---

## 2. Sab se ahem technical faisla — Offline Speech Recognition

Ye point plan ka dil hai, is liye pehle wazeh kar raha hoon:

- Browser ki **Web Speech API** (jo basic version me use hui) **online**
  hoti hai — awaz Google ke servers par jati hai. Offline woh kaam nahi karti.
- **Asli offline** recognition ke liye awaz ki pehchan **device ke andar** hi
  honi chahiye. Is ke liye **on-device AI model** browser me chalega:
  **Whisper (OpenAI) ka browser version — Transformers.js + WASM/WebGPU**.
  - Model ek dafa download hoga (~100–150 MB, base model), phir hamesha ke
    liye browser cache me rahega.
  - Us ke baad recognition 100% offline — koi data bahar nahi jata (privacy
    bhi behtar).
- **Dual-mode design:**
  | Mode | Engine | Faida |
  |---|---|---|
  | Online | Web Speech API (Chrome) | Fast, zyada accurate, zero download |
  | Offline | Whisper on-device (WASM/WebGPU) | Bina net ke kaam, private, hamesha available |
  - App khud detect karegi net hai ya nahi, aur user ko bata kar engine
    switch karegi. Settings me manual choice bhi hogi.

> Imandari se: offline Whisper ki Arabic accuracy online wale se kuch kam
> hogi (khaas kar tajweed wali bareek ghaltion par). Is liye matching engine
> me **fuzzy matching** rakha jayega taake chhoti recognition errors par
> user phasay nahi — magar asli galt lafz phir bhi reveal nahi karega.

---

## 3. Features (Complete List)

### Core Recitation
- [ ] Pura Quran: **114 surahs, 6,236 ayat**, Indo-Pak script
- [ ] **Mushaf page format** — har page bilkul chapay hue Quran jaisa:
      dekorative border, 15-line layout, surah ka header (naam wala box),
      page number, side par manzil marker; pages aage/peeche karne ki
      navigation (juz/surah/page se jump)
- [ ] Surah list + search + "go to ayah"
- [ ] Lafz-ba-lafz reveal (blur → clear) **mushaf page ke andar hi**,
      current lafz highlight
- [ ] Galat lafz par **red flash** + galti counter (lafz record hoga)
- [ ] Basmala har surah ke aghaz me alag line
- [ ] Ayat mukammal hone par khud agle ayat par focus; page khatam ho to
      khud agla page

### Modes
- [ ] **Practice Mode** — text halka sa dikhai de (peek), seekhne ke liye
- [ ] **Hifz/Test Mode** — text mukammal chhupa, sirf parhne par reveal;
      akhir me score (durust %, galat alfaaz ki list)
- [ ] **Listen Mode** — har ayat ki sahi tilawat audio (Alafasy),
      online stream; jo ayat ek dafa suni, woh offline ke liye cache

### Progress & Dashboard
- [ ] Har surah ki completion % save (offline storage — IndexedDB)
- [ ] Roz ka streak, total alfaaz, accuracy graph (weekly chart)
- [ ] Galat alfaaz ki history — "mere kamzor alfaaz" list dobara practice ke liye
- [ ] Dashboard screen: stats cards + charts + recent activity

### Experience
- [ ] PWA — installable, offline, home-screen icon, splash screen
- [ ] Dark / Light theme
- [ ] **Noor-e-Huda font** (Indo-Pak mushaf style ki Arabic typography)
- [ ] Mobile + desktop responsive design
- [ ] Settings: engine (online/offline), font size, theme, fuzzy level

---

## 4. Architecture

```
┌─────────────────────────────────────────────────┐
│  Next.js 15 (App Router) + TypeScript + Tailwind │
├──────────────┬──────────────┬───────────────────┤
│  UI Layer    │ Recitation   │  Speech Engines   │
│  - Dashboard │   Engine     │  - Web Speech API │
│  - Surah List│ - Word state │  - Whisper WASM   │
│  - Recite    │   machine    │    (Web Worker)   │
│  - Stats     │ - Fuzzy match│                   │
├──────────────┴──────────────┴───────────────────┤
│  Data Layer                                      │
│  - Quran text: bundled JSON (per-surah chunks)   │
│  - Progress: IndexedDB (Dexie)                   │
│  - Audio: Cache Storage (on-demand per ayah)     │
│  - PWA: Service Worker (Serwist)                 │
└─────────────────────────────────────────────────┘
```

**Key design decisions:**
- Quran text app ke sath **bundled** hoga (per-surah alag file, sirf
  muntakhib surah load hogi) — is liye text hamesha offline available.
- Whisper model ek **Web Worker** me chalega taake UI freeze na ho.
- Progress kabhi server par nahi jayegi — sab device par (privacy + offline).

## 5. Data Sources

| Cheez | Source | Size |
|---|---|---|
| Quran text (**Indo-Pak script**) | Tanzil-verified Indo-Pak edition / free open datasets se build-time par hasil karke bundled | ~4 MB |
| Mushaf layout data | Free open-source mushaf data (har lafz ka page/line number) — taake har page chapay hue mushaf jaisa render ho | ~2–3 MB |
| Surah/ayah metadata | Bundled JSON | chhota |
| Arabic font (Indo-Pak style) | **Noor-e-Huda** font (free) — fallback: Amiri Quran (OFL) | ~200 KB |
| Ayat audio (Alafasy) | Islamic Network CDN / EveryAyah (free) — play par stream, phir cache | per-ayah ~100–300 KB |
| Whisper base model | HuggingFace se ek dafa download, browser cache | ~150 MB |

### 5.1 Sab kuch 100% FREE — koi paid feature nahi

| Component | Free source / License |
|---|---|
| Framework: Next.js + React | Open source (MIT) |
| Styling: Tailwind CSS | Open source (MIT) |
| Quran text + layout data | Tanzil / open datasets (free, attribution ke saath) |
| Font: Noor-e-Huda / Amiri | Free / SIL Open Font License |
| Speech (online): Web Speech API | Browser built-in, free |
| Speech (offline): Whisper + Transformers.js | Open source (MIT/Apache), model free |
| Storage: IndexedDB (Dexie) | Open source, device par hi |
| Audio: Islamic Network CDN / EveryAyah | Free public CDN |
| Hosting (agar chahiye) | Vercel free tier — lazmi nahi, app local bhi chalti hai |

Paid cheezain jo **nahi** use hongi: koi paid speech API (Google/Azure
speech billing), paid database, paid hosting plan, paid font.

## 6. Screen Designs (Wireframe)

### 6.1 Dashboard (Home)
```
┌────────────────────────────────┐
│  📖 Tilawat        ⚙️  🌙      │
│  Assalam-o-Alaikum!            │
│  ┌──────┐ ┌──────┐ ┌──────┐   │
│  │Streak│ │Aaj ke│ │Accur.│   │
│  │ 5 din│ │120 lf│ │ 92%  │   │
│  └──────┘ └──────┘ └──────┘   │
│  [ Akhri mashq: Al-Ikhlas 80% ]│
│  [📈 Haftay ki progress chart] │
│  [ Surahs ki list → ]          │
└────────────────────────────────┘
```

### 6.2 Recitation Screen — Mushaf Page (main screen)
```
        ┌───────────────────────────┐
        │  البقرة              ٤     │ ← surah naam + page no
        │╔═════════════════════════╗│
        │║ الٓمّٓ ۚ ذٰلِكَ الْكِتٰبُ ║│
        │║ لَا رَيْبَ ۚ فِيْهِ ۚ هُدًى ║│ ← mushaf lines
        │║ لِّلْمُتَّقِيْنَ ۙ  الَّذِيْنَ ║│   (Indo-Pak script)
        │║ يُؤْمِنُوْنَ [بِالْغَيْبِ] ▒▒ ║│
        │║  ▒▒▒ ▒▒▒▒ ▒▒ ▒▒▒▒ ...   ║│
        │║        ...               ║│
        │╚═════════════════════════╝│
        │        منزل               │ ← manzil marker
        └───────────────────────────┘
   ❌ Galat: 2   ✅ Durust: 11/19   Page 4 / 604
   Jo suna: بِالْغَيْبِ وَيُقِيمُونَ
     [ 🎤 Parhna Shuru ]  [ 🔊 Ayat ]
     [ ◀ Pichla Page ] [ Agla Page ▶ ]
```
Durust parha gaya lafz mushaf page par **saaf** ho jata hai, current lafz
**golden highlight**, baqi abhi **blur**. Page TV/monitor par bhi waisa hi
dikhayega jaisa haath me pakra mushaf.

### 6.3 Stats Screen
```
┌────────────────────────────────┐
│  Meri Progress                 │
│  [Accuracy graph — 7 din]      │
│  Meri kamzor alfaaz:           │
│  • الصَّمَدُ (3 dafa galat)     │
│  • الْمَغْضُوبِ (2 dafa galat)  │
│  Mukammal surahs: 3 / 114      │
└────────────────────────────────┘
```

**Design language:** gehra sabz (emerald) + sunahra (gold) accent, safed/
cream card par Arabic text, Amiri Quran font, gol (rounded) corners,
naram shadows — pur-sukoon, islami aesthetics. Dark mode me gehra
sabz-kala background.

## 7. Matching Engine v2 (galti pakadne ka nizam)

Har lafz ki state: `hidden → current → correct | wrong`
1. Suna gaya lafz **normalize** hoga (tashkeel khatm, imla'i forms ek jaisi).
2. **Exact match** → reveal, agla lafz current.
3. **Fuzzy match** (ek harf ka farq, masalan recognition ki chhoti galti)
   → reveal, magar "qareeb tha" note ke saath (strict mode me off ho sakta hai).
4. **Galat lafz** → koi reveal nahi, lafz galtiyon me record, red feedback.
   Jab tak sahi lafz na parha jaye, engine aage nahi badhega.
5. Har session ke akhir me **report**: durust %, galat alfaaz, waqt.

## 8. Development Phases

| Phase | Kaam | Waqt (andazan) |
|---|---|---|
| 1 | Foundation: Next.js + Tailwind + pura Quran (Indo-Pak) data + **mushaf page format** + recitation engine v2 | 2–3 din |
| 2 | Dashboard, progress saving (IndexedDB), stats, modes (Practice/Hifz) | 2–3 din |
| 3 | PWA + offline: service worker, audio caching | 1–2 din |
| 4 | Offline Whisper engine (Web Worker) + dual-mode switching | 3–4 din |
| 5 | Polish: themes, fonts, responsive, testing | 1–2 din |

*Waqt ek developer ke full-time kaam ka andaza hai; AI ke sath banane par
marahil tez ho sakte hain, magar testing ka waqt phir bhi lagega.*

## 9. Risks / Limits (pehle se wazeh)

- **Offline model ka size** (~150 MB) pehli dafa download hoga — user ko
  setup screen par wazeh bataya jayega, Wi-Fi ki sifarish hogi.
- **Purane/kamzor devices** par Whisper slow ho sakta hai; Web Speech
  (online) fallback hamesha mojood rahega.
- **Tajweed ki bareek galtiyan** (masalan madd ki miqdar) speech recognition
  se reliably nahi pakri ja sakteen — app lafz ki durustgi par focus karegi,
  tajweed scoring mustaqbil ka feature hai.

## 10. Aap ka faisla

Agar plan manzoor hai to bas "shuru karo" keh dein — Phase 1 se build
shuru kar dunga. Koi hissa badalna ho (masalan koi feature kam/zyada,
design ka rang, ya sirf offline par focus) to woh bhi bata dein.
