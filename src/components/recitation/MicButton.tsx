export function MicButton({
  listening,
  disabled,
  onClick,
}: {
  listening: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={listening ? "Stop Reciting" : "Start Reciting"}
      aria-label={listening ? "Stop Reciting" : "Start Reciting"}
      className={`relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full transition-all shadow-lg active:scale-90 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0 ${
        listening
          ? "bg-rose-600 hover:bg-rose-500 text-white shadow-[0_0_22px_rgba(225,29,72,0.6)] ring-2 ring-rose-400/70 animate-pulse"
          : "bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 hover:from-emerald-500 hover:to-teal-300 text-white shadow-[0_0_18px_rgba(16,185,129,0.45)] border border-emerald-300/40 hover:shadow-[0_0_24px_rgba(16,185,129,0.6)]"
      }`}
    >
      {listening ? (
        <span className="relative flex items-center justify-center">
          <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-rose-400 opacity-60"></span>
          <svg className="w-5 h-5 text-white relative z-10" fill="currentColor" viewBox="0 0 24 24">
            <rect x="6" y="6" width="12" height="12" rx="2.5" />
          </svg>
        </span>
      ) : (
        <svg className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-white drop-shadow-sm" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
          <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
        </svg>
      )}
    </button>
  );
}
