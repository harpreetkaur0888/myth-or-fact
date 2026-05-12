import { motion } from 'framer-motion';
import type { Card, Verdict } from '../data/types';

interface Props {
  card: Card;
  userAnswer: Verdict;
  isCorrect: boolean;
  streakBanner: string | null;
  onNext: () => void;
}

export function RevealPanel({
  card,
  userAnswer: _userAnswer,
  isCorrect,
  streakBanner,
  onNext,
}: Props) {
  const verdictColor =
    card.verdict === 'MYTH' ? 'text-red-500' : 'text-emerald-600';
  const reaction = isCorrect
    ? (card.reaction_correct ?? 'Got it.')
    : (card.reaction_wrong ?? 'Not quite.');

  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="w-full max-w-[380px] mx-auto bg-white rounded-3xl shadow-xl p-6 flex flex-col gap-4"
    >
      {streakBanner && (
        <div className="text-xs font-bold uppercase tracking-wider text-orange-500">
          {streakBanner}
        </div>
      )}
      <motion.div
        initial={{ scale: 0.6, rotate: -3, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{
          delay: 0.35,
          type: 'spring',
          stiffness: 400,
          damping: 12,
        }}
        className={`text-4xl font-extrabold ${verdictColor} self-start origin-center`}
      >
        {card.verdict}
      </motion.div>
      <div className="text-sm italic text-slate-500">{reaction}</div>
      <p className="text-base leading-relaxed text-slate-800">
        {card.explanation}
      </p>
      <div className="text-xs text-slate-500">
        Source: {card.source.name} ({card.source.year})
      </div>
      <button
        type="button"
        onClick={onNext}
        className="mt-2 self-end rounded-full bg-slate-900 text-white px-6 py-2 text-sm font-semibold hover:bg-slate-700 active:scale-95 transition"
      >
        Next →
      </button>
    </motion.div>
  );
}
