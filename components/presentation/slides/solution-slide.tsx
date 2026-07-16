import {
  CalendarCheck,
  MailPlus,
  ListChecks,
  ArrowLeftRight,
  ClipboardList,
  HandHeart,
  Search,
  Target,
} from 'lucide-react'
import { SlideFrame } from '../slide-frame'

const features = [
  { icon: CalendarCheck, label: 'Volunteer Scheduler' },
  { icon: MailPlus, label: 'Smart Email Generator' },
  { icon: ListChecks, label: 'Task Planner' },
  { icon: ArrowLeftRight, label: 'Shift Handover Summaries' },
  { icon: ClipboardList, label: 'Meeting Notes Summariser' },
  { icon: HandHeart, label: 'Donation Campaign Assistant' },
  { icon: Search, label: 'AI Research Assistant' },
]

export function SolutionSlide() {
  return (
    <SlideFrame index="02" kicker="Our Solution">
      <div className="grid h-full grid-cols-1 gap-8 lg:grid-cols-[1fr_1.15fr]">
        <div className="flex flex-col">
          <h2 className="text-balance font-serif text-4xl font-semibold leading-tight tracking-tight text-foreground md:text-5xl">
            Introducing HopeSync AI
          </h2>
          <p className="mt-4 max-w-md text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
            A workplace assistant designed specifically for non-profits, handling
            the busywork so your team can focus on people.
          </p>

          <div className="mt-auto flex items-start gap-3 rounded-2xl bg-primary px-5 py-5 text-primary-foreground">
            <Target className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
            <p className="text-pretty text-sm leading-relaxed md:text-base">
              <span className="font-semibold">Mission:</span> Reduce
              administrative work so organisations can focus on making a greater
              social impact.
            </p>
          </div>
        </div>

        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Key Features
          </p>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {features.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-2xl border border-border bg-background px-4 py-3.5"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent">
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
