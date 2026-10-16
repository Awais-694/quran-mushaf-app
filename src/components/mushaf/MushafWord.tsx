import type { WordToken } from "@/types/quran";

// Ek lafz mushaf page par — state ke hisab se style:
// correct = crisp black ink, current = soft golden parchment glow, hidden = blur, wrong = soft rose tint
export function MushafWord({
  token,
  onClick,
}: {
  token: WordToken;
  onClick?: () => void;
}) {
  const isCurrent = token.state === "current";
  const isWrong = token.state === "wrong";
  const isHighlighted = isCurrent || isWrong;

  const cls =
    token.state === "correct"
      ? "text-[#102419] hover:bg-emerald-500/15 rounded"
      : isCurrent
        ? "bg-[#f5e6b8] text-[#1a382b] rounded px-1 py-0.5 shadow-sm ring-1 ring-[#c5a059]/60 font-semibold animate-pulse"
        : isWrong
          ? "bg-[#fed7d7] text-[#9b2c2c] rounded px-1 py-0.5 ring-1 ring-red-400/50"
          : "blur-[5px] opacity-30 select-none hover:opacity-75 hover:blur-[2px]";

  return (
    <span
      onClick={onClick}
      role={onClick ? "button" : undefined}
      title={onClick ? `Tap to recite & listen from Ayah ${token.ayahNumber || 1}` : undefined}
      className={`transition-all duration-150 ${onClick ? "cursor-pointer active:scale-95" : ""} ${
        isHighlighted ? "inline-block" : "inline"
      } ${cls}`}
    >
      {token.display}
    </span>
  );
}
