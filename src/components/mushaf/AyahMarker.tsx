const AR = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
export const toArabicDigits = (n: number) =>
  String(n).replace(/\d/g, (d) => AR[Number(d)]);

/** Ayat ke akhir ka gol nishan ﴿١﴾ */
export function AyahMarker({ number }: { number: number }) {
  return <span className="text-emerald-700 text-[0.75em] mx-1">﴿{toArabicDigits(number)}﴾</span>;
}
