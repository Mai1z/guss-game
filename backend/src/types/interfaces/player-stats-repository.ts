import { PlayerRoundStats, Prisma } from '@prisma/client';

export interface PlayerStatsWithUser extends PlayerRoundStats {
  user: {
    username: string;
  };
}

export interface IPlayerStatsRepository {
  // Получение stats с блокировкой строки (FOR UPDATE)
  // Используется внутри транзакции для предотвращения race conditions
  getForUpdate(
    userId: string,
    roundId: string,
    tx: Prisma.TransactionClient
  ): Promise<PlayerRoundStats | null>;
  
  upsertAndIncrement(
    userId: string,
    roundId: string,
    pointsToAdd: number,
    tx: Prisma.TransactionClient
  ): Promise<PlayerRoundStats>;
  
  // Получение топ игрока раунда (для отображения победителя)
  getTopPlayer(roundId: string): Promise<PlayerStatsWithUser | null>;
  
  // Получение статистики без блокировки (для чтения вне транзакции)
  findByUserAndRound(
    userId: string,
    roundId: string
  ): Promise<PlayerRoundStats | null>;
}