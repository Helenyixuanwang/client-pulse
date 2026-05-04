
# ClientPulse

A full-stack client project tracker built to demonstrate production-ready development with the modern React/Supabase stack.

## Live Demo

🔗 [client-pulse-psi.vercel.app](https://client-pulse-psi.vercel.app)

## Features

- **Authentication** — Email/password auth via Supabase Auth with session persistence
- **Projects** — Create and manage client projects with status tracking (active / paused / completed)
- **Tasks** — Per-project task management with status updates (todo / in-progress / done)
- **Feedback Board** — Per-project feedback items with upvoting
- **Dashboard** — Overview of all projects, active count, and total tasks
- **Row Level Security** — Supabase RLS policies ensure users only access their own data at the database level

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, TypeScript, Tailwind CSS |
| Auth | Supabase Auth (email/password) |
| Database | Supabase PostgreSQL with RLS |
| Client | Supabase JS (fully typed with generated types) |
| Deployment | Vercel |

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your Supabase URL and anon key to .env.local

# Run locally
npm run dev
```

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Database Schema

- `projects` — user-owned projects with name, description, and status
- `tasks` — per-project tasks with status (todo / in-progress / done) and due date
- `feedback` — per-project feedback items with upvote counts

All tables protected by Supabase Row Level Security policies.

## Project Structure
src/
├── app/
│   ├── auth/callback/        # Supabase auth callback handler
│   ├── dashboard/            # Main dashboard (server component)
│   │   └── projects/
│   │       ├── new/          # Create project page
│   │       └── [id]/         # Project detail page
│   ├── login/                # Auth page
│   └── logout/               # Sign out route handler
├── components/
│   ├── TaskList.tsx          # Client component for tasks
│   └── FeedbackList.tsx      # Client component for feedback
└── lib/
├── supabase/
│   ├── client.ts         # Browser Supabase client
│   └── server.ts         # Server Supabase client (cookie-based)
└── types/
└── database.types.ts # Auto-generated Supabase types
