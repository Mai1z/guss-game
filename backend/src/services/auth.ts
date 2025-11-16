import { UserRole } from '@prisma/client';
import { IUserRepository } from '../types/interfaces/user-repository';
import { hashPassword, comparePassword } from '../utils/password';
import { signToken } from '../utils/jwt';
import { AuthResponseDTO } from '../types/dtos';

export class AuthService {
  constructor(private userRepository: IUserRepository) {}

  async login(username: string, password: string): Promise<AuthResponseDTO> {
    const user = await this.userRepository.findByUsername(username);

    // Если пользователь не существует - создаем нового
    if (!user) {
      return this.register(username, password);
    }

    // Если существует - проверяем пароль
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    // Генерируем JWT токен
    const token = signToken({
      userId: user.id,
      username: user.username,
      role: user.role,
    });

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    };
  }

  private async register(
    username: string,
    password: string
  ): Promise<AuthResponseDTO> {
    // Определяем роль на основе имени пользователя
    const role = this.determineRole(username);

    const hashedPassword = await hashPassword(password);
    const user = await this.userRepository.create(
      username,
      hashedPassword,
      role
    );

    const token = signToken({
      userId: user.id,
      username: user.username,
      role: user.role,
    });

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    };
  }

  private determineRole(username: string): UserRole {
    // Бизнес-правило: определение роли по имени
    const lowerUsername = username.toLowerCase();
    
    if (lowerUsername === 'admin') {
      return UserRole.ADMIN;
    }
    
    if (lowerUsername === 'никита') {
      return UserRole.NIKITA;
    }
    
    return UserRole.SURVIVOR;
  }
}