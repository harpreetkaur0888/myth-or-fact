import { Link } from 'react-router-dom';
import { useSessionStore } from '../store/session';

export function HomePage() {
  const bestStreak = useSessionStore((s) => s.bestStreak);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-6 text-center">
      <div className="flex flex-col items-center gap-4 max-w-[380px]">
        <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight">
          Myth or Fact
        </h1>
        <p className="text-slate-600 text-lg">
          Swipe left for myth, right for fact.
        </p>
        <Link
          to="/play"
          className="mt-4 inline-block rounded-full bg-slate-900 text-white px-8 py-3 font-semibold hover:bg-slate-700 active:scale-95 transition"
        >
          Start playing
        </Link>
        {bestStreak > 0 && (
          <p className="mt-2 text-sm text-slate-500">
            Best streak: {bestStreak}
          </p>
        )}
      </div>
    </div>
  );
}
