import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Mail, MapPin, Send } from 'lucide-react'
import { toast } from 'sonner'
import { FAQS, SITE } from '@/config/site'
import { SectionHeading } from './Sections'
import { cn } from '@/lib/utils'

export function Faq() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <section id="faq" className="section-pad mx-auto max-w-4xl py-20 lg:py-28">
      <SectionHeading kicker="FAQ" title="Questions, answered" sub="Everything else you might want to know before diving in." />
      <div className="space-y-3">
        {FAQS.map((f, i) => {
          const isOpen = open === i
          return (
            <motion.div
              key={f.q}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              className={cn('glass overflow-hidden rounded-2xl transition-colors', isOpen && 'border-brand/30')}
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              >
                <span className="font-display text-[15px] font-semibold">{f.q}</span>
                <ChevronDown className={cn('h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300', isOpen && 'rotate-180 text-brand-soft')} />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: 'easeInOut' }}
                  >
                    <p className="px-6 pb-5 text-sm leading-7 text-muted-foreground">{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}

export function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [sent, setSent] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (form.name.trim().length < 2) errs.name = 'Please enter your name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email address.'
    if (form.message.trim().length < 10) errs.message = 'Tell us a bit more (10+ characters).'
    setErrors(errs)
    if (Object.keys(errs).length) return
    setSent(true)
    toast.success('Message sent!', { description: 'The StuAr team will reply within one business day.' })
  }

  return (
    <section id="contact" className="section-pad mx-auto max-w-7xl py-20 lg:py-28">
      <div className="glass-strong grid overflow-hidden rounded-3xl lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative p-8 sm:p-12">
          <div className="absolute -left-16 -top-16 h-56 w-56 rounded-full bg-brand/25 blur-3xl" aria-hidden="true" />
          <span className="chip">Contact</span>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Talk to a human.
            <br />
            <span className="text-gradient">We answer fast.</span>
          </h2>
          <p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground">
            School partnerships, Teams plans, press, or just feedback on your favorite tool — our inbox is open.
          </p>
          <div className="mt-8 space-y-4 text-sm">
            <p className="flex items-center gap-3 text-muted-foreground">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand/15 text-brand-soft">
                <Mail className="h-4 w-4" />
              </span>
              {SITE.email}
            </p>
            <p className="flex items-center gap-3 text-muted-foreground">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-aqua/15 text-aqua-soft">
                <MapPin className="h-4 w-4" />
              </span>
              Remote-first · serving 120+ countries
            </p>
          </div>
        </div>
        <div className="border-t border-white/[0.07] p-8 sm:p-12 lg:border-l lg:border-t-0">
          {sent ? (
            <div className="grid h-full min-h-64 place-items-center text-center">
              <div>
                <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-emerald-500/15 text-emerald-400">
                  <Send className="h-6 w-6" />
                </div>
                <h3 className="font-display text-xl font-semibold">Message on its way</h3>
                <p className="mt-2 text-sm text-muted-foreground">We&apos;ll get back to {form.email} shortly.</p>
                <button type="button" className="btn-ghost mt-6" onClick={() => { setSent(false); setForm({ name: '', email: '', message: '' }) }}>
                  Send another
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium">Name</label>
                  <input
                    id="contact-name"
                    className="input-field"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your name"
                  />
                  {errors.name && <p className="mt-1.5 text-xs text-red-400">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium">Email</label>
                  <input
                    id="contact-email"
                    type="email"
                    className="input-field"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@school.edu"
                  />
                  {errors.email && <p className="mt-1.5 text-xs text-red-400">{errors.email}</p>}
                </div>
              </div>
              <div>
                <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium">Message</label>
                <textarea
                  id="contact-message"
                  rows={5}
                  className="input-field resize-none"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us about your class, team, or idea…"
                />
                {errors.message && <p className="mt-1.5 text-xs text-red-400">{errors.message}</p>}
              </div>
              <button type="submit" className="btn-primary w-full sm:w-auto">
                Send message <Send className="h-4 w-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
