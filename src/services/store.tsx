import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { toast } from 'sonner'
import type {
  ActivityItem,
  Conversation,
  Deck,
  Exam,
  Habit,
  Note,
  NotificationItem,
  Profile,
  QuizQuestion,
  SavedQuiz,
  Settings,
  Task,
} from '@/types'
import { load, save, todayKey, uid } from '@/lib/storage'
import { levelFromXp } from '@/lib/format'
import { ACHIEVEMENTS, XP, type AchievementStats } from '@/config/achievements'
import { useAuth } from './auth'

const DEFAULT_SETTINGS: Settings = {
  theme: 'dark',
  language: 'English',
  notificationsEnabled: true,
  soundEnabled: true,
  openrouterKey: (import.meta.env.VITE_OPENROUTER_API_KEY as string | undefined) ?? '',
  model: 'openrouter/auto',
}

const DEFAULT_PROFILE: Profile = { bio: '', institution: '', learnerType: 'Self learner', goal: '' }

interface StoreValue {
  hydrated: boolean
  settings: Settings
  updateSettings: (patch: Partial<Settings>) => void
  profile: Profile
  updateProfile: (patch: Partial<Profile>) => void
  xp: number
  streak: number
  level: number
  levelProgress: number
  levelSpan: number
  unlocked: Record<string, number>
  activity: ActivityItem[]
  weekly: { day: string; xp: number; count: number }[]
  stats: AchievementStats
  logActivity: (type: ActivityItem['type'], label: string, xp: number, ref?: string) => void
  tasks: Task[]
  addTask: (title: string, priority: Task['priority'], due?: string) => void
  toggleTask: (id: string) => void
  deleteTask: (id: string) => void
  notes: Note[]
  saveNote: (note: Partial<Note> & { title: string; content: string }) => Note
  deleteNote: (id: string) => void
  habits: Habit[]
  addHabit: (name: string, color: string) => void
  toggleHabitDay: (id: string, day: string) => void
  deleteHabit: (id: string) => void
  exams: Exam[]
  addExam: (exam: Omit<Exam, 'id'>) => void
  deleteExam: (id: string) => void
  pins: string[]
  togglePin: (toolId: string) => void
  notifications: NotificationItem[]
  markAllRead: () => void
  clearNotifications: () => void
  conversations: Conversation[]
  saveConversation: (c: Conversation) => void
  deleteConversation: (id: string) => void
  decks: Deck[]
  saveDeck: (topic: string, cards: Deck['cards']) => void
  deleteDeck: (id: string) => void
  quizzes: SavedQuiz[]
  saveQuizResult: (topic: string, questions: QuizQuestion[], score: number) => void
  deleteQuiz: (id: string) => void
  notify: (title: string, body: string) => void
  resetAll: () => void
}

const StoreContext = createContext<StoreValue | null>(null)

