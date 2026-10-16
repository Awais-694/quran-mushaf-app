import type { ReactNode } from "react";
import { toArabicDigits } from "./AyahMarker";

// Mushaf ka ek page — bilkul chapay hue Taj 16-line Quran ke page jaisa frame.
export function MushafPage({
  surahName,
  pageNumber,
  manzil,
  fontSize,
  children,
}: {
  surahName: string;
  pageNumber: number;
  manzil?: string;
  fontSize?: number;
  children: ReactNode;
}) {
  return (
    <div className="bg-[#fcfaf5] text-[#13281d] rounded-xl sm:rounded-2xl shadow-xl p-1.5 sm:p-3.5 max-w-2xl mx-auto border border-[#d9ccb0]/80">
      {/* Taj mushaf header: surah name on the right, page number centered, juz/manzil on left */}
      <div className="relative flex items-center justify-between mb-1 px-1.5 sm:px-2 text-[12px] sm:text-[14px] text-[#244234] font-semibold border-b border-[#ebd7b2]/70 pb-1">
        <span className="text-xs text-[#4b6b5a]">{manzil || ""}</span>
        <span className="font-semibold tracking-wider text-sm">{toArabicDigits(pageNumber)}</span>
        <span className="font-semibold text-sm font-quran tracking-wide text-[#143323]" dir="rtl">{surahName}</span>
      </div>

      {/* Mushaf Decorative Border Frame */}
      <div className="border-[2px] sm:border-[3px] border-double border-[#1b382b] rounded-sm px-1.5 py-1 sm:px-3 sm:py-2.5 bg-[#fbf9f2] ring-1 ring-[#c5a059]/30">
        <div
          dir="rtl"
          className="font-quran leading-[1.6] sm:leading-[1.7] text-right select-none"
          style={fontSize ? { fontSize: `${fontSize}px` } : undefined}
        >
          {children}
        </div>
      </div>

      {/* Mushaf Footer */}
      <div className="flex justify-between items-center text-[10px] sm:text-xs text-[#526e5f] mt-1 px-1.5 sm:px-2">
        <span>صفحة {toArabicDigits(pageNumber)}</span>
        {manzil && <span>{manzil}</span>}
      </div>
    </div>
  );
}
