export type Verdict = 'MYTH' | 'FACT';

export type Difficulty = 'easy' | 'medium' | 'hard';

export type Nuance = 'low' | 'medium' | 'high';

export interface CardSource {
  name: string;
  year: number;
  url?: string;
}

export interface Card {
  id: string;
  claim: string;
  verdict: Verdict;
  explanation: string;
  source: CardSource;
  category: string;
  difficulty: Difficulty;
  nuance?: Nuance;
  reaction_correct?: string;
  reaction_wrong?: string;
  tags: string[];
}