function usePerUser<T>(userId: string | undefined, entity: string, fallback: T): [T, React.Dispatch<React.SetStateAction<T>>, boolean] {
  const [value, setValue] = useState<T>(fallback)
  const [ready, setReady] = useState(false)
  const keyRef = useRef('')

  useEffect(() => {
    if (!userId) return
    const key = `data:${userId}:${entity}`
    keyRef.current = key
    setValue(load<T>(key, fallback))
    setReady(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, entity])

  useEffect(() => {
    if (ready && keyRef.current) save(keyRef.current, value)
  }, [value, ready])

  return [value, setValue, ready]
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const userId = user?.id

  const [settings, setSettings] = useState<Settings>(() => load<Settings>('settings', DEFAULT_SETTINGS))
  const [profile, setProfile, rp] = usePerUser<Profile>(userId, 'profile', DEFAULT_PROFILE)
  const [xp, setXp, rx] = usePerUser<number>(userId, 'xp', 0)
  const [streak, setStreak, rs] = usePerUser<number>(userId, 'streak', 0)
  const [lastActive, setLastActive, rl] = usePerUser<string>(userId, 'lastActive', '')
  const [unlocked, setUnlocked, ru] = usePerUser<Record<string, number>>(userId, 'unlocked', {})
  const [activity, setActivity, ra] = usePerUser<ActivityItem[]>(userId, 'activity', [])
  const [tasks, setTasks, r1] = usePerUser<Task[]>(userId, 'tasks', [])
  const [notes, setNotes, r2] = usePerUser<Note[]>(userId, 'notes', [])
  const [habits, setHabits, r3] = usePerUser<Habit[]>(userId, 'habits', [])
  const [exams, setExams, r4] = usePerUser<Exam[]>(userId, 'exams', [])
  const [pins, setPins, r5] = usePerUser<string[]>(userId, 'pins', ['ai-tutor', 'homework-solver', 'notes-generator', 'quiz-generator'])
  const [notifications, setNotifications, r6] = usePerUser<NotificationItem[]>(userId, 'notifications', [])
  const [conversations, setConversations, r7] = usePerUser<Conversation[]>(userId, 'conversations', [])
  const [decks, setDecks, r8] = usePerUser<Deck[]>(userId, 'decks', [])
  const [quizzes, setQuizzes, r9] = usePerUser<SavedQuiz[]>(userId, 'quizzes', [])

  const hydrated = rp && rx && rs && rl && ru && ra && r1 && r2 && r3 && r4 && r5 && r6 && r7 && r8 && r9

  useEffect(() => {
    save('settings', settings)
    const root = document.documentElement
    root.classList.toggle('dark', settings.theme === 'dark')
    root.classList.toggle('light', settings.theme === 'light')
    root.style.colorScheme = settings.theme
  }, [settings])

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...patch }))
  }, [])

  const updateProfile = useCallback(
    (patch: Partial<Profile>) => {
      setProfile((prev) => ({ ...prev, ...patch }))
    },
    [setProfile],
  )

  const notify = useCallback(
    (title: string, body: string) => {
      const item: NotificationItem = { id: uid(), ts: Date.now(), title, body, read: false }
      setNotifications((prev) => [item, ...prev].slice(0, 50))
      if (settings.notificationsEnabled) {
        toast(title, { description: body })
      }
    },
    [setNotifications, settings.notificationsEnabled],
  )

  const stats: AchievementStats = useMemo(() => {
    const tools = new Set<string>()
    let chats = 0
    let toolRuns = 0
    let quizzesTaken = 0
    let flashcardSessions = 0
    let pomodoros = 0
    let tasksDone = 0
    let notesCreated = 0
    let habitsTicked = 0
    for (const a of activity) {
      if (a.type === 'chat') chats++
      if (a.type === 'tool') {
        toolRuns++
        if (a.ref) tools.add(a.ref)
      }
      if (a.type === 'quiz') quizzesTaken++
      if (a.type === 'flashcards') flashcardSessions++
      if (a.type === 'pomodoro') pomodoros++
      if (a.type === 'task') tasksDone++
      if (a.type === 'note') notesCreated++
      if (a.type === 'habit') habitsTicked++
    }
    const hour = activity.length ? new Date(activity[0]!.ts).getHours() : 12
    return {
      xp,
      streak,
      chats,
      toolRuns,
      distinctTools: tools.size,
      quizzes: quizzesTaken,
      flashcardSessions,
      pomodoros,
      tasksDone,
      notesCreated,
      habitsTicked,
      hour,
    }
  }, [activity, xp, streak])

  const evaluateAchievements = useCallback(
    (nextStats: AchievementStats, currentUnlocked: Record<string, number>, currentXp: number) => {
      const newly: typeof ACHIEVEMENTS = []
      const nextUnlocked = { ...currentUnlocked }
      let bonus = 0
      for (const def of ACHIEVEMENTS) {
        if (!nextUnlocked[def.id] && def.test(nextStats)) {
          nextUnlocked[def.id] = Date.now()
          newly.push(def)
          bonus += def.xpReward
        }
      }
      if (newly.length) {
        setUnlocked(nextUnlocked)
        setXp(currentXp + bonus)
        for (const def of newly) {
          notify(`Achievement unlocked: ${def.title}`, `${def.description} · +${def.xpReward} XP`)
        }
      }
      return bonus
    },
    [notify, setUnlocked, setXp],
  )

  const logActivity = useCallback(
    (type: ActivityItem['type'], label: string, xpGain: number, ref?: string) => {
      const now = new Date()
      const today = todayKey(now)
      const item: ActivityItem = { id: uid(), ts: now.getTime(), type, label, xp: xpGain, ref }
      const nextActivity = [item, ...activity].slice(0, 400)
      setActivity(nextActivity)

      let nextStreak = streak
      if (lastActive !== today) {
        const yesterday = todayKey(new Date(now.getTime() - 86400000))
        nextStreak = lastActive === yesterday ? streak + 1 : 1
        setStreak(nextStreak)
        setLastActive(today)
      }

      const nextXp = xp + xpGain
      const nextStats: AchievementStats = { ...stats, xp: nextXp, streak: nextStreak, hour: now.getHours() }
      if (type === 'chat') nextStats.chats++
      if (type === 'tool') {
        nextStats.toolRuns++
        if (ref) nextStats.distinctTools = new Set([...activity.filter((a) => a.ref).map((a) => a.ref!), ref]).size
      }
      if (type === 'quiz') nextStats.quizzes++
      if (type === 'flashcards') nextStats.flashcardSessions++
      if (type === 'pomodoro') nextStats.pomodoros++
      if (type === 'task') nextStats.tasksDone++
      if (type === 'note') nextStats.notesCreated++
      if (type === 'habit') nextStats.habitsTicked++

      const bonus = evaluateAchievements(nextStats, unlocked, nextXp)
      if (bonus === 0) setXp(nextXp)
    },
    [activity, streak, lastActive, xp, stats, unlocked, evaluateAchievements, setActivity, setStreak, setLastActive, setXp],
  )

  // ------- Tasks -------
  const addTask = useCallback(
    (title: string, priority: Task['priority'], due?: string) => {
      setTasks((prev) => [{ id: uid(), title, done: false, priority, due, createdAt: Date.now() }, ...prev])
    },
    [setTasks],
  )
  const toggleTask = useCallback(
    (id: string) => {
      const task = tasks.find((t) => t.id === id)
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
      if (task && !task.done) logActivity('task', `Completed task: ${task.title}`, XP.taskDone)
    },
    [tasks, setTasks, logActivity],
  )
  const deleteTask = useCallback((id: string) => setTasks((prev) => prev.filter((t) => t.id !== id)), [setTasks])

  // ------- Notes -------
  const saveNote = useCallback(
    (note: Partial<Note> & { title: string; content: string }) => {
      const existing = note.id ? notes.find((n) => n.id === note.id) : undefined
      const saved: Note = existing
        ? { ...existing, title: note.title, content: note.content, updatedAt: Date.now() }
        : { id: uid(), title: note.title, content: note.content, updatedAt: Date.now() }
      setNotes((prev) => (existing ? prev.map((n) => (n.id === saved.id ? saved : n)) : [saved, ...prev]))
      if (!existing) logActivity('note', `Created note: ${saved.title}`, XP.note)
      return saved
    },
    [notes, setNotes, logActivity],
  )
  const deleteNote = useCallback((id: string) => setNotes((prev) => prev.filter((n) => n.id !== id)), [setNotes])

  // ------- Habits -------
  const addHabit = useCallback(
    (name: string, color: string) => {
      setHabits((prev) => [...prev, { id: uid(), name, color, days: {}, createdAt: Date.now() }])
    },
    [setHabits],
  )
  const toggleHabitDay = useCallback(
    (id: string, day: string) => {
      const habit = habits.find((h) => h.id === id)
      setHabits((prev) =>
        prev.map((h) => (h.id === id ? { ...h, days: { ...h.days, [day]: !h.days[day] } } : h)),
      )
      if (habit && !habit.days[day]) logActivity('habit', `Checked in: ${habit.name}`, XP.habit)
    },
    [habits, setHabits, logActivity],
  )
  const deleteHabit = useCallback((id: string) => setHabits((prev) => prev.filter((h) => h.id !== id)), [setHabits])

  // ------- Exams -------
  const addExam = useCallback(
    (exam: Omit<Exam, 'id'>) => {
      setExams((prev) => [...prev, { ...exam, id: uid() }].sort((a, b) => a.date.localeCompare(b.date)))
      logActivity('system', `Planned exam: ${exam.subject}`, XP.examPlanned)
    },
    [setExams, logActivity],
  )
  const deleteExam = useCallback((id: string) => setExams((prev) => prev.filter((e) => e.id !== id)), [setExams])

  // ------- Pins -------
  const togglePin = useCallback(
    (toolId: string) => {
      setPins((prev) => (prev.includes(toolId) ? prev.filter((p) => p !== toolId) : [...prev, toolId]))
    },
    [setPins],
  )

  // ------- Notifications -------
  const markAllRead = useCallback(() => setNotifications((prev) => prev.map((n) => ({ ...n, read: true }))), [setNotifications])
  const clearNotifications = useCallback(() => setNotifications([]), [setNotifications])

  // ------- Conversations -------
  const saveConversation = useCallback(
    (c: Conversation) => {
      setConversations((prev) => {
        const exists = prev.some((x) => x.id === c.id)
        const next = exists ? prev.map((x) => (x.id === c.id ? c : x)) : [c, ...prev]
        return next.sort((a, b) => b.updatedAt - a.updatedAt)
      })
    },
    [setConversations],
  )
  const deleteConversation = useCallback((id: string) => setConversations((prev) => prev.filter((c) => c.id !== id)), [setConversations])

  // ------- Decks & Quizzes -------
  const saveDeck = useCallback(
    (topic: string, cards: Deck['cards']) => {
      setDecks((prev) => [{ id: uid(), topic, cards, createdAt: Date.now() }, ...prev])
    },
    [setDecks],
  )
  const deleteDeck = useCallback((id: string) => setDecks((prev) => prev.filter((d) => d.id !== id)), [setDecks])
  const saveQuizResult = useCallback(
    (topic: string, questions: QuizQuestion[], score: number) => {
      setQuizzes((prev) => [{ id: uid(), topic, questions, bestScore: score, createdAt: Date.now() }, ...prev])
    },
    [setQuizzes],
  )
  const deleteQuiz = useCallback((id: string) => setQuizzes((prev) => prev.filter((q) => q.id !== id)), [setQuizzes])

  const resetAll = useCallback(() => {
    if (!userId) return
    const entities = ['profile', 'xp', 'streak', 'lastActive', 'unlocked', 'activity', 'tasks', 'notes', 'habits', 'exams', 'pins', 'notifications', 'conversations', 'decks', 'quizzes']
    entities.forEach((e) => save(`data:${userId}:${e}`, null))
    window.location.reload()
  }, [userId])

  const weekly = useMemo(() => {
    const days: { day: string; xp: number; count: number }[] = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000)
      const key = todayKey(d)
      const items = activity.filter((a) => todayKey(new Date(a.ts)) === key)
      days.push({
        day: d.toLocaleDateString(undefined, { weekday: 'short' }),
        xp: items.reduce((s, a) => s + a.xp, 0),
        count: items.length,
      })
    }
    return days
  }, [activity])

  const { level, intoLevel, span } = levelFromXp(xp)

  const value: StoreValue = {
    hydrated,
    settings,
    updateSettings,
    profile,
    updateProfile,
    xp,
    streak,
    level,
    levelProgress: intoLevel,
    levelSpan: span,
    unlocked,
    activity,
    weekly,
    stats,
    logActivity,
    tasks,
    addTask,
    toggleTask,
    deleteTask,
    notes,
    saveNote,
    deleteNote,
    habits,
    addHabit,
    toggleHabitDay,
    deleteHabit,
    exams,
    addExam,
    deleteExam,
    pins,
    togglePin,
    notifications,
    markAllRead,
    clearNotifications,
    conversations,
    saveConversation,
    deleteConversation,
    decks,
    saveDeck,
    deleteDeck,
    quizzes,
    saveQuizResult,
    deleteQuiz,
    notify,
    resetAll,
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used inside StoreProvider')
  return ctx
}
