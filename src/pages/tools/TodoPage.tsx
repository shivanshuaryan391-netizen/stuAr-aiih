import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, CheckCircle2, Circle, Flag, Plus, Trash2 } from 'lucide-react'
import { useStore } from '@/services/store'
import { PageHeader } from '@/components/common/EmptyState'
import type { Task } from '@/types'
import { formatDate } from '@/lib/format'
import { todayKey } from '@/lib/storage'
import { cn } from '@/lib/utils'

type Filter = 'all' | 'open' | 'done'

export default function TodoPage() {
  const { tasks, addTask, toggleTask, deleteTask } = useStore()
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState<Task['priority']>('medium')
  const [due, setDue] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [error, setError] = useState('')

  useEffect(() => {
    document.title = 'Todo · StuAr AI'
  }, [])

  const filtered = useMemo(() => {
    if (filter === 'open') return tasks.filter((t) => !t.done)
    if (filter === 'done') return tasks.filter((t) => t.done)
    return tasks
  }, [tasks, filter])

  const openCount = tasks.filter((t) => !t.done).length

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim().length < 2) {
      setError('Give the task a real title (2+ characters).')
      return
    }
    setError('')
    addTask(title.trim(), priority, due || undefined)
    setTitle('')
    setDue('')
    setPriority('medium')
  }

  return (
    <div>
      <Link to="/app/tools" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Tools Library
      </Link>
      <PageHeader title="Todo" subtitle={`${openCount} open · ${tasks.length - openCount} completed. Every check-off earns XP.`} icon="ListTodo" />

      <div className="mx-auto max-w-2xl">
        <form onSubmit={submit} className="glass mb-5 rounded-2xl p-4 sm:p-5" noValidate>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              value={title}
              onChange={(e) => { setTitle(e.target.value); setError('') }}
              placeholder="What needs to get done?"
              aria-label="Task title"
              className="input-field flex-1"
            />
            <button type="submit" className="btn-primary shrink-0">
              <Plus className="h-4 w-4" /> Add task
            </button>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <div className="flex gap-1.5" role="radiogroup" aria-label="Priority">
              {(['low', 'medium', 'high'] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={cn(
                    'rounded-full px-3 py-1.5 text-xs font-semibold capitalize transition-all',
                    priority === p
                      ? p === 'high' ? 'bg-red-500/20 text-red-300 ring-1 ring-red-500/50' : p === 'medium' ? 'bg-brand/20 text-brand-soft ring-1 ring-brand/50' : 'bg-white/10 text-foreground ring-1 ring-white/25'
                      : 'bg-white/[0.04] text-muted-foreground hover:text-foreground',
                  )}
                >
                  <Flag className="mr-1 inline h-3 w-3" />{p}
                </button>
              ))}
            </div>
            <input type="date" value={due} min={todayKey()} onChange={(e) => setDue(e.target.value)} aria-label="Due date" className="input-field w-auto py-1.5 text-xs" />
          </div>
          {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
        </form>

        <div className="mb-4 flex gap-2">
          {(['all', 'open', 'done'] as Filter[]).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={cn(
                'rounded-full px-4 py-1.5 text-xs font-semibold capitalize transition-all',
                filter === f ? 'bg-gradient-to-r from-brand-deep to-brand text-white shadow-glow-sm' : 'border border-white/10 bg-white/[0.04] text-muted-foreground hover:text-foreground',
              )}
            >
              {f}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="glass rounded-2xl p-10 text-center">
            <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-400/60" />
            <p className="mt-3 font-display text-sm font-semibold">
              {filter === 'done' ? 'Nothing completed yet' : 'All clear!'}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {filter === 'done' ? 'Check off tasks to build your momentum.' : 'Add a task above and start checking things off.'}
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            <AnimatePresence initial={false}>
              {filtered.map((t) => (
                <motion.li
                  key={t.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.22 }}
                  className={cn('glass-subtle group flex items-center gap-3 rounded-xl px-4 py-3', t.done && 'opacity-55')}
                >
                  <button type="button" onClick={() => toggleTask(t.id)} aria-label={t.done ? `Reopen ${t.title}` : `Complete ${t.title}`} className="shrink-0 text-muted-foreground transition-colors hover:text-emerald-400">
                    {t.done ? <CheckCircle2 className="h-5 w-5 text-emerald-400" /> : <Circle className="h-5 w-5" />}
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className={cn('truncate text-sm font-medium', t.done && 'line-through')}>{t.title}</p>
                    {t.due && (
                      <p className={cn('text-xs', !t.done && t.due <= todayKey() ? 'text-red-400' : 'text-muted-foreground')}>
                        Due {formatDate(t.due)}{!t.done && t.due < todayKey() ? ' · overdue' : !t.done && t.due === todayKey() ? ' · today' : ''}
                      </p>
                    )}
                  </div>
                  <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase', t.priority === 'high' ? 'bg-red-500/15 text-red-400' : t.priority === 'low' ? 'bg-white/[0.07] text-muted-foreground' : 'bg-brand/15 text-brand-soft')}>
                    {t.priority}
                  </span>
                  <button type="button" onClick={() => deleteTask(t.id)} aria-label={`Delete ${t.title}`} className="rounded-lg p-1.5 text-muted-foreground opacity-0 transition-opacity hover:text-red-400 group-hover:opacity-100">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
        <p className="mt-4 text-center text-xs text-muted-foreground/70">{todayKey()} · tasks feed your dashboard goals automatically</p>
      </div>
    </div>
  )
}
