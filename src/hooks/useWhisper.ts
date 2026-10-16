import { useEffect, useRef, useState } from "react";

// Offline Whisper engine (beta) — PLAN.md Phase 4.
// Worker public/whisper-worker.js me hai (Transformers.js, v2 se app ke andar bundle hai — public/vendor/, CDN nahi).
// Model (whisper-base) pehli dafa download hokar browser cache me rehta hai,
// phir recognition 100% device ke andar — internet ki zaroorat nahi.
// Mic se 5-second ke segments transcribe hote hain, is liye results
// chand seconds ke waqfe se aate hain (live streaming nahi hai).

type Handler = (finalText: string, interimText: string) => void;
export type WhisperModelState = "idle" | "loading" | "ready" | "error";

async function decodeTo16k(blob: Blob): Promise<Float32Array | null> {
  let ctx: AudioContext | null = null;
  try {
    const buf = await blob.arrayBuffer();
    ctx = new AudioContext();
    const decoded = await ctx.decodeAudioData(buf);
    const len = Math.max(1, Math.ceil(decoded.duration * 16000));
    const off = new OfflineAudioContext(1, len, 16000);
    const src = off.createBufferSource();
    src.buffer = decoded;
    src.connect(off.destination);
    src.start();
    const rendered = await off.startRendering();
    return rendered.getChannelData(0);
  } catch {
    return null;
  } finally {
    // Context hamesha band karo — warna fail hone par leak hokar chand
    // segments ke baad naya AudioContext banna band ho jata hai.
    try { await ctx?.close(); } catch { /* ignore */ }
  }
}

export function useWhisper(onResult: Handler) {
  const [supported, setSupported] = useState(false);
  useEffect(() => {
    setSupported(
      typeof window !== "undefined" &&
      !!navigator.mediaDevices?.getUserMedia &&
      typeof Worker !== "undefined"
    );
  }, []);
  const [listening, setListening] = useState(false);
  const [modelState, setModelState] = useState<WhisperModelState>("idle");
  const [modelProgress, setModelProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  // "cpu" ya "gpu" — worker ne model asal me kis device par load kiya
  const [engineDevice, setEngineDevice] = useState<"cpu" | "gpu">("cpu");

  const workerRef = useRef<Worker | null>(null);
  const handlerRef = useRef(onResult);
  handlerRef.current = onResult;
  const finalsRef = useRef<string[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const activeRef = useRef(false);
  const modelStateRef = useRef<WhisperModelState>("idle");
  const pendingStart = useRef(false);

  const isBusyRef = useRef(false);
  const pendingAudioRef = useRef<Float32Array | null>(null);

  const processAudio = (audio: Float32Array) => {
    if (!workerRef.current) return;
    if (isBusyRef.current) {
      // Worker is currently busy computing on CPU — hold the latest audio chunk
      pendingAudioRef.current = audio;
      return;
    }
    isBusyRef.current = true;
    handlerRef.current(
      finalsRef.current.join(" "),
      engineDevice === "gpu" ? "Analyzing audio on GPU…" : "Analyzing audio on device CPU…"
    );
    workerRef.current.postMessage({ type: "transcribe", audio }, [audio.buffer as ArrayBuffer]);
  };

  const beginRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      activeRef.current = true;
      setListening(true);
      recordSegment();
    } catch {
      setError("Microphone permission was denied.");
      setListening(false);
    }
  };

  const recordSegment = () => {
    const stream = streamRef.current;
    if (!stream || !activeRef.current) return;
    const rec = new MediaRecorder(stream);
    recorderRef.current = rec;
    const chunks: Blob[] = [];
    rec.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data); };
    rec.onstop = async () => {
      if (chunks.length && workerRef.current) {
        const audio = await decodeTo16k(new Blob(chunks, { type: rec.mimeType }));
        if (audio) {
          // RMS energy check: only analyze if audio contains actual audible speech
          let sum = 0;
          for (let i = 0; i < audio.length; i++) {
            sum += audio[i] * audio[i];
          }
          const rms = Math.sqrt(sum / audio.length);
          if (rms >= 0.012) {
            processAudio(audio);
          }
        }
      }
      if (activeRef.current) recordSegment();
    };
    rec.start();
    // 3.2 second window for faster turnaround with multi-threaded decoder
    setTimeout(() => { if (rec.state === "recording") rec.stop(); }, 3200);
  };

  const ensureWorker = () => {
    if (workerRef.current) return workerRef.current;
    const w = new Worker("/whisper-worker.js", { type: "module" });
    w.onmessage = (e: MessageEvent) => {
      const m = e.data as { type: string; progress?: number; text?: string; message?: string; device?: string };
      if (m.type === "progress") {
        setModelProgress(m.progress ?? 0);
      } else if (m.type === "ready") {
        modelStateRef.current = "ready";
        setModelState("ready");
        setEngineDevice(m.device === "gpu" ? "gpu" : "cpu");
        if (pendingStart.current) {
          pendingStart.current = false;
          void beginRecording();
        }
      } else if (m.type === "result") {
        isBusyRef.current = false;
        const t = (m.text || "").trim();
        // Lagatar ek jaisa transcript dobara na gino
        if (t && t !== finalsRef.current[finalsRef.current.length - 1]) {
          finalsRef.current.push(t);
          handlerRef.current(finalsRef.current.join(" "), "");
        } else {
          handlerRef.current(finalsRef.current.join(" "), "");
        }
        // If audio arrived while we were busy, process the latest audio now
        if (pendingAudioRef.current && activeRef.current) {
          const next = pendingAudioRef.current;
          pendingAudioRef.current = null;
          processAudio(next);
        }
      } else if (m.type === "error") {
        isBusyRef.current = false;
        setError(m.message || "Something went wrong in the Whisper engine.");
        modelStateRef.current = "error";
        setModelState("error");
      }
    };
    workerRef.current = w;
    return w;
  };

  const loadModel = () => {
    const w = ensureWorker();
    if (modelStateRef.current === "ready" || modelStateRef.current === "loading") return;
    modelStateRef.current = "loading";
    setModelState("loading");
    setModelProgress(0);
    w.postMessage({ type: "load" });
  };

  const start = async () => {
    setError(null);
    if (modelStateRef.current !== "ready") {
      pendingStart.current = true;
      loadModel();
      return;
    }
    await beginRecording();
  };

  const stop = () => {
    activeRef.current = false;
    pendingStart.current = false;
    if (recorderRef.current?.state === "recording") recorderRef.current.stop();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setListening(false);
  };

  const resetFinals = () => { finalsRef.current = []; };

  useEffect(
    () => () => {
      activeRef.current = false;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      workerRef.current?.terminate();
    },
    []
  );

  return { supported, listening, modelState, modelProgress, error, start, stop, resetFinals, loadModel, engineDevice };
}
