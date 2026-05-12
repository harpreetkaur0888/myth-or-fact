import { useEffect } from 'react';
import { SwipeCard } from './SwipeCard';
import type { Card, Verdict } from '../data/types';

interface Props {
  cards: Card[];
  index: number;
  onAnswer: (card: Card, verdict: Verdict) => void;
  onAdvance: () => void;
  onEmpty: () => void;
  interactive?: boolean;
}

export function CardStack({
  cards,
  index,
  onAnswer,
  onAdvance,
  onEmpty,
  interactive = true,
}: Props) {
  useEffect(() => {
    if (index >= cards.length) onEmpty();
  }, [index, cards.length, onEmpty]);

  if (index >= cards.length) return null;

  const visible = cards.slice(index, index + 3);

  return (
    <div className="relative isolate w-full max-w-[380px] aspect-[3/4] mx-auto">
      {visible.map((card, i) => {
        const isTop = i === 0;
        const offsetY = i * 12;
        const scale = 1 - i * 0.04;
        const z = 30 - i * 10;
        return (
          <div
            key={card.id}
            className="absolute inset-0"
            style={{
              transform: `translateY(${offsetY}px) scale(${scale})`,
              zIndex: z,
            }}
          >
            {isTop && interactive ? (
              <SwipeCard
                card={card}
                onSwipe={(v) => onAnswer(card, v)}
                onExited={onAdvance}
              />
            ) : (
              <div className="absolute inset-0 rounded-3xl bg-white shadow-xl pointer-events-none" />
            )}
          </div>
        );
      })}
    </div>
  );
}
