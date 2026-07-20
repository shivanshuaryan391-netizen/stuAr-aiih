export interface AchievementDef {
  id: string
  title: string
  description: string
  icon: string
  xpReward: number
  test: (s: AchievementStats) => boolean
}

export interface AchievementStats {
  xp: number
  streak: number
  chats: number
  toolRuns: number
  distinctTools: number
  quizzes: number
  flashcardSessions: number
  pomodoros: number
  tasksDone: number
  notesCreated: number
  habitsTicked: number
  hour: number
}

export const ACHIEVEMENTS: AchievementDef[] = [
  { id: 'first-steps', title: 'First Steps', description: 'Send your first message to the AI tutor', icon: 'Footprints', xpReward: 25, test: (s) => s.chats >= 1 },
  { id: 'curious-mind', title: 'Curious Mind', description: 'Run 10 AI tool sessions', icon: 'Brain', xpReward: 50, test: (s) => s.toolRuns >= 10 },
  { id: 'toolbox-explorer', title: 'Toolbox Explorer', description: 'Use 5 different AI tools', icon: 'Compass', xpReward: 60, test: (s) => s.distinctTools >= 5 },
  { id: 'quiz-whiz', title: 'Quiz Whiz', description: 'Complete your first quiz', icon: 'BadgeCheck', xpReward: 40, test: (s) => s.quizzes >= 1 },
  { id: 'card-master', title: 'Card Master', description: 'Review a flashcard deck', icon: 'Layers', xpReward: 40, test: (s) => s.flashcardSessions >= 1 },
  { id: 'deep-work', title: 'Deep Work', description: 'Finish a Pomodoro focus session', icon: 'Timer', xpReward: 40, test: (s) => s.pomodoros >= 1 },
  { id: 'on-fire', title: 'On Fire', description: 'Reach a 3-day study streak', icon: 'Flame', xpReward: 75, test: (s) => s.streak >= 3 },
  { id: 'unstoppable', title: 'Unstoppable', description: 'Reach a 7-day study streak', icon: 'Zap', xpReward: 150, test: (s) => s.streak >= 7 },
  { id: 'scholar', title: 'Scholar', description: 'Earn 1,000 XP', icon: 'GraduationCap', xpReward: 100, test: (s) => s.xp >= 1000 },
  { id: 'sage', title: 'Sage', description: 'Earn 5,000 XP', icon: 'Crown', xpReward: 250, test: (s) => s.xp >= 5000 },
  { id: 'night-owl', title: 'Night Owl', description: 'Study after 11 PM', icon: 'Moon', xpReward: 30, test: (s) => s.hour >= 23 || s.hour < 4 },
  { id: 'early-bird', title: 'Early Bird', description: 'Study before 7 AM', icon: 'Sunrise', xpReward: 30, test: (s) => s.hour >= 4 && s.hour < 7 },
  { id: 'task-slayer', title: 'Task Slayer', description: 'Complete 25 tasks', icon: 'CheckCircle2', xpReward: 80, test: (s) => s.tasksDone >= 25 },
  { id: 'note-keeper', title: 'Note Keeper', description: 'Create 10 notes', icon: 'NotebookPen', xpReward: 60, test: (s) => s.notesCreated >= 10 },
  { id: 'habit-architect', title: 'Habit Architect', description: 'Check in habits 21 times', icon: 'Repeat', xpReward: 90, test: (s) => s.habitsTicked >= 21 },
  { id: 'polymath', title: 'Polymath', description: 'Use 12 different AI tools', icon: 'Sparkles', xpReward: 200, test: (s) => s.distinctTools >= 12 },
]

export const XP = {
  chat: 10,
  toolRun: 15,
  quiz: 20,
  flashcards: 12,
  pomodoro: 25,
  taskDone: 6,
  note: 8,
  habit: 4,
  examPlanned: 8,
} as const
