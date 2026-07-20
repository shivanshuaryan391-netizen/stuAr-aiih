import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import { TESTIMONIALS } from '@/config/site'
import { SectionHeading } from './Sections'

export function Testimonials() {
  return (
    <section id="testimonials" className="section-pad mx-auto max-w-7xl py-20 lg:py-28">
      <SectionHeading
        kicker="Testimonials"
        title="Loved by learners everywhere"
        sub="From JEE halls to UCLA lecture theaters — here is what the StuAr community says."
      />
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {TESTIMONIALS.map((t, i) => (
          <motion.figure
            key={t.name}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
            className="glass relative flex flex-col rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-glow-sm"
          >
            <Quote className="absolute right-5 top-5 h-7 w-7 text-brand/25" aria-hidden="true" />
            <div className="mb-3 flex gap-0.5" aria-label="5 star rating">
              {Array.from({ length: 5 }).map((_, s) => (
                <Star key={s} className="h-4 w-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <blockquote className="flex-1 text-sm leading-6 text-foreground/85">&ldquo;{t.quote}&rdquo;</blockquote>
            <figcaption className="mt-5 flex items-center gap-3 border-t border-white/[0.07] pt-4">
              <span
                className="grid h-10 w-10 place-items-center rounded-full font-display text-sm font-bold text-white"
                style={{ background: `linear-gradient(135deg, ${t.color}, ${t.color}99)` }}
              >
                {t.initials}
              </span>
              <div>
                <p className="text-sm font-semibold">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  )
}
