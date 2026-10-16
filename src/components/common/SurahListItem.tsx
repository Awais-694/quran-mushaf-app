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
      className="flex items-center justify-between gap-3 bg-emerald-950/60 border border-emerald-800 rounded-xl px-4 py-3 hover:bg-emerald-900/60"
    >
      <span className="flex items-center gap-3">
        <span className="w-9 h-9 grid place-items-center rounded-full border border-gold text-gold text-sm">
          {meta.number}
        </span>
        <span>
          <span className="block font-semibold">{meta.name}</span>
          <span className="block text-xs text-emerald-200/60">
            {meta.translation} • {meta.numberOfAyahs} ayahs
          </span>
        </span>
      </span>
      <span className="font-quran text-2xl">{meta.arabicName}</span>
      {progressPct !== undefined && (
        <span className="text-sm text-emerald-200/80">{progressPct}%</span>
      )}
    </Link>
  );
}
