// Matching engine v3 — fast recitation & adaptive speech matching.
//
// Rule: suna gaya lafz SIRF tab reveal hoga jab woh sahi expected sequence me ho.
// Fast recitation (حدر): tez tilawat me aksar alfaz wasl/idgham se mil jate hain
// ya browser speech recognition kisi harf/particle ("و", "ف", "ال") ko drop/merge kar leti hai.
// Ye engine lookahead recovery aur compound word matching se fast recitation ko
// bina galat mistake record kiye smoothly reveal karta hai.

import { normalizeArabic } from "./normalize";
import type { WordToken } from "@/types/quran";

export interface MatchStep {
  /** is step ke baad kitne alfaaz revealed hain */
  revealed: number;
  /** suna gaya lafz jo match nahi hua (agar hua) */
  wrongWord: string | null;
}

function editDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = i;
    for (let j = 1; j <= b.length; j++) {
      const val = a[i - 1] === b[j - 1] ? row[j - 1] : Math.min(row[j - 1], row[j], prev) + 1;
      row[j - 1] = prev;
      prev = val;
    }
    row[b.length] = prev;
  }
  return row[b.length];
}

function phoneticCanon(w: string): string {
  return w
    .replace(/[ظذ]/g, "ذ")
    .replace(/[ثس]/g, "س")
    .replace(/[ؤئ]/g, "ي")
    .replace(/[كق]/g, "ك") // dialect/speed variations
    .replace(/[طت]/g, "ت")
    .replace(/[صس]/g, "س")
    .replace(/[ضد]/g, "د")
    .replace(/ا+/g, "ا");
}

export function wordMatches(target: string, heard: string): boolean {
  if (target === heard) return true;
  const tNorm = target.replace(/ا+/g, "ا");
  const hNorm = heard.replace(/ا+/g, "ا");
  if (tNorm === hNorm) return true;
  if (phoneticCanon(tNorm) === phoneticCanon(hNorm)) return true;

  // Attached particles flexibility for fast recitation:
  // e.g. "و" / "ف" / "ب" / "ل" / "ال" prefix added or dropped in rapid speech
  for (const prefix of ["و", "ف", "ب", "ل", "ال"]) {
    if (tNorm.startsWith(prefix) && tNorm.slice(prefix.length) === hNorm) return true;
    if (hNorm.startsWith(prefix) && hNorm.slice(prefix.length) === tNorm) return true;
    if (tNorm.startsWith(prefix) && phoneticCanon(tNorm.slice(prefix.length)) === phoneticCanon(hNorm)) return true;
    if (hNorm.startsWith(prefix) && phoneticCanon(hNorm.slice(prefix.length)) === phoneticCanon(tNorm)) return true;
  }

  const maxLen = Math.max(tNorm.length, hNorm.length);
  // Fuzzy match for minor browser speech transcription variations
  if (maxLen >= 3 && editDistance(tNorm, hNorm) <= 1) return true;
  if (maxLen >= 6 && editDistance(tNorm, hNorm) <= 2) return true;
  return false;
}

/** Advance past non-recitable tokens (ayah-end markers etc. normalize to ""). */
export function skipEmpty(expectedNormalized: string[], r: number): number {
  while (r < expectedNormalized.length && expectedNormalized[r] === "") r++;
  return r;
}

/** Check one heard word against the expected sequence. */
export function matchOne(
  expectedNormalized: string[],
  revealed: number,
  heardWord: string,
  expectedForms?: string[][]
): MatchStep {
  const r = skipEmpty(expectedNormalized, revealed);
  if (r < expectedNormalized.length) {
    const forms = [expectedNormalized[r], ...(expectedForms?.[r] ?? [])];
    for (const f of forms) {
      if (wordMatches(f, heardWord)) {
        return { revealed: skipEmpty(expectedNormalized, r + 1), wrongWord: null };
      }
    }
  }
  return { revealed: r, wrongWord: heardWord };
}

/**
 * Final and interim results matching with fast-recitation lookahead & compound handling.
 */
