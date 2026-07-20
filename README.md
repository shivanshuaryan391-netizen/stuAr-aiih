# StuAr AI — Learn Smarter. Build Your Future.

The advanced AI learning platform for school students, college students, competitive-exam aspirants, teachers and self-learners.

A premium, dark, glassmorphic workspace with a ChatGPT-class AI tutor, **40+ AI tools** across Education / Writing / Coding / Business / Productivity / Design, and a fully gamified progress system (streaks, XP, levels, achievements, certificates).

## Features

- **Landing page** — hero, features, why-StuAr, live tools showcase, testimonials, pricing, FAQ, contact, footer
- **Auth** — email + Google (Supabase), register with password strength meter, forgot password, protected routes
- **Dashboard** — daily streak, XP & levels, achievements, weekly progress chart, recent activity, pinned tools, study calendar, upcoming exams, today's goals
- **AI Chat** — streaming responses, markdown + syntax highlighting, conversation history, image upload, copy / regenerate / stop / clear
- **40+ AI tools** — AI Tutor, Homework/Math/Physics/Chemistry solvers, Biology Tutor, Notes/MCQ/Quiz generators, interactive Flashcards, Mind Maps, Study/Exam/Revision planners, PDF Summarizer, OCR Notes Scanner (vision), Essay/Grammar/Resume/Email/Cover-letter writers, Translator, Code Generator/Debugger/Explainer, SQL & Regex generators, Business plan, Marketing copy, Invoice & Social generators, Prompt/Palette/Logo designers
- **Productivity suite** — Todo, Markdown Notes, Calendar, Habit tracker, Pomodoro with XP rewards
- **Profile & Settings** — analytics charts, achievements, certificates, themes (dark/light), language, model picker, data export, account deletion
- **Platform** — PWA (offline app shell, installable), global ⌘K search, page transitions, responsive, accessible, SEO meta + sitemap

## Tech stack

React 18 · Vite · TypeScript · Tailwind CSS · Framer Motion · React Router 7 · TanStack Query-ready · React Hook Form + Zod · Recharts · react-markdown + highlight.js · Supabase (optional) · OpenRouter AI

## Getting started

```bash
npm install
cp .env.example .env   # optional — keys can also be set in the app's Settings page
npm run dev
```

### AI setup (required for chat & AI tools)

1. Create a free key at [openrouter.ai/keys](https://openrouter.ai/keys)
2. Paste it in the app under **Settings → OpenRouter API key** (stored only in your browser), or set `VITE_OPENROUTER_API_KEY` in `.env`
3. Pick a model in Settings — free models work without credits

### Supabase (optional — cloud auth, Google login, sync)

1. Create a project at [supabase.com](https://supabase.com)
2. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env`
3. Run the SQL schema in `src/services/supabase.ts` (comment block) in the SQL editor
4. Enable the Google provider for OAuth sign-in

Without Supabase the app runs in **local mode**: secure hashed-credential accounts stored in the browser.

## Scripts

```bash
npm run dev       # dev server
npm run build     # production build → dist/
npm run preview   # preview the build
```

## Deploy (Vercel)

`vercel.json` already includes SPA rewrites and asset caching. Import the repo, add env vars, deploy. Any static host works — route all paths to `index.html`.

## Project structure

```
src/
├── components/     # brand, common (Markdown, EmptyState…), layout, search
├── config/         # site content, achievements catalog
├── hooks/          # reusable hooks
├── lib/            # storage, formatting, utils
├── pages/          # Landing, auth, Dashboard, Chat, Tools, Profile, Settings…
│   └── tools/      # custom interactive tools (Flashcards, Quiz, Pomodoro…)
├── sections/       # landing page sections
├── services/       # ai (OpenRouter streaming), auth, store (gamification+data), tools registry, supabase
└── types/          # shared TypeScript models
```

Every AI tool calls the shared OpenRouter service with streaming. Every form validates. Every route exists. No placeholders.
