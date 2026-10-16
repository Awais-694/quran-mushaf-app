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
    <div className="bg-[#0c1c14]/90 border border-emerald-900/60 rounded-xl sm:rounded-2xl p-2.5 sm:p-4 shadow-lg backdrop-blur-sm hover:border-emerald-700/60 transition-all flex flex-col justify-between text-center sm:text-left">
      <div className="text-[10px] sm:text-xs font-semibold text-emerald-300/80 uppercase tracking-wider truncate">
        {label}
      </div>
      <div className="text-lg sm:text-2xl font-bold text-white tracking-tight my-1 font-mono">
        {value}
      </div>
      {sublabel && (
        <div className="text-[9px] sm:text-[11px] text-emerald-400/60 font-medium truncate">
          {sublabel}
        </div>
      )}
    </div>
  );
}
