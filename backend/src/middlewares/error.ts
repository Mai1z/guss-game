import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';

export function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) {
  request.log.error(error);

  // Validation ошибки от Fastify JSON Schema
  if (error.validation) {
    return reply.code(400).send({
      error: 'Validation error',
      details: error.validation,
    });
  }

  // Prisma ошибки
  if (error.message.includes('Unique constraint')) {
    return reply.code(409).send({
      error: 'Resource already exists',
    });
  }

  // Бизнес-логика ошибки (из Services)
  const knownErrors: Record<string, number> = {
    'Round not found': 404,
    'Round is not active': 400,
    'Invalid password': 401,
    'Only admin can create rounds': 403,
    'Admin access required': 403,
  };

  const statusCode = knownErrors[error.message];
  if (statusCode) {
    return reply.code(statusCode).send({
      error: error.message,
    });
  }

  return reply.code(500).send({
    error: 'Internal server error',
  });
}