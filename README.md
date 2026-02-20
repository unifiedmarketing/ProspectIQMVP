# ProspectIQ — AI Sales Intelligence Platform

Generate complete AI-powered prospect intelligence reports with personalized outreach in under 60 seconds.

## 🚀 Deploy to Vercel in 3 Steps

### 1. Clone / unzip this project

```bash
cd prospectiq-vercel
npm install
```

### 2. Add your API keys

Copy `.env.local.example` to `.env.local` and fill in your keys:

```bash
cp .env.local.example .env.local
```

| Variable | Required | Where to get it |
|---|---|---|
| `ANTHROPIC_API_KEY` | ✅ Yes | [console.anthropic.com](https://console.anthropic.com) |
| `GOOGLE_PLACES_API_KEY` | Optional | [Google Cloud Console](https://console.cloud.google.com) → Places API |

> **Note:** Without a Google Places API key, the app uses mock GMB data. The AI report still generates fully — it just won't have live Google Business Profile data.

### 3. Deploy to Vercel

**Option A — Vercel CLI:**
```bash
npm install -g vercel
vercel
```
When prompted, add your environment variables.

**Option B — Vercel Dashboard:**
1. Push this folder to a GitHub repo
2. Go to [vercel.com/new](https://vercel.com/new) → Import repo
3. Add environment variables in Project Settings → Environment Variables:
   - `ANTHROPIC_API_KEY` = your key
   - `GOOGLE_PLACES_API_KEY` = your key (optional)
4. Deploy

## 🏃 Run Locally

```bash
npm install
cp .env.local.example .env.local
# Fill in ANTHROPIC_API_KEY in .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🏗 Project Structure

```
src/
  app/
    page.tsx              ← Home page (2-step form)
    report/page.tsx       ← Intelligence report output
    api/analyze/route.ts  ← API endpoint (scrape + AI)
    globals.css           ← Design system
    layout.tsx            ← Root layout + nav
  lib/
    ai.ts                 ← Claude API prompts
    gmb.ts                ← Google Places API
    scraper.ts            ← Website scraper
```

## 💡 What Gets Generated

For each prospect you scan:

- **Digital Health Score** — 0–100 overall digital presence rating
- **ICP Match Score** — How well they match your ideal customer profile  
- **Pain Point Matrix** — 5 specific issues with evidence + your solution for each
- **3-Touch Email Sequence** — Subject lines + bodies, ready to send
- **LinkedIn DM** — Short, specific, non-salesy opener
- **SMS Intro** — Under 160 chars, curiosity-gap format
- **Elevator Pitch** — 60-second verbal framework personalized to this prospect
- **30-Day Quick Win** — One specific thing you can do immediately to prove value

## 🔑 API Keys

### Anthropic (required)
1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Create an API key
3. Add to `.env.local` as `ANTHROPIC_API_KEY`

### Google Places (optional but recommended)
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Enable the **Places API**
3. Create an API key
4. Add to `.env.local` as `GOOGLE_PLACES_API_KEY`

Without this key, GMB data falls back to mock values — the AI report still generates, just without live Google review counts or profile completeness scores.
