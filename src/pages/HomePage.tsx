import { Link } from 'react-router-dom';
import { useSessionStore } from '../store/session';

export function HomePage() {
  const bestStreak = useSessionStore((s) => s.bestStreak);

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-6 text-center">
      <div className="flex flex-col items-center gap-4 max-w-[380px]">
        <h1 className="text-5xl font-semibold text-slate-900 tracking-tight font-display">
          Myth or Fact
        </h1>
        <p className="text-slate-600 text-lg">
          Swipe left for myth, right for fact.
        </p>
        <Link
          to="/play"
          className="mt-4 inline-block rounded-full bg-coral-500 text-white px-8 py-3 font-semibold hover:bg-coral-600 active:scale-95 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-500 focus-visible:ring-offset-2"
        >
          Start playing
        </Link>
        {bestStreak > 0 && (
          <p className="mt-2 text-sm text-slate-500 flex items-center gap-1">
            <span className="drop-shadow-[0_0_6px_rgba(231,111,81,0.55)]">🔥</span>
            <span>Your best streak: {bestStreak}</span>
          </p>
        )}
      </div>
    </div>
  );
}
