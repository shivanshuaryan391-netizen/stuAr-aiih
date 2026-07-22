export const SITE = {
  name: 'StuAr AI',
  tagline: 'Learn Smarter. Build Your Future.',
  mission:
    'Create the world\u2019s most advanced AI learning platform for school students, college students, competitive exam aspirants, teachers, and self learners.',
  email:'shivanshuaryan938@gmail.com',
}

export const MODELS = [
  { id: 'openrouter/auto', label: 'StuAr Auto (recommended)' },
  { id: 'meta-llama/llama-3.3-70b-instruct', label: 'Llama 3.3 70B' },
  { id: 'google/gemini-2.0-flash-001', label: 'Gemini 2.0 Flash' },
  { id: 'openai/gpt-4o-mini', label: 'GPT-4o Mini' },
  { id: 'anthropic/claude-3.5-haiku', label: 'Claude 3.5 Haiku' },
  { id: 'deepseek/deepseek-chat', label: 'DeepSeek V3' },
]

export const HERO_STATS = [
  { value: 40, suffix: '+', label: 'AI tools' },
  { value: 120, suffix: 'K+', label: 'learners' },
  { value: 4.9, suffix: '/5', label: 'avg. rating', decimals: 1 },
  { value: 98, suffix: '%', label: 'satisfaction' },
]

export const FEATURES = [
  {
    icon: 'Sparkles',
    title: 'ChatGPT-class AI Tutor',
    body: 'Streaming answers with markdown, code highlighting and image understanding — tuned for learning, not just answering.',
  },
  {
    icon: 'Layers',
    title: '40+ precision tools',
    body: 'Six curated suites — Education, Writing, Coding, Business, Productivity and Design — each engineered with expert prompts.',
  },
  {
    icon: 'Flame',
    title: 'Gamified momentum',
    body: 'Daily streaks, XP levels and achievements turn consistency into a habit you never want to break.',
  },
  {
    icon: 'CalendarClock',
    title: 'Plans that adapt',
    body: 'AI study, exam and revision planners build day-by-day schedules around your syllabus and deadlines.',
  },
  {
    icon: 'ShieldCheck',
    title: 'Private by design',
    body: 'Your keys stay in your browser, your data stays yours. Row-level security when you connect Supabase.',
  },
  {
    icon: 'Zap',
    title: 'Blazing everywhere',
    body: 'PWA offline support, sub-second loads, and a fully responsive interface from phone to ultrawide.',
  },
]

export const WHY_POINTS = [
  {
    title: 'Built for depth, not dopamine',
    body: 'Every tool produces structured, syllabus-aware output — steps, formulas, citations and practice questions — so you understand, not just copy.',
  },
  {
    title: 'One workspace, zero tab chaos',
    body: 'Chat, notes, tasks, habits, flashcards, calendar and analytics live together. Your study brain finally has one home.',
  },
  {
    title: 'Your progress, made visible',
    body: 'Weekly analytics, streak calendars and XP levels show exactly how consistent you are — and where to push next.',
  },
  {
    title: 'Bring your own model',
    body: 'Powered by OpenRouter: pick Llama, Gemini, GPT, Claude or DeepSeek. Swap models anytime from Settings.',
  },
]

