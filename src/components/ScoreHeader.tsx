import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface Props {
  correct: number;
  total: number;
  streak: number;
}

export function ScoreHeader({ correct, total, streak }: Props) {
  const [pulseKey, setPulseKey] = useState(0);
  const prevStreakRef = useRef(streak);

  useEffect(() => {
    if (
      streak !== prevStreakRef.current &&
      (streak === 3 || streak === 5 || streak === 10)
    ) {
      setPulseKey((k) => k + 1);
    }
    prevStreakRef.current = streak;
  }, [streak]);

  return (
    <div className="sticky top-0 z-50 w-full flex justify-center pt-3 pb-2 px-4 pointer-events-none">
      <div className="flex items-center gap-2 pointer-events-auto">
        <div className="rounded-full bg-white/90 backdrop-blur border border-slate-200 px-4 py-1.5 text-sm font-semibold text-slate-700 shadow-sm">
          {correct}/{total}
        </div>
        {streak >= 3 && (
          <div className="rounded-full bg-orange-500 text-white px-3 py-1.5 text-sm font-semibold shadow-sm flex items-center gap-1">
            <motion.span
              key={`fire-${pulseKey}`}
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              className="inline-block"
            >
              🔥
            </motion.span>
            <motion.span
              key={`num-${pulseKey}`}
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 0.4 }}
              className="inline-block"
            >
              {streak}
            </motion.span>
          </div>
        )}
      </div>
    </div>
  );
}
