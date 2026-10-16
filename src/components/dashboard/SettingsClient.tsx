"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getEnginePref,
  setEnginePref,
  getFontSize,
  setFontSize,
  resetFontSize,
  getDefaultMushafFontSize,
  getTheme,
  setTheme,
  type EnginePref,
  type ThemePref,
} from "@/lib/settings";
import { useWhisper } from "@/hooks/useWhisper";

export function SettingsClient() {
  const router = useRouter();
  const [engine, setEngine] = useState<EnginePref>("auto");
  const [fontSize, setFontSizeState] = useState(19);
  const [theme, setThemeState] = useState<ThemePref>("dark");
  const [mounted, setMounted] = useState(false);
  const whisper = useWhisper(() => {});

  useEffect(() => {
    setMounted(true);
    setEngine(getEnginePref());
    setFontSizeState(getFontSize());
    setThemeState(getTheme());
  }, []);

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/surahs");
    }
  };

  const applyTheme = (t: ThemePref) => {
    setThemeState(t);
    setTheme(t);
    document.documentElement.dataset.theme = t;
  };

  const handleResetFont = () => {
    const def = resetFontSize();
    setFontSizeState(def);
  };

  const defaultMushafSize = mounted ? getDefaultMushafFontSize() : 22;
  const isDefaultSize = fontSize === defaultMushafSize;

  const radioCls =
    "flex items-center gap-3 bg-[#0a1811]/70 hover:bg-[#0e2218]/90 border border-emerald-900/50 rounded-xl px-4 py-3 cursor-pointer transition-all";

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      {/* Top Navigation & Title Bar */}
      <div className="relative flex items-center justify-center min-h-[40px]">
        <button
          onClick={handleBack}
          className="absolute left-0 inline-flex items-center justify-center px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide text-emerald-100 bg-[#0d2217]/90 hover:bg-[#133022] border border-emerald-600/50 hover:border-emerald-400/80 shadow-[0_2px_8px_rgba(0,0,0,0.35)] hover:shadow-[0_0_12px_rgba(16,185,129,0.25)] backdrop-blur-md active:scale-95 transition-all duration-200 cursor-pointer"
        >
          Back
        </button>

        <h1 className="text-xl sm:text-2xl font-bold text-emerald-50 tracking-wide text-center">Settings</h1>
      </div>

      {/* Speech Recognition Engine */}
      <div className="bg-[#0c1c14]/90 border border-emerald-900/60 rounded-2xl p-4 sm:p-5 shadow-lg backdrop-blur-sm">
        <h2 className="text-base font-semibold text-emerald-100 mb-3">
          Speech Recognition Engine
        </h2>
        <div className="flex flex-col gap-2.5 text-xs sm:text-sm">
          <label className={radioCls}>
            <input
              type="radio"
              name="engine"
              checked={engine === "auto"}
              onChange={() => {
                setEngine("auto");
                setEnginePref("auto");
              }}
              className="accent-emerald-500 w-4 h-4 cursor-pointer"
            />
            <span className="text-emerald-100 font-medium">
              Auto — Online Web Speech when available, Whisper when offline
            </span>
          </label>
          <label className={radioCls}>
            <input
              type="radio"
              name="engine"
              checked={engine === "webspeech"}
              onChange={() => {
                setEngine("webspeech");
                setEnginePref("webspeech");
              }}
              className="accent-emerald-500 w-4 h-4 cursor-pointer"
            />
            <span className="text-emerald-100 font-medium">Online only (Web Speech API — Chrome / Edge)</span>
          </label>
          <label className={radioCls}>
            <input
              type="radio"
              name="engine"
              checked={engine === "whisper"}
              onChange={() => {
                setEngine("whisper");
                setEnginePref("whisper");
              }}
              className="accent-emerald-500 w-4 h-4 cursor-pointer"
            />
            <span className="text-emerald-100 font-medium">Offline only (Whisper — on-device model)</span>
          </label>
        </div>
      </div>

      {/* Offline Model (Whisper) */}
      <div className="bg-[#0c1c14]/90 border border-emerald-900/60 rounded-2xl p-4 sm:p-5 shadow-lg backdrop-blur-sm">
        <h2 className="text-base font-semibold text-emerald-100 mb-2">
          Offline Model (Whisper)
        </h2>
        <p className="text-xs sm:text-sm text-emerald-300/80 mb-3">
          Status:{" "}
          <b className="text-emerald-100">
            {whisper.modelState === "ready"
              ? "Downloaded & Ready"
              : whisper.modelState === "loading"
                ? `Downloading… ${Math.round(whisper.modelProgress)}%`
                : "Not downloaded"}
          </b>
        </p>
        <button
          onClick={() => whisper.loadModel()}
          disabled={whisper.modelState === "loading" || whisper.modelState === "ready"}
          className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold transition-all shadow-md active:scale-95 cursor-pointer"
        >
          {whisper.modelState === "ready" ? "Model Installed" : "Download Model (~150 MB, one-time)"}
        </button>
        {whisper.error && <p className="text-rose-300 text-xs sm:text-sm mt-2">{whisper.error}</p>}
      </div>

      {/* Mushaf Font Size & PDF Reset */}
      <div className="bg-[#0c1c14]/90 border border-emerald-900/60 rounded-2xl p-4 sm:p-5 shadow-lg backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <h2 className="text-base font-semibold text-emerald-100">
            Mushaf Font Size
          </h2>

          <button
            onClick={handleResetFont}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 border cursor-pointer ${
              isDefaultSize
                ? "bg-emerald-950/40 border-emerald-900/40 text-emerald-500/50 cursor-default"
                : "bg-amber-950/50 border-amber-600/50 text-amber-200 hover:bg-amber-900/60 hover:text-white shadow-sm"
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Reset to Mushaf PDF Scale</span>
          </button>
        </div>

        <p className="text-xs text-emerald-300/70 mb-3">
          Recommended scale: <b>22px</b> matches the Taj Company 16-line Mushaf PDF layout.
        </p>

        <div className="flex flex-wrap gap-2">
          {[16, 18, 20, 22, 24, 26].map((s) => (
            <button
              key={s}
              onClick={() => {
                setFontSizeState(s);
                setFontSize(s);
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium border transition-all active:scale-95 cursor-pointer ${
                fontSize === s
                  ? "bg-emerald-700 border-emerald-500 text-white shadow-md"
                  : "bg-emerald-950/60 border-emerald-900/70 text-emerald-200 hover:bg-emerald-900/60 hover:text-white"
              }`}
            >
              {s}px {s === defaultMushafSize && "(PDF Default)"}
            </button>
          ))}
        </div>
      </div>

      {/* Theme */}
      <div className="bg-[#0c1c14]/90 border border-emerald-900/60 rounded-2xl p-4 sm:p-5 shadow-lg backdrop-blur-sm">
        <h2 className="text-base font-semibold text-emerald-100 mb-2">
          Theme
        </h2>
        <p className="text-xs text-emerald-300/70 mb-3">
          Optimized for comfortable reading and focused Quran recitation.
        </p>
        <div className="inline-flex items-center px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-800/80 border border-emerald-600/60 text-white shadow-sm select-none">
          Dark Mode
        </div>
      </div>
    </div>
  );
}

