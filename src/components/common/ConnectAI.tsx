import { useState } from 'react'
import { KeyRound, ExternalLink, Sparkles, Eye, EyeOff } from 'lucide-react'
import { useStore } from '@/services/store'

/**
 * Shown inside chat / tools when no OpenRouter key is configured.
 * Lets the user paste a key inline — everything activates instantly.
 */
export function ConnectAI({ compact = false }: { compact?: boolean }) {
  const { settings, updateSettings } = useStore()
  const [key, setKey] = useState('')
  const [show, setShow] = useState(false)
  const [saved, setSaved] = useState(false)

  const save = () => {
    const trimmed = key.trim()
    if (trimmed.length < 10) return
    updateSettings({ openrouterKey: trimmed })
    setSaved(true)
  }

  return (
    <div className="glass mx-auto w-full max-w-xl rounded-2xl p-6 sm:p-8">
      <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-brand to-aqua shadow-glow-sm">
        <KeyRound className="h-6 w-6 text-white" />
      </div>
      <h3 className="font-display text-xl font-semibold">Connect your AI engine</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        StuAr AI runs on OpenRouter — one key unlocks Llama, Gemini, GPT, Claude and more. The key is stored{' '}
        <span className="font-semibold text-foreground">only in your browser</span> and sent directly to OpenRouter.
      </p>
      {!compact && (
        <ol className="mt-4 space-y-2 text-sm text-muted-foreground">
          <li className="flex gap-2.5">
            <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand/20 text-[11px] font-bold text-brand-soft">1</span>
            <span>
              Create a free key at{' '}
              <a href="https://openrouter.ai/keys" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-medium text-aqua-soft hover:underline">
                openrouter.ai/keys <ExternalLink className="h-3 w-3" />
              </a>
            </span>
          </li>
          <li className="flex gap-2.5">
            <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand/20 text-[11px] font-bold text-brand-soft">2</span>
            <span>Paste it below — free models work without credits.</span>
          </li>
        </ol>
      )}
      <div className="mt-5 flex gap-2">
        <div className="relative flex-1">
          <input
            type={show ? 'text' : 'password'}
            value={key}
            onChange={(e) => setKey(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && save()}
            placeholder="sk-or-v1-…"
            aria-label="OpenRouter API key"
            className="input-field pr-10 font-mono text-[13px]"
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? 'Hide key' : 'Show key'}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        <button type="button" onClick={save} disabled={key.trim().length < 10} className="btn-primary">
          <Sparkles className="h-4 w-4" />
          {saved && settings.openrouterKey ? 'Connected' : 'Connect'}
        </button>
      </div>
      <p className="mt-3 text-xs text-muted-foreground/80">
        Deploying your own copy? You can also set <code className="rounded bg-white/10 px-1 font-mono">VITE_OPENROUTER_API_KEY</code> in your environment.
      </p>
    </div>
  )
}
