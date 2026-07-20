import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Award, BadgeCheck, CalendarDays, Flame, GraduationCap, Mail, Save, Sparkles, Trophy, Zap } from 'lucide-react'
import { toast } from 'sonner'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useAuth } from '@/services/auth'
import { useStore } from '@/services/store'
import { ACHIEVEMENTS } from '@/config/achievements'
import { LEARNER_TYPES } from '@/config/site'
import { initials } from '@/lib/format'
import { PageHeader } from '@/components/common/EmptyState'
import { ToolIcon } from '@/components/common/ToolIcon'
import { cn } from '@/lib/utils'

const CERTIFICATES = [
  { level: 3, title: 'Apprentice Scholar', body: 'For reaching Level 3 and proving consistent daily learning.' },
  { level: 5, title: 'Dedicated Scholar', body: 'For reaching Level 5 — hundreds of focused learning actions.' },
  { level: 10, title: 'Master Scholar', body: 'For reaching Level 10, a milestone few learners achieve.' },
  { level: 20, title: 'Grand Sage', body: 'For reaching Level 20 — legendary commitment to growth.' },
]

export default function Profile() {
  const { user, refreshUser } = useAuth()
  const { profile, updateProfile, xp, streak, level, levelProgress, levelSpan, unlocked, weekly, stats, activity } = useStore()
  const [name, setName] = useState(user?.name ?? '')
  const [form, setForm] = useState(profile)

  useEffect(() => {
    document.title = 'Profile · StuAr AI'
  }, [])

  useEffect(() => setForm(profile), [profile])
  useEffect(() => setName(user?.name ?? ''), [user?.name])

  const memberSince = user ? new Date(user.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) : ''
  const unlockedCount = Object.keys(unlocked).length

  const categoryBreakdown = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const a of activity) counts[a.type] = (counts[a.type] ?? 0) + 1
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5)
  }, [activity])

  const save = () => {
    if (name.trim().length < 2) {
      toast.error('Name needs at least 2 characters')
      return
    }
    refreshUser({ name: name.trim() })
    updateProfile(form)
    toast.success('Profile saved')
  }

  if (!user) return null

  return (
    <div className="space-y-5">
      <PageHeader title="Profile" subtitle="Your identity, progress and achievements." icon="GraduationCap" />

      {/* Identity card */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-strong relative overflow-hidden rounded-2xl p-6 sm:p-8">
        <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-brand/25 blur-3xl" aria-hidden="true" />
        <div className="relative flex flex-wrap items-center gap-6">
          <div
            className="grid h-20 w-20 place-items-center rounded-2xl font-display text-2xl font-bold text-white shadow-glow"
            style={{ background: `linear-gradient(135deg, ${user.avatarColor}, ${user.avatarColor}88)` }}
          >
            {initials(user.name)}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-2xl font-bold">{user.name}</h2>
            <div className="mt-1.5 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> {user.email}</span>
              <span className="flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" /> Member since {memberSince}</span>
              {profile.learnerType && <span className="flex items-center gap-1.5"><GraduationCap className="h-3.5 w-3.5" /> {profile.learnerType}</span>}
            </div>
          </div>
          <div className="flex gap-6">
            <div className="text-center">
              <p className="font-display text-2xl font-bold text-gradient">{level}</p>
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Level</p>
            </div>
            <div className="text-center">
              <p className="font-display text-2xl font-bold text-gradient">{xp.toLocaleString()}</p>
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">XP</p>
            </div>
            <div className="text-center">
              <p className="font-display text-2xl font-bold text-gradient">{streak}</p>
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Streak</p>
            </div>
          </div>
        </div>
        <div className="relative mt-5">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Level {level}</span>
            <span>{levelProgress} / {levelSpan} XP</span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/[0.08]">
            <div className="h-full rounded-full bg-gradient-to-r from-brand to-aqua transition-all duration-700" style={{ width: `${Math.min(100, (levelProgress / levelSpan) * 100)}%` }} />
          </div>
        </div>
      </motion.div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Personal details */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass rounded-2xl p-6">
          <h3 className="mb-4 font-display text-base font-semibold">Personal details</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="pf-name" className="mb-1.5 block text-sm font-medium">Display name</label>
              <input id="pf-name" className="input-field" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label htmlFor="pf-type" className="mb-1.5 block text-sm font-medium">I am a…</label>
              <select id="pf-type" className="input-field" value={form.learnerType} onChange={(e) => setForm({ ...form, learnerType: e.target.value })}>
                {LEARNER_TYPES.map((t) => (
                  <option key={t} value={t} className="bg-[#0a0f24]">{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="pf-inst" className="mb-1.5 block text-sm font-medium">School / institution</label>
              <input id="pf-inst" className="input-field" placeholder="e.g. Delhi Public School" value={form.institution} onChange={(e) => setForm({ ...form, institution: e.target.value })} />
            </div>
            <div>
              <label htmlFor="pf-goal" className="mb-1.5 block text-sm font-medium">Current goal</label>
              <input id="pf-goal" className="input-field" placeholder="e.g. Crack JEE Advanced 2027" value={form.goal} onChange={(e) => setForm({ ...form, goal: e.target.value })} />
            </div>
            <div>
              <label htmlFor="pf-bio" className="mb-1.5 block text-sm font-medium">Bio</label>
              <textarea id="pf-bio" rows={3} className="input-field resize-none" placeholder="A line about your learning journey…" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
            </div>
            <button type="button" className="btn-primary" onClick={save}>
              <Save className="h-4 w-4" /> Save changes
            </button>
          </div>
        </motion.div>

        {/* Analytics */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-2xl p-6">
          <h3 className="mb-1 font-display text-base font-semibold">Study analytics</h3>
          <p className="mb-4 text-xs text-muted-foreground">XP trend this week</p>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weekly} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                <defs>
                  <linearGradient id="xpFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366F1" stopOpacity={0.55} />
                    <stop offset="100%" stopColor="#06B6D4" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fill: 'currentColor', fontSize: 11, opacity: 0.55 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'currentColor', fontSize: 11, opacity: 0.55 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ background: 'rgba(10,15,36,0.92)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12, color: '#fff' }}
                  labelStyle={{ color: '#fff' }}
                  formatter={(v) => [`${v} XP`, 'Earned']}
                />
                <Area type="monotone" dataKey="xp" stroke="#818CF8" strokeWidth={2.5} fill="url(#xpFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
            <div className="glass-subtle rounded-xl p-3.5">
              <p className="text-xs text-muted-foreground">AI chats</p>
              <p className="mt-0.5 font-display text-lg font-bold">{stats.chats}</p>
            </div>
            <div className="glass-subtle rounded-xl p-3.5">
              <p className="text-xs text-muted-foreground">Tool runs</p>
              <p className="mt-0.5 font-display text-lg font-bold">{stats.toolRuns}</p>
            </div>
            <div className="glass-subtle rounded-xl p-3.5">
              <p className="text-xs text-muted-foreground">Quizzes</p>
              <p className="mt-0.5 font-display text-lg font-bold">{stats.quizzes}</p>
            </div>
            <div className="glass-subtle rounded-xl p-3.5">
              <p className="text-xs text-muted-foreground">Focus sessions</p>
              <p className="mt-0.5 font-display text-lg font-bold">{stats.pomodoros}</p>
            </div>
          </div>
          {categoryBreakdown.length > 0 && (
            <div className="mt-5">
              <p className="mb-2 text-xs font-medium text-muted-foreground">Where your effort goes</p>
              <div className="space-y-2">
                {categoryBreakdown.map(([type, count]) => (
                  <div key={type} className="flex items-center gap-2.5">
                    <span className="w-20 truncate text-xs capitalize text-muted-foreground">{type}</span>
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.07]">
                      <div className="h-full rounded-full bg-gradient-to-r from-brand to-aqua" style={{ width: `${(count / categoryBreakdown[0]![1]) * 100}%` }} />
                    </div>
                    <span className="w-8 text-right text-xs font-semibold">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Achievements */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass rounded-2xl p-6">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-display text-base font-semibold">
            <Trophy className="mr-1.5 inline h-4 w-4 text-amber-400" /> Achievements
          </h3>
          <span className="chip">{unlockedCount} / {ACHIEVEMENTS.length} unlocked</span>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {ACHIEVEMENTS.map((a) => {
            const at = unlocked[a.id]
            return (
              <div
                key={a.id}
                className={cn(
                  'rounded-xl border p-4 transition-all',
                  at ? 'border-brand/30 bg-gradient-to-br from-brand/15 to-aqua/[0.06]' : 'border-white/[0.07] bg-white/[0.02] opacity-50',
                )}
              >
                <span className={cn('grid h-10 w-10 place-items-center rounded-xl', at ? 'bg-gradient-to-br from-brand to-aqua text-white shadow-glow-sm' : 'bg-white/[0.06] text-muted-foreground')}>
                  <ToolIcon name={a.icon} className="h-5 w-5" />
                </span>
                <p className="mt-3 text-sm font-semibold">{a.title}</p>
                <p className="mt-0.5 text-xs leading-5 text-muted-foreground">{a.description}</p>
                <p className="mt-2 flex items-center gap-1 text-[11px] font-medium">
                  {at ? (
                    <>
                      <BadgeCheck className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Unlocked {new Date(at).toLocaleDateString()}</span>
                    </>
                  ) : (
                    <>
                      <Zap className="h-3.5 w-3.5 text-aqua-soft" />
                      <span className="text-muted-foreground">+{a.xpReward} XP reward</span>
                    </>
                  )}
                </p>
              </div>
            )
          })}
        </div>
      </motion.div>

      {/* Certificates */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass rounded-2xl p-6">
        <h3 className="mb-5 font-display text-base font-semibold">
          <Award className="mr-1.5 inline h-4 w-4 text-aqua-soft" /> Certificates
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CERTIFICATES.map((c) => {
            const earned = level >= c.level
            return (
              <div
                key={c.title}
                className={cn(
                  'relative overflow-hidden rounded-xl border p-5 text-center',
                  earned ? 'border-amber-400/40 bg-gradient-to-b from-amber-500/[0.12] to-transparent' : 'border-white/[0.07] bg-white/[0.02] opacity-45',
                )}
              >
                {earned && <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400" />}
                <Award className={cn('mx-auto h-8 w-8', earned ? 'text-amber-400' : 'text-muted-foreground')} />
                <p className="mt-3 font-display text-sm font-bold">{c.title}</p>
                <p className="mt-1.5 text-xs leading-5 text-muted-foreground">{c.body}</p>
                <p className={cn('mt-3 text-[11px] font-semibold uppercase tracking-widest', earned ? 'text-amber-400' : 'text-muted-foreground')}>
                  {earned ? 'Earned' : `Reach level ${c.level}`}
                </p>
              </div>
            )
          })}
        </div>
      </motion.div>

      <div className="glass rounded-2xl p-6">
        <h3 className="mb-2 flex items-center gap-2 font-display text-base font-semibold">
          <Flame className="h-4 w-4 text-orange-400" /> Longest run
        </h3>
        <p className="text-sm text-muted-foreground">
          Current streak: <span className="font-semibold text-foreground">{streak} days</span> · total learning actions:{' '}
          <span className="font-semibold text-foreground">{activity.length}</span> · favorite tools used:{' '}
          <span className="font-semibold text-foreground">{stats.distinctTools}</span>
        </p>
      </div>

      <div className="pb-2 text-center text-xs text-muted-foreground/60">
        <Sparkles className="mr-1 inline h-3 w-3" /> Keep going — Sage status unlocks at 5,000 XP.
      </div>
    </div>
  )
}
