export function StatCard({
  label,
  value,
  sublabel,
}: {
  label: string;
  value: string;
  sublabel?: string;
  icon?: string;
}) {
  return (
    <div className="bg-[#0c1c14]/90 border border-emerald-900/60 rounded-2xl p-3.5 sm:p-5 shadow-lg backdrop-blur-sm hover:border-emerald-700/60 transition-all flex flex-col justify-between">
      <div className="text-[11px] sm:text-xs font-semibold text-emerald-300/80 uppercase tracking-wider">
        {label}
      </div>
      <div className="text-xl sm:text-2xl font-bold text-white tracking-tight my-1 font-mono">
        {value}
      </div>
      {sublabel && (
        <div className="text-[10px] sm:text-xs text-emerald-400/60 font-medium">
          {sublabel}
        </div>
      )}
    </div>
  );
}
