import { useState, useEffect, useRef, useCallback } from "react";

const ANTHROPIC_KEY = "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";

// ═══════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,700;0,9..144,900;1,9..144,700&family=Instrument+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

:root {
  --ink: #0A0C12;
  --ink2: #0E1119;
  --ink3: #131720;
  --ink4: #181E2B;
  --wire: #1E2738;
  --wire2: #283347;
  --gold: #E8A430;
  --gold2: #F5C660;
  --gold-dim: rgba(232,164,48,0.12);
  --gold-glow: rgba(232,164,48,0.25);
  --jade: #0FD4A8;
  --jade-dim: rgba(15,212,168,0.1);
  --coral: #FF5C6A;
  --coral-dim: rgba(255,92,106,0.1);
  --violet: #9B72F7;
  --violet-dim: rgba(155,114,247,0.1);
  --sky: #D4ECFF;
  --sky2: #8CAFC8;
  --sky3: #3D5A72;
  --mist: rgba(212,236,255,0.06);
  --mist2: rgba(212,236,255,0.03);
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body, #root { height: 100%; background: var(--ink); }
body { font-family: 'Instrument Sans', sans-serif; color: var(--sky); overflow: hidden; }
.f-mono { font-family: 'DM Mono', monospace; }
.f-serif { font-family: 'Fraunces', serif; }

@keyframes fadeUp   { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
@keyframes fadeIn   { from { opacity:0 } to { opacity:1 } }
@keyframes spin     { to { transform:rotate(360deg) } }
@keyframes sweep    { to { transform:rotate(360deg) } }
@keyframes pulse    { 0%,100%{opacity:.35} 55%{opacity:.9} }
@keyframes slideUp  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
@keyframes barGrow  { from{width:0} to{width:100%} }
@keyframes shimmer  { 0%{background-position:-600px 0} 100%{background-position:600px 0} }
@keyframes bounce   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-3px)} }
@keyframes scoreIn  { from{opacity:0;transform:scale(.6) rotate(-15deg)} to{opacity:1;transform:scale(1) rotate(0)} }

.afu  { animation: fadeUp .5s ease both }
.afu1 { animation: fadeUp .5s .07s ease both }
.afu2 { animation: fadeUp .5s .14s ease both }
.afu3 { animation: fadeUp .5s .21s ease both }
.afu4 { animation: fadeUp .5s .28s ease both }
.afu5 { animation: fadeUp .5s .35s ease both }
.afi  { animation: fadeIn .4s ease both }
.asu  { animation: slideUp .35s ease both }

/* ── Root shell ── */
.shell { display:flex; height:100vh; overflow:hidden; }

/* ── Sidebar ── */
.sidebar {
  width:240px; flex-shrink:0;
  background: var(--ink2);
  border-right: 1px solid var(--wire);
  display:flex; flex-direction:column;
  position:relative; overflow:hidden;
}
.sidebar::before {
  content:''; position:absolute; top:0; left:0; right:0; height:200px;
  background: radial-gradient(ellipse at 50% 0%, rgba(232,164,48,0.08) 0%, transparent 70%);
  pointer-events:none;
}
.sb-logo {
  padding:18px 20px 16px;
  border-bottom:1px solid var(--wire);
  display:flex; align-items:center; gap:10px; flex-shrink:0;
  position:relative; z-index:1;
}
.sb-hex {
  width:32px; height:32px; flex-shrink:0;
  background: linear-gradient(145deg, var(--gold), var(--gold2));
  clip-path: polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%);
  display:flex; align-items:center; justify-content:center;
  font-size:12px; font-weight:900; color:var(--ink);
  font-family:'Fraunces',serif;
}
.sb-steps { flex:1; overflow-y:auto; padding:12px 0; position:relative; z-index:1; }
.sb-steps::-webkit-scrollbar { display:none; }
.sb-step {
  padding:10px 20px; display:flex; align-items:center; gap:11px;
  cursor:pointer; transition:all .2s; position:relative;
  color:var(--sky3);
}
.sb-step.active { color:var(--sky); background:var(--mist); }
.sb-step.active::before {
  content:''; position:absolute; left:0; top:8px; bottom:8px; width:2px;
  background:var(--gold); border-radius:0 2px 2px 0;
}
.sb-step.done { color:var(--sky3); }
.sb-step.done:hover { color:var(--sky2); }
.sb-num {
  width:22px; height:22px; border-radius:50%; flex-shrink:0;
  display:flex; align-items:center; justify-content:center;
  font-size:10px; font-weight:700; font-family:'DM Mono',monospace;
  border:1px solid; transition:all .25s;
}
.sb-num-idle   { border-color:var(--wire2); color:var(--sky3); }
.sb-num-active { border-color:var(--gold); color:var(--gold); background:var(--gold-dim); }
.sb-num-done   { border-color:var(--jade); color:var(--jade); background:var(--jade-dim); font-size:9px; }
.sb-foot {
  padding:14px 18px; border-top:1px solid var(--wire);
  flex-shrink:0; position:relative; z-index:1;
}
.sb-prog-track { background:var(--ink4); height:2px; border-radius:1px; overflow:hidden; }
.sb-prog-bar { height:100%; background:linear-gradient(90deg,var(--gold),var(--jade)); transition:width .6s ease; }
.sb-user {
  margin-top:12px; padding:10px 12px;
  background:var(--mist2); border:1px solid var(--wire);
}

/* ── Main area ── */
.main-area { flex:1; overflow-y:auto; position:relative; background:var(--ink); }
.main-area::-webkit-scrollbar { width:4px; }
.main-area::-webkit-scrollbar-thumb { background:var(--wire2); border-radius:2px; }
.pg { padding:44px 52px 80px; max-width:820px; }

/* ── Typography ── */
.eyebrow {
  font-family:'DM Mono',monospace; font-size:9px;
  letter-spacing:.16em; text-transform:uppercase; color:var(--gold);
  margin-bottom:10px;
}
.pg-title {
  font-family:'Fraunces',serif; font-size:clamp(30px,4vw,44px);
  font-weight:900; line-height:1.08; letter-spacing:-.025em;
  color:var(--sky); margin-bottom:10px;
}
.pg-title em { font-style:italic; color:var(--gold); }
.pg-sub { font-size:14px; color:var(--sky3); line-height:1.72; margin-bottom:36px; max-width:500px; }

/* ── Form fields ── */
.field { margin-bottom:18px; }
.lbl {
  display:block; font-size:9.5px; font-weight:600;
  letter-spacing:.11em; text-transform:uppercase; color:var(--sky2);
  margin-bottom:6px; font-family:'DM Mono',monospace;
}
.inp {
  width:100%; background:var(--ink3); border:1px solid var(--wire);
  color:var(--sky); padding:12px 14px; font-family:'Instrument Sans',sans-serif;
  font-size:14px; outline:none; transition:border-color .2s, box-shadow .2s;
}
.inp:focus { border-color:var(--gold); box-shadow:0 0 0 3px rgba(232,164,48,.1); }
.inp::placeholder { color:var(--sky3); }
textarea.inp { resize:none; }
.g2 { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
.g3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:14px; }

/* ── Buttons ── */
.btn {
  display:inline-flex; align-items:center; justify-content:center; gap:8px;
  padding:13px 28px; font-family:'Instrument Sans',sans-serif; font-weight:600;
  font-size:14px; cursor:pointer; border:none; transition:all .2s; letter-spacing:.01em;
}
.btn-gold { background:var(--gold); color:var(--ink); }
.btn-gold:hover { background:var(--gold2); transform:translateY(-1px); box-shadow:0 6px 24px var(--gold-glow); }
.btn-gold:disabled { opacity:.38; cursor:not-allowed; transform:none; box-shadow:none; }
.btn-wire {
  background:transparent; color:var(--sky2); border:1px solid var(--wire2);
  padding:11px 22px; font-size:13px;
}
.btn-wire:hover { border-color:var(--gold); color:var(--gold); }
.btn-sm { padding:9px 18px; font-size:13px; }

/* ── Chip / pill selects ── */
.chips { display:flex; flex-wrap:wrap; gap:8px; }
.chip {
  padding:7px 14px; border:1px solid var(--wire2); cursor:pointer;
  font-size:12px; transition:all .15s; user-select:none;
  color:var(--sky3); background:transparent;
}
.chip:hover { border-color:var(--sky3); color:var(--sky); }
.chip.on { background:var(--gold-dim); border-color:var(--gold); color:var(--gold); }

