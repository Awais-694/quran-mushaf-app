"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { db, type SurahProgress } from "@/lib/storage/db";
import { getSurahMeta } from "@/lib/quran/data";
import { StatCard } from "./StatCard";
import { ProgressBar } from "@/components/common/ProgressBar";

interface Stats {
  streak: number;
  todayWords: number;
  totalWords: number;
  accuracy: number | null;
  inProgress: SurahProgress[];
  completedCount: number;
  lastActive: SurahProgress | null;
}

function calcStreak(dates: string[]): number {
  const set = new Set(dates);
  let streak = 0;
  const d = new Date();
  if (!set.has(d.toISOString().slice(0, 10))) d.setDate(d.getDate() - 1);
  while (set.has(d.toISOString().slice(0, 10))) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

export function DashboardClient() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    (async () => {
      const activity = await db.activity.toArray();
      const progress = await db.progress.toArray();
      const totalWords = activity.reduce((s, a) => s + a.wordsRevealed, 0);
      const totalMistakes = activity.reduce((s, a) => s + a.mistakes, 0);
      const today = new Date().toISOString().slice(0, 10);
      const sortedInProgress = progress
        .filter((p) => p.revealedWords > 0 && !p.completed)
        .sort((a, b) => b.lastPracticedAt - a.lastPracticedAt);

      setStats({
        streak: calcStreak(activity.filter((a) => a.wordsRevealed > 0).map((a) => a.date)),
        todayWords: activity.find((a) => a.date === today)?.wordsRevealed ?? 0,
        totalWords,
        accuracy:
          totalWords + totalMistakes > 0
            ? Math.round((totalWords / (totalWords + totalMistakes)) * 100)
            : null,
        inProgress: sortedInProgress.slice(0, 4),
        completedCount: progress.filter((p) => p.completed).length,
        lastActive: sortedInProgress[0] ?? null,
      });
    })();
  }, []);

  const lastActiveMeta = stats?.lastActive ? getSurahMeta(stats.lastActive.surahNumber) : null;
  const lastActivePct =
    stats?.lastActive && stats.lastActive.totalWords
      ? Math.round((stats.lastActive.revealedWords / stats.lastActive.totalWords) * 100)
      : 0;

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      {/* Header Greeting */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Assalam-o-Alaikum
        </h1>
        <p className="text-sm sm:text-base text-emerald-200/70">
          Recite aloud and reveal ayat word by word on the authentic 16-line Mushaf.
        </p>
      </div>

      {/* Quick Resume Card */}
      {stats?.lastActive && lastActiveMeta && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0e271b] via-[#091a12] to-[#05110b] border border-emerald-700/60 p-4 sm:p-5 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div>
              <div className="text-[10px] sm:text-[11px] uppercase tracking-wider text-emerald-400 font-semibold mb-1">
                Continue Reciting
              </div>
              <div className="flex items-baseline gap-2.5">
                <span className="text-lg sm:text-xl font-bold text-white">
                  {lastActiveMeta.number}. {lastActiveMeta.name}
                </span>
                <span className="font-quran text-emerald-300 text-lg sm:text-2xl" dir="rtl">
                  {lastActiveMeta.arabicName}
                </span>
              </div>
              <div className="text-xs text-emerald-300/70 mt-1">
                {stats.lastActive.revealedWords} of {stats.lastActive.totalWords} words revealed ({lastActivePct}%)
              </div>
            </div>

            <Link
              href={`/recite/${stats.lastActive.surahNumber}`}
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm shadow-md active:scale-95 transition-all"
            >
              Resume
            </Link>
          </div>

          <ProgressBar pct={lastActivePct} />
        </div>
      )}

      {/* Primary Recitation Statistics */}
      <div>
        <div className="text-xs font-semibold text-emerald-300/80 uppercase tracking-wider mb-2.5">
          Overview
        </div>
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
          <StatCard
            label="Streak"
            value={stats ? `${stats.streak} ${stats.streak === 1 ? "day" : "days"}` : "…"}
            sublabel="Consistent practice"
          />
          <StatCard
            label="Words Today"
            value={stats ? stats.todayWords.toLocaleString() : "…"}
            sublabel="Completed today"
          />
          <StatCard
            label="Accuracy"
            value={stats?.accuracy !== null && stats ? `${stats.accuracy}%` : "—"}
            sublabel="Recognition score"
          />
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 mt-2.5 sm:mt-3">
          <StatCard
            label="Total Correct Words"
            value={stats ? stats.totalWords.toLocaleString() : "…"}
            sublabel="All time memorized"
          />
          <StatCard
            label="Surahs Completed"
            value={stats ? `${stats.completedCount} / 114` : "…"}
            sublabel="Full surahs mastered"
          />
        </div>
      </div>

      {/* In Progress Surahs */}
      {stats && stats.inProgress.length > 0 && (
        <div className="bg-[#0c1c14]/90 border border-emerald-900/60 rounded-2xl p-4 sm:p-5 shadow-lg backdrop-blur-sm">
          <h2 className="text-base font-semibold text-emerald-100 mb-3">
            In Progress Surahs
          </h2>
          <div className="flex flex-col gap-2.5">
            {stats.inProgress.map((p) => {
              const meta = getSurahMeta(p.surahNumber);
              const pct = p.totalWords ? Math.round((p.revealedWords / p.totalWords) * 100) : 0;
              return (
                <Link
                  key={p.surahNumber}
                  href={`/recite/${p.surahNumber}`}
                  className="flex items-center justify-between bg-[#08150f]/80 border border-emerald-900/50 rounded-xl px-4 py-3 hover:bg-[#0f241a] hover:border-emerald-700/60 transition-all shadow-sm"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-emerald-950 border border-emerald-800/80 flex items-center justify-center text-xs font-semibold text-emerald-200">
                      {meta?.number}
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-emerald-100">
                        {meta?.name}
                      </div>
                      <div className="text-xs text-emerald-300/60">
                        {pct}% revealed
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-semibold text-emerald-300 hover:text-white px-3 py-1.5 rounded-lg bg-emerald-900/40 border border-emerald-700/40">
                    Continue
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Action Button */}
      <Link
        href="/surahs"
        className="block w-full py-3.5 sm:py-4 rounded-xl text-center font-semibold text-white bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-700 hover:from-emerald-600 hover:to-emerald-500 shadow-lg shadow-emerald-950/50 border border-emerald-500/50 active:scale-[0.98] transition-all text-sm sm:text-base tracking-wide"
      >
        Browse All 114 Surahs
      </Link>
    </div>
  );
}
