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
        quran: ['"IndoPak Nastaleeq"', '"Amiri Quran"', '"Scheherazade New"', "serif"],
        bismillah: ['"Amiri Quran"', '"IndoPak Nastaleeq"', '"Noto Naskh Arabic"', "serif"],
        surahTitle: ['"IndoPak Nastaleeq"', '"Amiri Quran"', '"Scheherazade New"', "serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
