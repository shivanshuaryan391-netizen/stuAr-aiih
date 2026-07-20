import { useEffect, useMemo, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Bell,
  Check,
  Flame,
  LogOut,
  Menu,
  Moon,
  Settings,
  Sun,
  Trash2,
  User,
  Zap,
} from 'lucide-react'
import { Logo } from '@/components/brand/Logo'
import { BackgroundFX } from '@/components/common/BackgroundFX'
import { ToolIcon } from '@/components/common/ToolIcon'
import { CommandPalette } from '@/components/search/CommandPalette'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/services/auth'
import { useStore } from '@/services/store'
import { TOOL_MAP } from '@/services/tools'
import { initials, timeAgo } from '@/lib/format'
import { cn } from '@/lib/utils'

const NAV_SECTIONS: { title: string; items: { label: string; to: string; icon: string }[] }[] = [
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard', to: '/app', icon: 'LayoutDashboard' },
      { label: 'AI Chat', to: '/app/chat', icon: 'MessageSquare' },
      { label: 'Tools Library', to: '/app/tools', icon: 'Library' },
    ],
  },
  {
    title: 'Learn',
    items: [
      { label: 'AI Tutor', to: '/app/tools/ai-tutor', icon: 'GraduationCap' },
      { label: 'Flashcards', to: '/app/tools/flashcards', icon: 'Layers' },
      { label: 'Quiz Generator', to: '/app/tools/quiz-generator', icon: 'ClipboardList' },
      { label: 'Study Planner', to: '/app/tools/study-planner', icon: 'CalendarClock' },
    ],
  },
  {
    title: 'Productivity',
    items: [
      { label: 'Todo', to: '/app/tools/todo', icon: 'ListTodo' },
      { label: 'Notes', to: '/app/tools/notes', icon: 'StickyNote' },
      { label: 'Calendar', to: '/app/tools/calendar', icon: 'Calendar' },
      { label: 'Habit Tracker', to: '/app/tools/habit-tracker', icon: 'Repeat' },
      { label: 'Pomodoro', to: '/app/tools/pomodoro', icon: 'Timer' },
    ],
  },
]

