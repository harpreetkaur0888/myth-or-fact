import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type LastResult = 'correct' | 'wrong' | null;

interface SessionState {
  cardsPlayed: number;
  correctAnswers: number;
  currentStreak: number;
  bestStreak: number;
  lastResult: LastResult;
  recordAnswer: (correct: boolean) => void;
  reset: () => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      cardsPlayed: 0,
      correctAnswers: 0,
      currentStreak: 0,
      bestStreak: 0,
      lastResult: null,
      recordAnswer: (correct) =>
        set((state) => {
          const cardsPlayed = state.cardsPlayed + 1;
          const correctAnswers = state.correctAnswers + (correct ? 1 : 0);
          const currentStreak = correct ? state.currentStreak + 1 : 0;
          const bestStreak = Math.max(state.bestStreak, currentStreak);
          return {
            cardsPlayed,
            correctAnswers,
            currentStreak,
            bestStreak,
            lastResult: correct ? 'correct' : 'wrong',
          };
        }),
      reset: () =>
        set((state) => ({
          cardsPlayed: 0,
          correctAnswers: 0,
          currentStreak: 0,
          bestStreak: state.bestStreak,
          lastResult: null,
        })),
    }),
    {
      name: 'mof-session',
      partialize: (state) => ({ bestStreak: state.bestStreak }),
    },
  ),
);
