import type { Metadata } from "next";
import { TarjamaClient } from "@/components/tarjama/TarjamaClient";

export const metadata: Metadata = {
  title: "Quran Tarjama & Tafseer (Kanz-ul-Irfan) — Tilawat.ai",
  description:
    "Read authentic Urdu translation and commentary (Ma'rifat-ul-Quran ala Kanz-ul-Irfan) across 6 volumes with instant Surah navigation.",
};

export default function TarjamaPage() {
  return <TarjamaClient />;
}