/* ── Persona cards ── */
.q-card {
  background:var(--ink3); border:1px solid var(--wire);
  padding:22px 24px; margin-bottom:14px; transition:border-color .2s;
}
.q-card:focus-within { border-color:rgba(232,164,48,.3); }
.q-label { font-family:'DM Mono',monospace; font-size:9px; color:var(--gold); letter-spacing:.12em; text-transform:uppercase; margin-bottom:8px; }
.q-text { font-size:15px; font-weight:600; color:var(--sky); margin-bottom:16px; line-height:1.5; }
.q-opts { display:flex; flex-wrap:wrap; gap:8px; }
.q-opt {
  padding:8px 15px; border:1px solid var(--wire2); cursor:pointer;
  font-size:12px; transition:all .15s; color:var(--sky3); background:transparent;
}
.q-opt:hover { border-color:var(--sky2); color:var(--sky); }
.q-opt.on { background:var(--gold-dim); border-color:var(--gold); color:var(--gold); }

/* ── Range ── */
.range-row { display:flex; align-items:center; gap:14px; margin-top:8px; }
.rng {
  -webkit-appearance:none; flex:1; height:2px;
  background: linear-gradient(90deg, var(--gold) var(--pct,50%), var(--ink4) var(--pct,50%));
  outline:none; cursor:pointer;
}
.rng::-webkit-slider-thumb {
  -webkit-appearance:none; width:16px; height:16px; border-radius:50%;
  background:var(--gold); cursor:pointer; box-shadow:0 0 8px var(--gold-glow);
}
.rng-val { font-family:'DM Mono',monospace; font-size:12px; color:var(--gold); min-width:90px; text-align:right; }

/* ── Discovery loading ── */
.disc-load {
  display:flex; flex-direction:column; align-items:center;
  justify-content:center; min-height:62vh; gap:24px;
}
.radar { width:88px; height:88px; position:relative; }
.rr { position:absolute; inset:0; border:1px solid rgba(232,164,48,.1); border-radius:50%; }
.rr:nth-child(2) { inset:15px; border-color:rgba(232,164,48,.18); }
.rr:nth-child(3) { inset:30px; border-color:rgba(232,164,48,.28); }
.rdot { position:absolute; top:50%; left:50%; width:6px; height:6px; border-radius:50%; background:var(--gold); transform:translate(-50%,-50%); box-shadow:0 0 10px var(--gold-glow); animation:pulse 1.2s ease infinite; }
.rsweep { position:absolute; inset:0; background:conic-gradient(from 0deg,transparent 0%,rgba(232,164,48,.2) 60%,transparent 61%); border-radius:50%; animation:sweep 2.8s linear infinite; }
.lstep { display:flex; align-items:center; gap:10px; padding:8px 14px; background:var(--ink3); border:1px solid var(--wire); font-size:12px; color:var(--sky3); transition:all .3s; min-width:270px; }
.lstep.done { border-color:rgba(15,212,168,.25); color:var(--sky); }
.lstep.active { border-color:rgba(232,164,48,.4); color:var(--gold); }
.lprog { background:var(--ink4); height:2px; min-width:270px; border-radius:1px; overflow:hidden; }
.lprog-fill { height:100%; background:linear-gradient(90deg,var(--gold),var(--jade)); transition:width .5s ease; }

/* ── Prospect cards ── */
.p-card {
  background:var(--ink3); border:1px solid var(--wire);
  padding:18px 20px; margin-bottom:10px; cursor:pointer;
  transition:all .2s; display:flex; align-items:flex-start; gap:14px; position:relative;
}
.p-card:hover { border-color:var(--wire2); background:var(--ink4); }
.p-card.sel { border-color:var(--gold); background:rgba(232,164,48,.04); }
.p-check {
  width:20px; height:20px; border:1.5px solid var(--wire2); flex-shrink:0;
  display:flex; align-items:center; justify-content:center; transition:all .2s; margin-top:2px;
}
.p-card.sel .p-check { background:var(--gold); border-color:var(--gold); }
.p-check-mark { display:none; color:var(--ink); font-size:10px; font-weight:900; }
.p-card.sel .p-check-mark { display:block; }
.rank-badge {
  width:30px; height:30px; border-radius:50%; display:flex; align-items:center;
  justify-content:center; font-family:'DM Mono',monospace; font-size:10px;
  font-weight:700; flex-shrink:0;
}
.rb-1 { background:rgba(232,164,48,.15); border:1.5px solid var(--gold); color:var(--gold); }
.rb-2 { background:rgba(15,212,168,.1); border:1.5px solid var(--jade); color:var(--jade); }
.rb-3 { background:rgba(155,114,247,.1); border:1.5px solid var(--violet); color:var(--violet); }
.rb-n { background:var(--mist2); border:1px solid var(--wire2); color:var(--sky3); }
.opp-track { background:var(--ink4); height:3px; border-radius:2px; overflow:hidden; margin-top:8px; }
.opp-fill { height:100%; border-radius:2px; transition:width 1s ease; }

/* ── Tags ── */
.tag { display:inline-block; padding:2px 8px; font-family:'DM Mono',monospace; font-size:8px; font-weight:500; letter-spacing:.09em; text-transform:uppercase; }
.tg { background:var(--gold-dim); color:var(--gold); border:1px solid rgba(232,164,48,.2); }
.tj { background:var(--jade-dim); color:var(--jade); border:1px solid rgba(15,212,168,.2); }
.tc { background:var(--coral-dim); color:var(--coral); border:1px solid rgba(255,92,106,.2); }
.tv { background:var(--violet-dim); color:var(--violet); border:1px solid rgba(155,114,247,.2); }

/* ── Report panels ── */
.report-shell { display:flex; height:100%; overflow:hidden; }
.rep-list {
  width:210px; flex-shrink:0; background:var(--ink2); border-right:1px solid var(--wire);
  display:flex; flex-direction:column; overflow:hidden;
}
.rep-list-items { flex:1; overflow-y:auto; padding:8px; }
.rep-list-items::-webkit-scrollbar { display:none; }
.rep-tab {
  padding:11px 12px; cursor:pointer; margin-bottom:4px;
  border:1px solid transparent; transition:all .15s;
}
.rep-tab:hover { background:var(--mist2); }
.rep-tab.active { background:rgba(232,164,48,.06); border-color:rgba(232,164,48,.25); }
.rep-status-dot {
  width:7px; height:7px; border-radius:50%; flex-shrink:0;
  transition:background .3s;
}
.rep-main { flex:1; overflow-y:auto; padding:28px 36px 80px; }
.rep-main::-webkit-scrollbar { width:4px; }
.rep-main::-webkit-scrollbar-thumb { background:var(--wire2); border-radius:2px; }

/* ── Score rings ── */
.s-ring { width:60px; height:60px; border-radius:50%; border:2px solid; flex-shrink:0; display:flex; align-items:center; justify-content:center; font-size:17px; font-weight:700; animation:scoreIn .5s ease both; }
.sr-hi  { border-color:var(--coral); color:var(--coral); background:var(--coral-dim); }
.sr-med { border-color:var(--gold); color:var(--gold); background:var(--gold-dim); }
.sr-lo  { border-color:var(--jade); color:var(--jade); background:var(--jade-dim); }

