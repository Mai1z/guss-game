import { RoundStatus } from '../types/entities';

export const getRoundStatus = (startAt: Date, endAt: Date): RoundStatus => {
  const now = new Date();
  
  if (now < startAt) {
    return RoundStatus.COOLDOWN;
  }
  
  if (now >= startAt && now <= endAt) {
    return RoundStatus.ACTIVE;
  }
  
  return RoundStatus.FINISHED;
};

export const isRoundActive = (startAt: Date, endAt: Date): boolean => {
  return getRoundStatus(startAt, endAt) === RoundStatus.ACTIVE;
};