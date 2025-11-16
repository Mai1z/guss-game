import { FastifyRequest, FastifyReply } from 'fastify';
import { AuthService } from '../services/auth';
import { LoginRequestDTO } from '../types/dtos';

export class AuthController {
  constructor(private authService: AuthService) {}

  async login(
    request: FastifyRequest<{ Body: LoginRequestDTO }>,
    reply: FastifyReply
  ) {
    const { username, password } = request.body;

    const result = await this.authService.login(username, password);

    return reply.code(200).send(result);
  }
}