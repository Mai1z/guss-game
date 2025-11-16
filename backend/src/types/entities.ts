import { UserRole } from '@prisma/client';

export { UserRole };

export enum RoundStatus {
  COOLDOWN = 'COOLDOWN',
  ACTIVE = 'ACTIVE',
  FINISHED = 'FINISHED',
}

export interface User {
  id: string;
  username: string;
  role: UserRole;
}

export interface Round {
  id: string;
  startAt: Date;
  endAt: Date;
  totalTaps: number;
  totalScore: number;
  createdAt: Date;
}

export interface PlayerStats {
  id: string;
  userId: string;
  roundId: string;
  taps: number;
  score: number;
}