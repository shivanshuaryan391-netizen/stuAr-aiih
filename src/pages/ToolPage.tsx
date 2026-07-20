import { useCallback, useEffect, useRef, useState, type ComponentType } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Check, Copy, ImagePlus, RefreshCw, Sparkles, Square, StickyNote, Trash2, X } from 'lucide-react'
import { toast } from 'sonner'
import { TOOL_MAP } from '@/services/tools'
import { useStore } from '@/services/store'
import { streamChat, TUTOR_SYSTEM, type AIMessage } from '@/services/ai'
import { Markdown } from '@/components/common/Markdown'
import { ConnectAI } from '@/components/common/ConnectAI'
import { PageHeader } from '@/components/common/EmptyState'
import { ToolIcon } from '@/components/common/ToolIcon'
import { XP } from '@/config/achievements'
import FlashcardsPage from '@/pages/tools/Flashcards'
import QuizPage from '@/pages/tools/Quiz'
import PomodoroPage from '@/pages/tools/Pomodoro'
import TodoPage from '@/pages/tools/TodoPage'
import NotesPage from '@/pages/tools/NotesPage'
import HabitsPage from '@/pages/tools/Habits'
import CalendarPage from '@/pages/tools/CalendarPage'
import { cn } from '@/lib/utils'

const CUSTOM_PAGES: Record<string, ComponentType> = {
  flashcards: FlashcardsPage,
  quiz: QuizPage,
  pomodoro: PomodoroPage,
  todo: TodoPage,
  notes: NotesPage,
  habits: HabitsPage,
  calendar: CalendarPage,
}

export default function ToolPage() {
  const { toolId } = useParams<{ toolId: string }>()
  const tool = toolId ? TOOL_MAP[toolId] : undefined

  if (!tool) {
    return (
      <div className="glass mx-auto max-w-lg rounded-2xl p-10 text-center">
        <h1 className="font-display text-xl font-bold">Tool not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">This tool doesn&apos;t exist (yet). Browse the full library instead.</p>
        <Link to="/app/tools" className="btn-primary mt-6">
          <ArrowLeft className="h-4 w-4" /> Back to library
        </Link>
      </div>
    )
  }

  if (tool.custom) {
    const Custom = CUSTOM_PAGES[tool.custom]
    return <Custom />
  }

  return <AiRunner key={tool.id} toolId={tool.id} />
}