/* ── Report sections ── */
.r-card { background:var(--ink3); border:1px solid var(--wire); margin-bottom:13px; }
.r-hdr { padding:13px 18px 11px; border-bottom:1px solid var(--wire); display:flex; align-items:center; gap:9px; }
.r-ico { width:30px; height:30px; background:rgba(232,164,48,.07); border:1px solid rgba(232,164,48,.15); display:flex; align-items:center; justify-content:center; font-size:13px; flex-shrink:0; }
.r-body { padding:15px 18px; }
.pain-hdr { display:grid; grid-template-columns:1fr 1fr 1fr; background:var(--ink4); }
.phc { padding:8px 13px; font-family:'DM Mono',monospace; font-size:8px; letter-spacing:.1em; text-transform:uppercase; color:var(--sky3); border-right:1px solid var(--wire); }
.phc:last-child { border-right:none; }
.pain-row { display:grid; grid-template-columns:1fr 1fr 1fr; border-top:1px solid var(--wire); }
.pc { padding:11px 13px; font-size:11px; line-height:1.5; border-right:1px solid var(--wire); }
.pc:last-child { border-right:none; }
.etab { padding:8px 13px; font-size:10px; font-weight:600; letter-spacing:.05em; text-transform:uppercase; font-family:'DM Mono',monospace; cursor:pointer; border:none; background:transparent; color:var(--sky3); border-bottom:2px solid transparent; margin-bottom:-1px; transition:all .15s; }
.etab:hover { color:var(--sky); }
.etab.on { color:var(--gold); border-bottom-color:var(--gold); }
.email-blk { background:var(--ink4); border:1px solid var(--wire); border-left:3px solid var(--gold); padding:15px 17px; }
.pitch-blk { background:var(--ink4); border:1px solid var(--wire); border-left:3px solid var(--violet); padding:15px; font-size:12px; line-height:1.75; color:var(--sky2); font-style:italic; }
.cp-btn { background:transparent; border:1px solid var(--wire2); color:var(--sky3); padding:3px 10px; font-family:'DM Mono',monospace; font-size:9px; cursor:pointer; transition:all .15s; }
.cp-btn:hover { border-color:var(--gold); color:var(--gold); }
.cp-btn.done { border-color:var(--jade); color:var(--jade); }
.spnr { width:15px; height:15px; border:2px solid rgba(232,164,48,.2); border-top-color:var(--gold); border-radius:50%; animation:spin .7s linear infinite; display:inline-block; }
.err-box { background:var(--coral-dim); border:1px solid rgba(255,92,106,.25); color:var(--coral); padding:10px 14px; font-size:12px; margin-top:12px; }
.skel-line { height:10px; border-radius:2px; background:linear-gradient(90deg,var(--ink3) 25%,var(--ink4) 50%,var(--ink3) 75%); background-size:600px 100%; animation:shimmer 1.5s infinite; }

/* ── Summary stat boxes ── */
.stat-box { background:var(--ink3); border:1px solid var(--wire); padding:14px 16px; text-align:center; }
.stat-val { font-family:'Fraunces',serif; font-size:28px; font-weight:900; color:var(--gold); line-height:1; display:block; }
.stat-lbl { font-family:'DM Mono',monospace; font-size:9px; color:var(--sky3); text-transform:uppercase; letter-spacing:.1em; margin-top:4px; display:block; }

