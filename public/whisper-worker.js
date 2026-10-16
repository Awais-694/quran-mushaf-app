// Offline Whisper worker — Tilawat app (beta)
// v2 (bundled): Transformers.js library ab jsDelivr CDN se NAHI aati —
// wohi official @huggingface/transformers@3.0.2 build app ke andar
// bundle hai (/vendor/transformers.min.js + saath ke ONNX wasm files),
// is liye library bhi 100% local hai aur Wi-Fi band + Chrome restart ke
// baad bhi load hoti hai. Sirf model (onnx-community/whisper-base)
// pehli dafa download hokar browser cache me rehta hai, phir 100% offline.
// v4 (WebGPU): agar browser me WebGPU (navigator.gpu) maujood hai to model
// GPU par chalta hai (device:"webgpu", fp32) — CPU se kayi guna tez.
// Na mile to khamoshi se CPU (wasm, q8) fallback. Kaunsa device laga ye
// "ready" message me device:"gpu"|"cpu" ki surat me UI ko bataya jata hai.
// Messages in:  {type:"load"} | {type:"transcribe", audio: Float32Array}
// Messages out: {type:"progress", progress} | {type:"ready", device} |
//               {type:"result", text} | {type:"error", message}

let asr = null;
// "cpu" ya "gpu" — asal me konsa device istemal hua (UI badge ke liye)
let deviceUsed = "cpu";

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
      if (asr) { self.postMessage({ type: "ready", device: deviceUsed }); return; }
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
      const progressCb = (p) => {
        if (p && p.status === "progress" && typeof p.progress === "number") {
          self.postMessage({ type: "progress", progress: p.progress });
        }
      };
      // WebGPU pehle try karo (GPU CPU se kayi guna tez hai).
      // WebGPU ke liye fp32 model file chahiye (q8 sirf CPU/wasm ke liye hai),
      // is liye GPU wali download thodi bari (~300MB) hogi.
      // Agar WebGPU na mile ya fail ho to khamoshi se CPU (wasm) fallback.
      let loaded = false;
      if (typeof navigator !== "undefined" && navigator.gpu) {
        try {
          asr = await pipeline(
            "automatic-speech-recognition",
            "onnx-community/whisper-base",
            {
              device: "webgpu",
              dtype: "fp32",
              progress_callback: progressCb,
            }
          );
          deviceUsed = "gpu";
          loaded = true;
        } catch (gpuErr) {
          asr = null; // neeche CPU fallback
        }
      }
      if (!loaded) {
        asr = await pipeline(
          "automatic-speech-recognition",
          "onnx-community/whisper-base",
          {
            dtype: "q8",
            device: "wasm",
            progress_callback: progressCb,
          }
        );
        deviceUsed = "cpu";
      }
      self.postMessage({ type: "ready", device: deviceUsed });
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
