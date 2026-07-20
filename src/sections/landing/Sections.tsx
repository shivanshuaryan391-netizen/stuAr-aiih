import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { FEATURES, WHY_POINTS } from '@/config/site'
import { ToolIcon } from '@/components/common/ToolIcon'

const reveal = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
}

export function SectionHeading({ kicker, title, sub }: { kicker: string; title: string; sub?: string }) {
  return (
    <motion.div {...reveal} transition={{ duration: 0.55 }} className="mx-auto mb-14 max-w-2xl text-center">
      <span className="chip">{kicker}</span>
      <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      {sub && <p className="mt-4 text-base leading-7 text-muted-foreground">{sub}</p>}
    </motion.div>
  )
}

export function Features() {
  return (
    <section id="features" className="section-pad mx-auto max-w-7xl py-20 lg:py-28">
      <SectionHeading
        kicker="Features"
        title="Everything a serious learner needs"
        sub="One premium workspace that replaces your tutor, notes app, planner and flashcards — powered by frontier AI."
      />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f, i) => (
          <motion.article
            key={f.title}
            {...reveal}
            transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
            className="glass group relative overflow-hidden rounded-2xl p-6 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-glow"
          >
            <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-brand/15 blur-2xl transition-all duration-500 group-hover:bg-brand/30" aria-hidden="true" />
            <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-brand/80 to-aqua/80 text-white shadow-glow-sm transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
              <ToolIcon name={f.icon} className="h-5 w-5" />
            </div>
            <h3 className="font-display text-lg font-semibold">{f.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{f.body}</p>
          </motion.article>
        ))}
      </div>
    </section>
  )
}

export function Why() {
  return (
    <section id="why" className="section-pad mx-auto max-w-7xl py-20 lg:py-28">
      <div className="grid items-center gap-14 lg:grid-cols-2">
        <motion.div {...reveal} transition={{ duration: 0.6 }}>
          <span className="chip">Why StuAr AI</span>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Not another chatbot.
            <br />
            <span className="text-gradient">A learning operating system.</span>
          </h2>
          <p className="mt-4 max-w-lg text-base leading-7 text-muted-foreground">
            Chat apps answer questions. StuAr AI builds learners — with structure, memory, momentum and tools
            engineered for outcomes.
          </p>
          <ul className="mt-8 space-y-5">
            {WHY_POINTS.map((p, i) => (
              <motion.li
                key={p.title}
                {...reveal}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="flex gap-3.5"
              >
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand to-aqua">
                  <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
                </span>
                <div>
                  <p className="font-display font-semibold">{p.title}</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{p.body}</p>
                </div>
              </motion.li>
            ))}
          </ul>
        </motion.div>
        <motion.div {...reveal} transition={{ duration: 0.6, delay: 0.1 }} className="relative">
          <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-tr from-aqua/25 via-transparent to-brand/25 blur-2xl" aria-hidden="true" />
          <div className="glass-strong relative grid grid-cols-2 gap-4 rounded-2xl p-5">
            {[
              { k: '2.4M+', v: 'questions answered', tone: 'text-brand-soft' },
              { k: '860K', v: 'flashcards reviewed', tone: 'text-aqua-soft' },
              { k: '92%', v: 'report better grades', tone: 'text-emerald-400' },
              { k: '41 days', v: 'median streak', tone: 'text-amber-400' },
            ].map((s) => (
              <div key={s.v} className="glass-subtle rounded-xl p-5">
                <p className={`font-display text-2xl font-bold sm:text-3xl ${s.tone}`}>{s.k}</p>
                <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">{s.v}</p>
              </div>
            ))}
            <div className="glass-subtle col-span-2 rounded-xl p-5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Weekly study time</span>
                <span className="text-xs text-muted-foreground">vs. before StuAr</span>
              </div>
              <div className="mt-3 space-y-2.5">
                <div>
                  <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                    <span>With StuAr AI</span>
                    <span>9.5h</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: '92%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full rounded-full bg-gradient-to-r from-brand to-aqua"
                    />
                  </div>
                </div>
                <div>
                  <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                    <span>Before</span>
                    <span>4.1h</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: '40%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
                      className="h-full rounded-full bg-white/25"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