/* ── Sticky action bar ── */
.sticky-bar {
  position:sticky; bottom:0; background:var(--ink); border-top:1px solid var(--wire);
  padding:14px 0; display:flex; gap:12px; align-items:center; margin-top:14px;
}
`;

function injectStyles() {
  if (!document.getElementById("piq-v2")) {
    const el = document.createElement("style");
    el.id = "piq-v2"; el.textContent = STYLES;
    document.head.appendChild(el);
  }
}

// ═══════════════════════════════════════════════════════════════
// AI CALL
// ═══════════════════════════════════════════════════════════════
async function callAI(prompt, sys = "You are an elite B2B sales intelligence analyst. Return only valid JSON unless told otherwise. No markdown fences.") {
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_KEY,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 6000,
      system: sys,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const d = await r.json();
  if (!r.ok) throw new Error(d.error?.message || "API error");
  return (d.content?.[0]?.text || "").replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
}

// ═══════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════
const INDUSTRIES = [
  "Senior Living / Assisted Living","Dental Practices","Medical Clinics & Urgent Care",
  "Law Firms","Financial Advisors / Wealth Mgmt","Restaurants & Catering",
  "Real Estate Agencies","Auto Dealerships","Home Services (HVAC, Plumbing, Roofing)",
  "Fitness & Wellness Studios","Hotels & Boutique Hospitality","Insurance Agencies",
  "Veterinary Clinics","Salons, Spas & Aesthetics","Contractors & Custom Builders",
  "IT Managed Services","Accounting & CPA Firms","Retail & E-Commerce",
  "Chiropractic / Physical Therapy","Marketing & Creative Agencies",
];

const REGIONS = [
  "South Florida (Miami, Broward, Palm Beach)",
  "Central Florida (Orlando, Tampa, Sarasota)",
  "North Florida (Jacksonville, Tallahassee)",
  "Northeast (NY, NJ, CT, MA)",
  "Mid-Atlantic (PA, MD, VA, DC)",
  "Southeast (GA, SC, NC, TN)",
  "Midwest (IL, OH, MI, IN, WI)",
  "South Central (TX, OK, AR, LA)",
  "Mountain West (CO, AZ, UT, NV)",
  "Pacific West (CA, OR, WA)",
];

const PERSONA_QS = [
  {
    id: "style",
    q: "How would you describe your natural sales communication style?",
    opts: [
      "Direct & confident — I cut to the chase and respect their time",
      "Consultative — I ask deep questions and listen before pitching",
      "Data-driven — I lead with numbers, proof, and case studies",
      "Warm & relational — I build genuine trust before any pitch",
      "Challenger — I respectfully reframe how they see their problem",
    ],
  },
  {
    id: "hook",
    q: "What's your strongest opening hook in cold outreach?",
    opts: [
      "I lead with a specific observation about their business",
      "I open with a surprising stat about their industry",
      "I name-drop a similar client and their results",
      "I identify a gap they probably don't know they have",
      "I ask a question they can't help but answer",
    ],
  },
  {
    id: "objection",
    q: "When they say 'we already have someone for that' — you:",
    opts: [
      "Ask what results they're currently getting, then compare",
      "Acknowledge it fully, then pivot to a gap they haven't considered",
      "Share a 30-second story about a client in the same spot",
      "Offer a free audit to show them what they're leaving on the table",
      "Respect it and ask if I can check back in 90 days",
    ],
  },
  {
    id: "close",
    q: "What's your preferred way to move toward a close?",
    opts: [
      "Next-step close — 'Can we do 15 minutes Thursday?'",
      "Assumptive — 'Let me put together a quick proposal'",
      "Trial close — 'Does what I'm describing make sense so far?'",
      "Value-stack — build the ROI case then make the ask",
      "Urgency — 'We're only taking 2 new clients this quarter'",
    ],
  },
  {
    id: "edge",
    q: "What's the one thing that genuinely separates you from competitors?",
    opts: [
      "Deep niche expertise — no generalists on my team",
      "Speed of execution — we move faster than anyone",
      "Radical transparency — clients see everything in real time",
      "Guaranteed outcomes — we put our money where our mouth is",
      "White-glove personal service — not a faceless agency",
      "Price-to-value ratio — premium results at a fair price",
    ],
  },
];

// ═══════════════════════════════════════════════════════════════
// SHARED COMPONENTS
// ═══════════════════════════════════════════════════════════════
function CopyBtn({ text }) {
  const [done, setDone] = useState(false);
  return (
    <button className={`cp-btn${done ? " done" : ""}`}
      onClick={() => { navigator.clipboard.writeText(text).catch(() => {}); setDone(true); setTimeout(() => setDone(false), 2200); }}>
      {done ? "✓ Copied" : "Copy"}
    </button>
  );
}

function Tag({ label, variant = "tg" }) {
  return <span className={`tag ${variant}`}>{label}</span>;
}

function ScoreRing({ score }) {
  const cls = score >= 70 ? "sr-hi" : score >= 45 ? "sr-med" : "sr-lo";
  return <div className={`s-ring ${cls}`}>{score}</div>;
}

function Chip({ label, on, onClick }) {
  return <div className={`chip${on ? " on" : ""}`} onClick={onClick}>{on && "✓ "}{label}</div>;
}

function SkeletonBlock({ lines = 3 }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="skel-line" style={{ width: `${[100, 85, 70][i % 3]}%`, height: 10 }} />
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// STEP 1 — COMPANY PROFILE
// ═══════════════════════════════════════════════════════════════
function S1Profile({ data, setData, onNext }) {
  const u = (k, v) => setData(d => ({ ...d, [k]: v }));
  const ready = data.name && data.company && data.service;

  return (
    <div className="pg afu">
      <div className="eyebrow">Step 1 of 4 — Your Foundation</div>
      <h1 className="pg-title">First, tell us<br />about <em>you</em></h1>
      <p className="pg-sub">This becomes the DNA of every message we write. The more specific you are about your offer, the sharper the outreach.</p>

      <div className="g2" style={{ marginBottom: 16 }}>
        <div className="field">
          <label className="lbl">Full Name *</label>
          <input className="inp" value={data.name} onChange={e => u("name", e.target.value)} placeholder="Jane Smith" />
        </div>
        <div className="field">
          <label className="lbl">Your Title</label>
          <input className="inp" value={data.title} onChange={e => u("title", e.target.value)} placeholder="Founder / VP of Sales" />
        </div>
      </div>
      <div className="g2" style={{ marginBottom: 16 }}>
        <div className="field">
          <label className="lbl">Company Name *</label>
          <input className="inp" value={data.company} onChange={e => u("company", e.target.value)} placeholder="Unified Marketing" />
        </div>
        <div className="field">
          <label className="lbl">Company Website</label>
          <input className="inp" value={data.website} onChange={e => u("website", e.target.value)} placeholder="https://yourco.com" />
        </div>
      </div>
      <div className="field">
        <label className="lbl">What You Sell — be brutally specific *</label>
        <textarea className="inp" rows={5} value={data.service} onChange={e => u("service", e.target.value)}
          placeholder="e.g. We help senior living communities cut their dependency on paid lead aggregators (A Place for Mom, Caring.com) by building owned digital channels. We do hyper-local SEO, AI Answer Engine Optimization (AEO), Google Business Profile optimization, and targeted PPC. Retainer: $1,500–$3,000/mo. Typical result: 10+ direct move-in inquiries within 60 days." />
      </div>
      <div className="g2" style={{ marginBottom: 28 }}>
        <div className="field">
          <label className="lbl">Average Deal Size</label>
          <input className="inp" value={data.dealSize} onChange={e => u("dealSize", e.target.value)} placeholder="$1,800/mo · $21,600/yr" />
        </div>
        <div className="field">
          <label className="lbl">Best Contact Method</label>
          <input className="inp" value={data.contact} onChange={e => u("contact", e.target.value)} placeholder="jane@unified.com / (561) 555-0123" />
        </div>
      </div>

      <button className="btn btn-gold" onClick={onNext} disabled={!ready}>
        Next: Shape Your Persona <span style={{ fontSize: 14 }}>→</span>
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// STEP 2 — PERSONA
// ═══════════════════════════════════════════════════════════════
function S2Persona({ answers, setAnswers, onNext, onBack }) {
  const sel = (id, v) => setAnswers(a => ({ ...a, [id]: v }));
  const complete = PERSONA_QS.every(q => answers[q.id]);

  return (
    <div className="pg afu">
      <div className="eyebrow">Step 2 of 4 — Your Sales Persona</div>
      <h1 className="pg-title">How do you <em>actually</em> sell?</h1>
      <p className="pg-sub">Answer 5 questions. The AI uses your answers to write every email, pitch, and message in your authentic voice — not a generic template.</p>

      {PERSONA_QS.map((q, i) => (
        <div key={q.id} className="q-card afu" style={{ animationDelay: `${i * 0.07}s` }}>
          <div className="q-label">Question {i + 1} / {PERSONA_QS.length}</div>
          <div className="q-text">{q.q}</div>
          <div className="q-opts">
            {q.opts.map(o => (
              <div key={o} className={`q-opt${answers[q.id] === o ? " on" : ""}`} onClick={() => sel(q.id, o)}>
                {answers[q.id] === o && "✓ "}{o}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
        <button className="btn btn-wire" onClick={onBack}>← Back</button>
        <button className="btn btn-gold" onClick={onNext} disabled={!complete}>
          Next: Target Market <span style={{ fontSize: 14 }}>→</span>
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// STEP 3 — TARGETING
// ═══════════════════════════════════════════════════════════════
function S3Target({ criteria, setCriteria, onNext, onBack }) {
  const u = (k, v) => setCriteria(c => ({ ...c, [k]: v }));
  const tog = (k, v) => setCriteria(c => {
    const arr = c[k] || [];
    return { ...c, [k]: arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v] };
  });

  const revOptions = ["Under $500K", "$500K – $1M", "$1M – $5M", "$5M – $25M", "$25M+"];
  const empOptions = ["1 – 10", "11 – 50", "51 – 200", "201 – 1,000", "1,000+"];
  const signalOptions = [
    "Low Google rating (under 4.0)", "Few / no Google reviews",
    "Incomplete Google Business Profile", "No active social media",
    "Heavy dependency on paid lead aggregators", "Missing from AI search results",
    "No blog or content marketing", "Recent negative press or reviews",
    "New ownership or rebranding", "Rapid growth / new locations",
  ];
  const ready = (criteria.industries || []).length > 0 && (criteria.regions || []).length > 0;

  return (
    <div className="pg afu">
      <div className="eyebrow">Step 3 of 4 — Target Criteria</div>
      <h1 className="pg-title">Define your<br /><em>ideal prospect</em></h1>
      <p className="pg-sub">Set your filters and we'll discover and rank real matching businesses by sales opportunity — no manual prospecting needed.</p>

      <div className="field afu1" style={{ marginBottom: 26 }}>
        <label className="lbl">Target Industries * — select up to 5</label>
        <div className="chips">
          {INDUSTRIES.map(ind => (
            <Chip key={ind} label={ind}
              on={(criteria.industries || []).includes(ind)}
              onClick={() => {
                const arr = criteria.industries || [];
                if (arr.includes(ind) || arr.length < 5) tog("industries", ind);
              }} />
          ))}
        </div>
      </div>

      <div className="field afu2" style={{ marginBottom: 26 }}>
        <label className="lbl">Geographic Areas * — select all that apply</label>
        <div className="chips">
          {REGIONS.map(r => (
            <Chip key={r} label={r} on={(criteria.regions || []).includes(r)} onClick={() => tog("regions", r)} />
          ))}
        </div>
        <div style={{ marginTop: 12 }}>
          <label className="lbl" style={{ marginBottom: 6 }}>Specific cities / ZIP codes (optional)</label>
          <input className="inp" value={criteria.customGeo || ""} onChange={e => u("customGeo", e.target.value)} placeholder="e.g. Boca Raton FL, Fort Lauderdale FL, Deerfield Beach FL" />
        </div>
      </div>

      <div className="g2 afu3" style={{ marginBottom: 26 }}>
        <div className="field">
          <label className="lbl">Target Annual Revenue</label>
          <div className="chips" style={{ marginTop: 2 }}>
            {revOptions.map(r => (
              <Chip key={r} label={r} on={(criteria.revenue || []).includes(r)} onClick={() => tog("revenue", r)} />
            ))}
          </div>
        </div>
        <div className="field">
          <label className="lbl">Employee Count</label>
          <div className="chips" style={{ marginTop: 2 }}>
            {empOptions.map(e => (
              <Chip key={e} label={e} on={(criteria.employees || []).includes(e)} onClick={() => tog("employees", e)} />
            ))}
          </div>
        </div>
      </div>

      <div className="field afu4" style={{ marginBottom: 26 }}>
        <label className="lbl">Target Pain Signals — select all that apply</label>
        <div className="chips">
          {signalOptions.map(s => (
            <Chip key={s} label={s} on={(criteria.signals || []).includes(s)} onClick={() => tog("signals", s)} />
          ))}
        </div>
      </div>

      <div className="field afu5" style={{ marginBottom: 32 }}>
        <label className="lbl">How many prospects to discover?</label>
        <div className="range-row">
          <input type="range" className="rng" min={5} max={20} value={criteria.count || 10}
            style={{ "--pct": `${((criteria.count || 10) - 5) / 15 * 100}%` }}
            onChange={e => u("count", parseInt(e.target.value))} />
          <span className="rng-val">{criteria.count || 10} prospects</span>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        <button className="btn btn-wire" onClick={onBack}>← Back</button>
        <button className="btn btn-gold" onClick={onNext} disabled={!ready}>
          <span>🔍</span> Discover &amp; Rank Prospects <span style={{ fontSize: 14 }}>→</span>
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// STEP 4 — DISCOVERY + RANKED LIST
// ═══════════════════════════════════════════════════════════════
function S4Discover({ profile, persona, criteria, onProceed, onBack }) {
  const [phase, setPhase] = useState("loading");
  const [prospects, setProspects] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loadStep, setLoadStep] = useState(0);
  const [err, setErr] = useState("");
  const ran = useRef(false);

  const lSteps = [
    { icon: "🎯", label: "Parsing your targeting criteria" },
    { icon: "🌍", label: "Searching for matching businesses" },
    { icon: "📊", label: "Scoring opportunity for each prospect" },
    { icon: "🏆", label: "Ranking by sales potential" },
  ];
  const pcts = [12, 38, 68, 95];

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    const delays = [0, 2800, 7000, 12000];
    const timers = delays.map((d, i) => setTimeout(() => setLoadStep(i), d));
    run().finally(() => timers.forEach(clearTimeout));
    return () => timers.forEach(clearTimeout);
  }, []);

  async function run() {
    try {
      const raw = await callAI(`You are a B2B sales intelligence engine for ${profile.company}.

