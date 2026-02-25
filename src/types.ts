export enum Suit {
  HEARTS = 'hearts',
  DIAMONDS = 'diamonds',
  CLUBS = 'clubs',
  SPADES = 'spades',
}

export type Rank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;

export interface CardData {
  id: string;
  suit: Suit;
  rank: Rank;
}

export type GameState = 'playing' | 'player_won' | 'ai_won';
export type Turn = 'player' | 'ai';
