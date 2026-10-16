// Quran data types — pure app inhi types par chalti hai.

export interface SurahMeta {
  number: number; // 1..114
  name: string; // English transliteration, e.g. "Al-Baqarah"
  arabicName: string; // e.g. "سُورَةُ البَقَرَةِ"
  translation: string; // English meaning
  revelationType: "Meccan" | "Medinan";
  numberOfAyahs: number;
}

export interface Ayah {
  number: number; // surah ke andar ayat number
  text: string; // Indo-Pak script, mukammal ayat
  words: string[]; // lafz-ba-lafz (text.split(" "))
  page: number; // mushaf page (1..604)
  juz: number;
}

export interface Surah extends SurahMeta {
  basmala: string | null; // Al-Fatiha/Tawbah ke ilawa har surah se pehle
  ayahs: Ayah[];
}

/** Har lafz ki halat — recitation engine isi ko update karta hai */
export type WordState =
  | "hidden" // abhi nazar nahi (blur)
  | "current" // agla expected lafz (golden highlight)
  | "correct" // durust parha gaya — visible
  | "wrong"; // galat parha gaya (momentary red flash, phir hidden)

export interface WordToken {
  display: string; // the actual word (Indo-Pak script)
  normalized: string; // primary canonical form for matching
  forms?: string[]; // all canonical forms (dagger-alef / maksura variants)
  state: WordState;
  ayahNumber: number;
  page: number;
}

export interface RecitationSession {
  surahNumber: number;
  startedAt: number;
  revealed: number; // kitne alfaaz reveal hue
  total: number; // kul alfaaz
  mistakes: number;
  wrongWords: string[]; // galat parhe gaye alfaaz (baad ki practice ke liye)
  completed: boolean;
}

export type SpeechEngineKind = "webspeech" | "whisper";