export function matchMany(
  expectedNormalized: string[],
  revealed: number,
  heardWords: string[],
  expectedForms?: string[][]
): { revealed: number; wrongWords: string[] } {
  let r = skipEmpty(expectedNormalized, revealed);
  const wrongWords: string[] = [];

  const formsAt = (idx: number): string[] => {
    if (idx >= expectedNormalized.length) return [];
    const out = [expectedNormalized[idx], ...(expectedForms?.[idx] ?? [])];
    return [...new Set(out)];
  };

  const matches = (idx: number, s: string): boolean => {
    if (idx >= expectedNormalized.length) return false;
    const forms = formsAt(idx);
    for (const f of forms) {
      if (wordMatches(f, s)) return true;
    }
    return false;
  };

  let i = 0;
  while (i < heardWords.length) {
    if (r >= expectedNormalized.length) break;
    const w = heardWords[i];

    // 1. Direct single-word match
    if (matches(r, w)) {
      r = skipEmpty(expectedNormalized, r + 1);
      i++;
      continue;
    }

    // 2. Speech recognizer split expected[r] into 2 or 3 heard words
    // e.g. "ياسين" split into "يا" + "سين", or "فمن" into "ف" + "من"
    if (i + 1 < heardWords.length && matches(r, (w + heardWords[i + 1]).replace(/ا+/g, "ا"))) {
      r = skipEmpty(expectedNormalized, r + 1);
      i += 2;
      continue;
    }
    if (i + 2 < heardWords.length && matches(r, (w + heardWords[i + 1] + heardWords[i + 2]).replace(/ا+/g, "ا"))) {
      r = skipEmpty(expectedNormalized, r + 1);
      i += 3;
      continue;
    }

    // 3. Fast recitation concatenation: recognizer merged multiple expected words into 1 heard word
    // e.g. ["باسم", "الله"] -> "بسمالله" or ["فباي", "الاء", "ربكما"] -> "فبايالاءربكما"
    const r2 = skipEmpty(expectedNormalized, r + 1);
    if (r2 < expectedNormalized.length) {
      const combos2 = new Set<string>();
      for (const a of formsAt(r)) {
        for (const b of formsAt(r2)) {
          combos2.add((a + b).replace(/ا+/g, "ا"));
        }
      }
      const wClean = w.replace(/ا+/g, "ا");
      if (combos2.has(wClean) || [...combos2].some((c) => wordMatches(c, w))) {
        r = skipEmpty(expectedNormalized, r2 + 1);
        i++;
        continue;
      }

      // Check 3 expected words merged together
      const r3 = skipEmpty(expectedNormalized, r2 + 1);
      if (r3 < expectedNormalized.length) {
        const combos3 = new Set<string>();
        for (const a of formsAt(r)) {
          for (const b of formsAt(r2)) {
            for (const c of formsAt(r3)) {
              combos3.add((a + b + c).replace(/ا+/g, "ا"));
            }
          }
        }
        if (combos3.has(wClean) || [...combos3].some((c) => wordMatches(c, w))) {
          r = skipEmpty(expectedNormalized, r3 + 1);
          i++;
          continue;
        }
      }
    }

    // 4. Fast Recitation Lookahead Recovery:
    // When reciting fast, a particle or short word may be elided or dropped by the speech API.
    // We check if heard[i] matches expected[r+1] or expected[r+2].
    // If the next word (or subsequent speech) confirms the position, advance cleanly!
    let lookaheadMatched = false;
    for (let look = 1; look <= 2; look++) {
      let candidateR = r;
      for (let k = 0; k < look; k++) {
        candidateR = skipEmpty(expectedNormalized, candidateR + 1);
      }
      if (candidateR >= expectedNormalized.length) break;

      if (matches(candidateR, w)) {
        const nextR = skipEmpty(expectedNormalized, candidateR + 1);
        const hasNextHeard = i + 1 < heardWords.length;
        if (!hasNextHeard || (nextR < expectedNormalized.length && matches(nextR, heardWords[i + 1]))) {
          // Fast speed jumped ahead: accept candidate position and reveal smoothly
          r = nextR;
          i++;
          lookaheadMatched = true;
          break;
        }
      }
    }
    if (lookaheadMatched) continue;

    // 5. Genuine mismatch
    wrongWords.push(w);
    i++;
  }

  return { revealed: r, wrongWords };
}

/** Surah ke alfaaz ko WordToken[] me badlo (sab hidden, pehla current). */
export function buildTokens(
  groups: { words: string[]; ayahNumber: number; page: number }[]
): WordToken[] {
  const tokens: WordToken[] = [];
  for (const g of groups) {
    for (const w of g.words) {
      tokens.push({
        display: w,
        normalized: normalizeArabic(w),
        state: tokens.length === 0 ? "current" : "hidden",
        ayahNumber: g.ayahNumber,
        page: g.page,
      });
    }
  }
  return tokens;
}
