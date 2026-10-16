// Quran data loader — the full Quran is bundled (offline-ready).
// Data: "Indopak 16 lines — Taj Company" mushaf layout (QUL / Tarteel,
// mushaf layout 7): every word carries its Taj mushaf page (p) and line (l),
// so pages render exactly like the printed Taj mushaf — 548 pages, 16 lines.
// One JSON per surah: src/data/surahs/surah-<n>.json

import type { SurahMeta } from "@/types/quran";
import metaJson from "@/data/surahs-meta.json";

export const SURAHS_META = metaJson as SurahMeta[];

export function getSurahMeta(number: number): SurahMeta | undefined {
  return SURAHS_META.find((s) => s.number === number);
}

export interface RawWord { t: string; p: number; l: number }
export interface RawAyah { n: number; id: number; page: number; juz: number; manzil: number; words: RawWord[] }
export interface RawSurah {
  number: number;
  basmala: { words: string[]; line: number | null } | null;
  ayahs: RawAyah[];
}

/** Ek lafz recitation sequence me */
export interface Token {
  display: string;
  page: number;
  line: number;
  ayahNumber: number; // 0 = basmala
  lastOfAyah: boolean;
  globalAyahId: number; // audio ke liye (1..6236), basmala par 0
}

export interface LoadedSurah {
  meta: SurahMeta;
  basmala: { words: string[]; line: number | null } | null;
  ayahs: RawAyah[];
  tokens: Token[]; // basmala (agar hai) pehle, phir tamam ayat tartib se
  pages: number[]; // is surah ke mushaf pages, tartib se
  manzil: number;
  juz: number;
}

const cache = new Map<number, LoadedSurah>();

// QUL kabhi kabhi do alag lafzon ko ek token me likhta hai (37:130 "اِلْ یَاسِیْنَ",
// 72:16 "وَّاَنْ لَّوِ") — bolne par ye do lafz hote hain, is liye inhe alag
// tokens banao taake har bola gaya lafz sahi match ho. (Sirf 2 muqamat.)
function splitTokenDisplay(display: string): string[] {
  return display.split(/\s+/).filter(Boolean);
}

export async function loadSurah(number: number): Promise<LoadedSurah | null> {
  const meta = getSurahMeta(number);
  if (!meta) return null;
  const hit = cache.get(number);
  if (hit) return hit;

  const raw = (await import(`../../data/surahs/surah-${number}.json`)).default as RawSurah;

  const tokens: Token[] = [];
  if (raw.basmala) {
    const first = raw.ayahs[0];
    raw.basmala.words.forEach((w, i) =>
      splitTokenDisplay(w).forEach((part, j, arr) =>
        tokens.push({
          display: part,
          page: first.page,
          line: raw.basmala!.line ?? 0, // its real line on the Taj page (0 = fallback)
          ayahNumber: 0,
          lastOfAyah: i === raw.basmala!.words.length - 1 && j === arr.length - 1,
          globalAyahId: 0,
        })
      )
    );
  }
  for (const a of raw.ayahs) {
    a.words.forEach((w, i) =>
      splitTokenDisplay(w.t).forEach((part, j, arr) =>
        tokens.push({
          display: part,
          page: w.p,
          line: w.l,
          ayahNumber: a.n,
          lastOfAyah: i === a.words.length - 1 && j === arr.length - 1,
          globalAyahId: a.id,
        })
      )
    );
  }

  const pages = [...new Set(tokens.map((t) => t.page))].sort((a, b) => a - b);
  const loaded: LoadedSurah = {
    meta,
    basmala: raw.basmala,
    ayahs: raw.ayahs,
    tokens,
    pages,
    manzil: raw.ayahs[0]?.manzil ?? 1,
    juz: raw.ayahs[0]?.juz ?? 1,
  };
  cache.set(number, loaded);
  return loaded;
}
