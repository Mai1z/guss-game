import { PrismaClient, User, UserRole, Prisma } from '@prisma/client';
import { IUserRepository } from '../types/interfaces/user-repository';

export class UserRepository implements IUserRepository {
  constructor(private prisma: PrismaClient) {}

  async findByUsername(username: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { username },
    });
  }

  async create(
    username: string,
    hashedPassword: string,
    role: UserRole
  ): Promise<User> {
    return this.prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role,
      },
    });
  }
}