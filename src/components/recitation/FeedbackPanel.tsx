export function FeedbackPanel({
  lastHeard,
  mistakes,
  revealed,
  total,
  listening,
  activeEngine,
  whisperDevice,
}: {
  lastHeard: string;
  mistakes: number;
  revealed: number;
  total: number;
  listening: boolean;
  activeEngine: string;
  whisperDevice: "cpu" | "gpu";
}) {
  const pct = total ? Math.round((revealed / total) * 100) : 0;
  const isWhisper = activeEngine === "whisper";

  return (
    <div className="bg-[#0b1a13]/90 backdrop-blur-md border border-emerald-800/60 rounded-2xl p-3 sm:p-3.5 shadow-lg text-emerald-100 mt-4 mb-8">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-emerald-300/80 mb-2 border-b border-emerald-900/50 pb-2">
        <div className="flex items-center gap-2">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              listening ? "bg-emerald-400 animate-pulse" : "bg-emerald-800"
            }`}
          />
          <span className="font-semibold tracking-wide text-white">
            {listening ? "Live Voice Input" : "Microphone Idle"}
          </span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
              isWhisper
                ? "bg-amber-950/60 text-amber-300 border-amber-800/60"
                : "bg-emerald-950/80 text-emerald-300 border-emerald-700/60"
            }`}
          >
            {isWhisper
              ? whisperDevice === "gpu"
                ? "Offline Whisper (GPU)"
                : "Offline Whisper (CPU)"
              : "Online Web Speech (Instant)"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-md bg-emerald-950/70 border border-emerald-800/60 text-emerald-200 font-mono text-[11px]">
            {revealed} / {total} words ({pct}%)
          </span>
          {mistakes > 0 && (
            <span className="px-2 py-0.5 rounded-md bg-rose-950/70 border border-rose-800/60 text-rose-300 text-[11px]">
              {mistakes} {mistakes === 1 ? "correction" : "corrections"}
            </span>
          )}
        </div>
      </div>

      <div
        dir="rtl"
        className="font-quran text-base sm:text-lg text-emerald-100 leading-relaxed min-h-[2rem] flex items-center justify-end px-1"
      >
        {lastHeard ? (
          <span className="drop-shadow-sm text-emerald-200">{lastHeard}</span>
        ) : (
          <span className="text-emerald-400/50 text-xs sm:text-sm font-sans not-italic text-left w-full" dir="ltr">
            {listening
              ? isWhisper
                ? whisperDevice === "gpu"
                  ? "Listening… recite clearly. GPU model analyzes in near real-time."
                  : "Listening… recite clearly. Offline CPU model analyzes in phrases (~4-6s)."
                : "Listening… recite aloud, words will reveal on the Mushaf instantly."
              : "Press 'Start Reciting' to begin reading."}
          </span>
        )}
      </div>
    </div>
  );
}
