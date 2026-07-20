export interface User {
  id: string
  name: string
  email: string
  avatarColor: string
  createdAt: number
  provider: 'email' | 'google'
}

export interface Profile {
  bio: string
  institution: string
  learnerType: string
  goal: string
}

export type Role = 'user' | 'assistant' | 'system'

export interface ChatMessage {
  id: string
  role: Role
  content: string
  ts: number
  image?: string
  model?: string
}

export interface Conversation {
  id: string
  title: string
  messages: ChatMessage[]
  model: string
  createdAt: number
  updatedAt: number
}

export interface Task {
  id: string
  title: string
  done: boolean
  priority: 'low' | 'medium' | 'high'
  due?: string
  createdAt: number
}

export interface Note {
  id: string
  title: string
  content: string
  updatedAt: number
}

export interface Habit {
  id: string
  name: string
  color: string
  days: Record<string, boolean>
  createdAt: number
}

export interface Exam {
  id: string
  subject: string
  date: string
  notes: string
}

export interface ActivityItem {
  id: string
  ts: number
  type: 'chat' | 'tool' | 'quiz' | 'flashcards' | 'pomodoro' | 'task' | 'note' | 'habit' | 'auth' | 'system'
  label: string
  xp: number
  ref?: string
}

export interface NotificationItem {
  id: string
  ts: number
  title: string
  body: string
  read: boolean
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt?: number
}

export interface Settings {
  theme: 'dark' | 'light'
  language: string
  notificationsEnabled: boolean
  soundEnabled: boolean
  openrouterKey: string
  model: string
}

export interface Flashcard {
  front: string
  back: string
}

export interface Deck {
  id: string
  topic: string
  cards: Flashcard[]
  createdAt: number
}

export interface QuizQuestion {
  question: string
  options: string[]
  answer: number
  explanation: string
}

export interface SavedQuiz {
  id: string
  topic: string
  questions: QuizQuestion[]
  bestScore: number
  createdAt: number
}

export interface ToolField {
  name: string
  label: string
  type: 'text' | 'textarea' | 'select' | 'number'
  placeholder?: string
  options?: string[]
  required?: boolean
  rows?: number
  min?: number
  max?: number
}

export interface ToolDef {
  id: string
  name: string
  category: string
  icon: string
  tagline: string
  description: string
  custom?: 'flashcards' | 'quiz' | 'pomodoro' | 'todo' | 'notes' | 'habits' | 'calendar'
  image?: boolean
  fields: ToolField[]
  buildPrompt?: (values: Record<string, string>) => string
  system?: string
}