SALESPERSON: ${profile.name} (${profile.title || "Founder"}) at ${profile.company}
SERVICE: ${profile.service}
DEAL SIZE: ${profile.dealSize || "N/A"}

TARGETING CRITERIA:
- Industries: ${(criteria.industries || []).join(", ")}
- Regions: ${[...(criteria.regions || []), criteria.customGeo || ""].filter(Boolean).join("; ")}
- Revenue: ${(criteria.revenue || []).join(", ") || "Any"}
- Employees: ${(criteria.employees || []).join(", ") || "Any"}
- Pain signals: ${(criteria.signals || []).join(", ") || "General digital gaps"}

Generate exactly ${criteria.count || 10} REALISTIC, SPECIFIC business prospects that match these criteria. Use your knowledge to create highly believable, detailed businesses with real-feeling names, specific locations, realistic Google ratings, and specific digital weaknesses relevant to ${profile.company}'s services.

For each prospect, assign an opportunityScore (0-100) based on: how well ${profile.company}'s specific offer fits their known pain points, urgency of their situation, and likelihood they'd be receptive. Be REALISTIC — scores should range from ~42 to ~94. Sort descending.

Return a JSON array ONLY:
[
  {
    "id": "p1",
    "name": "Business Name",
    "industry": "Industry category",
    "city": "City, State",
    "website": "https://example.com",
    "contactName": "First Last",
    "contactTitle": "Executive Director / Owner / etc",
    "googleRating": 3.7,
    "reviewCount": 28,
    "estimatedRevenue": "$2M–$5M",
    "employees": "30–60",
    "opportunityScore": 88,
    "oppColor": "#E8A430",
    "topPain": "One-sentence description of their most urgent pain point",
    "painCategory": "GMB|SEO|Content|Reputation|Social|Ads",
    "urgency": "high|medium|low",
    "estDealValue": "$X,XXX/mo",
    "whyNow": "2-sentence explanation of WHY this is a top opportunity for ${profile.name} RIGHT NOW",
    "signals": ["signal 1", "signal 2", "signal 3"]
  }
]`);

      setLoadStep(3);
      const list = JSON.parse(raw);
      setTimeout(() => {
        setProspects(list);
        setPhase("list");
      }, 700);
    } catch (e) {
      setErr(e.message);
      setPhase("error");
    }
  }

  const toggleSel = id => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const selectAll = () => setSelected(prospects.map(p => p.id));
  const clearAll = () => setSelected([]);

  const urgVariant = u => u === "high" ? "tc" : u === "medium" ? "tg" : "tj";
  const painVariant = p => ({ GMB:"tj", SEO:"tj", Content:"tg", Reputation:"tc", Social:"tv", Ads:"tc" })[p] || "tg";
  const rankCls = i => i === 0 ? "rb-1" : i === 1 ? "rb-2" : i === 2 ? "rb-3" : "rb-n";

  // ── Loading ──
  if (phase === "loading") return (
    <div className="pg">
      <div className="disc-load">
        <div className="radar">
          <div className="rr" /><div className="rr" /><div className="rr" />
          <div className="rsweep" /><div className="rdot" />
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "DM Mono, monospace", fontSize: 9, letterSpacing: ".16em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 8 }}>
            Discovering prospects
          </div>
          <div style={{ fontFamily: "Fraunces, serif", fontSize: 20, fontWeight: 700, color: "var(--sky)" }}>
            {(criteria.industries || []).slice(0, 2).join(" · ")}
          </div>
          <div style={{ color: "var(--sky3)", fontSize: 13, marginTop: 4 }}>
            {[...(criteria.regions || [])].slice(0, 2).join(" · ")}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          {lSteps.map((s, i) => (
            <div key={i} className={`lstep${i < loadStep ? " done" : i === loadStep ? " active" : ""}`}>
              <span style={{ fontSize: 12, width: 16, textAlign: "center", flexShrink: 0 }}>{i < loadStep ? "✓" : s.icon}</span>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
        <div className="lprog">
          <div className="lprog-fill" style={{ width: `${pcts[loadStep]}%` }} />
        </div>
      </div>
    </div>
  );

  if (phase === "error") return (
    <div className="pg">
      <div className="err-box" style={{ marginTop: 40 }}>Discovery failed: {err}</div>
      <button className="btn btn-wire" style={{ marginTop: 14 }} onClick={onBack}>← Back to Criteria</button>
    </div>
  );

  // ── Ranked list ──
  const highCount = prospects.filter(p => p.urgency === "high").length;
  const avgScore = prospects.length ? Math.round(prospects.reduce((a, p) => a + p.opportunityScore, 0) / prospects.length) : 0;

  return (
    <div className="pg afu">
      <div className="eyebrow">Step 4 of 4 — {prospects.length} Prospects Discovered</div>
      <h1 className="pg-title">Your ranked<br /><em>prospect list</em></h1>
      <p className="pg-sub">Sorted by opportunity score. Select the ones you want — we'll build a comprehensive intelligence report for each.</p>

      {/* Stats */}
      <div className="g3 afu1" style={{ marginBottom: 28 }}>
        {[
          { v: prospects.length, l: "Prospects Found" },
          { v: highCount, l: "High Urgency" },
          { v: avgScore, l: "Avg Opp Score" },
        ].map(({ v, l }) => (
          <div key={l} className="stat-box">
            <span className="stat-val">{v}</span>
            <span className="stat-lbl">{l}</span>
          </div>
        ))}
      </div>

      {/* Select controls */}
      <div className="afu2" style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button className="btn btn-wire btn-sm" onClick={selectAll}>Select All</button>
        <button className="btn btn-wire btn-sm" onClick={clearAll}>Clear</button>
        {selected.length > 0 && (
          <span style={{ alignSelf: "center", fontSize: 13, color: "var(--sky3)" }}>
            <span style={{ color: "var(--gold)", fontWeight: 600 }}>{selected.length}</span> selected
          </span>
        )}
      </div>

      {/* Prospect cards */}
      {prospects.map((p, i) => (
        <div key={p.id}
          className={`p-card afu${Math.min(i + 1, 5)}${selected.includes(p.id) ? " sel" : ""}`}
          style={{ animationDelay: `${i * 0.04}s` }}
          onClick={() => toggleSel(p.id)}>

          <div className="p-check"><span className="p-check-mark">✓</span></div>

          <div className={`rank-badge ${rankCls(i)}`}>#{i + 1}</div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 6 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: "var(--sky)", marginBottom: 3 }}>{p.name}</div>
                <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                  <span className="f-mono" style={{ fontSize: 10, color: "var(--sky3)" }}>📍 {p.city}</span>
                  <span style={{ color: "var(--wire2)" }}>·</span>
                  <span className="f-mono" style={{ fontSize: 10, color: "var(--sky3)" }}>{p.industry}</span>
                  {p.googleRating > 0 && (
                    <>
                      <span style={{ color: "var(--wire2)" }}>·</span>
                      <span className="f-mono" style={{ fontSize: 10, color: "var(--gold)" }}>★ {p.googleRating} ({p.reviewCount} reviews)</span>
                    </>
                  )}
                </div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontFamily: "Fraunces, serif", fontSize: 24, fontWeight: 900, color: p.oppColor || "var(--gold)", lineHeight: 1 }}>
                  {p.opportunityScore}
                </div>
                <div className="f-mono" style={{ fontSize: 8, color: "var(--sky3)", textTransform: "uppercase", letterSpacing: ".08em" }}>Opp Score</div>
              </div>
            </div>

            <p style={{ fontSize: 12, color: "var(--sky2)", lineHeight: 1.65, marginBottom: 10 }}>{p.whyNow}</p>

            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
              <Tag label={`${(p.urgency || "").toUpperCase()} URGENCY`} variant={urgVariant(p.urgency)} />
              <Tag label={p.painCategory || "General"} variant={painVariant(p.painCategory)} />
              {(p.signals || []).slice(0, 2).map(s => <Tag key={s} label={s} variant="tj" />)}
              {p.estDealValue && <Tag label={`💰 ${p.estDealValue}`} variant="tg" />}
            </div>

            <div className="opp-track">
              <div className="opp-fill" style={{ width: `${p.opportunityScore}%`, background: p.oppColor || "var(--gold)" }} />
            </div>
          </div>
        </div>
      ))}

      {/* Sticky action */}
      <div className="sticky-bar">
        <button className="btn btn-wire" onClick={onBack}>← Edit Criteria</button>
        <div style={{ flex: 1, fontSize: 13, color: "var(--sky3)" }}>
          {selected.length === 0
            ? "Select prospects above to generate deep reports"
            : <><strong style={{ color: "var(--gold)" }}>{selected.length} prospect{selected.length > 1 ? "s" : ""}</strong> selected — ready to analyze</>
          }
        </div>
        <button className="btn btn-gold" disabled={selected.length === 0}
          onClick={() => onProceed(prospects.filter(p => selected.includes(p.id)))}>
          <span>⚡</span> Build {selected.length > 0 ? selected.length : ""} Deep Report{selected.length !== 1 ? "s" : ""}
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// STEP 5 — DEEP REPORTS
// ═══════════════════════════════════════════════════════════════
function S5Reports({ prospects, profile, persona, onBack }) {
  const [reports, setReports] = useState({});
  const [loading, setLoading] = useState({});
  const [activeId, setActiveId] = useState(prospects[0]?.id);
  const [activeEmail, setActiveEmail] = useState(0);

  useEffect(() => {
    prospects.forEach(p => generateFor(p));
  }, []);

  async function generateFor(p) {
    setLoading(l => ({ ...l, [p.id]: true }));
    try {
      const raw = await callAI(
        `Generate a COMPREHENSIVE sales intelligence report. Every piece of outreach must be written in ${profile.name}'s authentic voice based on their persona below.

