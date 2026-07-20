import { Link } from 'react-router-dom'
import { ArrowUpRight, Github, Twitter, Youtube, Linkedin } from 'lucide-react'
import { Logo } from '@/components/brand/Logo'
import { SITE } from '@/config/site'

const COLUMNS = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'AI Tools', href: '#tools' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'Dashboard', to: '/app' },
    ],
  },
  {
    title: 'For learners',
    links: [
      { label: 'AI Tutor', to: '/app/tools/ai-tutor' },
      { label: 'Flashcards', to: '/app/tools/flashcards' },
      { label: 'Study Planner', to: '/app/tools/study-planner' },
      { label: 'Quiz Generator', to: '/app/tools/quiz-generator' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Why StuAr', href: '#why' },
      { label: 'Testimonials', href: '#testimonials' },
      { label: 'FAQ', href: '#faq' },
      { label: 'Contact', href: '#contact' },
    ],
  },
]

const SOCIALS = [
  { icon: Twitter, label: 'StuAr AI on X', href: 'https://x.com' },
  { icon: Github, label: 'StuAr AI on GitHub', href: 'https://github.com' },
  { icon: Youtube, label: 'StuAr AI on YouTube', href: 'https://youtube.com' },
  { icon: Linkedin, label: 'StuAr AI on LinkedIn', href: 'https://linkedin.com' },
]

export function Footer() {
  return (
    <footer className="border-t border-white/[0.07] bg-white/[0.015]">
      <div className="section-pad mx-auto max-w-7xl py-14">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-6 text-muted-foreground">{SITE.mission}</p>
            <div className="mt-6 flex gap-2.5">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-muted-foreground transition-all hover:border-brand/40 hover:text-brand-soft"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground/80">{col.title}</h4>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      {'to' in l && l.to ? (
                        <Link to={l.to} className="group inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground">
                          {l.label}
                          <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                        </Link>
                      ) : (
                        <a href={l.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                          {l.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/[0.07] pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {SITE.name}. Learn Smarter. Build Your Future.
          </p>
          <div className="flex gap-6 text-xs text-muted-foreground">
            <span>Privacy-first</span>
            <span>·</span>
            <span>Terms</span>
            <span>·</span>
            <span>Made for learners</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
