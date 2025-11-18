import { PrismaClient, UserRole, Prisma } from '@prisma/client';
import { IRoundRepository } from '../types/interfaces/round-repository';
import { IPlayerStatsRepository } from '../types/interfaces/player-stats-repository';
import { TapResponseDTO } from '../types/dtos';
import { isRoundActive } from '../utils/round';
import { withRetry } from '../utils/retry';

export class TapService {
  constructor(
    private roundRepository: IRoundRepository,
    private playerStatsRepository: IPlayerStatsRepository,
    private prisma: PrismaClient
  ) {}

  async processTap(
    userId: string,
    roundId: string,
    userRole: UserRole
  ): Promise<TapResponseDTO> {
    return withRetry(async () => {
      return await this.prisma.$transaction(
        async (tx) => {
          // 1. Получаем раунд
          const round = await this.roundRepository.findById(roundId, tx);
          if (!round) throw new Error('Round not found');
          if (!isRoundActive(round.startAt, round.endAt)) {
            throw new Error('Round is not active');
          }

          // 2. Получаем stats с блокировкой строки (FOR UPDATE)
          let stats = await this.playerStatsRepository.getForUpdate(
            userId,
            roundId,
            tx
          );

          // 3. Вычисляем новый tapCount
          const newTapCount = (stats?.taps || 0) + 1;

          // 4. Считаем очки по бизнес-правилам
          const pointsToAdd =
            userRole === UserRole.NIKITA
              ? 0
              : newTapCount % 11 === 0
              ? 10
              : 1;

          // 5. Атомарно upsert + increment (без race condition!)
          const updatedStats = await this.playerStatsRepository.upsertAndIncrement(
            userId,
            roundId,
            pointsToAdd,
            tx
          );

          // 6. Атомарно увеличиваем общий score и taps раунда
          if (pointsToAdd > 0) {
            await this.roundRepository.incrementScore(roundId, pointsToAdd, tx);
          }

          return {
            taps: updatedStats.taps,
            score: updatedStats.score,
          };
        },
        // Read Committed по идее по дефолту, но оставлю явно для наглядности
        {
          isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
        }
      );
    }, 3);
  }
}