import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import {
  Utensils,
  BedDouble,
  Users,
  PackageAlert,
  Sparkles,
  Loader2,
  ArrowUpRight,
  CircleDot,
  Heart,
  AlertTriangle,
  CheckCircle2,
  Clock,
  HandHeart,
} from "lucide-react";
import { askHopeSync } from "@/lib/hopesync.functions";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Operations Dashboard — HopeSync" },
      {
        name: "description",
        content:
          "A warm, at-a-glance operations dashboard for soup kitchens and shelters: meals served, bed occupancy, volunteer coverage, inventory alerts, and an AI daily briefing.",
      },
      { property: "og:title", content: "Operations Dashboard — HopeSync" },
      {
        property: "og:description",
        content:
          "See today's service at a glance — meals, beds, volunteers, and an AI briefing tuned for non-profit teams.",
      },
    ],
  }),
  component: DashboardPage,
});

// ————————————————————————————————————————————————————————————
// Demo data (realistic, editable in-memory)
// ————————————————————————————————————————————————————————————

const KPIS = [
  {
    key: "meals",
    label: "Meals served today",
    value: 284,
    goal: 350,
    delta: "+12% vs. yesterday",
    icon: Utensils,
    tone: "primary" as const,
  },
  {
    key: "beds",
    label: "Beds occupied",
    value: 46,
    goal: 52,
    delta: "6 beds still available tonight",
    icon: BedDouble,
    tone: "accent" as const,
  },
  {
    key: "volunteers",
    label: "Volunteers on shift",
    value: 11,
    goal: 14,
    delta: "3 spots open for dinner service",
    icon: Users,
    tone: "primary" as const,
  },
  {
    key: "alerts",
    label: "Low-stock alerts",
    value: 4,
    goal: 0,
    delta: "Coffee, milk, socks, hygiene kits",
    icon: PackageAlert,
    tone: "warn" as const,
  },
];

const SHIFTS = [
  { time: "6:00 – 9:00", role: "Breakfast service", owner: "Maria O.", filled: 4, needed: 4 },
  { time: "9:00 – 12:00", role: "Intake & check-in", owner: "Devon P.", filled: 2, needed: 3 },
  { time: "11:30 – 14:00", role: "Lunch service", owner: "Sam T.", filled: 5, needed: 5 },
  { time: "14:00 – 17:00", role: "Pantry & sorting", owner: "—", filled: 1, needed: 3 },
  { time: "17:00 – 20:00", role: "Dinner service", owner: "Aisha K.", filled: 3, needed: 6 },
  { time: "20:00 – 23:00", role: "Overnight prep", owner: "Jordan L.", filled: 2, needed: 2 },
];

const GUESTS = [
  { name: "Mr. T.", note: "Diabetic — needs low-sugar breakfast", tag: "Health flag", tone: "warn" as const },
  { name: "Ms. R.", note: "First-time guest, arrived last night", tag: "New", tone: "accent" as const },
  { name: "Mr. K.", note: "Follow-up: caseworker Tues 2pm", tag: "Case", tone: "primary" as const },
  { name: "Ms. J.", note: "Requested quiet bed near window", tag: "Preference", tone: "muted" as const },
];

const DONATIONS = [
  { from: "Sunrise Bakery", item: "40 loaves + pastries", when: "This morning" },
  { from: "Grace Community Church", item: "$500 monthly gift", when: "Yesterday" },
  { from: "Anonymous", item: "12 winter coats", when: "2 days ago" },
  { from: "Northside Food Bank", item: "Produce pallet (est. 220 lbs)", when: "2 days ago" },
];

// ————————————————————————————————————————————————————————————
// Page
// ————————————————————————————————————————————————————————————

