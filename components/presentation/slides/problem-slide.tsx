import {
  FileText,
  CalendarClock,
  Mail,
  NotebookPen,
  Gift,
  Users,
  TriangleAlert,
} from 'lucide-react'
import { SlideFrame } from '../slide-frame'

const challenges = [
  { icon: FileText, label: 'Time-consuming paperwork' },
  { icon: CalendarClock, label: 'Manual volunteer scheduling' },
  { icon: Mail, label: 'Writing emails and reports' },
  { icon: NotebookPen, label: 'Recording meeting notes' },
  { icon: Gift, label: 'Managing donation campaigns' },
  { icon: Users, label: 'Limited staff & volunteer resources' },
]

export function ProblemSlide() {
  return (
    <SlideFrame index="01" kicker="The Problem">
      <div className="flex h-full flex-col">
        <h2 className="max-w-3xl text-balance font-serif text-4xl font-semibold leading-tight tracking-tight text-foreground md:text-5xl">
          Challenges faced by non-profits
        </h2>
        <p className="mt-3 max-w-2xl text-pretty text-base text-muted-foreground md:text-lg">
          Many community organisations struggle with everyday admin that pulls
          them away from their mission.
        </p>

        <div className="mt-8 grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {challenges.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-3 rounded-2xl border border-border bg-background px-4 py-4"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                <Icon className="h-5 w-5" />
              </span>
              <span className="text-sm font-medium leading-snug text-foreground md:text-base">
                {label}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-start gap-3 rounded-2xl bg-accent/10 px-5 py-4">
          <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
          <p className="text-pretty text-sm font-medium text-foreground md:text-base">
            <span className="font-semibold">Impact:</span> More time spent on
            administration means less time serving people in need.
          </p>
        </div>
      </div>
    </SlideFrame>
  )
}
