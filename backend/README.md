# The Last of Guss - Backend

## Запуск

### 1. Установка зависимостей
```bash
npm install
```

### 2. Генерация Prisma Client
```bash
npx prisma generate
```

### 3. Запуск PostgreSQL
```bash
docker-compose up -d
```

### 4. Миграции БД
```bash
npx prisma migrate dev
```

### 5. Запуск сервера
```bash
npm run dev
```

Сервер запустится на http://localhost:3000

## Переменные окружения

Создай `.env` файл:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/guss_game?schema=public"
JWT_SECRET="your-secret-key"
PORT=3000
ROUND_DURATION=60
COOLDOWN_DURATION=30
```

## Полезные команды

```bash
# Prisma Studio (GUI для БД)
npx prisma studio
