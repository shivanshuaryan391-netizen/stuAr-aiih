import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Bell, Download, Eye, EyeOff, Globe, KeyRound, Moon, Palette, ShieldCheck, Sun, Trash2, TriangleAlert, Volume2 } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/services/auth'
import { useStore } from '@/services/store'
import { LANGUAGES, MODELS } from '@/config/site'
import { clearNamespace } from '@/lib/storage'
import { PageHeader } from '@/components/common/EmptyState'
import { cn } from '@/lib/utils'

function Row({ icon, title, desc, children }: { icon: React.ReactNode; title: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 py-4">
      <div className="flex min-w-0 items-start gap-3.5">
        <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand/15 text-brand-soft">{icon}</span>
        <div>
          <p className="text-sm font-semibold">{title}</p>
          <p className="mt-0.5 max-w-md text-xs leading-5 text-muted-foreground">{desc}</p>
        </div>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn('relative h-7 w-12 rounded-full transition-colors duration-300', checked ? 'bg-gradient-to-r from-brand to-aqua' : 'bg-white/[0.12]')}
    >
      <span className={cn('absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all duration-300', checked ? 'left-6' : 'left-1')} />
    </button>
  )
}

export default function Settings() {
  const { settings, updateSettings, resetAll } = useStore()
  const { user, signOut, backend } = useAuth()
  const navigate = useNavigate()
  const [keyDraft, setKeyDraft] = useState(settings.openrouterKey)
  const [showKey, setShowKey] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState('')
  const [confirmReset, setConfirmReset] = useState(false)

  useEffect(() => {
    document.title = 'Settings · StuAr AI'
  }, [])

  useEffect(() => setKeyDraft(settings.openrouterKey), [settings.openrouterKey])

  const exportData = () => {
    const data: Record<string, unknown> = {}
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)
      if (k?.startsWith('stuar:')) {
        try {
          data[k] = JSON.parse(localStorage.getItem(k) ?? 'null')
        } catch {
          data[k] = localStorage.getItem(k)
        }
      }
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `stuar-ai-export-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Data exported', { description: 'Your full StuAr AI data as JSON.' })
  }

  const deleteAccount = async () => {
    if (confirmDelete !== 'DELETE') return
    if (backend === 'supabase') {
      toast.info('Contact support to complete deletion', {
        description: 'Cloud accounts are deleted server-side. Your local data has been cleared.',
      })
    }
    clearNamespace()
    await signOut()
    toast.success('Account deleted', { description: 'All local data was erased.' })
    navigate('/')
  }

  const sectionCls = 'glass divide-y divide-white/[0.06] rounded-2xl px-5 sm:px-6 [&>*]:first:pt-2 [&>*]:last:pb-2'

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Settings" subtitle="Tune StuAr AI to your taste — everything saves instantly." icon="Settings" />

      <div className="space-y-5">
        {/* Appearance & preferences */}
        <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className={sectionCls} aria-label="Appearance and preferences">
          <h2 className="sr-only">Appearance</h2>
          <Row icon={<Palette className="h-4 w-4" />} title="Theme" desc="Dark is the StuAr signature — but light works beautifully too.">
            <div className="flex rounded-xl border border-white/10 p-1">
              <button
                type="button"
                onClick={() => updateSettings({ theme: 'dark' })}
                className={cn('flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all', settings.theme === 'dark' ? 'bg-gradient-to-r from-brand-deep to-brand text-white' : 'text-muted-foreground')}
              >
                <Moon className="h-3.5 w-3.5" /> Dark
              </button>
              <button
                type="button"
                onClick={() => updateSettings({ theme: 'light' })}
                className={cn('flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all', settings.theme === 'light' ? 'bg-gradient-to-r from-brand-deep to-brand text-white' : 'text-muted-foreground')}
              >
                <Sun className="h-3.5 w-3.5" /> Light
              </button>
            </div>
          </Row>
          <Row icon={<Globe className="h-4 w-4" />} title="Language" desc="AI responses will be written in this language.">
            <select
              value={settings.language}
              onChange={(e) => updateSettings({ language: e.target.value })}
              aria-label="AI response language"
              className="input-field w-40 py-2 text-sm"
            >
              {LANGUAGES.map((l) => (
                <option key={l} value={l} className="bg-[#0a0f24]">{l}</option>
              ))}
            </select>
          </Row>
          <Row icon={<Bell className="h-4 w-4" />} title="Notifications" desc="Toast alerts for achievements, streaks and reminders.">
            <Toggle checked={settings.notificationsEnabled} onChange={(v) => updateSettings({ notificationsEnabled: v })} label="Enable notifications" />
          </Row>
          <Row icon={<Volume2 className="h-4 w-4" />} title="Sounds" desc="Completion sounds for timers and quizzes.">
            <Toggle checked={settings.soundEnabled} onChange={(v) => updateSettings({ soundEnabled: v })} label="Enable sounds" />
          </Row>
        </motion.section>

        {/* AI engine */}
        <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className={sectionCls} aria-label="AI engine">
          <h2 className="sr-only">AI engine</h2>
          <Row
            icon={<KeyRound className="h-4 w-4" />}
            title="OpenRouter API key"
            desc="Stored only in your browser, sent directly to OpenRouter. Get a free key at openrouter.ai/keys."
          >
            <div className="flex items-center gap-2">
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={keyDraft}
                  onChange={(e) => setKeyDraft(e.target.value)}
                  placeholder="sk-or-v1-…"
                  aria-label="OpenRouter API key"
                  className="input-field w-56 py-2 pr-9 font-mono text-xs"
                />
                <button type="button" onClick={() => setShowKey((s) => !s)} aria-label={showKey ? 'Hide key' : 'Show key'} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showKey ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>
              <button
                type="button"
                className="btn-primary px-4 py-2 text-xs"
                onClick={() => {
                  updateSettings({ openrouterKey: keyDraft.trim() })
                  toast.success(keyDraft.trim() ? 'API key saved' : 'API key cleared')
                }}
              >
                Save
              </button>
            </div>
          </Row>
          <Row icon={<ShieldCheck className="h-4 w-4" />} title="Model" desc="Which model answers your chats and tool runs.">
            <select
              value={settings.model}
              onChange={(e) => updateSettings({ model: e.target.value })}
              aria-label="AI model"
              className="input-field w-56 py-2 text-sm"
            >
              {MODELS.map((m) => (
                <option key={m.id} value={m.id} className="bg-[#0a0f24]">{m.label}</option>
              ))}
            </select>
          </Row>
        </motion.section>

        {/* Data & privacy */}
        <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className={sectionCls} aria-label="Data and privacy">
          <h2 className="sr-only">Data and privacy</h2>
          <Row
            icon={<ShieldCheck className="h-4 w-4" />}
            title="Your data"
            desc={backend === 'supabase' ? 'Synced to your Supabase project with row-level security; cached locally for offline use.' : 'Stored 100% locally in this browser — nothing leaves your device except AI requests.'}
          >
            <button type="button" className="btn-ghost px-4 py-2 text-xs" onClick={exportData}>
              <Download className="h-3.5 w-3.5" /> Export JSON
            </button>
          </Row>
          <Row icon={<Trash2 className="h-4 w-4" />} title="Reset all data" desc="Wipes chats, notes, tasks, XP and achievements for this account. Cannot be undone.">
            {confirmReset ? (
              <div className="flex gap-2">
                <button
                  type="button"
                  className="rounded-xl bg-red-500/90 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-red-500"
                  onClick={() => {
                    resetAll()
                  }}
                >
                  Confirm wipe
                </button>
                <button type="button" className="btn-ghost px-4 py-2 text-xs" onClick={() => setConfirmReset(false)}>
                  Cancel
                </button>
              </div>
            ) : (
              <button type="button" className="btn-ghost border-red-500/30 px-4 py-2 text-xs text-red-300 hover:bg-red-500/10" onClick={() => setConfirmReset(true)}>
                <Trash2 className="h-3.5 w-3.5" /> Reset…
              </button>
            )}
          </Row>
          <Row icon={<TriangleAlert className="h-4 w-4" />} title="Delete account" desc="Removes your account and all data from this device. Type DELETE to confirm.">
            <div className="flex gap-2">
              <input
                value={confirmDelete}
                onChange={(e) => setConfirmDelete(e.target.value)}
                placeholder="Type DELETE"
                aria-label="Type DELETE to confirm account deletion"
                className="input-field w-32 py-2 text-xs"
              />
              <button
                type="button"
                disabled={confirmDelete !== 'DELETE'}
                className="rounded-xl bg-red-500/90 px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-red-500 disabled:opacity-40"
                onClick={() => void deleteAccount()}
              >
                Delete
              </button>
            </div>
          </Row>
        </motion.section>

        <p className="pb-4 text-center text-xs text-muted-foreground/60">
          StuAr AI v1.0 · signed in as {user?.email} · backend: {backend === 'supabase' ? 'Supabase cloud' : 'local (connect Supabase via .env)'}
        </p>
      </div>
    </div>
  )
}
