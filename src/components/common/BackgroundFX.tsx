import { memo } from 'react'
import { cn } from '@/lib/utils'

/** Animated aurora blobs + subtle grid used across landing & app pages. */
export const BackgroundFX = memo(function BackgroundFX({ subtle = false }: { subtle?: boolean }) {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-grid mask-fade-b opacity-70" />
      <div
        className={cn(
          'absolute -top-32 -left-24 h-[34rem] w-[34rem] rounded-full bg-brand/25 blur-[130px] animate-float-slow',
          subtle && 'opacity-50',
        )}
      />
      <div
        className={cn(
          'absolute top-1/4 -right-32 h-[30rem] w-[30rem] rounded-full bg-aqua/20 blur-[130px] animate-float-slow animate-delay-300',
          subtle && 'opacity-50',
        )}
      />
      <div
        className={cn(
          'absolute bottom-0 left-1/3 h-[26rem] w-[26rem] rounded-full bg-violet-500/15 blur-[130px] animate-float-slow animate-delay-500',
          subtle && 'opacity-40',
        )}
      />
    </div>
  )
})
