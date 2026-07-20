import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Flame, Plus, Trash2 } from 'lucide-react'
import { useStore } from '@/services/store'
import { PageHeader } from '@/components/common/EmptyState'
import { AVATAR_COLORS } from '@/lib/format'
import { todayKey } from '@/lib/storage'
import { cn } from '@/lib/utils'

function last7(): { key: string; label: string }[] {
  const out: { key: string; label: string }[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000)
    out.push({ key: todayKey(d), label: d.toLocaleDateString(undefined, { weekday: 'narrow' }) })
  }
  return out
}

function habitStreak(days: Record<string, boolean>): number {
  let streak = 0
  for (let i = 0; i < 365; i++) {
    const key = todayKey(new Date(Date.now() - i * 86400000))
    if (days[key]) streak++
    else if (i === 0) continue
    else break
  }
  return streak
}

export default function HabitsPage() {
  const { habits, addHabit, toggleHabitDay, deleteHabit } = useStore()
  const [name, setName] = useState('')
  const [color, setColor] = useState(AVATAR_COLORS[0]!)
  const [error, setError] = useState('')
  const week = useMemo(last7, [])
  const today = todayKey()

  useEffect(() => {
    document.title = 'Habit Tracker · StuAr AI'
  }, [])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim().length < 2) {
      setError('Name your habit (2+ characters).')
      return
    }
    if (habits.length >= 12) {
      setError('Keep it focused — 12 habits max.')
      return
    }
    addHabit(name.trim(), color)
    setName('')
    setError('')
  }

  return (
    <div>
      <Link to="/app/tools" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Tools Library
      </Link>
      <PageHeader title="Habit Tracker" subtitle="Small daily wins, compounding. Check in to earn XP and build streaks." icon="Repeat" />

      <form onSubmit={submit} className="glass mb-6 rounded-2xl p-4 sm:p-5" noValidate>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input value={name} onChange={(e) => { setName(e.target.value); setError('') }} placeholder="e.g. Read 20 pages, Review flashcards…" aria-label="Habit name" className="input-field flex-1" />
          <div className="flex items-center gap-2" role="radiogroup" aria-label="Habit color">
            {AVATAR_COLORS.slice(0, 6).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                aria-label={`Color ${c}`}
                aria-pressed={color === c}
                className={cn('h-7 w-7 rounded-full transition-transform', color === c ? 'scale-110 ring-2 ring-white/70 ring-offset-2 ring-offset-background' : 'opacity-60 hover:opacity-100')}
                style={{ background: c }}
              />
            ))}
          </div>
          <button type="submit" className="btn-primary shrink-0">
            <Plus className="h-4 w-4" /> Add habit
          </button>
        </div>
        {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
      </form>

      {habits.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center">
          <Flame className="mx-auto h-8 w-8 text-orange-400/70" />
          <p className="mt-3 font-display text-sm font-semibold">No habits yet</p>
          <p className="mt-1 text-sm text-muted-foreground">Add one above — start embarrassingly small.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="glass hidden grid-cols-[1fr_repeat(7,44px)_64px_40px] items-center gap-1 rounded-2xl px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground sm:grid">
            <span>Habit</span>
            {week.map((d) => (
              <span key={d.key} className={cn('text-center', d.key === today && 'text-aqua-soft')}>{d.label}</span>
            ))}
            <span className="text-center">Streak</span>
            <span />
          </div>
          {habits.map((h, i) => {
            const streak = habitStreak(h.days)
            return (
              <motion.div
                key={h.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="glass grid grid-cols-1 gap-3 rounded-2xl px-5 py-4 sm:grid-cols-[1fr_repeat(7,44px)_64px_40px] sm:items-center sm:gap-1"
              >
                <div className="flex items-center gap-3">
                  <span className="h-8 w-1.5 rounded-full" style={{ background: h.color }} />
                  <p className="text-sm font-semibold">{h.name}</p>
                </div>
                <div className="col-span-1 grid grid-cols-7 gap-1 sm:contents">
                  {week.map((d) => {
                    const checked = Boolean(h.days[d.key])
                    const isFuture = d.key > today
                    return (
                      <button
                        key={d.key}
                        type="button"
                        disabled={isFuture}
                        onClick={() => toggleHabitDay(h.id, d.key)}
                        aria-label={`${h.name} on ${d.key}: ${checked ? 'done' : 'not done'}`}
                        className={cn(
                          'mx-auto grid h-9 w-9 place-items-center rounded-xl border text-xs font-bold transition-all',
                          checked
                            ? 'border-transparent text-white shadow-glow-sm'
                            : 'border-white/10 bg-white/[0.03] text-transparent hover:border-white/25',
                          d.key === today && !checked && 'border-aqua/50',
                          isFuture && 'opacity-30',
                        )}
                        style={checked ? { background: h.color } : undefined}
                      >
                        ✓
                      </button>
                    )
                  })}
                </div>
                <div className="flex items-center gap-4 sm:contents">
                  <span className={cn('flex items-center justify-center gap-1 font-display text-sm font-bold', streak >= 3 ? 'text-orange-400' : 'text-muted-foreground')}>
                    <Flame className="h-4 w-4" /> {streak}
                  </span>
                  <button type="button" onClick={() => deleteHabit(h.id)} aria-label={`Delete ${h.name}`} className="justify-self-end rounded-lg p-2 text-muted-foreground transition-colors hover:text-red-400">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
