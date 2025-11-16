import Fastify from 'fastify';
import cors from '@fastify/cors';
import { config } from './config/env';
import { prisma } from './database/prisma';
import { errorHandler } from './middlewares/error';

// Repositories
import { UserRepository } from './repositories/user';
import { RoundRepository } from './repositories/round';
import { PlayerStatsRepository } from './repositories/player-stats';

// Services
import { AuthService } from './services/auth';
import { RoundService } from './services/round';
import { TapService } from './services/tap';

// Controllers
import { AuthController } from './controllers/auth';
import { RoundController } from './controllers/round';
import { TapController } from './controllers/tap';

// Routes
import { authRoutes } from './routes/auth';
import { roundRoutes } from './routes/round';
import { tapRoutes } from './routes/tap';

async function start() {
  // Создаем Fastify сервер с логированием
  const app = Fastify({
    logger: {
      level: process.env.NODE_ENV === 'development' ? 'info' : 'error',
    },
  });

  // CORS для фронтенда
  await app.register(cors, {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  });

  // Глобальный обработчик ошибок
  app.setErrorHandler(errorHandler);

  // === Dependency Injection ===
  
  // Repositories
  const userRepository = new UserRepository(prisma);
  const roundRepository = new RoundRepository(prisma);
  const playerStatsRepository = new PlayerStatsRepository(prisma);

  // Services
  const authService = new AuthService(userRepository);
  const roundService = new RoundService(roundRepository, playerStatsRepository);
  const tapService = new TapService(roundRepository, playerStatsRepository, prisma);

  // Controllers
  const authController = new AuthController(authService);
  const roundController = new RoundController(roundService);
  const tapController = new TapController(tapService);

  // === Routes ===
  authRoutes(app, authController);
  roundRoutes(app, roundController);
  tapRoutes(app, tapController);

  // Health check
  app.get('/health', async () => ({ status: 'ok' }));

  try {
    await app.listen({ port: config.port, host: '0.0.0.0' });
    console.log(`🚀 Server running on http://localhost:${config.port}`);
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }

  // Graceful shutdown
  const signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM'];
  signals.forEach((signal) => {
    process.on(signal, async () => {
      console.log(`\n${signal} received, closing server...`);
      await app.close();
      await prisma.$disconnect();
      process.exit(0);
    });
  });
}

start();