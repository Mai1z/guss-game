# The Last of Guss 🦆

A browser-based game where players compete by tapping on a goose infected with the G-42 mutation.

## Quick Start

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

Open http://localhost:5173

## Tech Stack

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

## Features

- Race conditions are handled using `FOR UPDATE` and retry logic.

## Game Rules

- 1 tap = 1 point
- Every 11th tap = 10 points
- The **"Nikita"** role — taps do not count.
- The **"admin"** role — can create new rounds.
