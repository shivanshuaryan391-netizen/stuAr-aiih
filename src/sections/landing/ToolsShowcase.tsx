import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { CATEGORIES, toolsByCategory } from '@/services/tools'
import { ToolIcon } from '@/components/common/ToolIcon'
import { SectionHeading } from './Sections'
import { cn } from '@/lib/utils'

export function ToolsShowcase() {
  const [active, setActive] = useState<string>('Education')
  const tools = toolsByCategory(active)

  return (
    <section id="tools" className="section-pad mx-auto max-w-7xl py-20 lg:py-28">
      <SectionHeading
        kicker="AI Tools"
        title="40+ tools. Six superpowers."
        sub="Every tool is engineered with expert prompts and streaming output — pick a suite and see."
      />
      <div className="mb-10 flex flex-wrap justify-center gap-2" role="tablist" aria-label="Tool categories">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            role="tab"
            aria-selected={active === c}
            onClick={() => setActive(c)}
            className={cn(
              'rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300',
              active === c
                ? 'bg-gradient-to-r from-brand-deep to-brand text-white shadow-glow-sm'
                : 'border border-white/10 bg-white/[0.04] text-muted-foreground hover:bg-white/[0.08] hover:text-foreground',
            )}
          >
            {c}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3 }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {tools.map((t) => (
            <Link
              key={t.id}
              to={`/app/tools/${t.id}`}
              className="glass group rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-glow-sm"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand/15 text-brand-soft transition-colors group-hover:bg-brand group-hover:text-white">
                  <ToolIcon name={t.icon} className="h-5 w-5" />
                </div>
                <ArrowRight className="h-4 w-4 -translate-x-1 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
              </div>
              <h3 className="font-display text-[15px] font-semibold">{t.name}</h3>
              <p className="mt-1 text-[13px] leading-5 text-muted-foreground">{t.tagline}</p>
            </Link>
          ))}
        </motion.div>
      </AnimatePresence>
      <p className="mt-10 text-center text-sm text-muted-foreground">
        …plus an AI chat with streaming, markdown and code highlighting.{' '}
        <Link to="/register" className="font-semibold text-aqua-soft hover:underline">
          Try them all free
        </Link>
      </p>
    </section>
  )
}
