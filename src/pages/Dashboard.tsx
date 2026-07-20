import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Award,
  CalendarPlus,
  CheckCircle2,
  Circle,
  Flame,
  Pin,
  Plus,
  Sparkles,
  Trash2,
  Trophy,
  Zap,
} from 'lucide-react'
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useAuth } from '@/services/auth'
import { useStore } from '@/services/store'
import { TOOL_MAP } from '@/services/tools'
import { ACHIEVEMENTS } from '@/config/achievements'
import { daysUntil, formatDate, greeting, timeAgo } from '@/lib/format'
import { todayKey } from '@/lib/storage'
import { ToolIcon } from '@/components/common/ToolIcon'
import { EmptyState } from '@/components/common/EmptyState'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}
const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
}

function StatCard({ icon, label, value, sub, tone }: { icon: React.ReactNode; label: string; value: string; sub: string; tone: string }) {
  return (
    <motion.div variants={item} className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <span className={cn('grid h-10 w-10 place-items-center rounded-xl', tone)}>{icon}</span>
      </div>
      <p className="mt-3.5 font-display text-[1.65rem] font-bold leading-none">{value}</p>
      <p className="mt-1.5 text-sm font-medium text-foreground/80">{label}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>
    </motion.div>
  )
}

function WeeklyChart() {
  const { weekly } = useStore()
  const max = Math.max(...weekly.map((w) => w.xp), 0)
  return (
    <motion.div variants={item} className="glass rounded-2xl p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-display text-base font-semibold">Weekly progress</h3>
          <p className="text-xs text-muted-foreground">XP earned per day</p>
        </div>
        <span className="chip">{max > 0 ? `${weekly.reduce((s, w) => s + w.xp, 0)} XP this week` : 'Start today'}</span>
      </div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weekly} margin={{ top: 4, right: 4, left: -22, bottom: 0 }}>
            <XAxis dataKey="day" tick={{ fill: 'currentColor', fontSize: 11, opacity: 0.55 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'currentColor', fontSize: 11, opacity: 0.55 }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip
              cursor={{ fill: 'rgba(99,102,241,0.08)' }}
              contentStyle={{
                background: 'rgba(10,15,36,0.92)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 12,
                fontSize: 12,
                color: '#fff',
              }}
              labelStyle={{ color: '#fff' }}
              formatter={(value) => [`${value} XP`, 'Earned']}
            />
            <Bar dataKey="xp" radius={[6, 6, 2, 2]} maxBarSize={34}>
              {weekly.map((w, i) => (
                <Cell key={i} fill={w.xp === max && max > 0 ? '#06B6D4' : '#6366F1'} fillOpacity={w.xp > 0 ? 1 : 0.25} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}

function GoalsCard() {
  const { tasks, addTask, toggleTask } = useStore()
  const [draft, setDraft] = useState('')
  const open = tasks.filter((t) => !t.done).slice(0, 4)
  return (
    <motion.div variants={item} className="glass rounded-2xl p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-base font-semibold">Today&apos;s goals</h3>
        <Link to="/app/tools/todo" className="text-xs font-medium text-aqua-soft hover:underline">
          View all
        </Link>
      </div>
      <form
        className="mb-3 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault()
          if (draft.trim().length < 2) return
          addTask(draft.trim(), 'medium', todayKey())
          setDraft('')
        }}
      >
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Add a goal for today…"
          aria-label="New goal"
          className="input-field py-2 text-[13px]"
        />
        <button type="submit" className="btn-primary shrink-0 px-3.5 py-2" aria-label="Add goal">
          <Plus className="h-4 w-4" />
        </button>
      </form>
      {open.length === 0 ? (
        <p className="rounded-xl border border-dashed border-white/10 px-4 py-6 text-center text-sm text-muted-foreground">
          No open goals. Add one above — small wins compound.
        </p>
      ) : (
        <ul className="space-y-1.5">
          {open.map((t) => (
            <li key={t.id}>
              <button
                type="button"
                onClick={() => toggleTask(t.id)}
                className="group flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-sm transition-colors hover:bg-white/[0.05]"
              >
                <Circle className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-brand-soft" />
                <span className="flex-1 truncate">{t.title}</span>
                <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase', t.priority === 'high' ? 'bg-red-500/15 text-red-400' : t.priority === 'low' ? 'bg-white/[0.07] text-muted-foreground' : 'bg-brand/15 text-brand-soft')}>
                  {t.priority}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  )
}

function ExamsCard() {
  const { exams, addExam, deleteExam } = useStore()
  const [open, setOpen] = useState(false)
  const [subject, setSubject] = useState('')
  const [date, setDate] = useState('')
  const upcoming = exams.filter((e) => daysUntil(e.date) >= 0).slice(0, 4)

  return (
    <motion.div variants={item} className="glass rounded-2xl p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-base font-semibold">Upcoming exams</h3>
        <button type="button" onClick={() => setOpen(true)} className="inline-flex items-center gap-1 text-xs font-medium text-aqua-soft hover:underline">
          <CalendarPlus className="h-3.5 w-3.5" /> Add
        </button>
      </div>
      {upcoming.length === 0 ? (
        <p className="rounded-xl border border-dashed border-white/10 px-4 py-6 text-center text-sm text-muted-foreground">
          No exams scheduled. Add one and let the Exam Planner build your countdown.
        </p>
      ) : (
        <ul className="space-y-2">
          {upcoming.map((e) => {
            const d = daysUntil(e.date)
            return (
              <li key={e.id} className="group flex items-center gap-3 rounded-xl bg-white/[0.03] px-3.5 py-3">
                <div className={cn('grid h-10 w-10 shrink-0 place-items-center rounded-xl font-display text-sm font-bold', d <= 3 ? 'bg-red-500/15 text-red-400' : d <= 7 ? 'bg-amber-500/15 text-amber-400' : 'bg-brand/15 text-brand-soft')}>
                  {d}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{e.subject}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(e.date)} · {d === 0 ? 'today!' : d === 1 ? 'tomorrow' : `${d} days left`}
                  </p>
                </div>
                <button type="button" onClick={() => deleteExam(e.id)} aria-label={`Delete ${e.subject}`} className="rounded-lg p-1.5 text-muted-foreground opacity-0 transition-opacity hover:text-red-400 group-hover:opacity-100">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </li>
            )
          })}
        </ul>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="glass-strong rounded-2xl border-white/10 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">Schedule an exam</DialogTitle>
          </DialogHeader>
          <form
            className="space-y-4"
            onSubmit={(ev) => {
              ev.preventDefault()
              if (subject.trim().length < 2 || !date) return
              addExam({ subject: subject.trim(), date, notes: '' })
              setSubject('')
              setDate('')
              setOpen(false)
            }}
          >
            <div>
              <label htmlFor="exam-subject" className="mb-1.5 block text-sm font-medium">Subject / exam name</label>
              <input id="exam-subject" className="input-field" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Physics midterm" />
            </div>
            <div>
              <label htmlFor="exam-date" className="mb-1.5 block text-sm font-medium">Date</label>
              <input id="exam-date" type="date" className="input-field" value={date} onChange={(e) => setDate(e.target.value)} min={todayKey()} />
            </div>
            <button type="submit" className="btn-primary w-full" disabled={subject.trim().length < 2 || !date}>
              <CalendarPlus className="h-4 w-4" /> Save exam
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}

function MiniCalendar() {
  const { activity } = useStore()
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const first = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const offset = (first.getDay() + 6) % 7 // Monday-first
  const activeDays = useMemo(() => {
    const map: Record<string, number> = {}
    for (const a of activity) {
      const k = todayKey(new Date(a.ts))
      map[k] = (map[k] ?? 0) + 1
    }
    return map
  }, [activity])

  const cells: (number | null)[] = [...Array<null>(offset).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]
  return (
    <motion.div variants={item} className="glass rounded-2xl p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-base font-semibold">Study calendar</h3>
        <span className="text-xs font-medium text-muted-foreground">
          {now.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
        </span>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold uppercase text-muted-foreground/70">
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
          <span key={i} className="py-1">{d}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (day === null) return <span key={i} />
          const key = todayKey(new Date(year, month, day))
          const count = activeDays[key] ?? 0
          const isToday = key === todayKey()
          return (
            <div
              key={i}
              title={count ? `${count} activities` : 'No activity'}
              className={cn(
                'grid aspect-square place-items-center rounded-lg text-xs font-medium transition-colors',
                count > 2 ? 'bg-gradient-to-br from-brand to-aqua text-white' : count > 0 ? 'bg-brand/25 text-brand-soft' : 'text-muted-foreground/70',
                isToday && 'ring-2 ring-aqua ring-offset-1 ring-offset-background',
              )}
            >
              {day}
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}

function PinnedTools() {
  const { pins } = useStore()
  const pinned = pins.map((id) => TOOL_MAP[id]).filter(Boolean)
  return (
    <motion.div variants={item} className="glass rounded-2xl p-5 sm:p-6 lg:col-span-2">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-base font-semibold">
          <Pin className="mr-1.5 inline h-4 w-4 text-brand-soft" /> Pinned tools
        </h3>
        <Link to="/app/tools" className="inline-flex items-center gap-1 text-xs font-medium text-aqua-soft hover:underline">
          Browse all <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
      {pinned.length === 0 ? (
        <EmptyState
          icon="Pin"
          title="No pinned tools yet"
          body="Pin your favorite tools from the library for one-click access here."
          action={<Link to="/app/tools" className="btn-primary px-4 py-2 text-xs">Open library</Link>}
        />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {pinned.map((t) => (
            <Link
              key={t!.id}
              to={`/app/tools/${t!.id}`}
              className="group flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.03] p-3.5 transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-glow-sm"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand/15 text-brand-soft transition-colors group-hover:bg-brand group-hover:text-white">
                <ToolIcon name={t!.icon} className="h-4 w-4" />
              </span>
              <span className="truncate text-sm font-medium">{t!.name}</span>
            </Link>
          ))}
        </div>
      )}
    </motion.div>
  )
}

function ActivityFeed() {
  const { activity } = useStore()
  const recent = activity.slice(0, 8)
  const tone: Record<string, string> = {
    chat: 'bg-brand/15 text-brand-soft',
    tool: 'bg-aqua/15 text-aqua-soft',
    quiz: 'bg-emerald-500/15 text-emerald-400',
    flashcards: 'bg-violet-500/15 text-violet-400',
    pomodoro: 'bg-amber-500/15 text-amber-400',
    task: 'bg-emerald-500/15 text-emerald-400',
    note: 'bg-sky-500/15 text-sky-400',
    habit: 'bg-pink-500/15 text-pink-400',
    auth: 'bg-white/[0.08] text-muted-foreground',
    system: 'bg-white/[0.08] text-muted-foreground',
  }
  return (
    <motion.div variants={item} className="glass rounded-2xl p-5 sm:p-6">
      <h3 className="mb-4 font-display text-base font-semibold">Recent activity</h3>
      {recent.length === 0 ? (
        <p className="rounded-xl border border-dashed border-white/10 px-4 py-6 text-center text-sm text-muted-foreground">
          Your learning timeline starts here. Try the AI Chat or any tool.
        </p>
      ) : (
        <ul className="space-y-1">
          {recent.map((a) => (
            <li key={a.id} className="flex items-center gap-3 rounded-xl px-2 py-2">
              <span className={cn('grid h-8 w-8 shrink-0 place-items-center rounded-lg', tone[a.type] ?? tone.system)}>
                <Sparkles className="h-3.5 w-3.5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm">{a.label}</p>
                <p className="text-[11px] text-muted-foreground">{timeAgo(a.ts)}</p>
              </div>
              <span className="text-xs font-semibold text-aqua-soft">+{a.xp} XP</span>
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  )
}

function AchievementsPreview() {
  const { unlocked } = useStore()
  const unlockedCount = Object.keys(unlocked).length
  const next = ACHIEVEMENTS.filter((a) => !unlocked[a.id]).slice(0, 3)
  const latest = ACHIEVEMENTS.filter((a) => unlocked[a.id]).sort((a, b) => (unlocked[b.id] ?? 0) - (unlocked[a.id] ?? 0)).slice(0, 3)
  return (
    <motion.div variants={item} className="glass rounded-2xl p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-base font-semibold">
          <Trophy className="mr-1.5 inline h-4 w-4 text-amber-400" /> Achievements
        </h3>
        <Link to="/app/profile" className="text-xs font-medium text-aqua-soft hover:underline">
          {unlockedCount}/{ACHIEVEMENTS.length} unlocked
        </Link>
      </div>
      <ul className="space-y-2.5">
        {[...latest, ...next].slice(0, 4).map((a) => {
          const isUnlocked = Boolean(unlocked[a.id])
          return (
            <li key={a.id} className={cn('flex items-center gap-3 rounded-xl px-3 py-2.5', isUnlocked ? 'bg-gradient-to-r from-brand/15 to-transparent' : 'opacity-55')}>
              <span className={cn('grid h-9 w-9 shrink-0 place-items-center rounded-lg', isUnlocked ? 'bg-gradient-to-br from-brand to-aqua text-white' : 'bg-white/[0.06] text-muted-foreground')}>
                <ToolIcon name={a.icon} className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{a.title}</p>
                <p className="truncate text-xs text-muted-foreground">{a.description}</p>
              </div>
              {isUnlocked && <Award className="ml-auto h-4 w-4 shrink-0 text-amber-400" />}
            </li>
          )
        })}
      </ul>
    </motion.div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const { xp, streak, level, levelProgress, levelSpan, stats, unlocked } = useStore()

  useEffect(() => {
    document.title = 'Dashboard · StuAr AI'
  }, [])

  const todayDone = stats.tasksDone
  const firstName = user?.name ?? 'Learner'

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">
      {/* Welcome banner */}
      <motion.div variants={item} className="glass-strong relative overflow-hidden rounded-2xl p-6 sm:p-8">
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-brand/25 blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-28 right-32 h-56 w-56 rounded-full bg-aqua/20 blur-3xl" aria-hidden="true" />
        <div className="relative flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-aqua-soft">
              {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
            <h1 className="mt-2 font-display text-2xl font-bold sm:text-3xl">{greeting(firstName)} 👋</h1>
            <p className="mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
              {streak > 0
                ? `You're on a ${streak}-day streak — keep the flame alive. What will you master today?`
                : 'A fresh start. One session today begins your streak.'}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link to="/app/chat" className="btn-primary" onClick={() => undefined}>
                <Sparkles className="h-4 w-4" /> Ask the AI tutor
              </Link>
              <Link to="/app/tools/pomodoro" className="btn-ghost">
                Start a focus session
              </Link>
            </div>
          </div>
          <div className="glass-subtle hidden rounded-2xl p-5 sm:block">
            <div className="flex items-center gap-3">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-brand to-aqua font-display text-xl font-bold text-white shadow-glow-sm">
                {level}
              </div>
              <div>
                <p className="font-display text-sm font-semibold">Level {level}</p>
                <p className="text-xs text-muted-foreground">{levelProgress} / {levelSpan} XP to next</p>
              </div>
            </div>
            <div className="mt-3 h-2 w-44 overflow-hidden rounded-full bg-white/[0.08]">
              <div className="h-full rounded-full bg-gradient-to-r from-brand to-aqua transition-all duration-700" style={{ width: `${Math.min(100, (levelProgress / levelSpan) * 100)}%` }} />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={<Flame className="h-5 w-5 text-orange-400" />}
          tone="bg-orange-500/15"
          label="Day streak"
          value={String(streak)}
          sub={streak >= 7 ? 'Unstoppable!' : streak >= 3 ? 'Building momentum' : 'Show up today'}
        />
        <StatCard
          icon={<Zap className="h-5 w-5 text-aqua-soft" />}
          tone="bg-aqua/15"
          label="Total XP"
          value={xp.toLocaleString()}
          sub={`Level ${level} scholar`}
        />
        <StatCard
          icon={<Trophy className="h-5 w-5 text-amber-400" />}
          tone="bg-amber-500/15"
          label="Achievements"
          value={`${Object.keys(unlocked).length}/${ACHIEVEMENTS.length}`}
          sub="Milestones unlocked"
        />
        <StatCard
          icon={<CheckCircle2 className="h-5 w-5 text-emerald-400" />}
          tone="bg-emerald-500/15"
          label="Tasks completed"
          value={String(todayDone)}
          sub="Lifetime check-offs"
        />
      </div>

      {/* Main grid */}
      <div className="grid gap-4 lg:grid-cols-2">
        <WeeklyChart />
        <GoalsCard />
        <PinnedTools />
        <MiniCalendar />
        <ExamsCard />
        <ActivityFeed />
        <AchievementsPreview />
      </div>
    </motion.div>
  )
}
