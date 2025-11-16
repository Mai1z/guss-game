import { FastifyRequest, FastifyReply } from 'fastify';
import { verifyToken, JwtPayload } from '../utils/jwt';
import { UserRole } from '@prisma/client';

declare module 'fastify' {
  interface FastifyRequest {
    user?: JwtPayload;
  }
}

export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return reply.code(401).send({ error: 'Missing or invalid token' });
    }

    const token = authHeader.substring(7);

    const payload = verifyToken(token);

    request.user = payload;
  } catch (error) {
    return reply.code(401).send({ error: 'Invalid or expired token' });
  }
}

export async function adminMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  if (!request.user || request.user.role !== UserRole.ADMIN) {
    return reply.code(403).send({ error: 'Admin access required' });
  }
}