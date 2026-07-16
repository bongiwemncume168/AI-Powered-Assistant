'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Loader2,
  Maximize,
  Minimize,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { TitleSlide } from './slides/title-slide'
import { ProblemSlide } from './slides/problem-slide'
import { SolutionSlide } from './slides/solution-slide'
import { BenefitsSlide } from './slides/benefits-slide'
import { VisionSlide } from './slides/vision-slide'

const slides = [
  { id: 'title', label: 'Title', Component: TitleSlide },
  { id: 'problem', label: 'The Problem', Component: ProblemSlide },
  { id: 'solution', label: 'Our Solution', Component: SolutionSlide },
  { id: 'benefits', label: 'Benefits', Component: BenefitsSlide },
  { id: 'vision', label: 'Vision & Future', Component: VisionSlide },
]

export function SlideDeck() {
  const [current, setCurrent] = useState(0)
  const [downloading, setDownloading] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const go = useCallback((dir: number) => {
    setCurrent((c) => Math.min(slides.length - 1, Math.max(0, c + dir)))
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') go(1)
      else if (e.key === 'ArrowLeft' || e.key === 'PageUp') go(-1)
      else if (e.key === 'Home') setCurrent(0)
      else if (e.key === 'End') setCurrent(slides.length - 1)
      else if (e.key === 'Escape' && !document.fullscreenElement)
        setIsFullscreen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go])

  useEffect(() => {
    const onChange = () => setIsFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  const toggleFullscreen = useCallback(() => {
    const el = document.getElementById('deck-root')
    // The native Fullscreen API can be blocked by a permissions policy
    // (e.g. inside a sandboxed preview iframe). Fall back to a CSS-based
    // fullscreen so the feature still works everywhere.
    try {
      if (!document.fullscreenElement) {
        const req = el?.requestFullscreen?.()
        if (req && typeof req.catch === 'function') {
          req.catch(() => setIsFullscreen((v) => !v))
        }
      } else {
        const exit = document.exitFullscreen?.()
        if (exit && typeof exit.catch === 'function') {
          exit.catch(() => setIsFullscreen((v) => !v))
        }
      }
    } catch {
      // requestFullscreen threw synchronously — use the CSS fallback.
      setIsFullscreen((v) => !v)
    }
  }, [])

  const handleDownload = useCallback(async () => {
    setDownloading(true)
    try {
      const { generatePptx } = await import('@/lib/generate-pptx')
      await generatePptx()
    } catch (err) {
      console.log('[v0] pptx download error:', err)
    } finally {
      setDownloading(false)
    }
  }, [])

  const Active = slides[current].Component

  return (
    <div className="flex min-h-svh flex-col bg-background">
      {/* Top bar */}
      <header className="flex items-center justify-between gap-4 px-4 py-3 md:px-8">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold tracking-tight text-foreground">
            HopeSync AI
          </span>
          <span className="hidden text-sm text-muted-foreground sm:inline">
            · Presentation
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleFullscreen}
            className="gap-2"
          >
            {isFullscreen ? (
              <Minimize className="h-4 w-4" />
            ) : (
              <Maximize className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">
              {isFullscreen ? 'Exit' : 'Present'}
            </span>
          </Button>
          <Button
            size="sm"
            onClick={handleDownload}
            disabled={downloading}
            className="gap-2"
          >
            {downloading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">
              {downloading ? 'Preparing…' : 'Download .pptx'}
            </span>
          </Button>
        </div>
      </header>

      {/* Stage */}
      <main
        id="deck-root"
        className={
          isFullscreen
            ? 'fixed inset-0 z-50 flex flex-col items-center justify-center bg-background px-4 py-4 md:px-8'
            : 'flex flex-1 flex-col items-center justify-center bg-background px-4 pb-4 md:px-8'
        }
      >
        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center">
          <div className="relative aspect-video w-full overflow-hidden rounded-3xl border border-border shadow-xl shadow-primary/5">
            <Active />
          </div>

          {/* Controls */}
          <div className="mt-4 flex items-center justify-between gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => go(-1)}
              disabled={current === 0}
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <div className="flex flex-1 items-center justify-center gap-2">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setCurrent(i)}
                  aria-label={`Go to slide ${i + 1}: ${s.label}`}
                  aria-current={i === current}
                  className={cn(
                    'h-2 rounded-full transition-all',
                    i === current
                      ? 'w-8 bg-primary'
                      : 'w-2 bg-border hover:bg-muted-foreground/50',
                  )}
                />
              ))}
            </div>

            <div className="hidden min-w-24 text-right text-sm font-medium text-muted-foreground sm:block">
              {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() => go(1)}
              disabled={current === slides.length - 1}
              aria-label="Next slide"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
