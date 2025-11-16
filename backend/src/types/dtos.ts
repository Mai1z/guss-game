import { RoundStatus } from './entities';

// Auth
export interface LoginRequestDTO {
  username: string;
  password: string;
}

export interface AuthResponseDTO {
  token: string;
  user: {
    id: string;
    username: string;
    role: string;
  };
}

// Rounds
export interface RoundListItemDTO {
  id: string;
  startAt: string;
  endAt: string;
  status: RoundStatus;
}

export interface RoundDetailsDTO {
  id: string;
  startAt: string;
  endAt: string;
  status: RoundStatus;
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

// Tap
export interface TapResponseDTO {
  taps: number;
  score: number;
}