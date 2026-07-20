import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Coffee, Flame, Pause, Play, RotateCcw, Settings2, Zap } from 'lucide-react'
import { toast } from 'sonner'
import { useStore } from '@/services/store'
import { PageHeader } from '@/components/common/EmptyState'
import { XP } from '@/config/achievements'
import { cn } from '@/lib/utils'

type Mode = 'focus' | 'short' | 'long'

const MODE_META: Record<Mode, { label: string; color: string; ring: string }> = {
  focus: { label: 'Focus', color: 'text-brand-soft', ring: '#6366F1' },
  short: { label: 'Short break', color: 'text-aqua-soft', ring: '#06B6D4' },
  long: { label: 'Long break', color: 'text-emerald-400', ring: '#10B981' },
}

export default function PomodoroPage() {
  const { logActivity, stats, settings } = useStore()
  const [durations, setDurations] = useState<Record<Mode, number>>({ focus: 25, short: 5, long: 15 })
  const [mode, setMode] = useState<Mode>('focus')
  const [secondsLeft, setSecondsLeft] = useState(25 * 60)
  const [running, setRunning] = useState(false)
  const [cycles, setCycles] = useState(0)
  const [showSettings, setShowSettings] = useState(false)
  const intervalRef = useRef<number | null>(null)

  useEffect(() => {
    document.title = 'Pomodoro Timer · StuAr AI'
  }, [])

  const total = durations[mode] * 60
  const progress = 1 - secondsLeft / total

  const switchMode = useCallback((next: Mode) => {
    setMode(next)
    setSecondsLeft((prev) => {
      void prev
      return durations[next] * 60
    })
    setRunning(false)
  }, [durations])

  const completeSession = useCallback(() => {
    if (mode === 'focus') {
      const newCycles = cycles + 1
      setCycles(newCycles)
      logActivity('pomodoro', `Pomodoro: ${durations.focus} min deep work`, XP.pomodoro)
      toast.success('Focus session complete!', { description: `+${XP.pomodoro} XP · time for a break.` })
      switchMode(newCycles % 4 === 0 ? 'long' : 'short')
    } else {
      toast.info('Break over', { description: 'Back to deep work.' })
      switchMode('focus')
    }
  }, [mode, cycles, durations.focus, logActivity, switchMode])

  useEffect(() => {
    if (!running) {
      if (intervalRef.current) window.clearInterval(intervalRef.current)
      return
    }
    intervalRef.current = window.setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          window.clearInterval(intervalRef.current!)
          completeSession()
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current)
    }
  }, [running, completeSession])

  const reset = () => {
    setRunning(false)
    setSecondsLeft(durations[mode] * 60)
  }

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0')
  const ss = String(secondsLeft % 60).padStart(2, '0')
  const R = 120
  const CIRC = 2 * Math.PI * R

  return (
    <div>
      <Link to="/app/tools" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Tools Library
      </Link>
      <PageHeader title="Pomodoro Timer" subtitle="Deep focus in cycles — every completed session earns XP." icon="Timer">
        <button type="button" className="btn-ghost px-4 py-2 text-xs" onClick={() => setShowSettings((s) => !s)}>
          <Settings2 className="h-3.5 w-3.5" /> Durations
        </button>
      </PageHeader>

      {showSettings && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="glass mb-6 rounded-2xl p-5">
          <div className="grid gap-4 sm:grid-cols-3">
            {(['focus', 'short', 'long'] as Mode[]).map((m) => (
              <div key={m}>
                <label htmlFor={`dur-${m}`} className="mb-1.5 block text-sm font-medium">{MODE_META[m].label} (min)</label>
                <input
                  id={`dur-${m}`}
                  type="number"
                  min={1}
                  max={m === 'focus' ? 90 : 30}
                  className="input-field"
                  value={durations[m]}
                  onChange={(e) => {
                    const v = Math.max(1, Math.min(m === 'focus' ? 90 : 30, Number(e.target.value) || 1))
                    setDurations((d) => ({ ...d, [m]: v }))
                    if (m === mode && !running) setSecondsLeft(v * 60)
                  }}
                />
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">After 4 focus cycles you get a long break. XP is awarded per completed focus session.</p>
        </motion.div>
      )}

      <div className="mx-auto max-w-2xl">
        <div className="glass rounded-3xl p-8 text-center sm:p-10">
          {/* Mode tabs */}
          <div className="mb-8 flex justify-center gap-2">
            {(['focus', 'short', 'long'] as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => switchMode(m)}
                className={cn(
                  'rounded-full px-4 py-2 text-xs font-semibold transition-all',
                  mode === m ? 'bg-gradient-to-r from-brand-deep to-brand text-white shadow-glow-sm' : 'border border-white/10 bg-white/[0.04] text-muted-foreground hover:text-foreground',
                )}
              >
                {MODE_META[m].label}
              </button>
            ))}
          </div>

          {/* Ring */}
          <div className="relative mx-auto h-64 w-64 sm:h-72 sm:w-72">
            <svg viewBox="0 0 260 260" className="h-full w-full -rotate-90">
              <circle cx="130" cy="130" r={R} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="10" />
              <circle
                cx="130"
                cy="130"
                r={R}
                fill="none"
                stroke={MODE_META[mode].ring}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={CIRC}
                strokeDashoffset={CIRC * (1 - progress)}
                style={{ transition: 'stroke-dashoffset 0.6s ease, stroke 0.4s ease', filter: `drop-shadow(0 0 12px ${MODE_META[mode].ring}66)` }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className={cn('font-display text-xs font-semibold uppercase tracking-widest', MODE_META[mode].color)}>
                {MODE_META[mode].label}
              </p>
              <p className="mt-1 font-display text-6xl font-bold tabular-nums tracking-tight sm:text-7xl">
                {mm}:{ss}
              </p>
              <p className="mt-1.5 text-xs text-muted-foreground">Cycle {cycles + 1} · {cycles % 4}/4 to long break</p>
            </div>
          </div>

          {/* Controls */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <button type="button" onClick={reset} aria-label="Reset timer" className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/[0.05] text-muted-foreground transition-all hover:text-foreground">
              <RotateCcw className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => setRunning((r) => !r)}
              aria-label={running ? 'Pause' : 'Start'}
              className={cn('grid h-16 w-16 place-items-center rounded-2xl text-white shadow-glow transition-all hover:scale-105 active:scale-95', running ? 'bg-gradient-to-br from-amber-500 to-orange-500' : 'bg-gradient-to-br from-brand-deep to-aqua', !running && 'animate-pulse-ring')}
            >
              {running ? <Pause className="h-7 w-7" /> : <Play className="ml-1 h-7 w-7" />}
            </button>
            <button type="button" onClick={completeSession} aria-label="Skip to next phase" className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/[0.05] text-muted-foreground transition-all hover:text-foreground">
              <Coffee className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-4">
          <div className="glass rounded-2xl p-4 text-center">
            <Flame className="mx-auto h-5 w-5 text-orange-400" />
            <p className="mt-2 font-display text-xl font-bold">{cycles}</p>
            <p className="text-[11px] text-muted-foreground">Sessions today</p>
          </div>
          <div className="glass rounded-2xl p-4 text-center">
            <Zap className="mx-auto h-5 w-5 text-aqua-soft" />
            <p className="mt-2 font-display text-xl font-bold">{stats.pomodoros * XP.pomodoro}</p>
            <p className="text-[11px] text-muted-foreground">Focus XP earned</p>
          </div>
          <div className="glass rounded-2xl p-4 text-center">
            <Settings2 className="mx-auto h-5 w-5 text-brand-soft" />
            <p className="mt-2 font-display text-xl font-bold">{durations.focus}m</p>
            <p className="text-[11px] text-muted-foreground">Focus length</p>
          </div>
        </div>
        {settings.soundEnabled === false && (
          <p className="mt-4 text-center text-xs text-muted-foreground/70">Sounds are disabled in Settings — you&apos;ll still get visual notifications.</p>
        )}
      </div>
    </div>
  )
}
