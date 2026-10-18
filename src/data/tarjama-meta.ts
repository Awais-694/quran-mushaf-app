export interface JildInfo {
  id: number;
  title: string;
  urduTitle: string;
  arabicTitle: string;
  parahRange: string;
  surahRange: string;
  fileName: string;
  sizeMB: number;
  surahNumbers: number[];
}

export const JILDS: JildInfo[] = [
  {
    id: 1,
    title: "Jild 1",
    urduTitle: "جلد اول",
    arabicTitle: "المجلد الأول",
    parahRange: "Parah 1 – 5 (پارہ ۱ تا ۵)",
    surahRange: "Surah 1 Al-Fatiha – Surah 4 An-Nisa",
    fileName: "/marifatul-quran-ala-kanzul-irfan-jild-1.pdf",
    sizeMB: 55.1,
    surahNumbers: [1, 2, 3, 4],
  },
  {
    id: 2,
    title: "Jild 2",
    urduTitle: "جلد دوم",
    arabicTitle: "المجلد الثاني",
    parahRange: "Parah 6 – 10 (پارہ ۶ تا ۱۰)",
    surahRange: "Surah 5 Al-Ma'idah – Surah 9 At-Tawbah",
    fileName: "/marfatul-quran-jild-2.pdf",
    sizeMB: 58.8,
    surahNumbers: [5, 6, 7, 8, 9],
  },
  {
    id: 3,
    title: "Jild 3",
    urduTitle: "جلد سوم",
    arabicTitle: "المجلد الثالث",
    parahRange: "Parah 11 – 15 (پارہ ۱۱ تا ۱۵)",
    surahRange: "Surah 10 Yunus – Surah 18 Al-Kahf",
    fileName: "/marifatul-quran-ala-kanzul-irfan-jild-3.pdf",
    sizeMB: 64.9,
    surahNumbers: [10, 11, 12, 13, 14, 15, 16, 17, 18],
  },
  {
    id: 4,
    title: "Jild 4",
    urduTitle: "جلد چہارم",
    arabicTitle: "المجلد الرابع",
    parahRange: "Parah 16 – 20 (پارہ ۱۶ تا ۲۰)",
    surahRange: "Surah 19 Maryam – Surah 28 Al-Qasas",
    fileName: "/marifatul-quran-ala-kanzul-irfan-jild-4.pdf",
    sizeMB: 70.0,
    surahNumbers: [19, 20, 21, 22, 23, 24, 25, 26, 27, 28],
  },
  {
    id: 5,
    title: "Jild 5",
    urduTitle: "جلد پنجم",
    arabicTitle: "المجلد الخامس",
    parahRange: "Parah 21 – 25 (پارہ ۲۱ تا ۲۵)",
    surahRange: "Surah 29 Al-Ankabut – Surah 45 Al-Jathiyah",
    fileName: "/maarifat-ul-quraan-jild-5.pdf",
    sizeMB: 76.2,
    surahNumbers: [29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45],
  },
  {
    id: 6,
    title: "Jild 6",
    urduTitle: "جلد ششم",
    arabicTitle: "المجلد السادس",
    parahRange: "Parah 26 – 30 (پارہ ۲۶ تا ۳۰)",
    surahRange: "Surah 46 Al-Ahqaf – Surah 114 An-Nas",
    fileName: "/maarifat-ul-quraan-jild-6.pdf",
    sizeMB: 50.0,
    surahNumbers: Array.from({ length: 114 - 46 + 1 }, (_, i) => 46 + i),
  },
];

export interface SurahPageMapping {
  jildId: number;
  page: number;
}

/**
 * Exact PDF Page numbers for all 114 Surahs in Ma'rifat-ul-Quran (Kanz-ul-Irfan).
 * Allows direct jump navigation with #page=X in the viewer.
 */
