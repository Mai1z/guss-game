import { IRoundRepository } from '../types/interfaces/round-repository';
import { IPlayerStatsRepository } from '../types/interfaces/player-stats-repository';
import { RoundListItemDTO, RoundDetailsDTO } from '../types/dtos';
import { getRoundStatus, isRoundActive } from '../utils/round';
import { RoundStatus, UserRole } from '../types/entities';
import { config } from '../config/env';

export class RoundService {
  constructor(
    private roundRepository: IRoundRepository,
    private playerStatsRepository: IPlayerStatsRepository
  ) {}

  async createRound(userRole: UserRole): Promise<RoundListItemDTO> {
    if (userRole !== UserRole.ADMIN) {
      throw new Error('Only admin can create rounds');
    }
  
    const now = new Date();
    const startAt = new Date(now.getTime() + config.cooldownDuration * 1000);
    const endAt = new Date(startAt.getTime() + config.roundDuration * 1000);
  
    const round = await this.roundRepository.create(startAt, endAt);
  
    return {
      id: round.id,
      startAt: round.startAt.toISOString(),
      endAt: round.endAt.toISOString(),
      status: getRoundStatus(round.startAt, round.endAt),
    };
  }

  async getRounds(): Promise<RoundListItemDTO[]> {
    const rounds = await this.roundRepository.findAll();

    // Фильтруем только не завершенные раунды
    const now = new Date();
    const activeOrUpcoming = rounds.filter((r) => r.endAt >= now);

    return activeOrUpcoming.map((round) => ({
      id: round.id,
      startAt: round.startAt.toISOString(),
      endAt: round.endAt.toISOString(),
      status: getRoundStatus(round.startAt, round.endAt),
    }));
  }

  async getRoundDetails(
    roundId: string,
    userId: string
  ): Promise<RoundDetailsDTO> {
    const round = await this.roundRepository.findById(roundId);
    if (!round) {
      throw new Error('Round not found');
    }

    const status = getRoundStatus(round.startAt, round.endAt);

    const myStats = await this.playerStatsRepository.findByUserAndRound(
      userId,
      roundId
    );

    let winner;
    if (status === RoundStatus.FINISHED) {
      const topPlayer = await this.playerStatsRepository.getTopPlayer(roundId);
      if (topPlayer) {
        winner = {
          username: topPlayer.user.username,
          score: topPlayer.score,
        };
      }
    }

    return {
      id: round.id,
      startAt: round.startAt.toISOString(),
      endAt: round.endAt.toISOString(),
      status,
      totalScore: round.totalScore,
      myStats: {
        taps: myStats?.taps || 0,
        score: myStats?.score || 0,
      },
      winner,
    };
  }
}