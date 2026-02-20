// ─────────────────────────────────────────────────────────────
// API helper
// Set your Anthropic API key in .env as VITE_ANTHROPIC_KEY
// or replace the fallback string below for quick local testing.
// ─────────────────────────────────────────────────────────────

const KEY = import.meta.env.VITE_ANTHROPIC_KEY || "";

export async function callAI(prompt) {
  if (!KEY) throw new Error("No API key. Set VITE_ANTHROPIC_KEY in your .env file.");

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": KEY,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 6000,
      system:
        "You are an elite B2B sales intelligence analyst. Return only valid JSON — no markdown fences, no commentary.",
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "API error");

  return (data.content?.[0]?.text || "")
    .replace(/```json\n?/g, "")
    .replace(/```\n?/g, "")
    .trim();
}
