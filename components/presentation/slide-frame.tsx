import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SlideFrameProps {
  children: ReactNode
  className?: string
  /** Slide number label, e.g. "01" */
  index?: string
  kicker?: string
}

export function SlideFrame({
  children,
  className,
  index,
  kicker,
}: SlideFrameProps) {
  return (
    <div
      className={cn(
        'relative flex h-full w-full flex-col overflow-hidden bg-card px-8 py-8 md:px-16 md:py-14',
        className,
      )}
    >
      {(index || kicker) && (
        <div className="mb-6 flex items-center gap-3 md:mb-8">
          {index && (
            <span className="font-mono text-sm font-semibold tracking-widest text-accent">
              {index}
            </span>
          )}
          {kicker && (
            <span className="h-px flex-1 max-w-24 bg-border" aria-hidden="true" />
          )}
          {kicker && (
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              {kicker}
            </span>
          )}
        </div>
      )}
      {children}
    </div>
  )
}
