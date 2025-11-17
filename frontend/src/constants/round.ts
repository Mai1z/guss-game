import { RoundStatus } from '@/types/enums';

export const ROUND_STATUS_COLORS: Record<RoundStatus, string> = {
  [RoundStatus.COOLDOWN]: 'blue',
  [RoundStatus.ACTIVE]: 'green',
  [RoundStatus.FINISHED]: 'default',
};

export const ROUND_STATUS_LABELS: Record<RoundStatus, string> = {
  [RoundStatus.COOLDOWN]: 'Cooldown',
  [RoundStatus.ACTIVE]: 'Активен',
  [RoundStatus.FINISHED]: 'Завершен',
};