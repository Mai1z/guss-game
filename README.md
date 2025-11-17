# The Last of Guss 🦆

Браузерная игра где игроки соревнуются в тапах по гусю с мутацией G-42.

## Быстрый старт

### 1. Backend
```bash
cd backend
npm install
docker-compose up -d
npx prisma generate
npx prisma migrate dev
npm run dev
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```

Откройте http://localhost:5173

## Технологии

**Backend:**
- Node.js + TypeScript
- Fastify
- Prisma + PostgreSQL
- JWT Authentication

**Frontend:**
- React + TypeScript
- Vite
- Ant Design
- React Query

## Особенности

- Race conditions решены (FOR UPDATE + Serializable + Retry)  

## Правила игры

- 1 тап = 1 очко
- Каждый 11-й тап = 10 очков
- Роль "Никита" - тапы не считаются
- Роль "admin" - может создавать раунды