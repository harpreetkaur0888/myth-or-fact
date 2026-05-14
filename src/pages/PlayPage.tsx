import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ScoreHeader } from '../components/ScoreHeader';
import { CardStack } from '../components/CardStack';
import { RevealPanel } from '../components/RevealPanel';
import { cards as allCards } from '../data/loader';
import { useSessionStore } from '../store/session';
import type { LastResult } from '../store/session';
import type { Card, Verdict } from '../data/types';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = a[i]!;
    a[i] = a[j]!;
    a[j] = tmp;
  }
  return a;
}

function computeBanner(
  prev: { currentStreak: number; lastResult: LastResult },
  correct: boolean,
): string | null {
  const newStreak = correct ? prev.currentStreak + 1 : 0;
  if (correct) {
    if (newStreak === 8) return 'OKAY, SHOW-OFF.';
    if (newStreak === 5) return "YOU'RE COOKING.";
    if (newStreak === 3) return 'ON A ROLL 🔥';
    if (prev.lastResult === 'wrong') return 'BACK ON IT.';
    return null;
  }
  if (prev.currentStreak >= 3) return 'STREAK BROKEN — HAPPENS TO EVERYONE.';
  if (prev.lastResult === 'wrong') return 'TOUGH RUN.';
  return null;
}

interface RevealState {
  card: Card;
  userAnswer: Verdict;
  isCorrect: boolean;
  banner: string | null;
}

export function PlayPage() {
  const navigate = useNavigate();
  const [restartKey, setRestartKey] = useState(0);
  const deck = useMemo(() => shuffle(allCards), [restartKey]);
  const [index, setIndex] = useState(0);
  const [reveal, setReveal] = useState<RevealState | null>(null);
  const [flash, setFlash] = useState<{ correct: boolean } | null>(null);
  const [done, setDone] = useState(false);
  const [shareToast, setShareToast] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);

  const correctAnswers = useSessionStore((s) => s.correctAnswers);
  const currentStreak = useSessionStore((s) => s.currentStreak);
  const recordAnswer = useSessionStore((s) => s.recordAnswer);
  const reset = useSessionStore((s) => s.reset);

  useEffect(() => {
    reset();
  }, [reset, restartKey]);

  function handleAnswer(card: Card, verdict: Verdict) {
    const correct = verdict === card.verdict;
    const prev = useSessionStore.getState();
    const banner = computeBanner(
      { currentStreak: prev.currentStreak, lastResult: prev.lastResult },
      correct,
    );
    recordAnswer(correct);
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(correct ? [10, 40, 10] : [60]);
    }
    setFlash({ correct });
    setTimeout(() => {
      setFlash(null);
      setReveal({ card, userAnswer: verdict, isCorrect: correct, banner });
    }, 250);
  }

  function handleNext() {
    setReveal(null);
    setIndex((i) => i + 1);
  }

  function handleEmpty() {
    setDone(true);
  }

  function restart() {
    setIndex(0);
    setReveal(null);
    setDone(false);
    setShareToast(false);
    setShareError(null);
    setRestartKey((k) => k + 1);
  }

  async function handleShare() {
    const text = `I got ${correctAnswers} out of ${deck.length} on Myth or Fact 🧐 think you can beat me? https://myth-or-fact.vercel.app`;
    try {
      await navigator.clipboard.writeText(text);
      setShareError(null);
      setShareToast(true);
      setTimeout(() => setShareToast(false), 2000);
    } catch {
      setShareError(text);
    }
  }

  if (done) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-cream">
        <div className="w-full max-w-[380px] bg-white rounded-2xl border border-cream-line shadow-[0_8px_24px_-4px_rgba(231,111,81,0.15)] p-8 text-center flex flex-col gap-6">
          <h2 className="text-4xl font-semibold text-slate-900 font-display">
            Deck complete
          </h2>
          <p className="text-slate-600">
            You got{' '}
            <span className="font-bold text-slate-900">{correctAnswers}</span>{' '}
            out of {deck.length}.
          </p>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={restart}
              className="rounded-full bg-coral-500 text-white py-3 font-semibold hover:bg-coral-600 active:scale-95 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-500 focus-visible:ring-offset-2"
            >
              Play again
            </button>
            <div className="relative">
              <AnimatePresence>
                {shareToast && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.2 }}
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 px-3 py-1 rounded-md bg-cream text-coral-500 text-sm font-semibold border border-coral-200 shadow-lg whitespace-nowrap pointer-events-none"
                  >
                    Copied!
                  </motion.div>
                )}
              </AnimatePresence>
              <button
                type="button"
                onClick={handleShare}
                className="w-full rounded-full bg-white border-2 border-coral-500 text-coral-500 py-3 font-semibold hover:bg-coral-400/15 active:scale-95 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-500 focus-visible:ring-offset-2"
              >
                Share my score
              </button>
            </div>
            {shareError && (
              <p className="text-xs text-slate-600 select-text text-left px-2">
                Couldn't copy — long-press to copy:{' '}
                <span className="text-slate-800 break-all">{shareError}</span>
              </p>
            )}
            <button
              type="button"
              onClick={() => navigate('/')}
              className="rounded-full bg-slate-100 text-slate-700 py-3 font-semibold hover:bg-coral-500 hover:text-white active:scale-95 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-500 focus-visible:ring-offset-2"
            >
              Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <ScoreHeader
        correct={correctAnswers}
        total={deck.length}
        streak={currentStreak}
      />
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-6 relative">
        <CardStack
          cards={deck}
          index={index}
          onAnswer={handleAnswer}
          onAdvance={() => {}}
          onEmpty={handleEmpty}
          interactive={!reveal}
        />
        {flash && (
          <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
            <motion.div
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 18 }}
              className={`text-[8rem] leading-none font-black ${
                flash.correct ? 'text-emerald-400/80' : 'text-red-400/80'
              }`}
            >
              {flash.correct ? '✓' : '✕'}
            </motion.div>
          </div>
        )}
        {reveal && (
          <div className="absolute inset-0 z-50 bg-cream/95 flex items-center justify-center p-4 overflow-y-auto">
            <RevealPanel
              card={reveal.card}
              userAnswer={reveal.userAnswer}
              isCorrect={reveal.isCorrect}
              streakBanner={reveal.banner}
              onNext={handleNext}
            />
          </div>
        )}
      </div>
    </div>
  );
}
