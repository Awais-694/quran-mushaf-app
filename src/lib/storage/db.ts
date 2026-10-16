// Offline progress storage — IndexedDB (Dexie).
// Sab data user ke device par rehta hai: koi server nahi, koi paid database nahi.

import Dexie, { type Table } from "dexie";
import type { RecitationSession } from "@/types/quran";

export interface SurahProgress {
  surahNumber: number;
  revealedWords: number; // jahan tak parha
  totalWords: number;
  completed: boolean;
  lastPracticedAt: number;
  lastAyahNumber?: number; // last recited ayah number
}

export interface DailyActivity {
  date: string; // "2026-10-12"
  wordsRevealed: number;
  mistakes: number;
  sessions: number;
}

class TilawatDB extends Dexie {
  progress!: Table<SurahProgress, number>;
  sessions!: Table<RecitationSession & { id?: number }, number>;
  activity!: Table<DailyActivity, string>;
  wrongWords!: Table<{ word: string; count: number }, string>;

  constructor() {
    super("tilawat-db");
    this.version(1).stores({
      progress: "surahNumber",
      sessions: "++id, surahNumber, startedAt",
      activity: "date",
      wrongWords: "word",
    });
  }
}

export const db = new TilawatDB();
