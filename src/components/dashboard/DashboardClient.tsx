"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { db, type SurahProgress } from "@/lib/storage/db";
import { getSurahMeta, loadSurah } from "@/lib/quran/data";
import { StatCard } from "./StatCard";
import { ProgressBar } from "@/components/common/ProgressBar";

interface Stats {
  streak: number;
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
  const [lastAyah, setLastAyah] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      const activity = await db.activity.toArray();
      const progress = await db.progress.toArray();
      const totalWords = activity.reduce((s, a) => s + a.wordsRevealed, 0);
      const totalMistakes = activity.reduce((s, a) => s + a.mistakes, 0);
      const sortedInProgress = progress
        .filter((p) => p.revealedWords > 0 && !p.completed)
        .sort((a, b) => b.lastPracticedAt - a.lastPracticedAt);

      const active = sortedInProgress[0] ?? null;

      setStats({
        streak: calcStreak(activity.filter((a) => a.wordsRevealed > 0).map((a) => a.date)),
        accuracy:
          totalWords + totalMistakes > 0
            ? Math.round((totalWords / (totalWords + totalMistakes)) * 100)
            : null,
        inProgress: sortedInProgress.slice(0, 4),
        completedCount: progress.filter((p) => p.completed).length,
        lastActive: active,
      });

