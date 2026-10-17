// Offline Whisper worker — Tilawat app (beta)
// v2 (bundled): Transformers.js library ab jsDelivr CDN se NAHI aati —
// wohi official @huggingface/transformers@3.0.2 build app ke andar
// bundle hai (/vendor/transformers.min.js + saath ke ONNX wasm files),
// is liye library bhi 100% local hai aur Wi-Fi band + Chrome restart ke
// baad bhi load hoti hai. Sirf model (onnx-community/whisper-base)
// pehli dafa download hokar browser cache me rehta hai, phir 100% offline.
// Messages in:  {type:"load"} | {type:"transcribe", audio: Float32Array}
// Messages out: {type:"progress", progress} | {type:"ready"} |
//               {type:"result", text} | {type:"error", message}

let asr = null;

const HALLUCINATIONS = new Set([
  "مرحب",
  "مرحبا",
  "شكرا",
  "شكرا لكم",
  "اشترك",
  "اشترك في القناة",
  "مع السلامة",
  "السلام عليكم",
]);

self.onmessage = async (e) => {
  const msg = e.data;
  try {
    if (msg.type === "load") {
      if (asr) { self.postMessage({ type: "ready" }); return; }
      const { pipeline, env } = await import("/vendor/transformers.min.js");
      env.allowLocalModels = false;
      const onnxBackend = env.backends && env.backends.onnx;
      const wasmCfg =
        (onnxBackend && onnxBackend.env && onnxBackend.env.wasm) ||
        (onnxBackend && onnxBackend.wasm);
      if (wasmCfg) {
        wasmCfg.wasmPaths = "/vendor/";
        if (typeof navigator !== "undefined" && navigator.hardwareConcurrency) {
          wasmCfg.numThreads = Math.min(4, navigator.hardwareConcurrency);
        }
      }
      const progressCallback = (p) => {
        if (p && p.status === "progress" && typeof p.progress === "number") {
          self.postMessage({ type: "progress", progress: p.progress });
        }
      };

      try {
        asr = await pipeline(
          "automatic-speech-recognition",
          "onnx-community/whisper-base",
          {
            device: "webgpu",
            dtype: "fp32",
            progress_callback: progressCallback,
          }
        );
      } catch (gpuErr) {
        console.warn("WebGPU initialization failed, falling back to wasm:", gpuErr);
        asr = await pipeline(
          "automatic-speech-recognition",
          "onnx-community/whisper-base",
          {
            dtype: "q8",
            device: "wasm",
            progress_callback: progressCallback,
          }
        );
      }
      self.postMessage({ type: "ready" });
    } else if (msg.type === "transcribe") {
      if (!asr) { self.postMessage({ type: "error", message: "Model ready nahi hai." }); return; }
      const out = await asr(msg.audio, {
        language: "arabic",
        task: "transcribe",
        return_timestamps: false,
        max_new_tokens: 30,
        num_beams: 1,
        temperature: 0.0,
        repetition_penalty: 1.2,
      });
      let text = (out && out.text) || "";
      const trimmed = text.trim();
      if (HALLUCINATIONS.has(trimmed)) {
        text = "";
      }
      self.postMessage({ type: "result", text });
    }
  } catch (err) {
    self.postMessage({ type: "error", message: String(err && err.message ? err.message : err) });
  }
};
