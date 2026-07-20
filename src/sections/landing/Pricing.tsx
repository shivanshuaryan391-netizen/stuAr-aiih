import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, Sparkles } from 'lucide-react'
import { PRICING } from '@/config/site'
import { SectionHeading } from './Sections'
import { cn } from '@/lib/utils'

export function Pricing() {
  return (
    <section id="pricing" className="section-pad mx-auto max-w-7xl py-20 lg:py-28">
      <SectionHeading
        kicker="Pricing"
        title="Simple plans, serious value"
        sub="Start free forever. Upgrade when you want unlimited AI power."
      />
      <div className="grid items-stretch gap-6 lg:grid-cols-3">
        {PRICING.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className={cn(
              'relative flex flex-col rounded-2xl p-7 transition-all duration-300',
              p.featured
                ? 'glass-strong scale-[1.02] border-brand/40 shadow-glow lg:scale-105'
                : 'glass hover:-translate-y-1',
            )}
          >
            {p.featured && (
              <span className="absolute -top-3.5 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-gradient-to-r from-brand-deep to-aqua px-4 py-1.5 text-xs font-bold text-white shadow-glow-sm">
                <Sparkles className="h-3.5 w-3.5" /> MOST POPULAR
              </span>
            )}
            <h3 className="font-display text-lg font-semibold">{p.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{p.blurb}</p>
            <div className="mt-5 flex items-end gap-2">
              <span className="font-display text-5xl font-bold tracking-tight">
                {p.price === 0 ? 'Free' : `$${p.price}`}
              </span>
              <span className="pb-1.5 text-sm text-muted-foreground">{p.price === 0 ? p.period : p.period}</span>
            </div>
            <ul className="mt-6 flex-1 space-y-3">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-foreground/85">
                  <span className={cn('mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full', p.featured ? 'bg-brand/25 text-brand-soft' : 'bg-white/[0.07] text-aqua-soft')}>
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            <Link
              to={p.name === 'Teams' ? '#contact' : '/register'}
              className={cn('mt-7 w-full', p.featured ? 'btn-primary' : 'btn-ghost')}
            >
              {p.cta}
            </Link>
          </motion.div>
        ))}
      </div>
      <p className="mt-8 text-center text-xs text-muted-foreground">
        Prices in USD. Student discounts available — just ask. Cancel anytime, keep your data forever.
      </p>
    </section>
  )
}
