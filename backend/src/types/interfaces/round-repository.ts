import { Round, Prisma } from '@prisma/client';

export interface IRoundRepository {
  create(startAt: Date, endAt: Date): Promise<Round>;
  findById(
    id: string,
    tx?: Prisma.TransactionClient
  ): Promise<Round | null>;
  findAll(): Promise<Round[]>;
  incrementScore(
    roundId: string,
    points: number,
    tx?: Prisma.TransactionClient
  ): Promise<Round>;
}