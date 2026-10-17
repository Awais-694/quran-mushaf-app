"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { JILDS, type JildInfo } from "@/data/tarjama-meta";
import surahsMeta from "@/data/surahs-meta.json";

export function TarjamaClient() {
  const router = useRouter();
  const [activeJildId, setActiveJildId] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSurahDrawerOpen, setIsSurahDrawerOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const activeJild = useMemo(
    () => JILDS.find((j) => j.id === activeJildId) ?? JILDS[0],
    [activeJildId]
  );

  // Filter surahs based on search query
  const filteredSurahs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return surahsMeta.map((s) => {
      const jild = JILDS.find((j) => j.surahNumbers.includes(s.number)) ?? JILDS[0];
      return { ...s, jild };
    }).filter((s) => {
      if (!q) return true;
      return (
        s.number.toString().includes(q) ||
        s.name.toLowerCase().includes(q) ||
        s.arabicName.includes(q) ||
        s.translation.toLowerCase().includes(q)
      );
    });
  }, [searchQuery]);

  const handleSelectSurah = (surahNumber: number) => {
    const targetJild = JILDS.find((j) => j.surahNumbers.includes(surahNumber));
    if (targetJild) {
      setActiveJildId(targetJild.id);
    }
    setIsSurahDrawerOpen(false);
  };

  return (
    <div className={`space-y-4 pb-12 ${isFullscreen ? "fixed inset-0 z-50 bg-[#06120b] p-2 sm:p-4 overflow-hidden" : ""}`}>
      {/* Top Header Card */}
      {!isFullscreen && (
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#0c1e15]/95 via-[#07160f]/95 to-[#040e09]/95 border border-[#1d442f]/80 p-3.5 sm:p-5 shadow-[0_12px_40px_rgba(0,0,0,0.5)] backdrop-blur-md">
          <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent" />

          {/* Top Bar: Back button on Left, Surah Index on Right */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <button
              onClick={() => router.push("/surahs")}
              className="inline-flex items-center justify-center px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide text-emerald-100 bg-[#0d2217]/90 hover:bg-[#133022] border border-emerald-600/50 hover:border-emerald-400/80 shadow-md backdrop-blur-md active:scale-95 transition-all cursor-pointer"
            >
              Back to Surahs
            </button>

            <button
              onClick={() => setIsSurahDrawerOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold text-emerald-100 bg-emerald-800/80 hover:bg-emerald-700 border border-emerald-500/70 shadow-[0_0_15px_rgba(16,185,129,0.25)] active:scale-95 transition-all cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.3" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
              <span>Surah Index (114)</span>
            </button>
          </div>

          {/* Title & Description */}
          <div className="text-center my-1 sm:my-2">
            <div className="text-xl sm:text-2xl font-bold font-quran text-emerald-200 tracking-wide select-none" dir="rtl">
              مَعْرِفَةُ الْقُرْآن عَلَىٰ كَنْزِ الْعِرْفَان
            </div>
            <h1 className="text-base sm:text-lg font-bold text-white tracking-wide mt-1">
              Quran Tarjama & Tafseer (Kanz-ul-Irfan)
            </h1>
            <p className="text-xs sm:text-sm text-emerald-300/70 mt-1 max-w-xl mx-auto">
              Mukammal 6 Jilds (Volumes) — Read authentic Urdu translation & commentary directly in-app.
            </p>
          </div>

          {/* Jild (Volume) Switcher Pills */}
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap mt-3 pt-3 border-t border-emerald-900/60">
            {JILDS.map((j) => (
              <button
                key={j.id}
                onClick={() => setActiveJildId(j.id)}
                className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 border ${
                  activeJildId === j.id
                    ? "bg-emerald-700 border-emerald-400 text-white shadow-[0_0_12px_rgba(16,185,129,0.35)] font-semibold"
                    : "bg-[#06140d]/80 border-emerald-900/70 text-emerald-200/80 hover:bg-emerald-900/50 hover:text-white"
                }`}
              >
                <span>{j.title}</span>
                <span className="text-[10px] sm:text-xs opacity-75 font-quran">{j.urduTitle}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Viewer Container Card */}
      <div className={`bg-[#0c1c14]/90 border border-emerald-900/70 rounded-2xl sm:rounded-3xl p-2 sm:p-3.5 shadow-xl backdrop-blur-md flex flex-col ${isFullscreen ? "h-full" : ""}`}>
        {/* Viewer Sub-bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2 px-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-700/60 text-emerald-200 text-xs font-semibold">
              {activeJild.title} ({activeJild.urduTitle})
            </span>
            <span className="text-xs text-emerald-300/70 hidden sm:inline">
              {activeJild.parahRange} • {activeJild.surahRange}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Open Fullscreen Button */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="px-2.5 py-1 rounded-lg bg-[#07170f] hover:bg-emerald-900/60 border border-emerald-800/70 text-emerald-200 text-xs font-medium flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
              title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen Mode"}
            >
              {isFullscreen ? (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 9L4 4m0 0l5 0m-5 0l0 5m11 5l5 5m0 0l-5 0m5 0l0-5" />
                  </svg>
                  <span>Exit Fullscreen</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                  </svg>
                  <span>Fullscreen</span>
                </>
              )}
            </button>

            {/* Direct Open in New Tab Button */}
            <a
              href={activeJild.fileName}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded-lg bg-[#07170f] hover:bg-emerald-900/60 border border-emerald-800/70 text-emerald-200 text-xs font-medium flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
              title="Open full PDF in browser tab or download"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
              <span>Open Tab</span>
            </a>
          </div>
        </div>

        {/* High Performance Embedded PDF Frame & Mobile Card */}
        <div className={`w-full rounded-xl overflow-hidden border border-emerald-900/60 bg-[#06120b] shadow-inner relative ${isFullscreen ? "flex-1" : "h-[74vh] sm:h-[82vh]"}`}>
          <object
            key={activeJild.fileName}
            data={`${activeJild.fileName}#view=FitH&toolbar=1&navpanes=1`}
            type="application/pdf"
            className="w-full h-full border-0"
          >
            {/* Fallback for browsers / devices that do not support inline PDF embedding (e.g. mobile Chrome/Safari) */}
            <div className="flex flex-col items-center justify-center p-6 sm:p-10 text-center h-full bg-gradient-to-b from-[#091f14] to-[#040e09] text-white">
              <div className="w-16 h-16 rounded-2xl bg-emerald-900/60 border border-emerald-600/50 flex items-center justify-center text-3xl mb-4 shadow-[0_0_25px_rgba(16,185,129,0.25)] text-emerald-200 animate-pulse">
                📖
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-1.5 font-quran" dir="rtl">
                {activeJild.urduTitle} ({activeJild.title})
              </h3>
              <p className="text-xs sm:text-sm text-emerald-300 font-medium mb-1">
                {activeJild.parahRange}
              </p>
              <p className="text-xs text-emerald-400/80 mb-5">
                {activeJild.surahRange}
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-sm">
                <a
                  href={activeJild.fileName}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm shadow-[0_4px_20px_rgba(16,185,129,0.35)] flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                  </svg>
                  <span>براہ راست پی ڈی ایف پڑھیں (Open PDF)</span>
                </a>

                <button
                  onClick={() => setIsSurahDrawerOpen(true)}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#0d271a] hover:bg-[#133825] border border-emerald-700/60 text-emerald-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  </svg>
                  <span>سورت منتخب کریں (Surah Index)</span>
                </button>
              </div>

              <p className="text-[11px] text-emerald-400/60 mt-4 max-w-xs">
                موبائل پر پی ڈی ایف فل اسکرین یا پی ڈی ایف ریڈر ایپ میں باآسانی زوم اور اسکرول ہو جائے گی۔
              </p>
            </div>
          </object>
        </div>
      </div>

      {/* Surah Index Modal / Drawer */}
      {isSurahDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#0b1a13] border border-emerald-800/80 rounded-2xl sm:rounded-3xl p-4 sm:p-5 w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl">
            {/* Drawer Header */}
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-emerald-900/70">
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Select Surah to Open in Tarjama</span>
              </h2>
              <button
                onClick={() => setIsSurahDrawerOpen(false)}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-emerald-950/70 hover:bg-emerald-900 text-emerald-300 hover:text-white transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Search Input */}
            <div className="my-3">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Surah (e.g. Yaseen, Baqara, Kahf, 36)..."
                  className="w-full px-3.5 py-2 pl-9 rounded-xl bg-[#06140d] border border-emerald-800/80 text-white placeholder-emerald-400/40 text-xs sm:text-sm focus:outline-none focus:border-emerald-400 transition-colors"
                />
                <svg
                  className="w-4 h-4 text-emerald-400/60 absolute left-3 top-2.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>
            </div>

            {/* Surah List */}
            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 divide-y divide-emerald-950/60">
              {filteredSurahs.map((s) => (
                <button
                  key={s.number}
                  onClick={() => handleSelectSurah(s.number)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#0e271a] transition-all text-left group cursor-pointer ${
                    activeJild.surahNumbers.includes(s.number) ? "bg-[#091f14]/60" : ""
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-emerald-900/60 border border-emerald-700/60 flex items-center justify-center text-xs font-bold text-emerald-200">
                      {s.number}
                    </span>
                    <div>
                      <div className="text-xs sm:text-sm font-semibold text-white group-hover:text-emerald-200 transition-colors">
                        {s.name}
                      </div>
                      <div className="text-[10px] text-emerald-400/70">
                        {s.translation} • {s.numberOfAyahs} Ayahs
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950/80 border border-emerald-800/60 text-emerald-300">
                      {s.jild.title} ({s.jild.urduTitle})
                    </span>
                    <span className="text-base sm:text-lg font-quran text-emerald-200" dir="rtl">
                      {s.arabicName}
                    </span>
                  </div>
                </button>
              ))}

              {filteredSurahs.length === 0 && (
                <div className="text-center py-8 text-emerald-400/60 text-xs sm:text-sm">
                  No Surah found matching &ldquo;{searchQuery}&rdquo;
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