function SideNav({ onNavigate }: { onNavigate?: () => void }) {
  const { pins } = useStore()
  const pinned = pins.map((id) => TOOL_MAP[id]).filter(Boolean).slice(0, 6)
  return (
    <div className="flex h-full flex-col">
      <div className="px-5 py-5">
        <Logo />
      </div>
      <nav className="flex-1 space-y-5 overflow-y-auto px-3 pb-4" aria-label="Main navigation">
        {NAV_SECTIONS.map((section) => (
          <div key={section.title}>
            <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/70">
              {section.title}
            </p>
            <ul className="space-y-0.5">
              {section.items.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.to === '/app'}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      cn(
                        'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                        isActive
                          ? 'bg-gradient-to-r from-brand/25 to-brand/[0.08] text-foreground shadow-inner-line'
                          : 'text-muted-foreground hover:bg-white/[0.05] hover:text-foreground',
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span
                          className={cn(
                            'grid h-7 w-7 place-items-center rounded-lg transition-colors',
                            isActive ? 'bg-gradient-to-br from-brand to-aqua text-white' : 'bg-white/[0.05] text-muted-foreground group-hover:text-foreground',
                          )}
                        >
                          <ToolIcon name={item.icon} className="h-3.5 w-3.5" />
                        </span>
                        {item.label}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
        {pinned.length > 0 && (
          <div>
            <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/70">
              Pinned tools
            </p>
            <ul className="space-y-0.5">
              {pinned.map((t) => (
                <li key={t!.id}>
                  <NavLink
                    to={`/app/tools/${t!.id}`}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      cn(
                        'group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all',
                        isActive
                          ? 'bg-gradient-to-r from-aqua/25 to-aqua/[0.06] text-foreground'
                          : 'text-muted-foreground hover:bg-white/[0.05] hover:text-foreground',
                      )
                    }
                  >
                    <span className="grid h-7 w-7 place-items-center rounded-lg bg-white/[0.05] text-aqua-soft">
                      <ToolIcon name={t!.icon} className="h-3.5 w-3.5" />
                    </span>
                    {t!.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>
      <div className="border-t border-white/[0.07] p-3">
        <NavLink
          to="/app/settings"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/[0.05] hover:text-foreground"
        >
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-white/[0.05]">
            <Settings className="h-3.5 w-3.5" />
          </span>
          Settings
        </NavLink>
      </div>
    </div>
  )
}

function NotificationsBell() {
  const { notifications, markAllRead, clearNotifications } = useStore()
  const unread = notifications.filter((n) => !n.read).length
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`}
          className="relative grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-muted-foreground transition-colors hover:bg-white/[0.08] hover:text-foreground"
        >
          <Bell className="h-4 w-4" />
          {unread > 0 && (
            <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-gradient-to-r from-brand to-aqua px-1 text-[10px] font-bold text-white">
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="glass-strong w-80 rounded-2xl border-white/10 p-2">
        <DropdownMenuLabel className="flex items-center justify-between px-2 py-1.5">
          <span className="font-display text-sm font-semibold">Notifications</span>
          <div className="flex gap-1">
            <button type="button" onClick={markAllRead} aria-label="Mark all read" className="rounded-lg p-1.5 text-muted-foreground hover:bg-white/[0.07] hover:text-foreground">
              <Check className="h-3.5 w-3.5" />
            </button>
            <button type="button" onClick={clearNotifications} aria-label="Clear all" className="rounded-lg p-1.5 text-muted-foreground hover:bg-white/[0.07] hover:text-foreground">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/[0.07]" />
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-muted-foreground">
              All caught up. Achievements and reminders will appear here.
            </p>
          ) : (
            notifications.map((n) => (
              <div key={n.id} className={cn('rounded-xl px-3 py-2.5', !n.read && 'bg-brand/[0.08]')}>
                <p className="text-sm font-medium leading-5">{n.title}</p>
                <p className="mt-0.5 text-xs leading-5 text-muted-foreground">{n.body}</p>
                <p className="mt-1 text-[10px] uppercase tracking-wide text-muted-foreground/60">{timeAgo(n.ts)}</p>
              </div>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function AvatarMenu() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  if (!user) return null
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Account menu"
          className="grid h-10 w-10 place-items-center rounded-xl font-display text-sm font-bold text-white shadow-glow-sm transition-transform hover:scale-105"
          style={{ background: `linear-gradient(135deg, ${user.avatarColor}, ${user.avatarColor}88)` }}
        >
          {initials(user.name)}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="glass-strong w-60 rounded-2xl border-white/10 p-2">
        <DropdownMenuLabel className="px-2 py-2">
          <p className="font-display text-sm font-semibold">{user.name}</p>
          <p className="truncate text-xs font-normal text-muted-foreground">{user.email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/[0.07]" />
        <DropdownMenuItem className="rounded-xl" onSelect={() => navigate('/app/profile')}>
          <User className="mr-2 h-4 w-4 text-brand-soft" /> Profile
        </DropdownMenuItem>
        <DropdownMenuItem className="rounded-xl" onSelect={() => navigate('/app/settings')}>
          <Settings className="mr-2 h-4 w-4 text-aqua-soft" /> Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-white/[0.07]" />
        <DropdownMenuItem
          className="rounded-xl text-red-400 focus:text-red-300"
          onSelect={async () => {
            await signOut()
            navigate('/')
          }}
        >
          <LogOut className="mr-2 h-4 w-4" /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const { streak, level, levelProgress, levelSpan, settings, updateSettings } = useStore()

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [location.pathname])

  const levelPct = useMemo(() => Math.round((levelProgress / levelSpan) * 100), [levelProgress, levelSpan])

  return (
    <div className="relative min-h-screen">
      <BackgroundFX subtle />
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[264px] border-r border-white/[0.07] bg-sidebar/60 backdrop-blur-2xl lg:block">
        <SideNav />
      </aside>

      {/* Mobile drawer */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-[280px] border-white/10 bg-background/95 p-0 backdrop-blur-2xl">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SideNav onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="lg:pl-[264px]">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-white/[0.07] bg-background/70 px-4 backdrop-blur-2xl sm:px-6">
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-muted-foreground lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 sm:flex">
            <Flame className="h-4 w-4 text-orange-400" />
            <span className="text-sm font-semibold">{streak}</span>
            <span className="text-xs text-muted-foreground">day streak</span>
          </div>
          <div className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 md:flex" title={`Level ${level} · ${levelProgress}/${levelSpan} XP`}>
            <Zap className="h-4 w-4 text-aqua-soft" />
            <span className="text-sm font-semibold">Lv {level}</span>
            <div className="h-1.5 w-16 overflow-hidden rounded-full bg-white/[0.08]">
              <div className="h-full rounded-full bg-gradient-to-r from-brand to-aqua transition-all duration-700" style={{ width: `${levelPct}%` }} />
            </div>
          </div>
          <div className="flex-1" />
          <CommandPalette />
          <button
            type="button"
            onClick={() => updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' })}
            aria-label={`Switch to ${settings.theme === 'dark' ? 'light' : 'dark'} mode`}
            className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-muted-foreground transition-colors hover:bg-white/[0.08] hover:text-foreground"
          >
            {settings.theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <NotificationsBell />
          <AvatarMenu />
        </header>

        {/* Page content with transitions */}
        <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
