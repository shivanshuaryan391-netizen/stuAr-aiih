import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Award, CheckCircle2, RefreshCw, Sparkles, XCircle } from 'lucide-react'
import { toast } from 'sonner'
import type { QuizQuestion } from '@/types'
import { useStore } from '@/services/store'
import { complete, extractJson } from '@/services/ai'
import { ConnectAI } from '@/components/common/ConnectAI'
import { PageHeader } from '@/components/common/EmptyState'
import { XP } from '@/config/achievements'
import { cn } from '@/lib/utils'

type Phase = 'setup' | 'generating' | 'playing' | 'results'

export default function QuizPage() {
  const { settings, logActivity, saveQuizResult } = useStore()
  const [topic, setTopic] = useState('')
  const [count, setCount] = useState('8')
  const [difficulty, setDifficulty] = useState('Medium')
  const [error, setError] = useState('')
  const [phase, setPhase] = useState<Phase>('setup')
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [answers, setAnswers] = useState<(number | null)[]>([])

  useEffect(() => {
    document.title = 'Quiz Generator · StuAr AI'
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
              'You are a quiz generator. Reply ONLY with a JSON array: [{"question":"...","options":["A","B","C","D"],"answer":0,"explanation":"..."}]. answer = index of the correct option (0-3). Exactly 4 options per question, realistic distractors, explanation max 30 words. No markdown.',
          },
          {
            role: 'user',
            content: `Create ${count} ${difficulty} quiz questions on: ${topic}${settings.language !== 'English' ? `. Write in ${settings.language}.` : ''}`,
          },
        ],
        temperature: 0.6,
      })
      const parsed = extractJson<QuizQuestion[]>(raw)
      const clean = parsed.filter((q) => q.question && Array.isArray(q.options) && q.options.length === 4 && typeof q.answer === 'number').slice(0, 20)
      if (clean.length < 3) throw new Error('Too few questions generated — try again.')
      setQuestions(clean)
      setAnswers(Array(clean.length).fill(null))
      setIndex(0)
      setPicked(null)
      setPhase('playing')
    } catch (e) {
      setPhase('setup')
      toast.error('Generation failed', { description: e instanceof Error ? e.message : 'Try again.' })
    }
  }

  const pick = (optionIdx: number) => {
    if (picked !== null) return
    setPicked(optionIdx)
    setAnswers((prev) => prev.map((a, i) => (i === index ? optionIdx : a)))
  }

  const next = () => {
    if (index < questions.length - 1) {
      setIndex(index + 1)
      setPicked(answers[index + 1])
    } else {
      const score = answers.reduce<number>((s, a, i) => s + (a === questions[i]!.answer ? 1 : 0), 0)
      setPhase('results')
      logActivity('quiz', `Quiz: ${topic} — scored ${score}/${questions.length}`, XP.quiz, 'quiz-generator')
      saveQuizResult(topic, questions, score)
    }
  }

  const q = questions[index]
  const score = answers.reduce<number>((s, a, i) => s + (a === questions[i]?.answer ? 1 : 0), 0)

  return (
    <div>
      <Link to="/app/tools" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Tools Library
      </Link>
      <PageHeader title="Quiz Generator" subtitle="Generate an interactive quiz on anything — answer here, get scored instantly." icon="ClipboardList" />

      {!hasKey ? (
        <ConnectAI />
      ) : phase === 'setup' || phase === 'generating' ? (
        <div className="glass mx-auto max-w-xl rounded-2xl p-6 sm:p-8">
          <div className="space-y-4">
            <div>
              <label htmlFor="qz-topic" className="mb-1.5 block text-sm font-medium">Topic</label>
              <input id="qz-topic" className="input-field" placeholder="e.g. World War II, Organic chemistry basics…" value={topic} onChange={(e) => { setTopic(e.target.value); setError('') }} onKeyDown={(e) => e.key === 'Enter' && void generate()} />
              {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="qz-count" className="mb-1.5 block text-sm font-medium">Questions</label>
                <select id="qz-count" className="input-field" value={count} onChange={(e) => setCount(e.target.value)}>
                  {['5', '8', '10', '15'].map((n) => (
                    <option key={n} value={n} className="bg-[#0a0f24]">{n}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="qz-diff" className="mb-1.5 block text-sm font-medium">Difficulty</label>
                <select id="qz-diff" className="input-field" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                  {['Easy', 'Medium', 'Hard', 'Mixed'].map((d) => (
                    <option key={d} value={d} className="bg-[#0a0f24]">{d}</option>
                  ))}
                </select>
              </div>
            </div>
            <button type="button" className="btn-primary w-full" onClick={() => void generate()} disabled={phase === 'generating'}>
              <Sparkles className="h-4 w-4" />
              {phase === 'generating' ? 'Building your quiz…' : 'Generate quiz'}
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
      ) : phase === 'playing' && q ? (
        <div className="mx-auto max-w-2xl">
          <div className="mb-4 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Question <span className="font-semibold text-foreground">{index + 1}</span> / {questions.length}
            </span>
            <span className="chip">{topic}</span>
          </div>
          <div className="mb-6 h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
            <div className="h-full rounded-full bg-gradient-to-r from-brand to-aqua transition-all duration-500" style={{ width: `${((index + (picked !== null ? 1 : 0)) / questions.length) * 100}%` }} />
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={index} initial={{ opacity: 0, x: 32 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.28 }}>
              <h2 className="font-display text-xl font-semibold leading-8 sm:text-2xl">{q.question}</h2>
              <div className="mt-6 space-y-3">
                {q.options.map((opt, oi) => {
                  const isCorrect = picked !== null && oi === q.answer
                  const isWrong = picked === oi && oi !== q.answer
                  return (
                    <button
                      key={oi}
                      type="button"
                      onClick={() => pick(oi)}
                      disabled={picked !== null}
                      className={cn(
                        'glass-subtle flex w-full items-center gap-3.5 rounded-xl px-4 py-3.5 text-left text-[15px] transition-all',
                        picked === null && 'hover:border-brand/50 hover:bg-brand/[0.08]',
                        isCorrect && 'border-emerald-500/60 bg-emerald-500/10',
                        isWrong && 'border-red-500/60 bg-red-500/10',
                        picked !== null && !isCorrect && !isWrong && 'opacity-50',
                      )}
                    >
                      <span className={cn(
                        'grid h-8 w-8 shrink-0 place-items-center rounded-lg font-display text-sm font-bold',
                        isCorrect ? 'bg-emerald-500 text-white' : isWrong ? 'bg-red-500 text-white' : 'bg-white/[0.07] text-muted-foreground',
                      )}>
                        {isCorrect ? <CheckCircle2 className="h-4 w-4" /> : isWrong ? <XCircle className="h-4 w-4" /> : String.fromCharCode(65 + oi)}
                      </span>
                      {opt}
                    </button>
                  )
                })}
              </div>
              <AnimatePresence>
                {picked !== null && (
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className={cn('mt-5 rounded-xl border px-4 py-3.5 text-sm leading-6', picked === q.answer ? 'border-emerald-500/40 bg-emerald-500/[0.08]' : 'border-amber-500/40 bg-amber-500/[0.08]')}>
                    <p className="font-semibold">{picked === q.answer ? '✅ Correct!' : `💡 The answer is ${String.fromCharCode(65 + q.answer)}.`}</p>
                    <p className="mt-1 text-muted-foreground">{q.explanation}</p>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="mt-6 flex justify-end">
                <button type="button" className="btn-primary" onClick={next} disabled={picked === null}>
                  {index === questions.length - 1 ? 'See results' : 'Next question'} <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="glass mx-auto max-w-xl rounded-2xl p-8 text-center sm:p-10">
          <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-brand to-aqua shadow-glow">
            <Award className="h-8 w-8 text-white" />
          </div>
          <p className="font-display text-4xl font-bold">
            {score}<span className="text-muted-foreground">/{questions.length}</span>
          </p>
          <p className="mt-2 font-display text-lg font-semibold text-gradient">
            {score === questions.length ? 'Perfect score! 🏆' : score >= questions.length * 0.7 ? 'Great work! 🎉' : score >= questions.length * 0.4 ? 'Solid effort — keep going' : 'Time to review and retry'}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            +{XP.quiz} XP earned · saved to your quiz history
          </p>
          <div className="mx-auto mt-6 max-h-72 space-y-2 overflow-y-auto text-left">
            {questions.map((qq, i) => {
              const ok = answers[i] === qq.answer
              return (
                <div key={i} className={cn('flex items-start gap-2.5 rounded-xl border px-3.5 py-2.5 text-sm', ok ? 'border-emerald-500/25 bg-emerald-500/[0.05]' : 'border-red-500/25 bg-red-500/[0.05]')}>
                  {ok ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" /> : <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />}
                  <div>
                    <p className="font-medium leading-5">{qq.question}</p>
                    {!ok && <p className="mt-0.5 text-xs text-muted-foreground">Correct: {qq.options[qq.answer]}</p>}
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-7 flex justify-center gap-3">
            <button type="button" className="btn-primary" onClick={() => { setPhase('setup'); setTopic('') }}>
              <RefreshCw className="h-4 w-4" /> New quiz
            </button>
            <button type="button" className="btn-ghost" onClick={() => { setAnswers(Array(questions.length).fill(null)); setIndex(0); setPicked(null); setPhase('playing') }}>
              Retry same quiz
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
