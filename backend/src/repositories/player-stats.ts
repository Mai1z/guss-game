import { PrismaClient, PlayerRoundStats, Prisma } from '@prisma/client';
import { IPlayerStatsRepository, PlayerStatsWithUser } from '../types/interfaces/player-stats-repository';

export class PlayerStatsRepository implements IPlayerStatsRepository {
  constructor(private prisma: PrismaClient) {}

  // Получение stats с блокировкой строки (FOR UPDATE)
  // Используется внутри транзакции для предотвращения race conditions
  async getForUpdate(
    userId: string,
    roundId: string,
    tx: Prisma.TransactionClient
  ): Promise<PlayerRoundStats | null> {
    const result = await tx.$queryRaw<PlayerRoundStats[]>`
      SELECT * FROM player_round_stats
      WHERE "userId" = ${userId} AND "roundId" = ${roundId}
      FOR UPDATE
    `;
    return result[0] || null;
  }

  async createEmpty(
    userId: string,
    roundId: string,
    tx: Prisma.TransactionClient
  ): Promise<PlayerRoundStats> {
    return tx.playerRoundStats.create({
      data: {
        userId,
        roundId,
        taps: 0,
        score: 0
      }
    });
  }

  // Атомарное обновление taps и score за одну операцию
  async updateStats(
    userId: string,
    roundId: string,
    pointsToAdd: number,
    tx: Prisma.TransactionClient
  ): Promise<PlayerRoundStats> {
    return tx.playerRoundStats.update({
      where: { userId_roundId: { userId, roundId } },
      data: {
        taps: { increment: 1 },
        score: { increment: pointsToAdd }
      }
    });
  }

  async getTopPlayer(roundId: string): Promise<PlayerStatsWithUser | null> {
    return this.prisma.playerRoundStats.findFirst({
      where: { roundId },
      orderBy: { score: "desc" },
      include: {
        user: { select: { username: true } }
      }
    });
  }

  async findByUserAndRound(
    userId: string,
    roundId: string
  ): Promise<PlayerRoundStats | null> {
    return this.prisma.playerRoundStats.findUnique({
      where: { userId_roundId: { userId, roundId } }
    });
  }
}