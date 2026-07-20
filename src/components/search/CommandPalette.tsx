import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LayoutDashboard, MessageSquare, Library, User, Settings, StickyNote, ListTodo, Search } from 'lucide-react'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { TOOLS } from '@/services/tools'
import { useStore } from '@/services/store'
import { ToolIcon } from '@/components/common/ToolIcon'

const PAGES = [
  { id: 'page-dashboard', label: 'Dashboard', to: '/app', icon: LayoutDashboard },
  { id: 'page-chat', label: 'AI Chat', to: '/app/chat', icon: MessageSquare },
  { id: 'page-tools', label: 'Tools Library', to: '/app/tools', icon: Library },
  { id: 'page-profile', label: 'Profile', to: '/app/profile', icon: User },
  { id: 'page-settings', label: 'Settings', to: '/app/settings', icon: Settings },
]

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const { notes, tasks } = useStore()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const noteItems = useMemo(() => notes.slice(0, 8), [notes])
  const taskItems = useMemo(() => tasks.filter((t) => !t.done).slice(0, 8), [tasks])

  const go = (to: string) => {
    setOpen(false)
    navigate(to)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="hidden items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-white/[0.08] hover:text-foreground sm:flex"
        aria-label="Open global search"
      >
        <Search className="h-4 w-4" />
        <span>Search tools, notes…</span>
        <kbd className="rounded-md border border-white/10 bg-white/[0.06] px-1.5 py-0.5 text-[10px] font-semibold">⌘K</kbd>
      </button>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-muted-foreground sm:hidden"
        aria-label="Open global search"
      >
        <Search className="h-4 w-4" />
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search tools, pages, notes, tasks…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Pages">
            {PAGES.map((p) => (
              <CommandItem key={p.id} onSelect={() => go(p.to)}>
                <p.icon className="mr-2 h-4 w-4 text-brand-soft" />
                {p.label}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="AI Tools">
            {TOOLS.map((t) => (
              <CommandItem key={t.id} onSelect={() => go(`/app/tools/${t.id}`)}>
                <span className="mr-2 text-brand-soft">
                  <ToolIcon name={t.icon} className="h-4 w-4" />
                </span>
                {t.name}
                <span className="ml-2 text-xs text-muted-foreground">{t.category}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          {noteItems.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Notes">
                {noteItems.map((n) => (
                  <CommandItem key={n.id} onSelect={() => go('/app/tools/notes')}>
                    <StickyNote className="mr-2 h-4 w-4 text-aqua-soft" />
                    {n.title}
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}
          {taskItems.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Open tasks">
                {taskItems.map((t) => (
                  <CommandItem key={t.id} onSelect={() => go('/app/tools/todo')}>
                    <ListTodo className="mr-2 h-4 w-4 text-emerald-400" />
                    {t.title}
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}
