import { useState, useEffect, useRef } from "react";
import { Tag, Radar } from "./components.jsx";
import { callAI } from "./api.js";

export default function Step4({ profile, persona, crit, onDone, back }) {
  const [phase, setPhase]       = useState("load");
  const [prospects, setProspects] = useState([]);
  const [sel, setSel]           = useState([]);
  const [ls, setLs]             = useState(0);
  const [err, setErr]           = useState("");
  const ran = useRef(false);

  const loadSteps = [
    { icon: "🎯", label: "Parsing your targeting criteria" },
    { icon: "🌍", label: "Searching for matching businesses" },
    { icon: "📊", label: "Scoring opportunity for each prospect" },
    { icon: "🏆", label: "Ranking by sales potential" },
  ];
  const pcts = [12, 38, 68, 95];

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    const delays = [0, 2500, 6000, 10500];
    const timers = delays.map((d, i) => setTimeout(() => setLs(i), d));
    run().finally(() => timers.forEach(clearTimeout));
    return () => timers.forEach(clearTimeout);
  }, []);

  async function run() {
    try {
      const raw = await callAI(
        `You are a B2B sales intelligence engine for ${profile.company}.
SALESPERSON: ${profile.name} (${profile.title || "Founder"}) at ${profile.company}
SERVICE: ${profile.service}
DEAL SIZE: ${profile.dealSize || "N/A"}
TARGETING:
- Industries: ${(crit.industries || []).join(", ")}
- Regions: ${[...(crit.regions || []), crit.geo || ""].filter(Boolean).join("; ")}
- Revenue: ${(crit.revenue || []).join(", ") || "Any"}
- Employees: ${(crit.employees || []).join(", ") || "Any"}
- Pain signals: ${(crit.signals || []).join(", ") || "General digital gaps"}

Generate exactly ${crit.count || 10} REALISTIC, SPECIFIC business prospects matching these criteria. Create believable businesses with real-feeling names, specific cities, realistic Google ratings (2.8–4.9 range), and specific digital weaknesses relevant to ${profile.company}'s services.

Assign opportunityScore (0–100) based on fit + urgency + receptiveness. Range ~42–94. Sort descending by score.

Return JSON array ONLY — no other text:
[{
  "id": "p1",
  "name": "Business Name",
  "industry": "category",
  "city": "City, ST",
  "website": "https://example.com",
  "contactName": "First Last",
  "contactTitle": "Executive Director",
  "googleRating": 3.7,
  "reviewCount": 28,
  "estimatedRevenue": "$2M–$5M",
  "employees": "30–60",
  "opportunityScore": 88,
  "oppColor": "#E8A430",
  "topPain": "one sentence describing their primary pain",
  "painCategory": "GMB|SEO|Content|Reputation|Social|Ads",
  "urgency": "high|medium|low",
  "estDealValue": "$2,200/mo",
  "whyNow": "2 sentences explaining why NOW is the moment for ${profile.name} to reach out",
  "signals": ["signal 1", "signal 2", "signal 3"]
}]`
      );
      setLs(3);
      const list = JSON.parse(raw);
      setTimeout(() => { setProspects(list); setPhase("list"); }, 500);
    } catch (e) {
      setErr(e.message);
      setPhase("err");
    }
  }

  const toggle  = (id) => setSel((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);
  const urgV    = (u)  => u === "high" ? "tr" : u === "medium" ? "ta" : "tg";
  const painV   = (p)  => ({ GMB:"tg", SEO:"tg", Content:"ta", Reputation:"tr", Social:"tv", Ads:"tr" })[p] || "ta";
  const rbCls   = (i)  => i === 0 ? "rb1" : i === 1 ? "rb2" : i === 2 ? "rb3" : "rbn";

  if (phase === "load") return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"80vh", gap:18 }}>
      <Radar size={72} />
      <div style={{ textAlign:"center" }}>
        <div className="mono" style={{ fontSize:8.5, letterSpacing:".16em", textTransform:"uppercase", color:"var(--au)", marginBottom:6 }}>
          Discovering prospects
        </div>
        <div className="serif" style={{ fontSize:17, fontWeight:700, color:"var(--tx)" }}>
          {(crit.industries || []).slice(0, 2).join(" · ")}
        </div>
        <div style={{ color:"var(--tx3)", fontSize:11, marginTop:2 }}>
          {(crit.regions || []).slice(0, 2).join(" · ")}
        </div>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
        {loadSteps.map((s, i) => (
          <div key={i} className={`ls${i < ls ? " done" : i === ls ? " act" : ""}`}>
            <span style={{ fontSize:10, width:14, textAlign:"center", flexShrink:0 }}>{i < ls ? "✓" : s.icon}</span>
            <span>{s.label}</span>
          </div>
        ))}
      </div>
      <div className="lp"><div className="lpf" style={{ width:`${pcts[ls]}%` }} /></div>
    </div>
  );

  if (phase === "err") return (
    <div className="pg">
      <div className="err" style={{ marginTop:30 }}>Discovery failed: {err}</div>
      <button className="btn bw" style={{ marginTop:12 }} onClick={back}>← Back to Criteria</button>
    </div>
  );

  const highCount = prospects.filter((p) => p.urgency === "high").length;
  const avgScore  = prospects.length
    ? Math.round(prospects.reduce((a, p) => a + p.opportunityScore, 0) / prospects.length)
    : 0;

  return (
    <div className="pg u0">
      <div className="ey">{prospects.length} Prospects Discovered</div>
      <h1 className="ti">Your ranked <em>prospect list</em></h1>
      <p className="su">Sorted by opportunity score. Select the ones you want deep intelligence reports for.</p>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:18 }}>
        {[{ v:prospects.length, l:"Found" }, { v:highCount, l:"High Urgency" }, { v:avgScore, l:"Avg Score" }].map(({ v, l }) => (
          <div key={l} className="sb">
            <div className="serif" style={{ fontSize:22, fontWeight:900, color:"var(--au)", lineHeight:1 }}>{v}</div>
            <div className="mono" style={{ fontSize:8, color:"var(--tx3)", textTransform:"uppercase", letterSpacing:".1em", marginTop:3 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div style={{ display:"flex", gap:6, marginBottom:10 }}>
        <button className="btn bw bsm" onClick={() => setSel(prospects.map((p) => p.id))}>Select All</button>
        <button className="btn bw bsm" onClick={() => setSel([])}>Clear</button>
        {sel.length > 0 && (
          <span style={{ alignSelf:"center", fontSize:11, color:"var(--tx3)" }}>
            <span style={{ color:"var(--au)", fontWeight:600 }}>{sel.length}</span> selected
          </span>
        )}
      </div>

      {/* Cards */}
      {prospects.map((p, i) => (
        <div
          key={p.id}
          className={`pcard u${Math.min(i + 1, 5)}${sel.includes(p.id) ? " sel" : ""}`}
          style={{ animationDelay:`${i * 0.04}s` }}
          onClick={() => toggle(p.id)}
        >
          <div className="pck"><span className="pckm">✓</span></div>
          <div className={`rb ${rbCls(i)}`}>#{i + 1}</div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8, marginBottom:3 }}>
              <div>
                <div style={{ fontWeight:700, fontSize:12.5, color:"var(--tx)", marginBottom:2 }}>{p.name}</div>
                <div style={{ display:"flex", gap:5, alignItems:"center", flexWrap:"wrap" }}>
                  <span className="mono" style={{ fontSize:9, color:"var(--tx3)" }}>📍 {p.city}</span>
                  <span style={{ color:"var(--ln2)" }}>·</span>
                  <span className="mono" style={{ fontSize:9, color:"var(--tx3)" }}>{p.industry}</span>
                  {p.googleRating > 0 && (
                    <>
                      <span style={{ color:"var(--ln2)" }}>·</span>
                      <span className="mono" style={{ fontSize:9, color:"var(--au)" }}>★{p.googleRating} ({p.reviewCount} reviews)</span>
                    </>
                  )}
                </div>
              </div>
              <div style={{ textAlign:"right", flexShrink:0 }}>
                <div className="serif" style={{ fontSize:20, fontWeight:900, color:p.oppColor || "var(--au)", lineHeight:1 }}>{p.opportunityScore}</div>
                <div className="mono" style={{ fontSize:7, color:"var(--tx3)", textTransform:"uppercase", letterSpacing:".08em" }}>Score</div>
              </div>
            </div>
            <p style={{ fontSize:11, color:"var(--tx2)", lineHeight:1.6, marginBottom:7 }}>{p.whyNow}</p>
            <div style={{ display:"flex", gap:4, flexWrap:"wrap", marginBottom:6 }}>
              <Tag label={`${(p.urgency || "").toUpperCase()} URGENCY`} v={urgV(p.urgency)} />
              <Tag label={p.painCategory || "General"} v={painV(p.painCategory)} />
              {(p.signals || []).slice(0, 2).map((s) => <Tag key={s} label={s} v="tg" />)}
              {p.estDealValue && <Tag label={`💰 ${p.estDealValue}`} v="ta" />}
            </div>
            <div className="ot"><div className="of" style={{ width:`${p.opportunityScore}%`, background:p.oppColor || "var(--au)" }} /></div>
          </div>
        </div>
      ))}

      {/* Sticky bar */}
      <div className="sact">
        <button className="btn bw" onClick={back}>← Edit Criteria</button>
        <div style={{ flex:1, fontSize:11, color:"var(--tx3)" }}>
          {sel.length === 0
            ? "Select prospects above to generate deep reports"
            : <><strong style={{ color:"var(--au)" }}>{sel.length}</strong> selected — ready to analyze</>
          }
        </div>
        <button
          className="btn bg"
          disabled={sel.length === 0}
          onClick={() => onDone(prospects.filter((p) => sel.includes(p.id)))}
        >
          ⚡ Build {sel.length > 0 ? sel.length : ""} Report{sel.length !== 1 ? "s" : ""}
        </button>
      </div>
    </div>
  );
}
