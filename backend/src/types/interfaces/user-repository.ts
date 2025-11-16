import { User, UserRole } from '@prisma/client';

export interface IUserRepository {
  findByUsername(username: string): Promise<User | null>;
  create(username: string, hashedPassword: string, role: UserRole): Promise<User>;
}