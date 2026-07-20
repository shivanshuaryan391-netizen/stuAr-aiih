import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { animate, motion, useInView } from 'framer-motion'
import { ArrowRight, Play, Sparkles, Flame, GraduationCap, Check } from 'lucide-react'
import { HERO_STATS } from '@/config/site'
import { useAuth } from '@/services/auth'

function CountUp({ value, suffix, decimals = 0 }: { value: number; suffix: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  useEffect(() => {
    if (!inView || !ref.current) return
    const controls = animate(0, value, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = v.toFixed(decimals) + suffix
      },
    })
    return () => controls.stop()
  }, [inView, value, suffix, decimals])
  return <span ref={ref}>0{suffix}</span>
}

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
}

export function Hero() {
  const { user } = useAuth()
  return (
    <section className="section-pad relative mx-auto max-w-7xl pb-16 pt-32 sm:pt-40 lg:pb-24">
      <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <motion.div {...fadeUp} transition={{ duration: 0.6 }}>
            <span className="chip">
              <Sparkles className="h-3.5 w-3.5" />
              The advanced AI learning platform
            </span>
          </motion.div>
          <motion.h1
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="mt-6 font-display text-[2.6rem] font-bold leading-[1.06] tracking-tight sm:text-6xl lg:text-[4.2rem]"
          >
            Learn <span className="text-gradient">smarter.</span>
            <br />
            Build your future.
          </motion.h1>
          <motion.p
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.16 }}
            className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground"
          >
            StuAr AI gives every student, teacher and self-learner a personal AI tutor, 40+ precision study
            tools, and a gamified workspace that makes consistency irresistible.
          </motion.p>
          <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.24 }} className="mt-8 flex flex-wrap items-center gap-4">
            <Link to={user ? '/app' : '/register'} className="btn-primary h-12 px-7 text-base">
              {user ? 'Open your dashboard' : 'Start learning free'} <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="#tools" className="btn-ghost h-12 px-7 text-base">
              <Play className="h-4 w-4" /> Explore the tools
            </a>
          </motion.div>
          <motion.dl
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.34 }}
            className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4"
          >
            {HERO_STATS.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-display text-3xl font-bold text-foreground">
                  <CountUp value={s.value} suffix={s.suffix} decimals={s.decimals ?? 0} />
                </dd>
                <dd className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">{s.label}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        {/* Product preview */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-brand/30 via-transparent to-aqua/30 blur-2xl" aria-hidden="true" />
          <div className="glass-strong relative rounded-2xl p-5 sm:p-6">
            <div className="flex items-center gap-2 border-b border-white/[0.07] pb-4">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
              <span className="ml-2 text-xs font-medium text-muted-foreground">StuAr AI · Tutor Chat</span>
            </div>
            <div className="space-y-4 pt-5">
              <div className="flex justify-end">
                <div className="max-w-[80%] rounded-2xl rounded-br-md bg-gradient-to-r from-brand-deep to-brand px-4 py-2.5 text-sm text-white shadow-glow-sm">
                  Explain the doppler effect like I'm 15 🚀
                </div>
              </div>
              <div className="flex gap-3">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-brand to-aqua">
                  <GraduationCap className="h-4 w-4 text-white" />
                </div>
                <div className="glass-subtle max-w-[85%] rounded-2xl rounded-tl-md px-4 py-3 text-sm leading-6 text-foreground/90">
                  Imagine an ambulance racing past you — the siren sounds <span className="font-semibold text-aqua-soft">higher</span> as it
                  approaches, then <span className="font-semibold text-brand-soft">lower</span> as it speeds away…
                  <span className="ml-1 inline-block h-4 w-2 animate-caret-blink rounded-sm bg-aqua align-middle" />
                </div>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {['Quiz me on this', 'Make flashcards', 'Add to notes'].map((chip) => (
                  <span key={chip} className="chip">
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="glass-strong absolute -left-4 -top-6 hidden items-center gap-2.5 rounded-2xl px-4 py-3 sm:flex"
          >
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-orange-500/20 text-orange-400">
              <Flame className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display text-sm font-bold leading-none">14-day streak</p>
              <p className="mt-1 text-[11px] text-muted-foreground">Personal best!</p>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="glass-strong absolute -bottom-6 -right-2 hidden items-center gap-2.5 rounded-2xl px-4 py-3 sm:flex"
          >
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-500/20 text-emerald-400">
              <Check className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display text-sm font-bold leading-none">Quiz: 9/10</p>
              <p className="mt-1 text-[11px] text-muted-foreground">+20 XP earned</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
