import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Check,
  Copy,
  ImagePlus,
  MessageSquare,
  Plus,
  RefreshCw,
  SendHorizonal,
  Sparkles,
  Square,
  Trash2,
  X,
} from 'lucide-react'
import { toast } from 'sonner'
import type { ChatMessage, Conversation } from '@/types'
import { useAuth } from '@/services/auth'
import { useStore } from '@/services/store'
import { streamChat, TUTOR_SYSTEM, type AIMessage } from '@/services/ai'
import { Markdown } from '@/components/common/Markdown'
import { ConnectAI } from '@/components/common/ConnectAI'
import { EmptyState } from '@/components/common/EmptyState'
import { ToolIcon } from '@/components/common/ToolIcon'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { uid } from '@/lib/storage'
import { initials, timeAgo } from '@/lib/format'
import { XP } from '@/config/achievements'
import { MODELS } from '@/config/site'
import { cn } from '@/lib/utils'

const SUGGESTIONS = [
  { icon: 'Calculator', label: 'Solve x² − 7x + 12 = 0 step by step' },
  { icon: 'Dna', label: 'Explain photosynthesis with a flow diagram in words' },
  { icon: 'PenLine', label: 'Give me a 5-paragraph essay outline on climate policy' },
  { icon: 'Code', label: 'Write a Python function to check palindromes and explain it' },
]