function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[380px] opacity-70"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 0%, oklch(0.9 0.06 65 / 0.5), transparent 70%)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 sm:px-6 sm:py-10">
        <TopBar />

        <section className="mt-8">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
            <div className="min-w-0">
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {new Date().toLocaleDateString(undefined, {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <h1 className="mt-1 font-display text-3xl leading-tight text-foreground sm:text-4xl">
                Today at a glance
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
                A calm view of service, guests, and coverage — so you can spot
                what needs a human touch.
              </p>
            </div>
            <div className="hidden shrink-0 items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground sm:inline-flex">
              <CircleDot className="h-3 w-3 text-primary" />
              Live · updated just now
            </div>
          </div>
        </section>

        <section className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {KPIS.map((k) => (
            <KpiCard key={k.key} kpi={k} />
          ))}
        </section>

        <section className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ShiftBoard />
          </div>
          <AiBriefing />
        </section>

        <section className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <GuestSpotlight />
          </div>
          <div className="lg:col-span-2">
            <DonationsCard />
          </div>
        </section>

        <footer className="mt-10 flex flex-col items-center justify-between gap-2 text-xs text-muted-foreground sm:flex-row">
          <div className="flex items-center gap-1.5">
            <Heart className="h-3.5 w-3.5 text-accent" />
            Numbers are a map, not the mission.
          </div>
          <div>HopeSync · Operations</div>
        </footer>
      </div>
    </div>
  );
}

// ————————————————————————————————————————————————————————————
// Sections
// ————————————————————————————————————————————————————————————

function TopBar() {
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
            Operations dashboard
          </div>
        </div>
      </div>
      <nav className="flex shrink-0 items-center gap-1 rounded-full border border-border bg-card p-1 text-sm">
        <Link
          to="/dashboard"
          className="rounded-full bg-[var(--gradient-primary)] px-3 py-1.5 text-primary-foreground shadow-[var(--shadow-soft)]"
        >
          Dashboard
        </Link>
        <Link
          to="/"
          className="rounded-full px-3 py-1.5 text-foreground transition hover:bg-muted"
        >
          Assistant
        </Link>
      </nav>
    </header>
  );
}

type Kpi = (typeof KPIS)[number];

function KpiCard({ kpi }: { kpi: Kpi }) {
  const Icon = kpi.icon;
  const pct =
    kpi.goal > 0 ? Math.min(100, Math.round((kpi.value / kpi.goal) * 100)) : 0;
  const isWarn = kpi.tone === "warn";
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {kpi.label}
          </div>
          <div className="mt-2 font-display text-3xl text-foreground">
            {kpi.value}
            {kpi.goal > 0 && !isWarn && (
              <span className="ml-1 text-base text-muted-foreground">
                / {kpi.goal}
              </span>
            )}
          </div>
        </div>
        <div
          className={[
            "grid h-10 w-10 shrink-0 place-items-center rounded-xl",
            isWarn
              ? "bg-warm text-warm-foreground"
              : "bg-[var(--gradient-primary)] text-primary-foreground",
          ].join(" ")}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {kpi.goal > 0 && !isWarn && (
        <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-[var(--gradient-primary)] transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      )}
      <div
        className={[
          "mt-3 flex items-center gap-1.5 text-xs",
          isWarn ? "text-accent-foreground" : "text-muted-foreground",
        ].join(" ")}
      >
        {isWarn ? (
          <AlertTriangle className="h-3.5 w-3.5 text-accent" />
        ) : (
          <ArrowUpRight className="h-3.5 w-3.5 text-primary" />
        )}
        <span className="truncate">{kpi.delta}</span>
      </div>
    </div>
  );
}

