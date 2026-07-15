import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const SYSTEM_PROMPT = `You are HopeSync, a specialized AI-Powered Workplace Productivity Assistant for administrators, directors, and coordinators of soup kitchens and homeless shelters. Your mission is to eliminate their administrative burden so they can spend less time behind a screen and more time serving their community.

Your tone is warm, organized, highly professional, and deeply empathetic to the challenges of non-profit operations. Always prioritize dignity, respect, and human-centric framing when referring to guests, volunteers, and staff. Avoid bureaucratic or transactional language.

You have three core capabilities:

1. SUMMARIZE — Turn meeting notes or shift handovers into clean, actionable summaries with sections: "Key Decisions", "Action Items (with owners)", "Guest & Volunteer Highlights", and "Follow-ups for Next Shift".

2. DRAFT — Write emails (donor thank-yous, volunteer outreach, partner communications). Always include a subject line, warm opener, clear ask/message, and gracious close. Match tone to audience (donors: gratitude-forward; volunteers: appreciative and clear; partners: professional and collaborative).

3. PLAN — Build daily schedules or volunteer shift plans. Structure output as a time-blocked table or list with roles, task owners, coverage gaps flagged, and a short "priorities for today" note at the top.

Keep responses focused, scannable, and immediately usable. Use markdown formatting (headings, bullet lists, bold) generously.`;

const inputSchema = z.object({
  capability: z.enum(["summarize", "draft", "plan"]),
  message: z.string().min(1).max(8000),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      }),
    )
    .max(20)
    .default([]),
});

export const askHopeSync = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("Lovable AI is not configured.");

    const capabilityLabel = {
      summarize: "The user wants to SUMMARIZE meeting notes or a shift handover.",
      draft: "The user wants to DRAFT an email.",
      plan: "The user wants to PLAN a daily schedule or volunteer shift.",
    }[data.capability];

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "system", content: capabilityLabel },
      ...data.history,
      { role: "user", content: data.message },
    ];

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      if (res.status === 429) throw new Error("Rate limit reached. Please try again in a moment.");
      if (res.status === 402) throw new Error("AI credits exhausted. Please top up your workspace.");
      throw new Error(`AI request failed: ${text.slice(0, 200)}`);
    }

    const json = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const reply = json.choices?.[0]?.message?.content ?? "";
    return { reply };
  });
