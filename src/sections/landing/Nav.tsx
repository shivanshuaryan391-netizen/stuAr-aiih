import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X, ArrowRight } from 'lucide-react'
import { Logo } from '@/components/brand/Logo'
import { cn } from '@/lib/utils'
import { useAuth } from '@/services/auth'

const LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Why StuAr', href: '#why' },
  { label: 'AI Tools', href: '#tools' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
]

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-500',
        scrolled ? 'border-b border-white/[0.07] bg-background/70 backdrop-blur-2xl' : 'bg-transparent',
      )}
    >
      <nav className="section-pad mx-auto flex h-16 max-w-7xl items-center justify-between">
        <Link to="/" aria-label="StuAr AI home">
          <Logo />
        </Link>
        <div className="hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-lg px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </div>
        <div className="hidden items-center gap-3 lg:flex">
          {user ? (
            <Link to="/app" className="btn-primary">
              Open Dashboard <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn-ghost">
                Sign in
              </Link>
              <Link to="/register" className="btn-primary">
                Get started free <ArrowRight className="h-4 w-4" />
              </Link>
            </>
          )}
        </div>
        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04] lg:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden border-b border-white/[0.07] bg-background/95 backdrop-blur-2xl lg:hidden"
          >
            <div className="section-pad flex flex-col gap-1 py-4">
              {LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-white/[0.06] hover:text-foreground"
                >
                  {l.label}
                </a>
              ))}
              <div className="mt-3 flex gap-3">
                {user ? (
                  <Link to="/app" className="btn-primary flex-1">
                    Open Dashboard
                  </Link>
                ) : (
                  <>
                    <Link to="/login" className="btn-ghost flex-1">
                      Sign in
                    </Link>
                    <Link to="/register" className="btn-primary flex-1">
                      Get started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
