import { RoundStatus } from '../enums';

export interface Round {
  id: string;
  startAt: string;
  endAt: string;
  status: RoundStatus;
}

export interface RoundDetails extends Round {
  totalScore: number;
  myStats: {
    taps: number;
    score: number;
  };
  winner?: {
    username: string;
    score: number;
  };
}