import Link from "next/link";

export default function NotFound() {
  return (
    <div className="text-center py-16 space-y-4">
      <h2 className="text-2xl font-bold">Page Not Found</h2>
      <p className="text-stone-400">The page you are looking for does not exist.</p>
      <Link
        href="/"
        className="inline-block mt-4 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-600 rounded-xl text-white font-medium shadow-md transition-all active:scale-95"
      >
        Return to Home
      </Link>
    </div>
  );
}
