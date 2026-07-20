import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { ToolIcon } from './ToolIcon'

export function EmptyState({
  icon = 'Sparkles',
  title,
  body,
  action,
  className,
}: {
  icon?: string
  title: string
  body?: string
  action?: ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 px-6 py-12 text-center', className)}>
      <div className="mb-3 grid h-11 w-11 place-items-center rounded-xl bg-brand/15 text-brand-soft">
        <ToolIcon name={icon} className="h-5 w-5" />
      </div>
      <p className="font-display text-sm font-semibold text-foreground">{title}</p>
      {body && <p className="mt-1 max-w-sm text-sm text-muted-foreground">{body}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

export function PageHeader({
  title,
  subtitle,
  icon,
  children,
}: {
  title: string
  subtitle?: string
  icon?: string
  children?: ReactNode
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div className="flex items-start gap-3.5">
        {icon && (
          <div className="mt-0.5 grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand/80 to-aqua/80 text-white shadow-glow-sm">
            <ToolIcon name={icon} className="h-5 w-5" />
          </div>
        )}
        <div>
          <h1 className="font-display text-2xl font-bold sm:text-[1.7rem]">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  )
}
