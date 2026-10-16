"use client";

import { useEffect, useState } from "react";

export function BismillahSplash() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Only show on fresh page load/open
    const timer = setTimeout(() => {
      setFading(true);
      const hideTimer = setTimeout(() => {
        setVisible(false);
      }, 700); // match transition duration
      return () => clearTimeout(hideTimer);
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setFading(true);
    setTimeout(() => setVisible(false), 300);
  };

  if (!visible) return null;

  return (
    <div
      onClick={handleDismiss}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center p-6 bg-[#040d07] select-none transition-all duration-700 cursor-pointer ${
        fading ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100"
      }`}
      aria-label="Opening Bismillah Screen"
      role="banner"
    >
      {/* Background Ambient Glow & Islamic Ornament */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-900/30 via-[#040d07]/90 to-[#020704] pointer-events-none" />
      
      {/* Subtle Golden Decorative Frame */}
      <div className="relative max-w-md w-full mx-auto flex flex-col items-center text-center px-4 py-8 rounded-3xl border border-emerald-500/20 bg-gradient-to-b from-emerald-950/40 via-[#06140b]/70 to-[#030a06]/90 shadow-[0_0_50px_rgba(5,150,105,0.15)] backdrop-blur-md">
        
        {/* Top Islamic Geometric Icon */}
        <div className="w-12 h-12 mb-5 rounded-2xl bg-gradient-to-br from-emerald-600/30 to-emerald-950 border border-emerald-400/40 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
          <svg
            className="w-6 h-6 text-emerald-300"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        </div>

        {/* Bismillah Calligraphy */}
        <div className="relative my-2 px-2">
          <h1
            dir="rtl"
            lang="ar"
            className="font-bismillah text-3xl sm:text-4xl md:text-5xl font-bold leading-relaxed tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-emerald-100 via-amber-200 to-emerald-200 drop-shadow-[0_2px_12px_rgba(251,191,36,0.25)]"
          >
            بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
          </h1>
        </div>

        {/* Translation in Urdu and English */}
        <div className="mt-4 space-y-1.5">
          <p
            dir="rtl"
            className="text-emerald-200/90 text-sm sm:text-base font-arabic leading-relaxed"
          >
            شروع اللہ کے نام سے جو بڑا مہربان نہایت رحم والا ہے
          </p>
          <p className="text-emerald-400/60 text-xs sm:text-xs tracking-wider font-medium">
            In the name of Allah, the Most Gracious, the Most Merciful
          </p>
        </div>

        {/* Elegant Animated Progress Line */}
        <div className="w-28 h-1 bg-emerald-950/80 rounded-full mt-6 overflow-hidden border border-emerald-800/40">
          <div className="h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-400 rounded-full animate-[pulse_1.5s_ease-in-out_infinite]" />
        </div>

        <span className="text-[10px] text-emerald-400/40 mt-3 uppercase tracking-widest font-mono">
          Tap anywhere to continue
        </span>
      </div>
    </div>
  );
}
