export function ProgressBar({ pct }: { pct: number }) {
  const clamped = Math.min(100, Math.max(0, pct));
  return (
    <div className="relative w-full bg-[#06120b] border border-emerald-900/60 rounded-full h-2.5 sm:h-3 overflow-hidden shadow-inner p-[1px]">
      <div
        className="h-full rounded-full bg-gradient-to-r from-emerald-600 via-emerald-400 to-[#e2c179] transition-all duration-500 ease-out shadow-[0_0_10px_rgba(52,211,153,0.4)]"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
