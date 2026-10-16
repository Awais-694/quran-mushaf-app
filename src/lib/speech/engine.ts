// Speech engines ka common interface.
// Do engines hain (PLAN.md Section 2):
//  - "webspeech": Chrome Web Speech API — online, fast (hooks/useSpeechRecognition)
//  - "whisper":   on-device Whisper (Transformers.js, Web Worker) — offline (Phase 4)
// App net ki halat dekh kar engine chunti hai; Settings me manual choice bhi hai.

import type { SpeechEngineKind } from "@/types/quran";

export interface SpeechEngine {
  kind: SpeechEngineKind;
  supported: boolean;
  start: () => void;
  stop: () => void;
  /** finalText: poori session ka final transcript; interimText: abhi bola jata hua hissa */
  onResult: ((finalText: string, interimText: string) => void) | null;
}

export function pickEngine(online: boolean): SpeechEngineKind {
  return online ? "webspeech" : "whisper";
}
