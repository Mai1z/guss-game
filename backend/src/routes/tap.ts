import { FastifyInstance } from 'fastify';
import { TapController } from '../controllers/tap';
import { authMiddleware } from '../middlewares/auth';

export function tapRoutes(app: FastifyInstance, controller: TapController) {
  app.post<{ Params: { id: string } }>(
    '/api/rounds/:id/tap',
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
              taps: { type: 'number' },
              score: { type: 'number' },
            },
          },
        },
      },
    },
    (request, reply) => controller.tap(request, reply)
  );
}