function AiRunner({ toolId }: { toolId: string }) {
  const tool = TOOL_MAP[toolId]!
  const { settings, logActivity, saveNote } = useStore()
  const [values, setValues] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [image, setImage] = useState<string | null>(null)
  const [output, setOutput] = useState('')
  const [running, setRunning] = useState(false)
  const [hasRun, setHasRun] = useState(false)
  const [copied, setCopied] = useState(false)
  const abortRef = useRef<AbortController | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const outputRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.title = `${tool.name} · StuAr AI`
  }, [tool.name])

  useEffect(() => () => abortRef.current?.abort(), [])

  useEffect(() => {
    if (running && outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [output, running])

  const setValue = (name: string, value: string) => {
    setValues((v) => ({ ...v, [name]: value }))
    setErrors((e) => ({ ...e, [name]: '' }))
  }

  const validate = (): boolean => {
    const errs: Record<string, string> = {}
    for (const f of tool.fields) {
      const val = (values[f.name] ?? '').trim()
      if (f.required && !val) errs[f.name] = `${f.label} is required.`
      if (f.type === 'number' && val) {
        const n = Number(val)
        if (Number.isNaN(n)) errs[f.name] = 'Enter a valid number.'
        else {
          if (f.min !== undefined && n < f.min) errs[f.name] = `Minimum is ${f.min}.`
          if (f.max !== undefined && n > f.max) errs[f.name] = `Maximum is ${f.max}.`
        }
      }
    }
    if (tool.image && !image) errs.image = 'Upload an image of your notes first.'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const run = useCallback(async () => {
    if (running) return
    if (!validate()) {
      toast.error('Check the form', { description: 'Some fields need attention.' })
      return
    }
    const controller = new AbortController()
    abortRef.current = controller
    setRunning(true)
    setHasRun(true)
    setOutput('')

    const systemBase = tool.system ?? TUTOR_SYSTEM
    const system = settings.language !== 'English' ? `${systemBase}\n\nAlways respond in ${settings.language}.` : systemBase
    const prompt = tool.buildPrompt ? tool.buildPrompt(values) : values.topic ?? ''
    const messages: AIMessage[] = [{ role: 'system', content: system }]
    if (tool.image && image) {
      messages.push({
        role: 'user',
        content: [
          { type: 'text', text: prompt },
          { type: 'image_url', image_url: { url: image } },
        ],
      })
    } else {
      messages.push({ role: 'user', content: prompt })
    }

    try {
      await streamChat({
        apiKey: settings.openrouterKey,
        model: settings.model,
        messages,
        signal: controller.signal,
        onToken: (full) => setOutput(full),
      })
      logActivity('tool', `Ran ${tool.name}`, XP.toolRun, tool.id)
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') {
        setOutput((prev) => prev || '*Generation stopped.*')
      } else {
        const msg = e instanceof Error ? e.message : 'Request failed'
        setOutput((prev) => prev || `**Error:** ${msg}`)
        toast.error('AI request failed', { description: msg })
      }
    } finally {
      setRunning(false)
      abortRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, values, image, settings, tool, logActivity])

  const stop = () => abortRef.current?.abort()

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(output)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      toast.error('Copy failed')
    }
  }

  const saveAsNote = () => {
    if (!output.trim()) return
    saveNote({ title: `${tool.name} — ${new Date().toLocaleDateString()}`, content: output })
    toast.success('Saved to Notes', { description: 'Find it in Productivity → Notes.' })
  }

  const hasKey = Boolean(settings.openrouterKey)

  return (
    <div>
      <Link to="/app/tools" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Tools Library
      </Link>
      <PageHeader title={tool.name} subtitle={tool.description} icon={tool.icon}>
        <span className="chip">{tool.category}</span>
      </PageHeader>

      {!hasKey ? (
        <ConnectAI />
      ) : (
        <div className="grid gap-5 lg:grid-cols-[380px_1fr]">
          {/* Form */}
          <form
            className="glass h-fit space-y-4 rounded-2xl p-5 sm:p-6"
            onSubmit={(e) => {
              e.preventDefault()
              void run()
            }}
            noValidate
          >
            {tool.fields.map((f) => (
              <div key={f.name}>
                <label htmlFor={`f-${f.name}`} className="mb-1.5 block text-sm font-medium">
                  {f.label}
                  {f.required && <span className="ml-1 text-brand-soft">*</span>}
                </label>
                {f.type === 'textarea' ? (
                  <textarea
                    id={`f-${f.name}`}
                    rows={f.rows ?? 4}
                    className="input-field resize-y"
                    placeholder={f.placeholder}
                    value={values[f.name] ?? ''}
                    onChange={(e) => setValue(f.name, e.target.value)}
                  />
                ) : f.type === 'select' ? (
                  <select
                    id={`f-${f.name}`}
                    className="input-field appearance-none bg-[length:14px] bg-[right_0.9rem_center] bg-no-repeat pr-10"
                    style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")" }}
                    value={values[f.name] ?? ''}
                    onChange={(e) => setValue(f.name, e.target.value)}
                  >
                    <option value="" disabled>
                      Select…
                    </option>
                    {f.options?.map((o) => (
                      <option key={o} value={o} className="bg-[#0a0f24] text-foreground">
                        {o}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    id={`f-${f.name}`}
                    type={f.type === 'number' ? 'number' : 'text'}
                    min={f.min}
                    max={f.max}
                    className="input-field"
                    placeholder={f.placeholder}
                    value={values[f.name] ?? ''}
                    onChange={(e) => setValue(f.name, e.target.value)}
                  />
                )}
                {errors[f.name] && <p className="mt-1.5 text-xs text-red-400">{errors[f.name]}</p>}
              </div>
            ))}

            {tool.image && (
              <div>
                <span className="mb-1.5 block text-sm font-medium">
                  Notes image <span className="ml-1 text-brand-soft">*</span>
                </span>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
                  const file = e.target.files?.[0]
                  e.target.value = ''
                  if (!file) return
                  if (file.size > 4 * 1024 * 1024) {
                    toast.error('Image too large', { description: 'Keep it under 4 MB.' })
                    return
                  }
                  const reader = new FileReader()
                  reader.onload = () => {
                    setImage(String(reader.result))
                    setErrors((er) => ({ ...er, image: '' }))
                  }
                  reader.readAsDataURL(file)
                }} />
                {image ? (
                  <div className="relative inline-block">
                    <img src={image} alt="Notes upload" className="max-h-44 rounded-xl border border-white/10" />
                    <button type="button" onClick={() => setImage(null)} aria-label="Remove image" className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-red-500 text-white">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <button type="button" onClick={() => fileRef.current?.click()} className="flex w-full flex-col items-center gap-2 rounded-xl border border-dashed border-white/15 px-4 py-8 text-sm text-muted-foreground transition-colors hover:border-brand/40 hover:text-foreground">
                    <ImagePlus className="h-6 w-6" />
                    Upload a photo of your notes
                  </button>
                )}
                {errors.image && <p className="mt-1.5 text-xs text-red-400">{errors.image}</p>}
              </div>
            )}

            {running ? (
              <button type="button" onClick={stop} className="btn-ghost w-full border-red-500/40 text-red-300 hover:bg-red-500/10">
                <Square className="h-4 w-4 fill-current" /> Stop generating
              </button>
            ) : (
              <button type="submit" className="btn-primary w-full">
                <Sparkles className="h-4 w-4" />
                {hasRun ? 'Regenerate' : `Run ${tool.name}`}
              </button>
            )}
            <p className="text-center text-[11px] text-muted-foreground/70">+{XP.toolRun} XP per run · streams via OpenRouter</p>
          </form>

          {/* Output */}
          <div className="glass flex min-h-[26rem] flex-col rounded-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-3.5">
              <p className="font-display text-sm font-semibold">
                Output
                {running && <span className="ml-2 inline-block h-2 w-2 animate-pulse rounded-full bg-aqua align-middle" />}
              </p>
              <div className="flex gap-1.5">
                <button type="button" onClick={copy} disabled={!output} aria-label="Copy output" className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-white/[0.07] hover:text-foreground disabled:opacity-40">
                  {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                </button>
                <button type="button" onClick={saveAsNote} disabled={!output || running} aria-label="Save as note" className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-white/[0.07] hover:text-foreground disabled:opacity-40">
                  <StickyNote className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => void run()} disabled={running || !hasRun} aria-label="Regenerate" className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-white/[0.07] hover:text-foreground disabled:opacity-40">
                  <RefreshCw className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOutput('')
                    setHasRun(false)
                  }}
                  disabled={running || !output}
                  aria-label="Clear output"
                  className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-white/[0.07] hover:text-red-400 disabled:opacity-40"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div ref={outputRef} className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
              {!hasRun ? (
                <div className="grid h-full min-h-72 place-items-center">
                  <div className="text-center">
                    <div className={cn('mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-brand/25 to-aqua/20 text-brand-soft')}>
                      <ToolIcon name={tool.icon} className="h-7 w-7" />
                    </div>
                    <p className="font-display text-sm font-semibold text-foreground/80">Fill the form and hit run</p>
                    <p className="mt-1 max-w-xs text-xs leading-5 text-muted-foreground">
                      {tool.tagline}. Output streams here with markdown, tables and code highlighting.
                    </p>
                  </div>
                </div>
              ) : output ? (
                <>
                  <Markdown content={output} />
                  {running && <span className="ml-1 inline-block h-4 w-2 animate-caret-blink rounded-sm bg-aqua align-middle" />}
                </>
              ) : (
                <div className="space-y-3 py-2">
                  <div className="shimmer h-4 w-3/4 rounded-md bg-white/[0.05]" />
                  <div className="shimmer h-4 w-full rounded-md bg-white/[0.05]" />
                  <div className="shimmer h-4 w-5/6 rounded-md bg-white/[0.05]" />
                  <div className="shimmer h-4 w-2/3 rounded-md bg-white/[0.05]" />
                  <p className="pt-2 text-xs text-muted-foreground">Connecting to the model…</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
