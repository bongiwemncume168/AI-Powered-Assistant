import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Heart,
  FileText,
  Mail,
  CalendarClock,
  Sparkles,
  Send,
  RotateCcw,
  Loader2,
  LayoutDashboard,
} from "lucide-react";
import { askHopeSync } from "@/lib/hopesync.functions";

export const Route = createFileRoute("/")({
  component: HopeSyncApp,
});

type Capability = "summarize" | "draft" | "plan";
type ChatMsg = { role: "user" | "assistant"; content: string };

const CAPABILITIES: Record<
  Capability,
  {
    label: string;
    icon: typeof FileText;
    tagline: string;
    placeholder: string;
    starters: string[];
  }
> = {
  summarize: {
    label: "Summarize",
    icon: FileText,
    tagline: "Turn shift handovers or meeting notes into clean action items.",
    placeholder:
      "Paste your shift handover, meeting notes, or a rough voice-to-text dump…",
    starters: [
      "Summarize last night's shelter shift handover",
      "Pull action items from our weekly staff meeting",
      "Condense volunteer coordinator notes into next-steps",
    ],
  },
  draft: {
    label: "Draft an email",
    icon: Mail,
    tagline: "Warm, professional emails to donors, volunteers, and partners.",
    placeholder:
      "Who is this for and what do you want to say? (e.g. Thank a donor who gave $500 for holiday meals)",
    starters: [
      "Thank a monthly donor for their continued support",
      "Recruit weekend volunteers for the meal service",
      "Follow up with a food-bank partner about a delivery",
    ],
  },
  plan: {
    label: "Plan a schedule",
    icon: CalendarClock,
    tagline: "Build a daily schedule or volunteer shift plan in seconds.",
    placeholder:
      "Describe the day: hours, meals served, volunteers available, priorities…",
    starters: [
      "Plan Saturday breakfast service with 8 volunteers",
      "Draft a weekday intake shift from 7am to 3pm",
      "Coordinate a holiday meal distribution for 200 guests",
    ],
  },
};

const SAMPLES: Record<Capability, { label: string; text: string }[]> = {
  summarize: [
    {
      label: "Overnight shelter shift handover",
      text: `Shift: Tue 11pm – Wed 7am
On duty: Marcus (lead), Priya, Jamal (volunteer)

- 42 guests checked in (capacity 48). 3 walk-ins after midnight, all placed.
- New guest "Ms. R" arrived visibly cold, no ID. Intake waived per policy, assigned bed 17. Needs case-worker follow-up in the morning — she mentioned eviction last Friday.
- Bed 9 (Mr. T) had a rough night, coughing. Gave water, checked temp (normal). Flag for nurse visit Wed afternoon.
- Shower room drain backed up around 2am. Put "out of order" sign, texted facilities (Dan). Needs plumber before 7am service.
- Breakfast prep: oatmeal + bananas ready in walk-in. Coffee urn cleaned. We're out of oat milk — please pick up.
- Donations dropped at back door overnight: 4 bags winter coats (unsorted), 1 box canned goods. Left in intake office.
- No incidents. Quiet night overall.

Follow-ups for AM team:
- Ms. R → case worker
- Mr. T → nurse
- Drain → facilities
- Oat milk run
- Sort coat donation`,
    },
    {
      label: "Weekly staff meeting notes",
      text: `HopeSync Kitchen — Weekly Staff Meeting, Mon 10am
Present: Elena (director), Marcus, Priya, Sam, Dana (volunteer coord)

- Meal counts up 18% vs last month. Averaging 220 lunches/day.
- Holiday meal drive: Dana confirmed 34 volunteers signed up for Dec 23. Still need 6 more for the 2–5pm cleanup block.
- Grant: United Way renewal due Dec 15. Elena drafting, needs program stats from Marcus by Fri.
- Food bank partner (Second Harvest) shifting delivery from Wed to Thu starting next week. Update the intake schedule.
- Guest feedback: two mentions this week that hot meals cool too fast at the outdoor line. Sam to price insulated trays.
- New volunteer onboarding: batch orientation Sat 9am, 7 people confirmed. Priya leading.
- Elena out Dec 27–Jan 2. Marcus is point of contact.`,
    },
  ],
  draft: [
    {
      label: "Thank-you to a $500 monthly donor",
      text: `Draft a warm thank-you email to Grace Community Church for their recurring $500 monthly gift. Mention it helps fund roughly 165 hot meals a month, and invite them to tour the kitchen during the holiday meal drive on Dec 23. Signed by Elena, Director.`,
    },
    {
      label: "Recruit weekend volunteers",
      text: `Draft an email to our volunteer list recruiting 6 more people for the Dec 23 holiday meal drive, 2–5pm cleanup block. Warm, appreciative tone. Include sign-up link placeholder and a note that food/coffee are provided. Signed by Dana, Volunteer Coordinator.`,
    },
  ],
  plan: [
    {
      label: "Saturday breakfast service (8 volunteers)",
      text: `Plan Saturday breakfast service, 6am–10am. 8 volunteers available. Expecting ~120 guests. Menu: oatmeal, eggs, fruit, coffee. Need coverage for: intake, serving line, dishwashing, floor support, and 7:30am donation drop-off from Sunrise Bakery.`,
    },
    {
      label: "Weekday intake shift 7am–3pm",
      text: `Draft a weekday intake shift plan, 7am–3pm. 3 staff (Marcus, Priya, one floater). Priorities: morning bed turnover, case-worker follow-up for Ms. R at 10am, nurse visit for Mr. T at 2pm, and a Second Harvest delivery Thu at noon. Flag any coverage gaps.`,
    },
  ],
};

