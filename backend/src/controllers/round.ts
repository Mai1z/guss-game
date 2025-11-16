import { FastifyRequest, FastifyReply } from 'fastify';
import { RoundService } from '../services/round';
import { UserRole } from '@prisma/client';

export class RoundController {
  constructor(private roundService: RoundService) {}

  async getRounds(request: FastifyRequest, reply: FastifyReply) {
    const rounds = await this.roundService.getRounds();
    return reply.code(200).send(rounds);
  }

  async createRound(request: FastifyRequest, reply: FastifyReply) {
    const userRole = request.user!.role as UserRole;
    
    const round = await this.roundService.createRound(userRole);
    return reply.code(201).send(round);
  }

  async getRoundById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    const { id } = request.params;
    const userId = request.user!.userId;

    const round = await this.roundService.getRoundDetails(id, userId);
    return reply.code(200).send(round);
  }
}