export const TESTIMONIALS = [
  {
    name: 'Aarav Mehta',
    role: 'JEE Aspirant, Kota',
    quote:
      'The Physics Solver doesn\u2019t just give answers — it walks through free-body diagrams step by step. My mock test scores jumped 23% in six weeks.',
    initials: 'AM',
    color: '#6366F1',
  },
  {
    name: 'Sofia Ramirez',
    role: 'Pre-med, UCLA',
    quote:
      'I feed lecture PDFs into the summarizer and turn them into flashcards the same night. StuAr replaced four separate apps for me.',
    initials: 'SR',
    color: '#06B6D4',
  },
  {
    name: 'Daniel Okafor',
    role: 'High-school teacher, Lagos',
    quote:
      'The MCQ and Quiz generators save me hours of prep every week. The questions are genuinely exam-grade, with solid distractors.',
    initials: 'DO',
    color: '#8B5CF6',
  },
  {
    name: 'Mei-Ling Chen',
    role: 'CS undergrad, NUS',
    quote:
      'Code Debugger explained a race condition my TA couldn\u2019t spot. The chat keeps full history, so my study log basically writes itself.',
    initials: 'MC',
    color: '#EC4899',
  },
  {
    name: 'Lucas Weber',
    role: 'Self-taught developer, Berlin',
    quote:
      'Pomodoro + habit tracker + AI tutor in one tab. The streak system is the first one I\u2019ve actually kept alive for 100+ days.',
    initials: 'LW',
    color: '#F59E0B',
  },
  {
    name: 'Priya Nair',
    role: 'UPSC aspirant, Delhi',
    quote:
      'Revision Planner mapped my entire GS syllabus into daily slots with spaced repetition. It feels like having a personal coach.',
    initials: 'PN',
    color: '#10B981',
  },
]

export const PRICING = [
  {
    name: 'Starter',
    price: 0,
    period: 'forever',
    blurb: 'Everything you need to start learning smarter.',
    features: [
      'AI Chat with streaming',
      '10 AI tool runs / day',
      'Notes, Tasks & Habit tracker',
      'Pomodoro timer',
      'PWA offline support',
    ],
    cta: 'Start free',
    featured: false,
  },
  {
    name: 'Pro',
    price: 8,
    period: 'per month',
    blurb: 'Unlimited power for serious students.',
    features: [
      'Unlimited AI tools & chat',
      'All 40+ premium tools',
      'Flashcards & Quiz studio',
      'AI study & exam planners',
      'PDF summarizer & OCR scanner',
      'Study analytics & certificates',
      'Priority model routing',
    ],
    cta: 'Go Pro',
    featured: true,
  },
  {
    name: 'Teams',
    price: 24,
    period: 'per month',
    blurb: 'For classrooms, coaching centers & study groups.',
    features: [
      'Everything in Pro',
      '5 seats included',
      'Shared decks & quizzes',
      'Teacher dashboard',
      'Usage analytics export',
      'Priority support',
    ],
    cta: 'Contact sales',
    featured: false,
  },
]

export const FAQS = [
  {
    q: 'Which AI models power StuAr AI?',
    a: 'StuAr AI connects to OpenRouter, giving you access to top models — Llama 3.3, Gemini 2.0, GPT-4o, Claude and DeepSeek — through one API key. You can switch models anytime in Settings, or use StuAr Auto to route each request to the best model.',
  },
  {
    q: 'Is StuAr AI free to use?',
    a: 'Yes. The Starter plan is free forever and includes the AI chat, daily tool runs and the full productivity suite. Pro unlocks unlimited usage and advanced tools like the PDF Summarizer and OCR Notes Scanner.',
  },
  {
    q: 'Who is StuAr AI for?',
    a: 'School students, college students, competitive-exam aspirants (JEE, NEET, UPSC, SAT, GRE), teachers creating material, and self-learners building new skills. The tools adapt to your level and syllabus.',
  },
  {
    q: 'Does it work offline and on mobile?',
    a: 'StuAr AI is a Progressive Web App — install it on any phone or desktop. Notes, tasks, habits and your dashboard work offline; AI features reconnect automatically when you\u2019re back online.',
  },
  {
    q: 'How is my data handled?',
    a: 'Your OpenRouter key is stored only in your browser. Connect Supabase for end-to-end encrypted cloud sync with row-level security, or stay fully local — the choice is yours. We never train on your data.',
  },
  {
    q: 'Can teachers use StuAr AI for their classes?',
    a: 'Absolutely. The Teams plan adds shared decks, quiz distribution and a teacher dashboard. The MCQ, Quiz and Notes generators are built to produce classroom-ready material in seconds.',
  },
]

export const LANGUAGES = [
  'English',
  'Hindi',
  'Spanish',
  'French',
  'German',
  'Portuguese',
  'Japanese',
  'Korean',
]

export const LEARNER_TYPES = [
  'School student',
  'College student',
  'Competitive exam aspirant',
  'Teacher',
  'Self learner',
]