function HopeSyncApp() {
  const [capability, setCapability] = useState<Capability>("summarize");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const askFn = useServerFn(askHopeSync);

  const mutation = useMutation({
    mutationFn: async (payload: { message: string; history: ChatMsg[] }) => {
      const res = await askFn({
        data: {
          capability,
          message: payload.message,
          history: payload.history,
        },
      });
      return res.reply;
    },
    onSuccess: (reply) => {
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    },
    onError: (err: Error) => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `⚠️ ${err.message || "Something went wrong. Please try again."}`,
        },
      ]);
    },
  });

  const active = CAPABILITIES[capability];

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, mutation.isPending]);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || mutation.isPending) return;
    const nextHistory = [...messages, { role: "user" as const, content: trimmed }];
    setMessages(nextHistory);
    setInput("");
    mutation.mutate({ message: trimmed, history: messages });
  };

  const reset = () => {
    setMessages([]);
    setInput("");
    mutation.reset();
  };

  const showEmpty = messages.length === 0 && !mutation.isPending;

  return (
    <div className="min-h-screen bg-background">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px] opacity-70"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 0%, oklch(0.9 0.06 65 / 0.55), transparent 70%)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-6 sm:px-6 sm:py-10">
        <Header onReset={reset} hasMessages={messages.length > 0} />

        <section className="mt-8 sm:mt-10">
          <h1 className="font-display text-3xl leading-tight text-foreground sm:text-5xl">
            Less screen time.{" "}
            <span className="italic text-primary">More service.</span>
          </h1>
          <p className="mt-3 max-w-2xl text-base text-muted-foreground sm:text-lg">
            HopeSync is a warm, organized AI assistant built for the people who
            run soup kitchens and shelters. Pick a task — we'll handle the
            paperwork.
          </p>
        </section>

        <CapabilityPicker
          value={capability}
          onChange={(next) => {
            setCapability(next);
            reset();
          }}
        />

        <div className="mt-6 flex-1 rounded-3xl border border-border bg-card shadow-[var(--shadow-soft)]">
          <div className="flex items-center gap-3 border-b border-border/70 px-5 py-4">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[var(--gradient-primary)] text-primary-foreground">
              <active.icon className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <div className="truncate font-display text-lg text-foreground">
                {active.label}
              </div>
              <div className="truncate text-sm text-muted-foreground">
                {active.tagline}
              </div>
            </div>
          </div>

          <div
            ref={scrollRef}
            className="max-h-[52vh] min-h-[280px] overflow-y-auto px-4 py-5 sm:px-6"
          >
            {showEmpty ? (
              <EmptyState
                capability={capability}
                onPick={(s) => send(s)}
                onLoadSample={(text) => setInput(text)}
              />
            ) : (
              <div className="flex flex-col gap-4">
                {messages.map((m, i) => (
                  <MessageBubble key={i} msg={m} />
                ))}
                {mutation.isPending && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    HopeSync is thinking with care…
                  </div>
                )}
              </div>
            )}
          </div>

          <Composer
            value={input}
            onChange={setInput}
            onSubmit={() => send(input)}
            disabled={mutation.isPending}
            placeholder={active.placeholder}
          />
        </div>

        <footer className="mt-8 flex flex-col items-center justify-between gap-2 text-xs text-muted-foreground sm:flex-row">
          <div className="flex items-center gap-1.5">
            <Heart className="h-3.5 w-3.5 text-accent" />
            Built for the folks who feed and shelter our neighbors.
          </div>
          <div>HopeSync · A quiet assistant for loud, meaningful work.</div>
        </footer>
      </div>
    </div>
  );
}

function Header({ onReset, hasMessages }: { onReset: () => void; hasMessages: boolean }) {
  return (
    <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
      <div className="flex min-w-0 items-center gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-glow)]">
          <Sparkles className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <div className="truncate font-display text-xl font-semibold text-foreground sm:text-2xl">
            HopeSync
          </div>
          <div className="truncate text-xs text-muted-foreground sm:text-sm">
            AI workplace assistant for non-profits
          </div>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-sm text-foreground transition hover:bg-muted"
        >
          <LayoutDashboard className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Dashboard</span>
        </Link>
        {hasMessages && (
          <button
            onClick={onReset}
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-sm text-foreground transition hover:bg-muted"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">New conversation</span>
            <span className="sm:hidden">New</span>
          </button>
        )}
      </div>
    </header>
  );
}