function MessageBubble({
  msg,
  onCopy,
  onRegenerate,
  isLast,
  streaming,
}: {
  msg: ChatMessage
  onCopy: (text: string, id: string) => void
  onRegenerate: () => void
  isLast: boolean
  streaming: boolean
}) {
  const { user } = useAuth()
  const [copied, setCopied] = useState(false)
  const isUser = msg.role === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={cn('flex gap-3', isUser && 'flex-row-reverse')}
    >
      {isUser ? (
        <span
          className="grid h-8 w-8 shrink-0 place-items-center rounded-lg font-display text-xs font-bold text-white"
          style={{ background: `linear-gradient(135deg, ${user?.avatarColor ?? '#6366F1'}, ${user?.avatarColor ?? '#6366F1'}88)` }}
        >
          {initials(user?.name ?? 'Me')}
        </span>
      ) : (
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-brand to-aqua shadow-glow-sm">
          <Sparkles className="h-4 w-4 text-white" />
        </span>
      )}
      <div className={cn('max-w-[85%] sm:max-w-[78%]', isUser && 'flex flex-col items-end')}>
        {msg.image && (
          <img src={msg.image} alt="Uploaded attachment" className="mb-2 max-h-56 rounded-xl border border-white/10 object-cover" />
        )}
        <div
          className={cn(
            'rounded-2xl px-4 py-3',
            isUser
              ? 'rounded-br-md bg-gradient-to-r from-brand-deep to-brand text-white shadow-glow-sm'
              : 'glass-subtle rounded-tl-md',
          )}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap text-[15px] leading-7">{msg.content}</p>
          ) : (
            <>
              <Markdown content={msg.content} />
              {streaming && isLast && <span className="ml-1 inline-block h-4 w-2 animate-caret-blink rounded-sm bg-aqua align-middle" />}
            </>
          )}
        </div>
        <div className={cn('mt-1.5 flex items-center gap-1 px-1 text-[11px] text-muted-foreground', isUser && 'flex-row-reverse')}>
          <span>{timeAgo(msg.ts)}</span>
          {!isUser && !streaming && (
            <span className="ml-1 flex gap-1">
              <button
                type="button"
                aria-label="Copy response"
                className="rounded-md p-1 hover:bg-white/[0.08] hover:text-foreground"
                onClick={() => {
                  onCopy(msg.content, msg.id)
                  setCopied(true)
                  setTimeout(() => setCopied(false), 1500)
                }}
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
              {isLast && (
                <button type="button" aria-label="Regenerate response" className="rounded-md p-1 hover:bg-white/[0.08] hover:text-foreground" onClick={onRegenerate}>
                  <RefreshCw className="h-3.5 w-3.5" />
                </button>
              )}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

function ConversationList({ currentId, onSelect, onNew }: { currentId: string | null; onSelect: (id: string) => void; onNew: () => void }) {
  const { conversations, deleteConversation } = useStore()
  return (
    <div className="flex h-full flex-col">
      <button type="button" onClick={onNew} className="btn-primary mx-1 mb-3">
        <Plus className="h-4 w-4" /> New chat
      </button>
      <div className="flex-1 space-y-1 overflow-y-auto px-1">
        {conversations.length === 0 && (
          <p className="px-3 py-8 text-center text-xs leading-5 text-muted-foreground">
            No conversations yet.
            <br />
            Your history lives here.
          </p>
        )}
        {conversations.map((c) => (
          <div
            key={c.id}
            className={cn(
              'group flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2.5 transition-colors',
              c.id === currentId ? 'bg-brand/15' : 'hover:bg-white/[0.05]',
            )}
            onClick={() => onSelect(c.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onSelect(c.id)}
          >
            <MessageSquare className={cn('h-4 w-4 shrink-0', c.id === currentId ? 'text-brand-soft' : 'text-muted-foreground')} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{c.title}</p>
              <p className="text-[11px] text-muted-foreground">{timeAgo(c.updatedAt)}</p>
            </div>
            <button
              type="button"
              aria-label={`Delete ${c.title}`}
              className="rounded-md p-1 text-muted-foreground opacity-0 transition-opacity hover:text-red-400 group-hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation()
                deleteConversation(c.id)
                if (c.id === currentId) onNew()
              }}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Chat() {
  const { settings, conversations, saveConversation, logActivity } = useStore()
  const [currentId, setCurrentId] = useState<string | null>(null)
  const [input, setInput] = useState('')
  const [image, setImage] = useState<string | null>(null)
  const [streamingId, setStreamingId] = useState<string | null>(null)
  const [streamText, setStreamText] = useState('')
  const [historyOpen, setHistoryOpen] = useState(false)
  const abortRef = useRef<AbortController | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const current: Conversation | null = useMemo(
    () => conversations.find((c) => c.id === currentId) ?? null,
    [conversations, currentId],
  )
  const isStreaming = streamingId !== null
  const hasKey = Boolean(settings.openrouterKey)
  const modelLabel = MODELS.find((m) => m.id === settings.model)?.label ?? settings.model

  useEffect(() => {
    document.title = 'AI Chat · StuAr AI'
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [current?.messages.length, streamText])

  // Auto-resize composer
  useEffect(() => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = Math.min(ta.scrollHeight, 180) + 'px'
  }, [input])

  useEffect(() => () => abortRef.current?.abort(), [])

  const persistMessages = useCallback(
    (convId: string, messages: ChatMessage[]) => {
      const existing = conversations.find((c) => c.id === convId)
      const firstUser = messages.find((m) => m.role === 'user')
      const title = existing?.title && existing.title !== 'New conversation'
        ? existing.title
        : (firstUser?.content.slice(0, 46) || 'New conversation') + (firstUser && firstUser.content.length > 46 ? '…' : '')
      saveConversation({
        id: convId,
        title,
        messages,
        model: settings.model,
        createdAt: existing?.createdAt ?? Date.now(),
        updatedAt: Date.now(),
      })
    },
    [conversations, saveConversation, settings.model],
  )

  const runAssistant = useCallback(
    async (convId: string, history: ChatMessage[]) => {
      const assistantId = uid()
      setStreamingId(assistantId)
      setStreamText('')
      const controller = new AbortController()
      abortRef.current = controller

      const system = settings.language !== 'English' ? `${TUTOR_SYSTEM}\n\nAlways respond in ${settings.language}.` : TUTOR_SYSTEM
      const apiMessages: AIMessage[] = [
        { role: 'system', content: system },
        ...history.slice(-20).map((m) => ({
          role: m.role as 'user' | 'assistant',
          content:
            m.image && m.role === 'user'
              ? [
                  { type: 'text' as const, text: m.content || 'What is in this image?' },
                  { type: 'image_url' as const, image_url: { url: m.image } },
                ]
              : m.content,
        })),
      ]

      let full = ''
      try {
        full = await streamChat({
          apiKey: settings.openrouterKey,
          model: settings.model,
          messages: apiMessages,
          signal: controller.signal,
          onToken: (text) => setStreamText(text),
        })
      } catch (e) {
        if (e instanceof DOMException && e.name === 'AbortError') {
          full = full || ''
        } else {
          const message = e instanceof Error ? e.message : 'Something went wrong'
          toast.error('AI request failed', { description: message })
          setStreamingId(null)
          setStreamText('')
          return
        }
      }

      const finalText = full.trim() || '*Generation stopped.*'
      const assistantMsg: ChatMessage = { id: assistantId, role: 'assistant', content: finalText, ts: Date.now(), model: settings.model }
      const nextMessages = [...history, assistantMsg]
      persistMessages(convId, nextMessages)
      logActivity('chat', `AI chat: ${nextMessages.find((m) => m.role === 'user')?.content.slice(0, 40) ?? 'conversation'}`, XP.chat)
      setStreamingId(null)
      setStreamText('')
      abortRef.current = null
    },
    [settings, persistMessages, logActivity],
  )

  const send = useCallback(() => {
    const text = input.trim()
    if ((!text && !image) || isStreaming) return
    if (!hasKey) {
      toast.error('Connect OpenRouter first', { description: 'Add your API key below or in Settings.' })
      return
    }
    const convId = currentId ?? uid()
    const userMsg: ChatMessage = { id: uid(), role: 'user', content: text, ts: Date.now(), image: image ?? undefined }
    const history = [...(current?.messages ?? []), userMsg]
    if (!currentId) setCurrentId(convId)
    persistMessages(convId, history)
    setInput('')
    setImage(null)
    void runAssistant(convId, history)
  }, [input, image, isStreaming, hasKey, currentId, current, persistMessages, runAssistant])

  const regenerate = useCallback(() => {
    if (!current || isStreaming) return
    const msgs = [...current.messages]
    while (msgs.length && msgs[msgs.length - 1]!.role === 'assistant') msgs.pop()
    if (!msgs.length) return
    persistMessages(current.id, msgs)
    void runAssistant(current.id, msgs)
  }, [current, isStreaming, persistMessages, runAssistant])

  const clearChat = useCallback(() => {
    if (!current) return
    persistMessages(current.id, [])
  }, [current, persistMessages])

  const stop = useCallback(() => {
    abortRef.current?.abort()
  }, [])

  const newChat = useCallback(() => {
    if (isStreaming) stop()
    setCurrentId(null)
    setHistoryOpen(false)
    setTimeout(() => textareaRef.current?.focus(), 50)
  }, [isStreaming, stop])

  const onPickImage = (file: File | undefined) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are supported')
      return
    }
    if (file.size > 4 * 1024 * 1024) {
      toast.error('Image too large', { description: 'Keep it under 4 MB.' })
      return
    }
    const reader = new FileReader()
    reader.onload = () => setImage(String(reader.result))
    reader.readAsDataURL(file)
  }

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('Copied to clipboard')
    } catch {
      toast.error('Copy failed')
    }
  }

  const displayedMessages = useMemo(() => {
    const base = current?.messages ?? []
    if (isStreaming && streamText) {
      return [...base, { id: streamingId!, role: 'assistant' as const, content: streamText, ts: Date.now() }]
    }
    return base
  }, [current, isStreaming, streamText, streamingId])

  return (
    <div className="flex h-[calc(100vh-10.5rem)] gap-4">
      {/* History sidebar */}
      <aside className="glass hidden w-64 shrink-0 rounded-2xl p-3 lg:block">
        <ConversationList currentId={currentId} onSelect={setCurrentId} onNew={newChat} />
      </aside>
      <Sheet open={historyOpen} onOpenChange={setHistoryOpen}>
        <SheetContent side="left" className="w-72 border-white/10 bg-background/95 p-3 backdrop-blur-2xl">
          <SheetTitle className="sr-only">Conversation history</SheetTitle>
          <ConversationList currentId={currentId} onSelect={(id) => { setCurrentId(id); setHistoryOpen(false) }} onNew={newChat} />
        </SheetContent>
      </Sheet>

      {/* Chat column */}
      <section className="glass flex min-w-0 flex-1 flex-col rounded-2xl">
        {/* Header */}
        <div className="flex items-center gap-2 border-b border-white/[0.07] px-4 py-3">
          <button type="button" className="btn-ghost px-3 py-2 text-xs lg:hidden" onClick={() => setHistoryOpen(true)}>
            <MessageSquare className="h-4 w-4" /> History
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-display text-sm font-semibold">{current?.title ?? 'New conversation'}</h1>
            <p className="text-[11px] text-muted-foreground">{modelLabel}</p>
          </div>
          {current && current.messages.length > 0 && (
            <button type="button" onClick={clearChat} className="btn-ghost px-3 py-2 text-xs" aria-label="Clear chat">
              <Trash2 className="h-3.5 w-3.5" /> Clear
            </button>
          )}
          <button type="button" onClick={newChat} className="btn-ghost px-3 py-2 text-xs">
            <Plus className="h-3.5 w-3.5" /> New
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">
          {!hasKey ? (
            <div className="grid h-full place-items-center py-8">
              <ConnectAI />
            </div>
          ) : displayedMessages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-8 py-6">
              <EmptyState
                icon="Sparkles"
                title="Your personal AI tutor is ready"
                body="Ask anything — homework, concepts, code, essays. Answers stream in with full markdown and code highlighting."
              />
              <div className="grid w-full max-w-2xl gap-2.5 sm:grid-cols-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s.label}
                    type="button"
                    onClick={() => {
                      setInput(s.label)
                      textareaRef.current?.focus()
                    }}
                    className="glass-subtle group flex items-start gap-3 rounded-xl p-3.5 text-left text-sm text-muted-foreground transition-all hover:border-brand/40 hover:text-foreground"
                  >
                    <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-brand/15 text-brand-soft">
                      <ToolIcon name={s.icon} className="h-3.5 w-3.5" />
                    </span>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-3xl space-y-6">
              <AnimatePresence initial={false}>
                {displayedMessages.map((m, i) => (
                  <MessageBubble
                    key={m.id}
                    msg={m}
                    isLast={i === displayedMessages.length - 1}
                    streaming={isStreaming}
                    onCopy={(t) => void copyText(t)}
                    onRegenerate={regenerate}
                  />
                ))}
              </AnimatePresence>
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {/* Composer */}
        <div className="border-t border-white/[0.07] p-3 sm:p-4">
          {image && (
            <div className="relative mb-2 inline-block">
              <img src={image} alt="Attachment preview" className="h-16 w-16 rounded-xl border border-white/10 object-cover" />
              <button
                type="button"
                onClick={() => setImage(null)}
                aria-label="Remove image"
                className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-red-500 text-white"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          <div className="glass-subtle flex items-end gap-2 rounded-2xl p-2">
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { onPickImage(e.target.files?.[0]); e.target.value = '' }} />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              aria-label="Upload image"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-white/[0.07] hover:text-foreground"
            >
              <ImagePlus className="h-5 w-5" />
            </button>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  send()
                }
              }}
              rows={1}
              placeholder={hasKey ? 'Ask StuAr AI anything…  (Enter to send, Shift+Enter for new line)' : 'Connect OpenRouter above to start chatting…'}
              aria-label="Message StuAr AI"
              className="max-h-44 flex-1 resize-none bg-transparent px-2 py-2.5 text-[15px] leading-6 outline-none placeholder:text-muted-foreground/60"
            />
            {isStreaming ? (
              <button type="button" onClick={stop} className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-red-500/90 text-white shadow transition-colors hover:bg-red-500" aria-label="Stop generation">
                <Square className="h-4 w-4 fill-current" />
              </button>
            ) : (
              <button
                type="button"
                onClick={send}
                disabled={(!input.trim() && !image) || !hasKey}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-r from-brand-deep to-brand text-white shadow-glow-sm transition-all hover:shadow-glow disabled:opacity-40 disabled:shadow-none"
                aria-label="Send message"
              >
                <SendHorizonal className="h-4 w-4" />
              </button>
            )}
          </div>
          <p className="mt-2 text-center text-[11px] text-muted-foreground/70">
            StuAr AI can make mistakes — verify important information. XP earned per reply.
          </p>
        </div>
      </section>
    </div>
  )
}