      if (active) {
        if (active.lastAyahNumber) {
          setLastAyah(active.lastAyahNumber);
        } else {
          // Resolve ayah dynamically from tokens if older record
          const s = await loadSurah(active.surahNumber);
          if (s) {
            const idx = Math.max(0, Math.min(active.revealedWords - 1, s.tokens.length - 1));
            setLastAyah(s.tokens[idx]?.ayahNumber || 1);
          }
        }
      }
    })();
  }, []);

  const lastActiveMeta = stats?.lastActive ? getSurahMeta(stats.lastActive.surahNumber) : null;
  const lastActivePct =
    stats?.lastActive && stats.lastActive.totalWords
      ? Math.round((stats.lastActive.revealedWords / stats.lastActive.totalWords) * 100)
      : 0;

  return (
    <div className="max-w-2xl mx-auto space-y-5 sm:space-y-6 px-2 sm:px-0 pb-16">
      
      {/* Centered Professional Header with Islamic Motif */}
      <div className="text-center pt-2 sm:pt-4 pb-1 space-y-3">
        {/* Top Ornate Bismillah Capsule */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-emerald-950 via-[#071f13] to-emerald-950 border border-emerald-600/40 shadow-[0_2px_12px_rgba(16,185,129,0.15)]">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="font-arabic text-sm sm:text-base text-emerald-100 font-normal tracking-wide" dir="rtl">
            بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
        </div>

        {/* Assalam-o-Alaikum & Calligraphic Salam */}
        <div className="space-y-1">
          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-100 via-amber-100 to-emerald-200 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
            Assalam-o-Alaikum
          </h1>
          <p className="font-arabic text-emerald-200 text-lg sm:text-2xl font-normal leading-relaxed tracking-wide" dir="rtl">
            اَلسَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ
          </p>
        </div>

        <p className="text-xs sm:text-sm text-emerald-200/75 max-w-md mx-auto leading-relaxed px-2 font-normal">
          Recite aloud with instant AI speech recognition on the authentic 16-line Taj Company Mushaf.
        </p>
      </div>

      {/* Quick Resume Card (Ayah Progress & Resume Prompt) */}
      {stats?.lastActive && lastActiveMeta && (
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#0e2a1d] via-[#091b12] to-[#040e08] border border-emerald-600/50 p-4 sm:p-5 shadow-[0_8px_30px_rgba(0,0,0,0.45)]">
          {/* Subtle Ambient Decorative Glow */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-3 relative z-10">
            {/* Header Badge & Question */}
            <div className="flex items-center justify-between border-b border-emerald-800/40 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400"></span>
                </span>
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-amber-300">
                  Resume Tilawat
                </span>
              </div>
              <span className="text-[11px] sm:text-xs font-semibold text-emerald-300/80 bg-emerald-950/70 border border-emerald-800/60 px-2 py-0.5 rounded-md">
                {lastActivePct}% Completed
              </span>
            </div>

            {/* Surah & Ayah Information */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-baseline gap-2.5 flex-wrap">
                  <span className="text-lg sm:text-xl font-bold text-white tracking-tight">
                    {lastActiveMeta.number}. {lastActiveMeta.name}
                  </span>
                  <span className="font-quran text-emerald-300 text-xl sm:text-2xl" dir="rtl">
                    {lastActiveMeta.arabicName}
                  </span>
                </div>

                <div className="mt-1.5 space-y-0.5">
                  <div className="flex items-center gap-2 flex-wrap text-xs sm:text-sm font-semibold text-emerald-100">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-800/60 border border-emerald-600/50 text-white text-xs">
                      {lastAyah ? `Ayah ${lastAyah}` : "Ayah 1"}
                    </span>
                    <span className="text-emerald-300/70 font-normal text-xs">
                      {stats.lastActive.revealedWords} / {stats.lastActive.totalWords} words revealed
                    </span>
                  </div>
                  
                  {/* Prompt question asked explicitly */}
                  <p className="text-xs text-amber-200/90 font-medium pt-1">
                    Would you like to resume reciting from where you left off?
                  </p>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="pt-0.5">
              <ProgressBar pct={lastActivePct} />
            </div>

            {/* Mobile Thumb-Friendly Big Resume Button */}
            <Link
              href={`/recite/${stats.lastActive.surahNumber}`}
              className="w-full py-3 sm:py-3.5 px-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/60 active:scale-[0.98] transition-all"
            >
              <svg className="w-4 h-4 text-white fill-current" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              <span>Resume Recitation</span>
            </Link>
          </div>
        </div>
      )}

      {/* Recitation Overview Stats (Words Today & Total Correct Words Removed) */}
      <div className="space-y-2">
        <div className="text-[11px] sm:text-xs font-semibold text-emerald-300/80 uppercase tracking-wider px-1">
          Recitation Overview
        </div>
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <StatCard
            label="Daily Streak"
            value={stats ? `${stats.streak} ${stats.streak === 1 ? "day" : "days"}` : "…"}
            sublabel="Daily recitation habit"
          />
          <StatCard
            label="Accuracy"
            value={stats?.accuracy !== null && stats ? `${stats.accuracy}%` : "—"}
            sublabel="AI speech score"
          />
          <StatCard
            label="Completed"
            value={stats ? `${stats.completedCount} / 114` : "…"}
            sublabel="Full Surahs"
          />
        </div>
      </div>

      {/* In Progress Surahs */}
      {stats && stats.inProgress.length > 0 && (
        <div className="bg-[#0c1c14]/90 border border-emerald-900/60 rounded-2xl p-3.5 sm:p-5 shadow-lg backdrop-blur-sm space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm sm:text-base font-semibold text-emerald-100">
              In-Progress Surahs
            </h2>
            <span className="text-[11px] text-emerald-400/60 font-medium">
              {stats.inProgress.length} active
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {stats.inProgress.map((p) => {
              const meta = getSurahMeta(p.surahNumber);
              const pct = p.totalWords ? Math.round((p.revealedWords / p.totalWords) * 100) : 0;
              return (
                <Link
                  key={p.surahNumber}
                  href={`/recite/${p.surahNumber}`}
                  className="flex items-center justify-between bg-[#08150f]/80 border border-emerald-900/50 rounded-xl px-3.5 py-2.5 sm:px-4 sm:py-3 hover:bg-[#0f241a] hover:border-emerald-700/60 active:scale-[0.99] transition-all shadow-sm"
                >
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                    <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-950 border border-emerald-800/80 flex items-center justify-center text-xs font-bold text-emerald-200 shrink-0">
                      {meta?.number}
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-semibold text-emerald-100 truncate">
                        {meta?.name}
                      </div>
                      <div className="text-[11px] text-emerald-300/60">
                        {p.lastAyahNumber ? `Ayah ${p.lastAyahNumber} • ` : ""}{pct}% revealed
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-semibold text-emerald-300 px-3 py-1.5 rounded-lg bg-emerald-900/40 border border-emerald-700/40 shrink-0">
                    Continue
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Action Button - Mobile Focused */}
      <Link
        href="/surahs"
        className="block w-full py-3.5 sm:py-4 rounded-xl sm:rounded-2xl text-center font-bold text-white bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-700 hover:from-emerald-600 hover:to-emerald-500 shadow-xl shadow-emerald-950/60 border border-emerald-500/50 active:scale-[0.98] transition-all text-sm sm:text-base tracking-wide"
      >
        Browse All 114 Surahs
      </Link>
    </div>
  );
}
