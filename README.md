# ProspectIQ — Sales Intelligence v2

AI-powered B2B prospect discovery and personalized outreach generation. Built with React + Vite, powered by Claude.

## Features

- **Company Profile** — Tell the AI who you are and what you sell
- **Sales Persona** — 5 questions to capture your authentic voice and close style
- **Target Market** — Filter by industry, geography, revenue, headcount, and pain signals
- **AI Discovery** — Generates realistic, ranked prospects with opportunity scores
- **Intelligence Reports** — Per-prospect deep-dives with:
  - Pain Point Matrix (evidence + business impact + your fix)
  - 3-touch cold email sequences in your voice
  - LinkedIn DM and SMS templates
  - 60-second elevator pitch script
  - Objection handlers tailored to your style
  - 30-day quick win recommendation

---

## Quick Start

### 1. Clone & install

```bash
git clone https://github.com/YOUR_USERNAME/prospectiq.git
cd prospectiq
npm install
```

### 2. Add your API key

```bash
cp .env.example .env
# Edit .env and paste your Anthropic API key
```

Get your key at [console.anthropic.com](https://console.anthropic.com/).

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## Deploy to Vercel

### Option A — Vercel CLI

```bash
npm install -g vercel
vercel
```

Add your environment variable when prompted, or go to your Vercel project dashboard:
**Settings → Environment Variables → Add** `VITE_ANTHROPIC_KEY`

### Option B — GitHub + Vercel UI

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import your repo
3. Add environment variable: `VITE_ANTHROPIC_KEY` = your key
4. Deploy

---

## Project Structure

```
prospectiq/
├── src/
│   ├── main.jsx          # React entry point
│   ├── App.jsx           # Root component + layout
│   ├── styles.css        # All styles (CSS variables + utility classes)
│   ├── constants.js      # Industries, regions, persona questions
│   ├── api.js            # Anthropic API helper
│   ├── components.jsx    # Shared UI: CopyBtn, Tag, Chip, Ring, Radar
│   ├── Step1.jsx         # Company profile form
│   ├── Step2.jsx         # Sales persona quiz
│   ├── Step3.jsx         # Target market criteria
│   ├── Step4.jsx         # AI prospect discovery + ranked list
│   └── Step5.jsx         # Deep intelligence reports
├── public/
│   └── favicon.svg
├── index.html
├── vite.config.js
├── vercel.json
├── .env.example
└── package.json
```

---

## Tech Stack

- **React 18** — UI
- **Vite 5** — Build tool
- **Claude Sonnet 4** — AI backbone (prospect generation + report writing)
- **Pure CSS** — No UI library; custom design system with CSS variables

---

## ⚠️ API Key Note

This app calls the Anthropic API **directly from the browser** using `anthropic-dangerous-direct-browser-access`. This is fine for personal/internal tools but means your API key is visible in the client bundle.

For a production app with multiple users, move the API calls to a server-side function (Vercel Edge Functions, Next.js API routes, etc.) and keep the key server-side only.