function ShiftBoard() {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)]">
      <div className="flex items-center justify-between border-b border-border/70 px-5 py-4">
        <div className="min-w-0">
          <div className="font-display text-lg text-foreground">
            Today's shifts
          </div>
          <div className="text-sm text-muted-foreground">
            Coverage across the day
          </div>
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-warm px-2.5 py-1 text-xs text-warm-foreground">
          <Clock className="h-3.5 w-3.5" /> 2 gaps to fill
        </div>
      </div>
      <ul className="divide-y divide-border/70">
        {SHIFTS.map((s) => {
          const gap = s.needed - s.filled;
          const covered = gap <= 0;
          return (
            <li
              key={s.time}
              className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 px-5 py-3"
            >
              <div className="w-28 shrink-0 font-mono text-xs text-muted-foreground sm:text-sm">
                {s.time}
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-medium text-foreground sm:text-[15px]">
                  {s.role}
                </div>
                <div className="truncate text-xs text-muted-foreground">
                  Lead: {s.owner}
                </div>
              </div>
              <div
                className={[
                  "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs",
                  covered
                    ? "bg-primary/10 text-primary"
                    : "bg-accent/25 text-accent-foreground",
                ].join(" ")}
              >
                {covered ? (
                  <CheckCircle2 className="h-3.5 w-3.5" />
                ) : (
                  <AlertTriangle className="h-3.5 w-3.5" />
                )}
                {s.filled}/{s.needed} {covered ? "covered" : `· need ${gap}`}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function GuestSpotlight() {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)]">
      <div className="flex items-center justify-between border-b border-border/70 px-5 py-4">
        <div>
          <div className="font-display text-lg text-foreground">
            Guest spotlight
          </div>
          <div className="text-sm text-muted-foreground">
            Names removed for privacy — flags to carry forward
          </div>
        </div>
      </div>
      <ul className="divide-y divide-border/70">
        {GUESTS.map((g) => (
          <li key={g.name} className="flex items-start gap-3 px-5 py-3">
            <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-warm font-display text-sm text-warm-foreground">
              {g.name.split(" ")[0].replace(/[^A-Z]/g, "").slice(0, 2) || "•"}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <div className="truncate text-sm font-medium text-foreground">
                  {g.name}
                </div>
                <span
                  className={[
                    "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider",
                    g.tone === "warn"
                      ? "bg-accent/25 text-accent-foreground"
                      : g.tone === "accent"
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground",
                  ].join(" ")}
                >
                  {g.tag}
                </span>
              </div>
              <div className="mt-0.5 text-sm text-muted-foreground">
                {g.note}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DonationsCard() {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)]">
      <div className="flex items-center justify-between border-b border-border/70 px-5 py-4">
        <div>
          <div className="font-display text-lg text-foreground">
            Recent gifts
          </div>
          <div className="text-sm text-muted-foreground">
            Say thank you when you can
          </div>
        </div>
        <HandHeart className="h-5 w-5 text-accent" />
      </div>
      <ul className="divide-y divide-border/70">
        {DONATIONS.map((d) => (
          <li key={d.from + d.when} className="px-5 py-3">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 truncate text-sm font-medium text-foreground">
                {d.from}
              </div>
              <div className="shrink-0 text-xs text-muted-foreground">
                {d.when}
              </div>
            </div>
            <div className="mt-0.5 truncate text-sm text-muted-foreground">
              {d.item}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AiBriefing() {
  const askFn = useServerFn(askHopeSync);
  const [reply, setReply] = useState<string>("");

  const snapshot = useMemo(() => {
    return [
      "Please give me a warm, focused DAILY BRIEFING for the team based on this snapshot:",
      "",
      "KPIs:",
      ...KPIS.map((k) => `- ${k.label}: ${k.value}${k.goal ? ` / ${k.goal}` : ""} — ${k.delta}`),
      "",
      "Shifts:",
      ...SHIFTS.map(
        (s) => `- ${s.time} ${s.role} (lead: ${s.owner}) — ${s.filled}/${s.needed} filled`,
      ),
      "",
      "Guest flags:",
      ...GUESTS.map((g) => `- ${g.name}: ${g.note}`),
      "",
      "Recent donations:",
      ...DONATIONS.map((d) => `- ${d.from} — ${d.item} (${d.when})`),
      "",
      "Structure the briefing with: **Top priorities today** (3 bullets), **Coverage gaps to close**, **Guests to check in on**, and **A quick thank-you to send**. Keep it short and human.",
    ].join("\n");
  }, []);

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await askFn({
        data: { capability: "summarize", message: snapshot, history: [] },
      });
      return res.reply;
    },
    onSuccess: (r) => setReply(r),
    onError: (e: Error) => setReply(`⚠️ ${e.message}`),
  });

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)]">
      <div className="flex items-center gap-3 border-b border-border/70 px-5 py-4">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[var(--gradient-primary)] text-primary-foreground">
          <Sparkles className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <div className="truncate font-display text-lg text-foreground">
            AI daily briefing
          </div>
          <div className="truncate text-sm text-muted-foreground">
            Turn today's numbers into next steps
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        {reply ? (
          <div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
            {reply}
          </div>
        ) : mutation.isPending ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            HopeSync is reading the room…
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">
            Generate a short, warm briefing based on today's KPIs, shifts,
            guest flags, and gifts. Great for the 9am huddle.
          </div>
        )}
      </div>

      <div className="border-t border-border/70 p-3">
        <button
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--gradient-primary)] px-3 py-2.5 text-sm font-medium text-primary-foreground shadow-[var(--shadow-glow)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {mutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          {reply ? "Regenerate briefing" : "Generate today's briefing"}
        </button>
      </div>
    </div>
  );
}
