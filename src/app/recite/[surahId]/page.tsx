import { getSurahMeta, loadSurah } from "@/lib/quran/data";
import { ReciteClient } from "@/components/recitation/ReciteClient";

// Recitation screen — mushaf page format, lafz-ba-lafz reveal.
export default async function RecitePage({
  params,
}: {
  params: Promise<{ surahId: string }>;
}) {
  const { surahId } = await params;
  const meta = getSurahMeta(Number(surahId));
  if (!meta) return <p className="text-center py-12 text-emerald-200">Surah not found.</p>;
  const initialSurah = await loadSurah(meta.number);
  return <ReciteClient key={meta.number} surahNumber={meta.number} initialSurah={initialSurah} />;
}
