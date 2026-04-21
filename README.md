# TaskPilot

TaskPilot is a Stitch-inspired time management web app built with React, Vite, Tailwind CSS, and Supabase-ready configuration.

## Features

- Adaptive onboarding setup for work rhythm and peak-energy windows
- Daily flow dashboard with realism gauge and AI recommendations
- Smart task intent input with effort and energy matching
- Focus mode with countdown timer
- Intelligence feed and workload trends
- Adaptive overload rescheduling
- End-of-day sanctuary report
- Sanctuary profile and alert preferences
- Vercel-ready SPA deployment

## Tech Stack

- React 19
- Vite 8
- Tailwind CSS 4
- TypeScript
- React Router 7
- Supabase client

## Local Development

```cmd
cd /d "C:\Study Material XI\NIET\Innovation And Entrepreneurship\Ai planner\Ai planner"
"C:\Program Files\nodejs\npm.cmd" install
"C:\Program Files\nodejs\npm.cmd" run dev
```

## Production Build

```cmd
"C:\Program Files\nodejs\npm.cmd" run build
```

## Vercel

This project includes [vercel.json](/C:/Users/aweso/OneDrive/Desktop/Ai%20planner/vercel.json) with:

- Vite build settings
- `dist` output directory
- SPA rewrites to `index.html` for React Router routes

Set these environment variables in Vercel:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## TaskPilot Task Sync (Supabase)

TaskPilot tasks now support cloud sync with automatic local fallback.

1. Keep `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` set.
2. In Supabase SQL Editor, run:
   - `supabase/schema.sql`
   - `supabase/policies.sql`
   - `supabase/taskpilot_tasks.sql`

If Supabase is unreachable or not configured, TaskPilot continues in local mode automatically.
