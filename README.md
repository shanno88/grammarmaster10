<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Grammar Master Pro

A mono-repo containing backend API, web frontend, and Electron desktop app.

## Project Structure

```
/
├── backend/          # Express API server (licensing, billing, webhooks)
│   └── src/
│       ├── controllers/
│       ├── routes/
│       └── services/
├── frontend/         # React web app (Vercel deployment)
│   └── src/
│       ├── pages/
│       └── services/
├── electron/         # Electron desktop app
│   └── src/
└── package.json      # Root orchestration scripts
```

## Quick Start

**Prerequisites:** Node.js 18+

### 1. Install all dependencies

```bash
npm run install:all
```

### 2. Configure environment

- Copy `.env.example` to `.env` in each package folder
- Set required environment variables (API keys, database paths, etc.)

### 3. Start development servers

**Web + Backend:**
```bash
npm run dev
```
- Backend: http://localhost:3001
- Frontend: http://localhost:3000

**Or start individually:**
```bash
# Backend only
cd backend && npm run dev

# Frontend only
cd frontend && npm run dev

# Electron + Backend
npm run dev:electron
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run backend` | Start backend in dev mode |
| `npm run frontend` | Start frontend in dev mode |
| `npm run electron` | Start Electron app in dev mode |
| `npm run dev` | Start backend + frontend concurrently |
| `npm run dev:electron` | Start backend + Electron concurrently |
| `npm run install:all` | Install dependencies for all packages |

## Package Details

### Backend (`/backend`)
- Express.js API server
- SQLite database via better-sqlite3
- Paddle webhook handling
- License management

### Frontend (`/frontend`)
- React 19 + TypeScript
- Vite build system
- Deployed to Vercel

### Electron (`/electron`)
- Desktop application wrapper
- Same React codebase as frontend
- Built with electron-builder
