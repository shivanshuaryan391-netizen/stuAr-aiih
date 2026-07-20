import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'
import { useStore } from '@/services/store'
import { PageHeader } from '@/components/common/EmptyState'
import { todayKey } from '@/lib/storage'
import { daysUntil } from '@/lib/format'
import { cn } from '@/lib/utils'

interface DayEvents {
  exams: string[]
  tasks: string[]
  activity: number
}

export default function CalendarPage() {
  const { exams, tasks, activity } = useStore()
  const [cursor, setCursor] = useState(() => {
    const d = new Date()
    return { year: d.getFullYear(), month: d.getMonth() }
  })
  const [selected, setSelected] = useState<string>(todayKey())

  useEffect(() => {
    document.title = 'Calendar · StuAr AI'
  }, [])

  const { year, month } = cursor
  const first = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const offset = (first.getDay() + 6) % 7
  const cells: (number | null)[] = [...Array<null>(offset).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]

  const eventsByDay = useMemo(() => {
    const map: Record<string, DayEvents> = {}
    const ensure = (k: string): DayEvents => (map[k] ??= { exams: [], tasks: [], activity: 0 })
    for (const e of exams) ensure(e.date).exams.push(e.subject)
    for (const t of tasks) if (t.due) ensure(t.due).tasks.push(t.title)
    for (const a of activity) {
      const k = todayKey(new Date(a.ts))
      ensure(k).activity++
    }
    return map
  }, [exams, tasks, activity])

  const move = (delta: number) => {
    setCursor((c) => {
      const d = new Date(c.year, c.month + delta, 1)
      return { year: d.getFullYear(), month: d.getMonth() }
    })
  }

  const selectedEvents = eventsByDay[selected]

  return (
    <div>
      <Link to="/app/tools" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Tools Library
      </Link>
      <PageHeader title="Calendar" subtitle="Exams, task deadlines and study activity — one view." icon="Calendar" />

      <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
        <div className="glass rounded-2xl p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">
              {new Date(year, month, 1).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
            </h2>
            <div className="flex gap-1.5">
              <button type="button" onClick={() => move(-1)} aria-label="Previous month" className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-muted-foreground transition-colors hover:text-foreground">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  const d = new Date()
                  setCursor({ year: d.getFullYear(), month: d.getMonth() })
                  setSelected(todayKey())
                }}
                className="rounded-xl border border-white/10 bg-white/[0.04] px-3 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Today
              </button>
              <button type="button" onClick={() => move(1)} aria-label="Next month" className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-muted-foreground transition-colors hover:text-foreground">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1.5 text-center text-[11px] font-semibold uppercase tracking-wide text-muted-foreground/70">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
              <span key={d} className="py-1.5">{d}</span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {cells.map((day, i) => {
              if (day === null) return <span key={i} />
              const key = todayKey(new Date(year, month, day))
              const ev = eventsByDay[key]
              const isToday = key === todayKey()
              const isSelected = key === selected
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelected(key)}
                  className={cn(
                    'relative flex min-h-14 flex-col items-center rounded-xl border px-1 py-2 text-sm transition-all sm:min-h-16',
                    isSelected ? 'border-brand/60 bg-brand/15' : 'border-transparent bg-white/[0.02] hover:bg-white/[0.06]',
                    isToday && 'ring-1 ring-aqua/60',
                  )}
                >
                  <span className={cn('font-medium', isToday ? 'text-aqua-soft' : 'text-foreground/85')}>{day}</span>
                  <span className="mt-auto flex gap-1">
                    {ev && ev.exams.length > 0 && <span className="h-1.5 w-1.5 rounded-full bg-red-400" title="Exam" />}
                    {ev && ev.tasks.length > 0 && <span className="h-1.5 w-1.5 rounded-full bg-brand" title="Task due" />}
                    {ev && ev.activity > 0 && <span className="h-1.5 w-1.5 rounded-full bg-aqua" title="Study activity" />}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="mt-5 flex flex-wrap gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-red-400" /> Exam</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-brand" /> Task due</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-aqua" /> Study activity</span>
          </div>
        </div>

        {/* Day detail */}
        <div className="glass h-fit rounded-2xl p-5">
          <h3 className="font-display text-sm font-semibold">
            {new Date(selected + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
          </h3>
          <div className="mt-4 space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-red-400/80">Exams</p>
              {selectedEvents?.exams.length ? (
                <ul className="mt-1.5 space-y-1.5">
                  {selectedEvents.exams.map((s, i) => {
                    const d = daysUntil(selected)
                    return (
                      <li key={i} className="rounded-lg bg-red-500/10 px-3 py-2 text-sm">
                        {s} <span className="text-xs text-muted-foreground">· {d === 0 ? 'today' : `in ${d}d`}</span>
                      </li>
                    )
                  })}
                </ul>
              ) : (
                <p className="mt-1 text-sm text-muted-foreground/70">None</p>
              )}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-soft/80">Tasks due</p>
              {selectedEvents?.tasks.length ? (
                <ul className="mt-1.5 space-y-1.5">
                  {selectedEvents.tasks.map((t, i) => (
                    <li key={i} className="rounded-lg bg-brand/10 px-3 py-2 text-sm">{t}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-1 text-sm text-muted-foreground/70">None</p>
              )}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-aqua-soft/80">Activity</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {selectedEvents?.activity ? `${selectedEvents.activity} learning ${selectedEvents.activity === 1 ? 'action' : 'actions'} logged` : 'No activity logged'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