function CapabilityPicker({
  value,
  onChange,
}: {
  value: Capability;
  onChange: (c: Capability) => void;
}) {
  const items = useMemo(
    () => Object.entries(CAPABILITIES) as [Capability, (typeof CAPABILITIES)[Capability]][],
    [],
  );
  return (
    <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
      {items.map(([key, meta]) => {
        const active = key === value;
        const Icon = meta.icon;
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={[
              "group relative overflow-hidden rounded-2xl border p-4 text-left transition",
              active
                ? "border-primary/40 bg-card shadow-[var(--shadow-soft)]"
                : "border-border bg-card/60 hover:border-primary/30 hover:bg-card",
            ].join(" ")}
          >
            <div className="flex items-start gap-3">
              <div
                className={[
                  "grid h-10 w-10 shrink-0 place-items-center rounded-xl transition",
                  active
                    ? "bg-[var(--gradient-primary)] text-primary-foreground"
                    : "bg-warm text-warm-foreground",
                ].join(" ")}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="font-display text-base text-foreground">{meta.label}</div>
                <div className="mt-0.5 text-sm text-muted-foreground">{meta.tagline}</div>
              </div>
            </div>
            {active && (
              <div className="absolute right-3 top-3 text-[10px] font-medium uppercase tracking-wider text-primary">
                Active
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

function EmptyState({
  capability,
  onPick,
  onLoadSample,
}: {
  capability: Capability;
  onPick: (s: string) => void;
  onLoadSample: (text: string) => void;
}) {
  const meta = CAPABILITIES[capability];
  const samples = SAMPLES[capability];
  return (
    <div className="flex flex-col items-center py-8 text-center">
      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-warm text-warm-foreground">
        <meta.icon className="h-5 w-5" />
      </div>
      <div className="mt-4 font-display text-xl text-foreground">
        How can I help you {meta.label.toLowerCase()}?
      </div>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">
        Share what you have — even messy notes are fine. I'll organize it with
        care.
      </p>
      <div className="mt-6 flex w-full flex-col gap-2 sm:max-w-lg">
        {meta.starters.map((s) => (
          <button
            key={s}
            onClick={() => onPick(s)}
            className="rounded-xl border border-border bg-background px-4 py-3 text-left text-sm text-foreground transition hover:border-primary/40 hover:bg-muted"
          >
            {s}
          </button>
        ))}
      </div>
      {samples.length > 0 && (
        <div className="mt-6 w-full sm:max-w-lg">
          <div className="mb-2 flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            <FileText className="h-3 w-3" />
            Or load a sample
          </div>
          <div className="flex flex-col gap-2">
            {samples.map((s) => (
              <button
                key={s.label}
                onClick={() => onLoadSample(s.text)}
                className="group flex items-start justify-between gap-3 rounded-xl border border-dashed border-border bg-warm/40 px-4 py-3 text-left text-sm text-foreground transition hover:border-primary/40 hover:bg-warm"
              >
                <div className="min-w-0">
                  <div className="truncate font-medium">{s.label}</div>
                  <div className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                    {s.text.split("\n").find((l) => l.trim()) ?? ""}
                  </div>
                </div>
                <span className="shrink-0 self-center text-[11px] font-medium text-primary opacity-70 group-hover:opacity-100">
                  Load →
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MessageBubble({ msg }: { msg: ChatMsg }) {
  const isUser = msg.role === "user";
  return (
    <div className={["flex gap-3", isUser ? "justify-end" : "justify-start"].join(" ")}>
      {!isUser && (
        <div className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-[var(--gradient-primary)] text-primary-foreground">
          <Sparkles className="h-4 w-4" />
        </div>
      )}
      <div
        className={[
          "max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed sm:text-[15px]",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground",
        ].join(" ")}
      >
        {msg.content}
      </div>
    </div>
  );
}

function Composer({
  value,
  onChange,
  onSubmit,
  disabled,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  disabled: boolean;
  placeholder: string;
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="border-t border-border/70 p-3 sm:p-4"
    >
      <div className="flex items-end gap-2 rounded-2xl border border-border bg-background p-2 focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/15">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSubmit();
            }
          }}
          rows={2}
          placeholder={placeholder}
          className="min-h-[44px] flex-1 resize-none bg-transparent px-2 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none sm:text-[15px]"
        />
        <button
          type="submit"
          disabled={disabled || !value.trim()}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-glow)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Send"
        >
          {disabled ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </button>
      </div>
      <div className="mt-2 px-1 text-[11px] text-muted-foreground">
        Press Enter to send · Shift + Enter for a new line
      </div>
    </form>
  );
}
