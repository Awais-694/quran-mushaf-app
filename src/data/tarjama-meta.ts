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

export function getJildForSurah(surahNumber: number): JildInfo {
  const found = JILDS.find((j) => j.surahNumbers.includes(surahNumber));
  return found ?? JILDS[0];
}
