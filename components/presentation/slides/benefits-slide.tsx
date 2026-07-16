import { Briefcase, HandHeart, Users } from 'lucide-react'
import { SlideFrame } from '../slide-frame'

const groups = [
  {
    icon: Briefcase,
    title: 'For Staff',
    points: [
      'Saves hours of administrative work',
      'Keeps teams organised',
      'Improves communication',
    ],
  },
  {
    icon: Users,
    title: 'For Volunteers',
    points: [
      'Clear schedules',
      'Easy task assignments',
      'Better coordination',
    ],
  },
  {
    icon: HandHeart,
    title: 'For Communities',
    points: [
      'Faster service delivery',
      'More efficient operations',
      'Greater focus on helping vulnerable people',
    ],
  },
]

export function BenefitsSlide() {
  return (
    <SlideFrame index="03" kicker="Benefits">
      <div className="flex h-full flex-col">
        <h2 className="max-w-3xl text-balance font-serif text-4xl font-semibold leading-tight tracking-tight text-foreground md:text-5xl">
          How HopeSync AI helps
        </h2>
        <p className="mt-3 max-w-2xl text-pretty text-base text-muted-foreground md:text-lg">
          Real value across every part of your organisation.
        </p>

        <div className="mt-8 grid flex-1 grid-cols-1 gap-4 md:grid-cols-3">
          {groups.map(({ icon: Icon, title, points }, i) => (
            <div
              key={title}
              className={`flex flex-col rounded-3xl border border-border p-6 ${
                i === 2 ? 'bg-primary text-primary-foreground' : 'bg-background'
              }`}
            >
              <span
                className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                  i === 2
                    ? 'bg-primary-foreground/15 text-accent'
                    : 'bg-secondary text-primary'
                }`}
              >
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 font-serif text-2xl font-semibold tracking-tight">
                {title}
              </h3>
              <ul className="mt-4 flex flex-col gap-3">
                {points.map((p) => (
                  <li key={p} className="flex items-start gap-2.5 text-sm md:text-base">
                    <span
                      className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                        i === 2 ? 'bg-accent' : 'bg-accent'
                      }`}
                      aria-hidden="true"
                    />
                    <span
                      className={
                        i === 2
                          ? 'text-primary-foreground/85'
                          : 'text-muted-foreground'
                      }
                    >
                      {p}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </SlideFrame>
  )
}
