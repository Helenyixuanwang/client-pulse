# ClientPulse

A full-stack client project tracker built to demonstrate production-ready development with the modern React/Supabase stack.

## Features

- **Authentication** — Email/password auth via Supabase Auth
- **Projects** — Create and manage client projects with status tracking (active / paused / completed)
- **Tasks** — Per-project task management with status updates (todo / in-progress / done)
- **Feedback Board** — Per-project feedback items with upvoting
- **Dashboard** — Overview of all projects, active count, and total tasks
- **Row Level Security** — Supabase RLS policies ensure users only access their own data

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, TypeScript, Tailwind CSS |
| Auth | Supabase Auth (email/password) |
| Database | Supabase PostgreSQL with RLS |
| ORM | Supabase JS client (fully typed) |
| Deployment | Vercel |

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your Supabase URL and anon key

# Run locally
npm run dev
```

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Database Schema

- `projects` — user-owned projects with name, description, status
- `tasks` — per-project tasks with status and due date
- `feedback` — per-project feedback items with upvote counts

All tables protected by Supabase Row Level Security policies.

## Live Demo

[client-pulse.vercel.app](https://client-pulse.vercel.app)
