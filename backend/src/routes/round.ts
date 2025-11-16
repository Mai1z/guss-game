import { FastifyInstance } from 'fastify';
import { RoundController } from '../controllers/round';
import { authMiddleware, adminMiddleware } from '../middlewares/auth';

export function roundRoutes(app: FastifyInstance, controller: RoundController) {
  app.get(
    '/api/rounds',
    {
      preHandler: [authMiddleware],
      schema: {
        response: {
          200: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                startAt: { type: 'string' },
                endAt: { type: 'string' },
                status: { type: 'string', enum: ['COOLDOWN', 'ACTIVE', 'FINISHED'] },
              },
            },
          },
        },
      },
    },
    (request, reply) => controller.getRounds(request, reply)
  );

  app.post(
    '/api/rounds',
    {
      preHandler: [authMiddleware, adminMiddleware],
      schema: {
        response: {
          201: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              startAt: { type: 'string' },
              endAt: { type: 'string' },
              status: { type: 'string' },
            },
          },
        },
      },
    },
    (request, reply) => controller.createRound(request, reply)
  );

  app.get<{ Params: { id: string } }>(
    '/api/rounds/:id',
    {
      preHandler: [authMiddleware],
      schema: {
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string', format: 'uuid' },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              startAt: { type: 'string' },
              endAt: { type: 'string' },
              status: { type: 'string' },
              totalScore: { type: 'number' },
              myStats: {
                type: 'object',
                properties: {
                  taps: { type: 'number' },
                  score: { type: 'number' },
                },
              },
              winner: {
                type: 'object',
                nullable: true,
                properties: {
                  username: { type: 'string' },
                  score: { type: 'number' },
                },
              },
            },
          },
        },
      },
    },
    async (request, reply) => controller.getRoundById(request, reply)
  );
}