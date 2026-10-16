// Ayat audio player — reference tilawat (Alafasy), free CDN.
// Jo ayat ek dafa play hogi, Cache Storage me save ho jayegi
// taake dobara offline bhi chal sake (Phase 3).

const AUDIO_BASE = "https://cdn.islamic.network/quran/audio/128/ar.alafasy";

/** Global ayah number (1..6236) se audio URL */
export function ayahAudioUrl(globalAyahNumber: number): string {
  return `${AUDIO_BASE}/${globalAyahNumber}.mp3`;
}

let current: HTMLAudioElement | null = null;

export function playAyah(globalAyahNumber: number): HTMLAudioElement {
  stopAyah();
  const audio = new Audio(ayahAudioUrl(globalAyahNumber));
  current = audio;

  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise.catch((err) => {
      // AbortError tab aata hai jab audio ko play() complete hone se pehle pause() ya stop kar diya jaye.
      // Yeh normal browser behavior hai aur ise safely ignore karna chahiye.
      if (err.name !== "AbortError") {
        console.warn("Audio playback notice:", err.message || err);
      }
    });
  }

  return audio;
}

export function stopAyah() {
  if (current) {
    try {
      current.pause();
      current.currentTime = 0;
    } catch {
      // ignore
    }
    current = null;
  }
}
