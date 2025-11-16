import { PrismaClient, Round, Prisma } from '@prisma/client';
import { IRoundRepository } from '../types/interfaces/round-repository';

export class RoundRepository implements IRoundRepository {
  constructor(private prisma: PrismaClient) {}

  async create(startAt: Date, endAt: Date): Promise<Round> {
    return this.prisma.round.create({
      data: { startAt, endAt },
    });
  }

  async findById(id: string, tx?: Prisma.TransactionClient): Promise<Round | null> {
    const client = tx || this.prisma;
    return client.round.findUnique({ where: { id } });
  }

  async findAll(): Promise<Round[]> {
    return this.prisma.round.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async incrementScore(
    roundId: string,
    points: number,
    tx: Prisma.TransactionClient
  ): Promise<Round> {
    return tx.round.update({
      where: { id: roundId },
      data: {
        totalScore: { increment: points },
        totalTaps: { increment: 1 }
      }
    });
  }
}