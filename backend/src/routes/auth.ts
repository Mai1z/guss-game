import { FastifyInstance } from 'fastify';
import { AuthController } from '../controllers/auth';
import { LoginRequestDTO } from '../types/dtos';

export function authRoutes(app: FastifyInstance, controller: AuthController) {
  app.post<{ Body: LoginRequestDTO }>(
    '/api/auth/login',
    {
      schema: {
        body: {
          type: 'object',
          required: ['username', 'password'],
          properties: {
            username: { type: 'string', minLength: 1, maxLength: 50 },
            password: { type: 'string', minLength: 3, maxLength: 100 },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              token: { type: 'string' },
              user: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  username: { type: 'string' },
                  role: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
    (request, reply) => controller.login(request, reply)
  );
}