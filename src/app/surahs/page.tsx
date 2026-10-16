import Link from "next/link";
import { SURAHS_META } from "@/lib/quran/data";
import { SurahListItem } from "@/components/common/SurahListItem";

export default function SurahsPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-5 pb-12">
      {/* Top Navigation Bar with Centered Title & Home Back Button */}
      <div className="relative flex items-center justify-center min-h-[40px]">
        <Link
          href="/"
          title="Back to Home Dashboard"
          className="absolute left-0 inline-flex items-center justify-center px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide text-emerald-100 bg-[#0d2217]/90 hover:bg-[#133022] border border-emerald-600/50 hover:border-emerald-400/80 shadow-[0_2px_8px_rgba(0,0,0,0.35)] hover:shadow-[0_0_12px_rgba(16,185,129,0.25)] backdrop-blur-md active:scale-95 transition-all duration-200 cursor-pointer"
        >
          Back
        </Link>

        <h1 className="text-xl sm:text-2xl font-bold text-emerald-50 tracking-wide text-center">
          Select a Surah
        </h1>
      </div>

      <div className="flex flex-col gap-2">
        {SURAHS_META.map((m) => (
          <SurahListItem key={m.number} meta={m} />
        ))}
      </div>
    </div>
  );
}
