import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Pin, PinOff, Search } from 'lucide-react'
import { CATEGORIES, TOOLS } from '@/services/tools'
import { useStore } from '@/services/store'
import { ToolIcon } from '@/components/common/ToolIcon'
import { PageHeader } from '@/components/common/EmptyState'
import { cn } from '@/lib/utils'

export default function Tools() {
  const { pins, togglePin } = useStore()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<string>('All')

  useEffect(() => {
    document.title = 'AI Tools Library · StuAr AI'
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return TOOLS.filter((t) => {
      const inCategory = category === 'All' || t.category === category
      const matches = !q || t.name.toLowerCase().includes(q) || t.tagline.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
      return inCategory && matches
    })
  }, [query, category])

  return (
    <div>
      <PageHeader title="AI Tools Library" subtitle={`${TOOLS.length} precision tools across ${CATEGORIES.length} categories — pin your favorites.`} icon="Library" />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools…"
            aria-label="Search tools"
            className="input-field pl-10"
          />
        </div>
        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
          {['All', ...CATEGORIES].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={cn(
                'shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-all',
                category === c
                  ? 'bg-gradient-to-r from-brand-deep to-brand text-white shadow-glow-sm'
                  : 'border border-white/10 bg-white/[0.04] text-muted-foreground hover:text-foreground',
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center">
          <p className="font-display text-lg font-semibold">No tools match &ldquo;{query}&rdquo;</p>
          <p className="mt-1 text-sm text-muted-foreground">Try a different search or category.</p>
        </div>
      ) : (
        (category === 'All' ? CATEGORIES : [category as (typeof CATEGORIES)[number]]).map((cat) => {
          const tools = filtered.filter((t) => t.category === cat)
          if (!tools.length) return null
          return (
            <section key={cat} className="mb-8">
              <h2 className="mb-4 flex items-center gap-2.5 font-display text-lg font-semibold">
                <span className="h-5 w-1 rounded-full bg-gradient-to-b from-brand to-aqua" />
                {cat}
                <span className="text-xs font-normal text-muted-foreground">{tools.length} tools</span>
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {tools.map((t, i) => {
                  const pinned = pins.includes(t.id)
                  return (
                    <motion.div
                      key={t.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: Math.min(i * 0.04, 0.3) }}
                      className="glass group relative rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-glow-sm"
                    >
                      <button
                        type="button"
                        onClick={() => togglePin(t.id)}
                        aria-label={pinned ? `Unpin ${t.name}` : `Pin ${t.name}`}
                        className={cn(
                          'absolute right-3.5 top-3.5 rounded-lg p-2 transition-all',
                          pinned ? 'text-brand-soft' : 'text-muted-foreground opacity-0 hover:text-foreground group-hover:opacity-100',
                        )}
                      >
                        {pinned ? <Pin className="h-4 w-4 fill-current" /> : <PinOff className="h-4 w-4" />}
                      </button>
                      <Link to={`/app/tools/${t.id}`} className="block">
                        <div className="mb-3.5 grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-brand/25 to-aqua/20 text-brand-soft transition-all group-hover:from-brand group-hover:to-aqua group-hover:text-white group-hover:shadow-glow-sm">
                          <ToolIcon name={t.icon} className="h-5 w-5" />
                        </div>
                        <h3 className="font-display text-base font-semibold">{t.name}</h3>
                        <p className="mt-0.5 text-xs font-medium text-aqua-soft">{t.tagline}</p>
                        <p className="mt-2 line-clamp-2 text-[13px] leading-5 text-muted-foreground">{t.description}</p>
                      </Link>
                    </motion.div>
                  )
                })}
              </div>
            </section>
          )
        })
      )}
    </div>
  )
}
