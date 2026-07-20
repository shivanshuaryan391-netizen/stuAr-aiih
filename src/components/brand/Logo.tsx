import { cn } from '@/lib/utils'

export function LogoMark({ className }: { className?: string }) {
  return (
    <div className={cn('relative grid place-items-center rounded-xl bg-gradient-to-br from-brand-deep via-brand to-aqua shadow-glow-sm', className)}>
      <svg viewBox="0 0 24 24" fill="none" className="h-[58%] w-[58%]" aria-hidden="true">
        <path
          d="M12 3L2 8.5L12 14L22 8.5L12 3Z"
          stroke="white"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="M6.5 11.5V16C6.5 16 8.5 18.5 12 18.5C15.5 18.5 17.5 16 17.5 16V11.5"
          stroke="white"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path d="M22 8.5V13.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    </div>
  )
}

export function Logo({ className, textClassName }: { className?: string; textClassName?: string }) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <LogoMark className="h-9 w-9" />
      <div className={cn('font-display text-lg leading-none', textClassName)}>
        <span className="font-bold text-foreground">StuAr</span>{' '}
        <span className="font-bold text-gradient">AI</span>
        <span className="mt-0.5 block text-[10px] font-medium tracking-widest text-muted-foreground">
          LEARN SMARTER
        </span>
      </div>
    </div>
  )
}
