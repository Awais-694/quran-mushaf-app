import Link from "next/link";
import type { SurahMeta } from "@/types/quran";

// Surahs list ki ek row — naam, ayat ki tadaad, progress %
export function SurahListItem({
  meta,
  progressPct,
}: {
  meta: SurahMeta;
  progressPct?: number;
}) {
  return (
    <Link
      href={`/recite/${meta.number}`}
      className="flex items-center justify-between gap-2.5 sm:gap-4 bg-emerald-950/60 border border-emerald-800/80 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 hover:bg-emerald-900/60 active:scale-[0.99] transition-all"
    >
      {/* Left: Number + English Name + Ayahs count */}
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
        <span className="w-8 h-8 sm:w-9 sm:h-9 grid place-items-center rounded-full border border-gold/90 text-gold text-xs sm:text-sm font-bold shrink-0">
          {meta.number}
        </span>
        <div className="min-w-0 flex-1">
          <span className="block font-semibold text-sm sm:text-base text-white truncate">
            {meta.name}
          </span>
          <span className="block text-[11px] sm:text-xs text-emerald-200/60 truncate">
            {meta.translation} • {meta.numberOfAyahs} ayahs
          </span>
        </div>
      </div>

      {/* Right: Arabic Name (strictly single-line nowrap) */}
      <div className="text-right shrink-0 flex items-center gap-2">
        <span
          className="font-quran text-lg sm:text-2xl text-emerald-100 whitespace-nowrap leading-none tracking-normal"
          dir="rtl"
        >
          {meta.arabicName}
        </span>
        {progressPct !== undefined && (
          <span className="text-xs sm:text-sm text-emerald-200/80 font-mono">
            {progressPct}%
          </span>
        )}
      </div>
    </Link>
  );
}
