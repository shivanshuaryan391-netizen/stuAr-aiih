import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Eye, PenLine, Plus, Save, Search, StickyNote, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { useStore } from '@/services/store'
import { PageHeader } from '@/components/common/EmptyState'
import { Markdown } from '@/components/common/Markdown'
import { timeAgo } from '@/lib/format'
import { cn } from '@/lib/utils'

export default function NotesPage() {
  const { notes, saveNote, deleteNote } = useStore()
  const [activeId, setActiveId] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [query, setQuery] = useState('')
  const [preview, setPreview] = useState(false)
  const [dirty, setDirty] = useState(false)

  useEffect(() => {
    document.title = 'Notes · StuAr AI'
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return notes
    return notes.filter((n) => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q))
  }, [notes, query])

  const openNote = (id: string) => {
    const n = notes.find((x) => x.id === id)
    if (!n) return
    setActiveId(n.id)
    setTitle(n.title)
    setContent(n.content)
    setDirty(false)
    setPreview(false)
  }

  const newNote = () => {
    setActiveId(null)
    setTitle('')
    setContent('')
    setDirty(false)
    setPreview(false)
  }

  const save = () => {
    if (title.trim().length < 2) {
      toast.error('Give the note a title first')
      return
    }
    const saved = saveNote({ id: activeId ?? undefined, title: title.trim(), content })
    setActiveId(saved.id)
    setDirty(false)
    toast.success('Note saved')
  }

  const editing = activeId !== null || title || content

  return (
    <div>
      <Link to="/app/tools" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Tools Library
      </Link>
      <PageHeader title="Notes" subtitle="Markdown notes with instant save — your second brain." icon="StickyNote">
        <button type="button" className="btn-primary px-4 py-2 text-xs" onClick={newNote}>
          <Plus className="h-3.5 w-3.5" /> New note
        </button>
      </PageHeader>

      <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
        {/* List */}
        <div className="glass h-fit rounded-2xl p-3">
          <div className="relative mb-2">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search notes…" aria-label="Search notes" className="input-field py-2 pl-9 text-[13px]" />
          </div>
          <div className="max-h-[28rem] space-y-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="px-3 py-8 text-center text-xs leading-5 text-muted-foreground">
                {notes.length === 0 ? 'No notes yet. Create your first one!' : 'No notes match your search.'}
              </p>
            ) : (
              filtered.map((n) => (
                <div
                  key={n.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => openNote(n.id)}
                  onKeyDown={(e) => e.key === 'Enter' && openNote(n.id)}
                  className={cn(
                    'group flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2.5 transition-colors',
                    n.id === activeId ? 'bg-brand/15' : 'hover:bg-white/[0.05]',
                  )}
                >
                  <StickyNote className={cn('h-4 w-4 shrink-0', n.id === activeId ? 'text-brand-soft' : 'text-muted-foreground')} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{n.title}</p>
                    <p className="text-[11px] text-muted-foreground">{timeAgo(n.updatedAt)}</p>
                  </div>
                  <button
                    type="button"
                    aria-label={`Delete ${n.title}`}
                    className="rounded-md p-1 text-muted-foreground opacity-0 transition-opacity hover:text-red-400 group-hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteNote(n.id)
                      if (n.id === activeId) newNote()
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Editor */}
        <div className="glass flex min-h-[30rem] flex-col rounded-2xl">
          <div className="flex items-center gap-2 border-b border-white/[0.07] px-4 py-3">
            <input
              value={title}
              onChange={(e) => { setTitle(e.target.value); setDirty(true) }}
              placeholder="Note title…"
              aria-label="Note title"
              className="min-w-0 flex-1 bg-transparent font-display text-base font-semibold outline-none placeholder:text-muted-foreground/50"
            />
            <div className="flex rounded-lg border border-white/10 p-0.5">
              <button type="button" onClick={() => setPreview(false)} className={cn('rounded-md px-2.5 py-1 text-xs font-medium transition-colors', !preview ? 'bg-brand/25 text-brand-soft' : 'text-muted-foreground')} aria-label="Edit mode">
                <PenLine className="h-3.5 w-3.5" />
              </button>
              <button type="button" onClick={() => setPreview(true)} className={cn('rounded-md px-2.5 py-1 text-xs font-medium transition-colors', preview ? 'bg-brand/25 text-brand-soft' : 'text-muted-foreground')} aria-label="Preview mode">
                <Eye className="h-3.5 w-3.5" />
              </button>
            </div>
            <button type="button" onClick={save} className="btn-primary px-4 py-2 text-xs" disabled={!dirty && activeId !== null}>
              <Save className="h-3.5 w-3.5" /> Save
            </button>
          </div>
          {preview ? (
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {content.trim() ? <Markdown content={content} /> : <p className="text-sm text-muted-foreground">Nothing to preview yet.</p>}
            </div>
          ) : (
            <textarea
              value={content}
              onChange={(e) => { setContent(e.target.value); setDirty(true) }}
              placeholder={'Write in markdown…\n\n# Heading\n- bullets, **bold**, tables, code blocks\n\nEverything renders in Preview.'}
              aria-label="Note content"
              className="min-h-[24rem] flex-1 resize-none bg-transparent px-5 py-4 font-mono text-[13.5px] leading-6 outline-none placeholder:text-muted-foreground/50"
            />
          )}
          <div className="border-t border-white/[0.07] px-4 py-2 text-[11px] text-muted-foreground/70">
            {content.trim() ? `${content.trim().split(/\s+/).length} words` : 'Empty note'} {dirty && '· unsaved changes'} {!editing && '· pick a note or start typing'}
          </div>
        </div>
      </div>
    </div>
  )
}
