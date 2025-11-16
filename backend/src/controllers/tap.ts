import { FastifyRequest, FastifyReply } from 'fastify';
import { TapService } from '../services/tap';
import { UserRole } from '@prisma/client';

export class TapController {
  constructor(private tapService: TapService) {}

  async tap(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    const roundId = request.params.id;
    const userId = request.user!.userId;
    const userRole = request.user!.role as UserRole;

    const result = await this.tapService.processTap(userId, roundId, userRole);
    return reply.code(200).send(result);
  }
}