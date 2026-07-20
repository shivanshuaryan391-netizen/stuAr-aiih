import { memo, useRef, useState, type ReactNode } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { Check, Copy } from 'lucide-react'
import { cn } from '@/lib/utils'

function CodeBlock({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLPreElement>(null)
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    const text = ref.current?.innerText ?? ''
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      // clipboard unavailable
    }
  }
  return (
    <div className="group/code relative">
      <button
        type="button"
        onClick={copy}
        aria-label="Copy code"
        className="absolute right-2.5 top-2.5 z-10 rounded-lg border border-white/10 bg-white/[0.06] p-1.5 text-muted-foreground opacity-0 backdrop-blur transition-all hover:bg-white/[0.12] hover:text-foreground group-hover/code:opacity-100"
      >
        {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
      </button>
      <pre ref={ref}>{children}</pre>
    </div>
  )
}

export const Markdown = memo(function Markdown({ content, className }: { content: string; className?: string }) {
  return (
    <div className={cn('mdx', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[[rehypeHighlight, { detect: false, ignoreMissing: true }]]}
        components={{
          pre: ({ children }) => <CodeBlock>{children}</CodeBlock>,
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noreferrer noopener">
              {children}
            </a>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto">
              <table>{children}</table>
            </div>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
})
