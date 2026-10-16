import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        emeraldDeep: "#0f1a14",
        cardCream: "#fdfcf7",
        gold: "#c9a227",
      },
      fontFamily: {
        quran: ['"IndoPak Nastaleeq"', '"Amiri"', '"Scheherazade New"', "serif"],
        bismillah: ['"Amiri"', '"Scheherazade New"', '"IndoPak Nastaleeq"', "serif"],
        arabic: ['"Amiri"', '"Scheherazade New"', '"Noto Naskh Arabic"', "serif"],
        urdu: ['"Noto Nastaliq Urdu"', '"IndoPak Nastaleeq"', "serif"],
        display: ['"Outfit"', '"Cinzel"', "sans-serif"],
        surahTitle: ['"IndoPak Nastaleeq"', '"Amiri"', '"Scheherazade New"', "serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
