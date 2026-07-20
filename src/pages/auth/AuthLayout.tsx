import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Flame, Layers, Sparkles } from 'lucide-react'
import { Logo } from '@/components/brand/Logo'
import { BackgroundFX } from '@/components/common/BackgroundFX'

const PERKS = [
  { icon: Sparkles, text: 'ChatGPT-class AI tutor with streaming answers' },
  { icon: Layers, text: '40+ tools for study, writing, code & business' },
  { icon: Flame, text: 'Streaks, XP and achievements that keep you going' },
]

export function AuthLayout({ children, title, subtitle }: { children: ReactNode; title: string; subtitle: string }) {
  return (
    <div className="relative grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      <BackgroundFX subtle />
      {/* Brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden p-12 lg:flex">
        <Link to="/" aria-label="Back to home">
          <Logo />
        </Link>
        <div className="relative">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-display text-4xl font-bold leading-tight xl:text-5xl"
          >
            Your future self
            <br />
            is <span className="text-gradient">already studying.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-5 max-w-md text-base leading-7 text-muted-foreground"
          >
            Join 120,000+ learners using StuAr AI to study deeper, stay consistent, and actually enjoy the process.
          </motion.p>
          <ul className="mt-10 space-y-4">
            {PERKS.map((p, i) => (
              <motion.li
                key={p.text}
                initial={{ opacity: 0, x: -18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                className="glass-subtle flex items-center gap-3.5 rounded-xl px-4 py-3.5"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-brand/80 to-aqua/80 text-white">
                  <p.icon className="h-4 w-4" />
                </span>
                <span className="text-sm font-medium text-foreground/85">{p.text}</span>
              </motion.li>
            ))}
          </ul>
        </div>
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} StuAr AI · Learn Smarter. Build Your Future.</p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center px-5 py-10 sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="w-full max-w-md"
        >
          <div className="mb-8 lg:hidden">
            <Link to="/" aria-label="Back to home">
              <Logo />
            </Link>
          </div>
          <div className="glass rounded-2xl p-7 sm:p-9">
            <h1 className="font-display text-2xl font-bold">{title}</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>
            <div className="mt-7">{children}</div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
