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
    // Оборачиваем транзакцию в retry механизм
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

          // Если нет — создаем
          if (!stats) {
            stats = await this.playerStatsRepository.createEmpty(
              userId,
              roundId,
              tx
            );
          }

          // 3. Считаем новый tapCount заранее
          const newTapCount = stats.taps + 1;

          // 4. Считаем очки по бизнес-правилам
          const pointsToAdd =
            userRole === UserRole.NIKITA
              ? 0
              : newTapCount % 11 === 0
              ? 10
              : 1;

          // 5. Атомарно увеличиваем taps + score
          const updatedStats = await this.playerStatsRepository.updateStats(
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
        {
          // Serializable уровень изоляции для максимальной защиты от race conditions
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        }
      );
    }, 3);
  }
}