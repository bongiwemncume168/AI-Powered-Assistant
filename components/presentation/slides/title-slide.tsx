import { HeartHandshake, Sparkles } from 'lucide-react'

export function TitleSlide() {
  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-primary px-8 py-10 text-primary-foreground md:px-16 md:py-14">
      {/* decorative circles */}
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-accent/30 blur-2xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-28 -left-16 h-72 w-72 rounded-full bg-primary-foreground/10 blur-2xl"
        aria-hidden="true"
      />

      <div className="relative flex items-center gap-2.5">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-foreground/15">
          <HeartHandshake className="h-5 w-5" />
        </span>
        <span className="text-lg font-semibold tracking-tight">HopeSync AI</span>
      </div>

      <div className="relative mt-auto flex flex-col">
        <span className="mb-5 inline-flex w-fit items-center gap-2 rounded-full bg-primary-foreground/15 px-4 py-1.5 text-sm font-medium">
          <Sparkles className="h-4 w-4 text-accent" />
          AI Workplace Assistant for Non-Profits
        </span>
        <h1 className="text-balance font-serif text-6xl font-semibold leading-[0.95] tracking-tight md:text-8xl">
          HopeSync AI
        </h1>
        <p className="mt-5 text-balance font-serif text-2xl italic text-accent md:text-4xl">
          Less Screen Time. More Service.
        </p>
        <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-primary-foreground/80 md:text-lg">
          Helping soup kitchens, shelters, and community organisations reduce
          administration so they can spend more time helping people.
        </p>
      </div>

      <div className="relative mt-auto flex items-center gap-3 pt-8">
        <div className="h-11 w-11 rounded-full bg-accent" aria-hidden="true" />
        <div>
          <p className="text-xs uppercase tracking-widest text-primary-foreground/60">
            Presented by
          </p>
          <p className="text-lg font-semibold">Bongiwe Mncume</p>
        </div>
      </div>
    </div>
  )
}