SALESPERSON:
- Name: ${profile.name} | Title: ${profile.title || "Sales Professional"}
- Company: ${profile.company} | Website: ${profile.website || "N/A"}
- Offer: ${profile.service}
- Deal size: ${profile.dealSize || "N/A"}
- Contact: ${profile.contact || "N/A"}

PERSONA (write ALL outreach to match this voice):
- Communication style: ${persona.style || "Professional"}
- Opening hook style: ${persona.hook || "Observation-based"}
- Objection response: ${persona.objection || "Ask questions"}
- Closing style: ${persona.close || "Next-step"}
- Key differentiator: ${persona.edge || "Specialization"}

PROSPECT:
- Name: ${p.name} | Industry: ${p.industry}
- City: ${p.city} | Website: ${p.website || "Unknown"}
- Contact: ${p.contactName || "Decision Maker"} (${p.contactTitle || ""})
- Google: ★ ${p.googleRating} (${p.reviewCount} reviews)
- Revenue: ${p.estimatedRevenue || "N/A"} | Employees: ${p.employees || "N/A"}
- Known signals: ${(p.signals || []).join(", ")}
- Primary pain: ${p.topPain}

Return this exact JSON:
{
  "executiveSummary": "3-4 sentences: what this business does, their current digital situation, and why RIGHT NOW is the moment for ${profile.company} to reach out",
  "digitalHealthScore": 0-100,
  "relevanceScore": 0-100,
  "outreachAngle": "The single sharpest, most compelling opening hook for this specific prospect from ${profile.name}",
  "painPoints": [
    {
      "category": "GMB|Website|SEO|Content|Reputation|Social|Ads",
      "pain": "Specific problem title",
      "evidence": "Concrete observation or data point that reveals this",
      "urgency": "high|medium|low",
      "impact": "What this is costing them in real business terms",
      "fix": "Exactly how ${profile.company} solves this with their specific service"
    }
  ],
  "competitorGap": "What 1-2 direct competitors in their area are doing that this prospect isn't — make it specific",
  "emailSequence": [
    {
      "touch": 1, "timing": "Day 1",
      "subject": "Subject line referencing something specific about their business",
      "body": "Full email — under 130 words — written exactly in ${profile.name}'s voice using their ${persona.hook || "observation"} hook style and ${persona.style || "professional"} tone. Reference something real about this specific business.",
      "cta": "${profile.name}'s natural ${persona.close || "next-step"} close"
    },
    {
      "touch": 2, "timing": "Day 7",
      "subject": "Follow-up subject adding a new angle",
      "body": "Adds a fresh observation or competitive insight — under 110 words — still in ${profile.name}'s voice",
      "cta": "Natural follow-up ask"
    },
    {
      "touch": 3, "timing": "Day 14",
      "subject": "Final — leaves door open",
      "body": "Honest, brief, no desperation — under 90 words. ${profile.name}'s authentic style. References their specific situation one last time.",
      "cta": "Low-pressure final ask"
    }
  ],
  "linkedinMessage": "Under 270 chars. Written in ${profile.name}'s exact voice. References one SPECIFIC thing about this business. No generic pitches.",
  "smsMessage": "Under 155 chars. Conversational, creates curiosity, references a real observation about their business.",
  "elevatorPitch": "60-second SPOKEN script in ${profile.name}'s voice. Opens with their pain, delivers ${profile.company}'s solution, closes with ${profile.name}'s natural ${persona.close || "next-step"} ask. Make it feel unrehearsed.",
  "objectionHandlers": [
    { "obj": "We already have someone for that", "response": "Response exactly how ${profile.name} would handle it: ${persona.objection || "ask questions first"}" },
    { "obj": "Not in the budget right now", "response": "Use their specific pain as the leverage point" },
    { "obj": "Just send me some info", "response": "Redirect toward a real conversation — in ${profile.name}'s style" }
  ],
  "quickWin": "The single most impressive thing ${profile.company} could demonstrate for this specific prospect in the first 30 days — make it concrete and business-specific"
}`);

      const parsed = JSON.parse(raw);
      setReports(r => ({ ...r, [p.id]: parsed }));
    } catch (e) {
      setReports(r => ({ ...r, [p.id]: { __error: e.message } }));
    } finally {
      setLoading(l => ({ ...l, [p.id]: false }));
    }
  }

  const ap = prospects.find(p => p.id === activeId);
  const ar = reports[activeId];
  const isLoading = loading[activeId];

  const catV = c => ({ GMB: "tj", Website: "tv", SEO: "tj", Content: "tg", Reputation: "tc", Social: "tv", Ads: "tc" })[c] || "tg";
  const urgV = u => ({ high: "tc", medium: "tg", low: "tj" })[(u || "").toLowerCase()] || "tg";
  const ringCls = s => s >= 70 ? "sr-hi" : s >= 45 ? "sr-med" : "sr-lo";

  return (
    <div className="report-shell" style={{ height: "calc(100vh - 0px)" }}>
      {/* Tab list */}
      <div className="rep-list">
        <div style={{ padding: "13px 16px", borderBottom: "1px solid var(--wire)", flexShrink: 0 }}>
          <div className="f-mono" style={{ fontSize: 9, color: "var(--sky3)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 2 }}>Reports</div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>{prospects.length} Prospect{prospects.length !== 1 ? "s" : ""}</div>
        </div>
        <div className="rep-list-items">
          {prospects.map(p => {
            const done = !!reports[p.id] && !reports[p.id]?.__error;
            const err = !!reports[p.id]?.__error;
            const isLd = loading[p.id];
            return (
              <div key={p.id}
                className={`rep-tab${activeId === p.id ? " active" : ""}`}
                onClick={() => { setActiveId(p.id); setActiveEmail(0); }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                  <div className="rep-status-dot" style={{
                    background: err ? "var(--coral)" : isLd ? "var(--gold)" : done ? "var(--jade)" : "var(--wire2)",
                    animation: isLd ? "pulse 1s infinite" : "none"
                  }} />
                  <div style={{ fontSize: 12, fontWeight: 600, color: activeId === p.id ? "var(--sky)" : "var(--sky2)", lineHeight: 1.3 }}>{p.name}</div>
                </div>
                <div className="f-mono" style={{ fontSize: 9, color: "var(--sky3)", paddingLeft: 15 }}>{p.city}</div>
              </div>
            );
          })}
        </div>
        <div style={{ padding: "12px 14px", borderTop: "1px solid var(--wire)" }}>
          <button className="btn btn-wire" style={{ width: "100%", justifyContent: "center", fontSize: 12, padding: "8px" }} onClick={onBack}>
            ← Back to List
          </button>
        </div>
      </div>

      {/* Report content */}
      <div className="rep-main">
        {/* Loading state */}
        {ap && isLoading && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "55vh", gap: 20 }}>
            <div className="radar" style={{ width: 70, height: 70 }}>
              <div className="rr" /><div className="rr" /><div className="rr" />
              <div className="rsweep" /><div className="rdot" />
            </div>
            <div style={{ textAlign: "center" }}>
              <div className="f-mono" style={{ fontSize: 9, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--gold)", marginBottom: 7 }}>Building intelligence report</div>
              <div style={{ fontFamily: "Fraunces, serif", fontSize: 20, fontWeight: 700 }}>{ap.name}</div>
              <div style={{ color: "var(--sky3)", fontSize: 12, marginTop: 4 }}>Personalizing to {profile.name}'s voice…</div>
            </div>
            <div style={{ width: 240 }}>
              <div className="lprog"><div className="lprog-fill" style={{ width: "55%", animation: "shimmer 2s infinite" }} /></div>
            </div>
          </div>
        )}

        {/* Error */}
        {ar?.__error && (
          <div style={{ padding: 28 }}>
            <div className="err-box">Report failed: {ar.__error}</div>
            <button className="btn btn-wire" style={{ marginTop: 12 }} onClick={() => generateFor(ap)}>Retry</button>
          </div>
        )}

        {/* Full report */}
        {ap && ar && !ar.__error && !isLoading && (
          <div className="afi">
            {/* ── Header ── */}
            <div style={{ borderBottom: "1px solid var(--wire)", paddingBottom: 22, marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
                <div>
                  <Tag label="Intelligence Report" variant="tg" />
                  <div style={{ marginTop: 9, fontFamily: "Fraunces, serif", fontSize: "clamp(22px,3vw,32px)", fontWeight: 900, letterSpacing: "-.025em", lineHeight: 1.1, color: "var(--sky)" }}>
                    {ap.name}
                  </div>
                  <div style={{ color: "var(--sky3)", fontSize: 12, marginTop: 5 }}>
                    📍 {ap.city} · {ap.industry}
                    {ap.contactName && ` · ${ap.contactName}, ${ap.contactTitle || ""}`}
                  </div>
                </div>
                <div className="f-mono" style={{ fontSize: 8, color: "var(--sky3)", textAlign: "right", lineHeight: 1.9 }}>
                  <div>For {profile.name}</div>
                  <div>{new Date().toLocaleString()}</div>
                </div>
              </div>

              {/* Scores + summary */}
              <div style={{ display: "flex", gap: 18, flexWrap: "wrap", alignItems: "flex-start" }}>
                <div style={{ display: "flex", gap: 14 }}>
                  {[
                    { score: ar.relevanceScore || 0, label: "ICP Match" },
                    { score: ar.digitalHealthScore || 0, label: "Digital Health" },
                    { score: ap.opportunityScore || 0, label: "Opp Score" },
                  ].map(({ score, label }) => (
                    <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                      <div className={`s-ring ${ringCls(score)}`}>{score}</div>
                      <div className="f-mono" style={{ fontSize: 8, color: "var(--sky3)", textTransform: "uppercase", letterSpacing: ".08em" }}>{label}</div>
                    </div>
                  ))}
                </div>
                <div style={{ flex: 1, minWidth: 190, paddingLeft: 18, borderLeft: "1px solid var(--wire)" }}>
                  <div className="f-mono" style={{ fontSize: 9, color: "var(--gold)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 6 }}>Executive Summary</div>
                  <p style={{ color: "var(--sky2)", fontSize: 12, lineHeight: 1.7 }}>{ar.executiveSummary}</p>
                  {ar.outreachAngle && (
                    <div style={{ marginTop: 10, padding: "8px 12px", background: "rgba(232,164,48,.05)", borderLeft: "2px solid var(--gold)" }}>
                      <div className="f-mono" style={{ fontSize: 8, color: "var(--gold)", textTransform: "uppercase", letterSpacing: ".09em", marginBottom: 3 }}>Core Angle</div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "var(--sky)" }}>{ar.outreachAngle}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── Pain Matrix ── */}
            <div className="r-card" style={{ marginBottom: 13 }}>
              <div className="r-hdr">
                <div className="r-ico">⚠️</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>Pain Point Matrix</div>
                  <div style={{ color: "var(--sky3)", fontSize: 11, marginTop: 1 }}>Evidence-backed issues + {profile.company}'s exact solution</div>
                </div>
              </div>
              <div className="pain-hdr">
                {["Issue + Evidence", "Business Impact", `${profile.company}'s Fix`].map(h => (
                  <div key={h} className="phc">{h}</div>
                ))}
              </div>
              {(ar.painPoints || []).map((p, i) => (
                <div key={i} className="pain-row">
                  <div className="pc">
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 5 }}>
                      <Tag label={(p.urgency || "").toUpperCase()} variant={urgV(p.urgency)} />
                      <Tag label={p.category || ""} variant={catV(p.category)} />
                    </div>
                    <div style={{ fontWeight: 600, fontSize: 11, color: "var(--sky)" }}>{p.pain}</div>
                    <div style={{ fontSize: 10, color: "var(--sky3)", marginTop: 3 }}>{p.evidence}</div>
                  </div>
                  <div className="pc" style={{ color: "var(--sky2)", fontSize: 11 }}>{p.impact}</div>
                  <div className="pc" style={{ color: "var(--jade)", fontSize: 11, background: "rgba(15,212,168,.02)" }}>{p.fix}</div>
                </div>
              ))}
            </div>

            {/* ── Competitor Gap ── */}
            {ar.competitorGap && (
              <div style={{ marginBottom: 13, padding: "13px 16px", background: "rgba(155,114,247,.05)", border: "1px solid rgba(155,114,247,.18)", borderLeft: "3px solid var(--violet)" }}>
                <div className="f-mono" style={{ fontSize: 8, color: "var(--violet)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 5 }}>🔎 Competitor Context</div>
                <p style={{ fontSize: 12, color: "var(--sky2)", lineHeight: 1.65 }}>{ar.competitorGap}</p>
              </div>
            )}

            {/* ── Email Sequences ── */}
            <div className="r-card" style={{ marginBottom: 13 }}>
              <div className="r-hdr">
                <div className="r-ico">✉️</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>Cold Email Sequences</div>
                  <div style={{ color: "var(--sky3)", fontSize: 11, marginTop: 1 }}>Written in {profile.name}'s voice · 3-touch campaign</div>
                </div>
              </div>
              <div style={{ display: "flex", borderBottom: "1px solid var(--wire)", padding: "0 18px" }}>
                {(ar.emailSequence || []).map((e, i) => (
                  <button key={i} className={`etab${activeEmail === i ? " on" : ""}`} onClick={() => setActiveEmail(i)}>
                    Email {e.touch || i + 1}
                  </button>
                ))}
              </div>
              <div className="r-body">
                {(ar.emailSequence || []).map((e, i) => (
                  <div key={i} style={{ display: activeEmail === i ? "block" : "none" }}>
                    <div className="email-blk">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10, gap: 8 }}>
                        <div>
                          {e.timing && <div className="f-mono" style={{ fontSize: 8, color: "var(--gold)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 3 }}>{e.timing}</div>}
                          <div style={{ fontWeight: 700, fontSize: 12, color: "var(--sky)" }}>Subject: {e.subject}</div>
                        </div>
                        <CopyBtn text={`Subject: ${e.subject}\n\n${e.body}`} />
                      </div>
                      <div style={{ whiteSpace: "pre-wrap", fontSize: 11, color: "var(--sky2)", lineHeight: 1.8, borderTop: "1px solid var(--wire)", paddingTop: 10 }}>{e.body}</div>
                      {e.cta && (
                        <div style={{ marginTop: 9, padding: "6px 10px", background: "rgba(232,164,48,.04)", borderLeft: "2px solid rgba(232,164,48,.22)", fontSize: 10, color: "var(--sky3)" }}>
                          <span className="f-mono" style={{ fontSize: 8, color: "var(--gold)", textTransform: "uppercase", letterSpacing: ".08em", marginRight: 6 }}>CTA</span>{e.cta}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── LinkedIn + SMS ── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 13 }}>
              {ar.linkedinMessage && (
                <div className="r-card" style={{ margin: 0, borderColor: "rgba(155,114,247,.25)" }}>
                  <div className="r-hdr">
                    <div className="r-ico" style={{ background: "rgba(155,114,247,.07)", borderColor: "rgba(155,114,247,.2)" }}>💼</div>
                    <div style={{ fontWeight: 700, fontSize: 12 }}>LinkedIn DM</div>
                  </div>
                  <div className="r-body">
                    <div style={{ fontSize: 11, color: "var(--sky2)", lineHeight: 1.7, marginBottom: 10 }}>{ar.linkedinMessage}</div>
                    <CopyBtn text={ar.linkedinMessage} />
                  </div>
                </div>
              )}
              {ar.smsMessage && (
                <div className="r-card" style={{ margin: 0, borderColor: "rgba(15,212,168,.2)" }}>
                  <div className="r-hdr">
                    <div className="r-ico" style={{ background: "rgba(15,212,168,.06)", borderColor: "rgba(15,212,168,.18)" }}>📱</div>
                    <div style={{ fontWeight: 700, fontSize: 12 }}>SMS Intro</div>
                  </div>
                  <div className="r-body">
                    <div style={{ background: "var(--ink4)", border: "1px solid var(--wire)", padding: 10, fontSize: 11, color: "var(--sky2)", lineHeight: 1.65, marginBottom: 10 }}>{ar.smsMessage}</div>
                    <CopyBtn text={ar.smsMessage} />
                  </div>
                </div>
              )}
            </div>

            {/* ── Elevator Pitch ── */}
            {ar.elevatorPitch && (
              <div className="r-card" style={{ marginBottom: 13 }}>
                <div className="r-hdr">
                  <div className="r-ico" style={{ background: "rgba(232,164,48,.07)", borderColor: "rgba(232,164,48,.18)" }}>🎤</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>Elevator Pitch Script</div>
                    <div style={{ color: "var(--sky3)", fontSize: 11, marginTop: 1 }}>60 seconds · in {profile.name}'s voice</div>
                  </div>
                </div>
                <div className="r-body">
                  <div className="pitch-blk">{ar.elevatorPitch}</div>
                  <div style={{ marginTop: 10 }}><CopyBtn text={ar.elevatorPitch} /></div>
                </div>
              </div>
            )}

            {/* ── Objection Handlers ── */}
            {(ar.objectionHandlers || []).length > 0 && (
              <div className="r-card" style={{ marginBottom: 13 }}>
                <div className="r-hdr">
                  <div className="r-ico">🥊</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>Objection Handlers</div>
                    <div style={{ color: "var(--sky3)", fontSize: 11, marginTop: 1 }}>Tailored to {profile.name}'s closing style</div>
                  </div>
                </div>
                <div className="r-body">
                  {ar.objectionHandlers.map((o, i) => (
                    <div key={i} style={{ marginBottom: i < ar.objectionHandlers.length - 1 ? 16 : 0 }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: "var(--coral)", marginBottom: 5 }}>"{o.obj}"</div>
                      <div style={{ fontSize: 12, color: "var(--sky2)", lineHeight: 1.65, paddingLeft: 12, borderLeft: "2px solid var(--wire2)" }}>{o.response}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Quick Win ── */}
            {ar.quickWin && (
              <div style={{ padding: "13px 16px", background: "rgba(15,212,168,.04)", border: "1px solid rgba(15,212,168,.15)", borderLeft: "3px solid var(--jade)" }}>
                <div className="f-mono" style={{ fontSize: 8, color: "var(--jade)", letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 6 }}>⚡ 30-Day Quick Win</div>
                <p style={{ fontSize: 12, color: "var(--sky)", lineHeight: 1.65 }}>{ar.quickWin}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SIDEBAR
// ═══════════════════════════════════════════════════════════════
const STEPS_META = [
  { label: "Company Profile",    sub: "Who you are & what you sell" },
  { label: "Sales Persona",      sub: "How you communicate & close" },
  { label: "Target Market",      sub: "Industries, geo & signals" },
  { label: "Prospect Discovery", sub: "AI-ranked list" },
  { label: "Intelligence Reports", sub: "Deep-dive per prospect" },
];

// ═══════════════════════════════════════════════════════════════
// ROOT
// ═══════════════════════════════════════════════════════════════
export default function ProspectIQ() {
  useEffect(() => { injectStyles(); }, []);

  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState({ name: "", title: "", company: "", website: "", service: "", dealSize: "", contact: "" });
  const [persona, setPersona] = useState({});
  const [criteria, setCriteria] = useState({ count: 10 });
  const [selProspects, setSelProspects] = useState([]);

  const progress = Math.round(step / (STEPS_META.length - 1) * 100);

  return (
    <div className="shell">
      {/* ── Sidebar ── */}
      <div className="sidebar">
        <div className="sb-logo">
          <div className="sb-hex">P</div>
          <div>
            <div style={{ fontFamily: "Fraunces, serif", fontSize: 15, fontWeight: 900, letterSpacing: ".01em", color: "var(--sky)", lineHeight: 1.1 }}>ProspectIQ</div>
            <div className="f-mono" style={{ fontSize: 8, color: "var(--sky3)", letterSpacing: ".1em", textTransform: "uppercase", marginTop: 1 }}>Sales Intelligence v2</div>
          </div>
        </div>

        <div className="sb-steps">
          {STEPS_META.map((s, i) => (
            <div key={i}
              className={`sb-step${step === i ? " active" : ""}${step > i ? " done" : ""}`}
              onClick={() => { if (i < step) setStep(i); }}>
              <div className={`sb-num sb-num-${step > i ? "done" : step === i ? "active" : "idle"}`}>
                {step > i ? "✓" : i + 1}
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: step === i ? 600 : 400, lineHeight: 1.3, transition: "color .2s" }}>
                  {s.label}
                </div>
                <div className="f-mono" style={{ fontSize: 9, color: "var(--sky3)", marginTop: 1, letterSpacing: ".04em" }}>
                  {s.sub}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="sb-foot">
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <div className="f-mono" style={{ fontSize: 8, color: "var(--sky3)", letterSpacing: ".08em", textTransform: "uppercase" }}>Progress</div>
            <div className="f-mono" style={{ fontSize: 9, color: "var(--gold)" }}>{progress}%</div>
          </div>
          <div className="sb-prog-track">
            <div className="sb-prog-bar" style={{ width: `${progress}%` }} />
          </div>
          {profile.name && (
            <div className="sb-user" style={{ marginTop: 12 }}>
              <div className="f-mono" style={{ fontSize: 8, color: "var(--sky3)", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 4 }}>Active session</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--sky)" }}>{profile.name}</div>
              <div style={{ fontSize: 11, color: "var(--sky3)" }}>{profile.company}</div>
            </div>
          )}
        </div>
      </div>

      {/* ── Main ── */}
      <div className="main-area">
        {step === 0 && <S1Profile data={profile} setData={setProfile} onNext={() => setStep(1)} />}
        {step === 1 && <S2Persona answers={persona} setAnswers={setPersona} onNext={() => setStep(2)} onBack={() => setStep(0)} />}
        {step === 2 && <S3Target criteria={criteria} setCriteria={setCriteria} onNext={() => setStep(3)} onBack={() => setStep(1)} />}
        {step === 3 && (
          <S4Discover profile={profile} persona={persona} criteria={criteria}
            onProceed={list => { setSelProspects(list); setStep(4); }}
            onBack={() => setStep(2)} />
        )}
        {step === 4 && (
          <S5Reports prospects={selProspects} profile={profile} persona={persona} onBack={() => setStep(3)} />
        )}
      </div>
    </div>
  );
}
