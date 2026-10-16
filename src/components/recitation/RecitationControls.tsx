// Tilawat ke controls: mic, ayat audio, reset, peek — Phase 1/2 me wire honge.
import { MicButton } from "./MicButton";

export function RecitationControls({
  listening,
  onToggleMic,
  onPlayAyah,
  onReset,
}: {
  listening: boolean;
  onToggleMic: () => void;
  onPlayAyah: () => void;
  onReset: () => void;
}) {
  return (
    <div className="flex flex-wrap gap-3 justify-center mt-4">
      <MicButton listening={listening} onClick={onToggleMic} />
      <button onClick={onPlayAyah} className="px-5 py-3 rounded-xl bg-emerald-900 border border-emerald-700">
        🔊 Ayat Sunein
      </button>
      <button onClick={onReset} className="px-5 py-3 rounded-xl bg-emerald-900 border border-emerald-700">
        ↺ Reset
      </button>
    </div>
  );
}
