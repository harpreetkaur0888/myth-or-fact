import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import type { PanInfo } from 'framer-motion';
import type { Card, Verdict } from '../data/types';

interface Props {
  card: Card;
  onSwipe: (verdict: Verdict) => void;
  onExited?: () => void;
}

const SWIPE_DISTANCE = 100;
const SWIPE_VELOCITY = 500;

export function SwipeCard({ card, onSwipe, onExited }: Props) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-18, 0, 18]);
  const mythOpacity = useTransform(x, [-150, -20, 0], [1, 0, 0]);
  const factOpacity = useTransform(x, [0, 20, 150], [0, 0, 1]);

  function commit(verdict: Verdict) {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(15);
    }
    const target = verdict === 'FACT' ? 600 : -600;
    onSwipe(verdict);
    animate(x, target, {
      duration: 0.3,
      ease: 'easeOut',
      onComplete: () => onExited?.(),
    });
  }

  function handleDragEnd(
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) {
    const offsetX = info.offset.x;
    const velocityX = info.velocity.x;
    if (offsetX > SWIPE_DISTANCE || velocityX > SWIPE_VELOCITY) {
      commit('FACT');
    } else if (offsetX < -SWIPE_DISTANCE || velocityX < -SWIPE_VELOCITY) {
      commit('MYTH');
    } else {
      animate(x, 0, { type: 'spring', stiffness: 400, damping: 30 });
    }
  }

  return (
    <motion.div
      className="absolute inset-0 rounded-2xl bg-white border border-cream-line shadow-[0_8px_24px_-4px_rgba(231,111,81,0.15)] flex items-center justify-center px-7 py-10 cursor-grab active:cursor-grabbing select-none touch-none"
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.8}
      style={{ x, rotate }}
      onDragEnd={handleDragEnd}
    >
      <motion.div
        className="absolute top-5 left-5 rounded-lg border-2 border-red-500 px-3 py-1 text-red-500 font-extrabold text-2xl tracking-wide -rotate-12"
        style={{ opacity: mythOpacity }}
      >
        MYTH
      </motion.div>
      <motion.div
        className="absolute top-5 right-5 rounded-lg border-2 border-emerald-600 px-3 py-1 text-emerald-600 font-extrabold text-2xl tracking-wide rotate-12"
        style={{ opacity: factOpacity }}
      >
        FACT
      </motion.div>
      <p className="text-center text-[32px] font-semibold leading-snug text-slate-900 font-display">
        {card.claim}
      </p>
    </motion.div>
  );
}