export const SURAH_TARJAMA_PAGES: Record<number, SurahPageMapping> = {
  // Jild 1 (Offset: Book + 4)
  1: { jildId: 1, page: 7 }, // Al-Fatihah
  2: { jildId: 1, page: 8 }, // Al-Baqarah
  3: { jildId: 1, page: 187 }, // Aal-e-Imran
  4: { jildId: 1, page: 294 }, // An-Nisa (Part 1; Part 2 is in Jild 2)

  // Jild 2 (Offset: Book + 8)
  5: { jildId: 2, page: 26 }, // Al-Ma'idah
  6: { jildId: 2, page: 108 }, // Al-An'am
  7: { jildId: 2, page: 197 }, // Al-A'raf
  8: { jildId: 2, page: 282 }, // Al-Anfal
  9: { jildId: 2, page: 322 }, // At-Tawbah

  // Jild 3 (Offset: Book + 8)
  10: { jildId: 3, page: 32 }, // Yunus
  11: { jildId: 3, page: 82 }, // Hud
  12: { jildId: 3, page: 137 }, // Yusuf
  13: { jildId: 3, page: 189 }, // Ar-Ra'd
  14: { jildId: 3, page: 215 }, // Ibrahim
  15: { jildId: 3, page: 240 }, // Al-Hijr
  16: { jildId: 3, page: 261 }, // An-Nahl
  17: { jildId: 3, page: 315 }, // Al-Isra
  18: { jildId: 3, page: 360 }, // Al-Kahf

  // Jild 4 (Offset: Book + 10)
  19: { jildId: 4, page: 26 }, // Maryam
  20: { jildId: 4, page: 54 }, // Ta-Ha
  21: { jildId: 4, page: 93 }, // Al-Anbiya
  22: { jildId: 4, page: 127 }, // Al-Hajj
  23: { jildId: 4, page: 165 }, // Al-Mu'minun
  24: { jildId: 4, page: 196 }, // An-Nur
  25: { jildId: 4, page: 234 }, // Al-Furqan
  26: { jildId: 4, page: 262 }, // Ash-Shu'ara
  27: { jildId: 4, page: 301 }, // An-Naml
  28: { jildId: 4, page: 335 }, // Al-Qasas

  // Jild 5 (Offsets: Parah 21=+27, 22/23=+28, 24=+30, 25=+31)
  29: { jildId: 5, page: 30 }, // Al-Ankabut
  30: { jildId: 5, page: 40 }, // Ar-Rum
  31: { jildId: 5, page: 64 }, // Luqman
  32: { jildId: 5, page: 79 }, // As-Sajdah
  33: { jildId: 5, page: 90 }, // Al-Ahzab
  34: { jildId: 5, page: 129 }, // Saba
  35: { jildId: 5, page: 154 }, // Fatir
  36: { jildId: 5, page: 175 }, // Ya-Sin
  37: { jildId: 5, page: 197 }, // As-Saffat
  38: { jildId: 5, page: 223 }, // Sad
  39: { jildId: 5, page: 245 }, // Az-Zumar
  40: { jildId: 5, page: 281 }, // Ghafir
  41: { jildId: 5, page: 315 }, // Fussilat
  42: { jildId: 5, page: 340 }, // Ash-Shura
  43: { jildId: 5, page: 364 }, // Az-Zukhruf
  44: { jildId: 5, page: 389 }, // Ad-Dukhan
  45: { jildId: 5, page: 399 }, // Al-Jathiyah

  // Jild 6 (Offsets: Parah 26=+25, 27=+26, 28=+27, 29=+28, 30=+29)
  46: { jildId: 6, page: 28 }, // Al-Ahqaf
  47: { jildId: 6, page: 46 }, // Muhammad
  48: { jildId: 6, page: 63 }, // Al-Fath
  49: { jildId: 6, page: 80 }, // Al-Hujurat
  50: { jildId: 6, page: 90 }, // Qaf
  51: { jildId: 6, page: 102 }, // Adh-Dhariyat
  52: { jildId: 6, page: 113 }, // At-Tur
  53: { jildId: 6, page: 122 }, // An-Najm
  54: { jildId: 6, page: 133 }, // Al-Qamar
  55: { jildId: 6, page: 144 }, // Ar-Rahman
  56: { jildId: 6, page: 155 }, // Al-Waqi'ah
  57: { jildId: 6, page: 167 }, // Al-Hadid
  58: { jildId: 6, page: 186 }, // Al-Mujadila
  59: { jildId: 6, page: 199 }, // Al-Hashr
  60: { jildId: 6, page: 212 }, // Al-Mumtahanah
  61: { jildId: 6, page: 222 }, // As-Saff
  62: { jildId: 6, page: 228 }, // Al-Jumu'ah
  63: { jildId: 6, page: 233 }, // Al-Munafiqun
  64: { jildId: 6, page: 239 }, // At-Taghabun
  65: { jildId: 6, page: 246 }, // At-Talaq
  66: { jildId: 6, page: 254 }, // At-Tahrim
  67: { jildId: 6, page: 263 }, // Al-Mulk
  68: { jildId: 6, page: 273 }, // Al-Qalam
  69: { jildId: 6, page: 282 }, // Al-Haqqah
  70: { jildId: 6, page: 290 }, // Al-Ma'arij
  71: { jildId: 6, page: 297 }, // Nuh
  72: { jildId: 6, page: 304 }, // Al-Jinn
  73: { jildId: 6, page: 313 }, // Al-Muzzammil
  74: { jildId: 6, page: 319 }, // Al-Muddathir
  75: { jildId: 6, page: 327 }, // Al-Qiyamah
  76: { jildId: 6, page: 332 }, // Al-Insan
  77: { jildId: 6, page: 340 }, // Al-Mursalat
  78: { jildId: 6, page: 348 }, // An-Naba
  79: { jildId: 6, page: 354 }, // An-Nazi'at
  80: { jildId: 6, page: 360 }, // Abasa
  81: { jildId: 6, page: 365 }, // At-Takwir
  82: { jildId: 6, page: 368 }, // Al-Infitar
  83: { jildId: 6, page: 371 }, // Al-Mutaffifin
  84: { jildId: 6, page: 377 }, // Al-Inshiqaq
  85: { jildId: 6, page: 381 }, // Al-Buruj
  86: { jildId: 6, page: 385 }, // At-Tariq
  87: { jildId: 6, page: 387 }, // Al-A'la
  88: { jildId: 6, page: 390 }, // Al-Ghashiyah
  89: { jildId: 6, page: 393 }, // Al-Fajr
  90: { jildId: 6, page: 398 }, // Al-Balad
  91: { jildId: 6, page: 401 }, // Ash-Shams
  92: { jildId: 6, page: 403 }, // Al-Layl
  93: { jildId: 6, page: 406 }, // Ad-Duha
  94: { jildId: 6, page: 408 }, // Ash-Sharh
  95: { jildId: 6, page: 409 }, // At-Tin
  96: { jildId: 6, page: 411 }, // Al-Alaq
  97: { jildId: 6, page: 414 }, // Al-Qadr
  98: { jildId: 6, page: 415 }, // Al-Bayyinah
  99: { jildId: 6, page: 418 }, // Az-Zalzalah
  100: { jildId: 6, page: 420 }, // Al-Adiyat
  101: { jildId: 6, page: 422 }, // Al-Qari'ah
  102: { jildId: 6, page: 423 }, // At-Takathur
  103: { jildId: 6, page: 425 }, // Al-Asr
  104: { jildId: 6, page: 426 }, // Al-Humazah
  105: { jildId: 6, page: 427 }, // Al-Fil
  106: { jildId: 6, page: 428 }, // Quraysh
  107: { jildId: 6, page: 429 }, // Al-Ma'un
  108: { jildId: 6, page: 430 }, // Al-Kawthar
  109: { jildId: 6, page: 431 }, // Al-Kafirun
  110: { jildId: 6, page: 432 }, // An-Nasr
  111: { jildId: 6, page: 433 }, // Al-Masad
  112: { jildId: 6, page: 434 }, // Al-Ikhlas
  113: { jildId: 6, page: 435 }, // Al-Falaq
  114: { jildId: 6, page: 436 }, // An-Nas
};

export function getJildForSurah(surahNumber: number): JildInfo {
  const found = JILDS.find((j) => j.surahNumbers.includes(surahNumber));
  return found ?? JILDS[0];
}
