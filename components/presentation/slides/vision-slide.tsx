import {
  Smartphone,
  Languages,
  LayoutDashboard,
  MessageSquareText,
  BarChart3,
  CalendarSync,
  Compass,
} from 'lucide-react'
import { SlideFrame } from '../slide-frame'

const future = [
  { icon: Smartphone, label: 'Mobile App' },
  { icon: Languages, label: 'Multilingual Support' },
  { icon: LayoutDashboard, label: 'Donor Management Dashboard' },
  { icon: MessageSquareText, label: 'AI Chat Assistant' },
  { icon: BarChart3, label: 'Analytics & Reporting' },
  { icon: CalendarSync, label: 'Calendar & Email Integration' },
]

export function VisionSlide() {
  return (
    <SlideFrame index="04" kicker="Vision & Future">
      <div className="grid h-full grid-cols-1 gap-8 lg:grid-cols-[1fr_1fr]">
        <div className="flex flex-col">
          <h2 className="text-balance font-serif text-4xl font-semibold leading-tight tracking-tight text-foreground md:text-5xl">
            Building stronger communities through AI
          </h2>

          <div className="mt-6 rounded-3xl bg-accent/10 p-6">
            <div className="flex items-center gap-2 text-accent">
              <Compass className="h-5 w-5" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em]">
                Our Vision
              </span>
            </div>
            <p className="mt-3 text-pretty text-base leading-relaxed text-foreground md:text-lg">
              To empower every non-profit organisation with simple, accessible AI
              tools that improve efficiency and maximise community impact.
            </p>
          </div>

          <p className="mt-auto pt-6 font-serif text-xl italic text-primary">
            Empowering people who empower communities.
          </p>
        </div>

        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Future Enhancements
          </p>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {future.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-2xl border border-border bg-background px-4 py-3.5"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="text-sm font-medium leading-tight text-foreground">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SlideFrame>
  )
}
