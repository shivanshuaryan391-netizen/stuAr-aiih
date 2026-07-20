import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check, Layers, Library, RefreshCw, Shuffle, Sparkles, Trash2, X } from 'lucide-react'
import { toast } from 'sonner'
import type { Flashcard } from '@/types'
import { useStore } from '@/services/store'
import { complete, extractJson } from '@/services/ai'
import { ConnectAI } from '@/components/common/ConnectAI'
import { PageHeader } from '@/components/common/EmptyState'
import { XP } from '@/config/achievements'

type Phase = 'setup' | 'generating' | 'review'

export default function FlashcardsPage() {
  const { settings, decks, saveDeck, deleteDeck, logActivity } = useStore()
  const [topic, setTopic] = useState('')
  const [count, setCount] = useState('10')
  const [difficulty, setDifficulty] = useState('Medium')
  const [error, setError] = useState('')
  const [phase, setPhase] = useState<Phase>('setup')
  const [cards, setCards] = useState<Flashcard[]>([])
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [known, setKnown] = useState<Set<number>>(new Set())
  const [showLibrary, setShowLibrary] = useState(false)

  useEffect(() => {
    document.title = 'Flashcards · StuAr AI'
  }, [])

  const hasKey = Boolean(settings.openrouterKey)

  const generate = async () => {
    if (topic.trim().length < 3) {
      setError('Give me a topic (3+ characters).')
      return
    }
    setError('')
    setPhase('generating')
    try {
      const raw = await complete({
        apiKey: settings.openrouterKey,
        model: settings.model,
        messages: [
          {
            role: 'system',
            content:
              'You are a flashcard generator. Reply ONLY with a JSON array of objects: [{"front": "...", "back": "..."}]. Front = concise question/term. Back = clear answer (max 40 words). No markdown, no commentary.',
          },
          {
            role: 'user',
            content: `Create ${count} ${difficulty} flashcards on: ${topic}${settings.language !== 'English' ? `. Write them in ${settings.language}.` : ''}`,
          },
        ],
        temperature: 0.6,
      })
      const parsed = extractJson<Flashcard[]>(raw)
      const clean = parsed.filter((c) => c.front && c.back).slice(0, 30)
      if (clean.length < 3) throw new Error('Too few cards generated — try again.')
      setCards(clean)
      setIndex(0)
      setFlipped(false)
      setKnown(new Set())
      setPhase('review')
      logActivity('flashcards', `Flashcards: ${topic} (${clean.length} cards)`, XP.flashcards, 'flashcards')
    } catch (e) {
      setPhase('setup')
      toast.error('Generation failed', { description: e instanceof Error ? e.message : 'Try again.' })
    }
  }

  const openDeck = (deckId: string) => {
    const deck = decks.find((d) => d.id === deckId)
    if (!deck) return
    setTopic(deck.topic)
    setCards(deck.cards)
    setIndex(0)
    setFlipped(false)
    setKnown(new Set())
    setPhase('review')
    setShowLibrary(false)
  }

  const mark = (isKnown: boolean) => {
    setKnown((prev) => {
      const next = new Set(prev)
      if (isKnown) next.add(index)
      else next.delete(index)
      return next
    })
    if (index < cards.length - 1) {
      setIndex(index + 1)
      setFlipped(false)
    }
  }

  const done = known.size
  const card = cards[index]

  return (
    <div>
      <Link to="/app/tools" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Tools Library
      </Link>
      <PageHeader title="Flashcards" subtitle="Generate smart decks on any topic, flip through them, and save to your library." icon="Layers">
        <button type="button" className="btn-ghost px-4 py-2 text-xs" onClick={() => setShowLibrary((s) => !s)}>
          <Library className="h-3.5 w-3.5" /> Saved decks ({decks.length})
        </button>
      </PageHeader>

      <AnimatePresence>
        {showLibrary && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-6 overflow-hidden">
            <div className="glass rounded-2xl p-5">
              {decks.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">No saved decks yet — generate one and hit save.</p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {decks.map((d) => (
                    <div key={d.id} className="glass-subtle group flex items-center gap-3 rounded-xl p-3.5">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand/15 text-brand-soft">
                        <Layers className="h-4 w-4" />
                      </span>
                      <button type="button" onClick={() => openDeck(d.id)} className="min-w-0 flex-1 text-left">
                        <p className="truncate text-sm font-semibold">{d.topic}</p>
                        <p className="text-xs text-muted-foreground">{d.cards.length} cards</p>
                      </button>
                      <button type="button" onClick={() => deleteDeck(d.id)} aria-label={`Delete ${d.topic}`} className="rounded-lg p-1.5 text-muted-foreground opacity-0 transition-opacity hover:text-red-400 group-hover:opacity-100">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!hasKey ? (
        <ConnectAI />
      ) : phase === 'setup' || phase === 'generating' ? (
        <div className="glass mx-auto max-w-xl rounded-2xl p-6 sm:p-8">
          <div className="space-y-4">
            <div>
              <label htmlFor="fc-topic" className="mb-1.5 block text-sm font-medium">Topic</label>
              <input id="fc-topic" className="input-field" placeholder="e.g. Periodic table trends, French Revolution dates…" value={topic} onChange={(e) => { setTopic(e.target.value); setError('') }} onKeyDown={(e) => e.key === 'Enter' && void generate()} />
              {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="fc-count" className="mb-1.5 block text-sm font-medium">Cards</label>
                <select id="fc-count" className="input-field" value={count} onChange={(e) => setCount(e.target.value)}>
                  {['5', '10', '15', '20'].map((n) => (
                    <option key={n} value={n} className="bg-[#0a0f24]">{n}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="fc-diff" className="mb-1.5 block text-sm font-medium">Difficulty</label>
                <select id="fc-diff" className="input-field" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                  {['Easy', 'Medium', 'Hard'].map((d) => (
                    <option key={d} value={d} className="bg-[#0a0f24]">{d}</option>
                  ))}
                </select>
              </div>
            </div>
            <button type="button" className="btn-primary w-full" onClick={() => void generate()} disabled={phase === 'generating'}>
              <Sparkles className="h-4 w-4" />
              {phase === 'generating' ? 'Generating your deck…' : 'Generate flashcards'}
            </button>
            {phase === 'generating' && (
              <div className="space-y-2.5 pt-1">
                <div className="shimmer h-4 w-2/3 rounded-md bg-white/[0.05]" />
                <div className="shimmer h-4 w-full rounded-md bg-white/[0.05]" />
                <div className="shimmer h-4 w-1/2 rounded-md bg-white/[0.05]" />
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-2xl">
          <div className="mb-4 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Card <span className="font-semibold text-foreground">{index + 1}</span> / {cards.length}
            </span>
            <span className="chip">{done} known · {cards.length - done} left</span>
          </div>
          <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
            <div className="h-full rounded-full bg-gradient-to-r from-brand to-aqua transition-all duration-500" style={{ width: `${(done / cards.length) * 100}%` }} />
          </div>

          {/* Card */}
          <div className="perspective-1000" style={{ perspective: 1200 }}>
            <motion.button
              type="button"
              key={index}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0, rotateY: flipped ? 180 : 0 }}
              transition={{ duration: 0.35 }}
              onClick={() => setFlipped((f) => !f)}
              aria-label={flipped ? 'Show question' : 'Reveal answer'}
              className="relative block h-72 w-full cursor-pointer rounded-3xl text-left [transform-style:preserve-3d] sm:h-80"
            >
              <div className="glass-strong absolute inset-0 flex flex-col items-center justify-center rounded-3xl p-8 text-center [backface-visibility:hidden]">
                <span className="chip mb-4">Question</span>
                <p className="font-display text-xl font-semibold leading-8 sm:text-2xl">{card.front}</p>
                <p className="mt-6 text-xs text-muted-foreground">Tap to reveal</p>
              </div>
              <div className="glass-strong absolute inset-0 flex flex-col items-center justify-center rounded-3xl border-aqua/30 p-8 text-center [backface-visibility:hidden] [transform:rotateY(180deg)]">
                <span className="chip mb-4 border-aqua/40 bg-aqua/10 text-aqua-soft">Answer</span>
                <p className="text-lg leading-8 text-foreground/90">{card.back}</p>
              </div>
            </motion.button>
          </div>

          {/* Controls */}
          <div className="mt-6 flex items-center justify-center gap-3">
            <button type="button" className="btn-ghost px-4 py-2.5" onClick={() => { setIndex(Math.max(0, index - 1)); setFlipped(false) }} disabled={index === 0} aria-label="Previous card">
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => mark(false)} className="btn-ghost border-red-500/40 px-5 py-2.5 text-red-300 hover:bg-red-500/10">
              <X className="h-4 w-4" /> Still learning
            </button>
            <button type="button" onClick={() => mark(true)} className="btn-primary px-5 py-2.5 !from-emerald-600 !to-emerald-500">
              <Check className="h-4 w-4" /> I know this
            </button>
            <button type="button" className="btn-ghost px-4 py-2.5" onClick={() => { setIndex(Math.min(cards.length - 1, index + 1)); setFlipped(false) }} disabled={index === cards.length - 1} aria-label="Next card">
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              className="btn-ghost px-4 py-2 text-xs"
              onClick={() => {
                const shuffled = [...cards].sort(() => Math.random() - 0.5)
                setCards(shuffled)
                setIndex(0)
                setFlipped(false)
              }}
            >
              <Shuffle className="h-3.5 w-3.5" /> Shuffle
            </button>
            <button type="button" className="btn-ghost px-4 py-2 text-xs" onClick={() => { saveDeck(topic, cards); toast.success('Deck saved to your library') }}>
              <Layers className="h-3.5 w-3.5" /> Save deck
            </button>
            <button type="button" className="btn-ghost px-4 py-2 text-xs" onClick={() => setPhase('setup')}>
              <RefreshCw className="h-3.5 w-3.5" /> New deck
            </button>
          </div>

          {done === cards.length && cards.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass mt-6 rounded-2xl p-6 text-center">
              <p className="font-display text-lg font-bold text-gradient">Deck mastered! 🎉</p>
              <p className="mt-1 text-sm text-muted-foreground">You marked every card as known. Shuffle and go again to lock it in.</p>
            </motion.div>
          )}
        </div>
      )}
    </div>
  )
}
