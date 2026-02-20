import { useState, useEffect } from "react";
import { Tag, Ring, CopyBtn, Radar } from "./components.jsx";
import { callAI } from "./api.js";

export default function Step5({ prospects, profile, persona, back }) {
  const [reps, setReps]         = useState({});
  const [loading, setLoading]   = useState({});
  const [active, setActive]     = useState(prospects[0]?.id);
  const [emailTab, setEmailTab] = useState(0);

  useEffect(() => { prospects.forEach((p) => generate(p)); }, []);

  async function generate(p) {
    setLoading((l) => ({ ...l, [p.id]: true }));
    try {
      const raw = await callAI(
        `Generate a COMPREHENSIVE sales intelligence report. Write ALL outreach in ${profile.name}'s authentic voice.

SALESPERSON:
- Name: ${profile.name} | Title: ${profile.title || "Sales Professional"} | Company: ${profile.company}
- Offer: ${profile.service}
- Deal size: ${profile.dealSize || "N/A"} | Contact: ${profile.contact || "N/A"}

PERSONA (match this voice in every piece of copy):
- Communication style: ${persona.style || "Professional"}
- Opening hook: ${persona.hook || "Observation-based"}
- Objection handling: ${persona.obj || "Ask questions"}
- Closing style: ${persona.close || "Next-step"}
- Key differentiator: ${persona.edge || "Specialization"}

PROSPECT:
- Name: ${p.name} | Industry: ${p.industry} | City: ${p.city}
- Contact: ${p.contactName || "Decision Maker"} (${p.contactTitle || ""})
- Google: ★${p.googleRating} (${p.reviewCount} reviews)
- Revenue: ${p.estimatedRevenue || "N/A"} | Employees: ${p.employees || "N/A"}
- Signals: ${(p.signals || []).join(", ")}
- Primary pain: ${p.topPain}

Return this exact JSON (no other text):
{
  "executiveSummary": "3-4 sentences: what this business does, their digital situation, and why NOW is the moment for ${profile.company} to reach out",
  "digitalHealthScore": 0-100,
  "relevanceScore": 0-100,
  "outreachAngle": "The single sharpest, most compelling opening hook for this specific prospect",
  "painPoints": [
    {
      "category": "GMB|Website|SEO|Content|Reputation|Social|Ads",
      "pain": "Specific problem title",
      "evidence": "Concrete observation revealing this problem",
      "urgency": "high|medium|low",
      "impact": "What this costs them in real business terms",
      "fix": "Exactly how ${profile.company} solves this"
    }
  ],
  "competitorGap": "What 1–2 direct local competitors are doing that this prospect isn't — be specific",
  "emailSequence": [
    {
      "touch": 1, "timing": "Day 1",
      "subject": "Subject referencing something specific about their business",
      "body": "Full email under 130 words in ${profile.name}'s exact voice. Reference something real and specific.",
      "cta": "${profile.name}'s natural closing ask"
    },
    {
      "touch": 2, "timing": "Day 7",
      "subject": "Follow-up adding a fresh angle",
      "body": "Under 110 words, new competitive insight, still in ${profile.name}'s voice",
      "cta": "Follow-up ask"
    },
    {
      "touch": 3, "timing": "Day 14",
      "subject": "Final — leaves the door open",
      "body": "Under 90 words, honest, zero desperation, references their situation",
      "cta": "Low-pressure final ask"
    }
  ],
  "linkedinMessage": "Under 270 chars. ${profile.name}'s exact voice. References ONE specific thing about this business.",
  "smsMessage": "Under 155 chars. Conversational, creates curiosity, specific observation.",
  "elevatorPitch": "60-second spoken script in ${profile.name}'s voice. Opens with their pain, delivers ${profile.company}'s solution, closes naturally.",
  "objectionHandlers": [
    { "obj": "We already have someone for that", "response": "How ${profile.name} would handle this" },
    { "obj": "Not in the budget right now", "response": "Use their specific pain as leverage" },
    { "obj": "Just send me some info", "response": "Redirect to a real conversation" }
  ],
  "quickWin": "The single most impressive thing ${profile.company} could demonstrate for this prospect in the first 30 days"
}`
      );
      setReps((r) => ({ ...r, [p.id]: JSON.parse(raw) }));
    } catch (e) {
      setReps((r) => ({ ...r, [p.id]: { _err: e.message } }));
    } finally {
      setLoading((l) => ({ ...l, [p.id]: false }));
    }
  }

  const ap    = prospects.find((p) => p.id === active);
  const ar    = reps[active];
  const isLd  = loading[active];

  const catV  = (c) => ({ GMB:"tg", Website:"tv", SEO:"tg", Content:"ta", Reputation:"tr", Social:"tv", Ads:"tr" })[c] || "ta";
  const urgV  = (u) => ({ high:"tr", medium:"ta", low:"tg" })[(u || "").toLowerCase()] || "ta";
  const rc    = (s) => s >= 70 ? "sr-h" : s >= 45 ? "sr-m" : "sr-l";

  return (
    <div className="rep-wrap" style={{ height:"100%" }}>
      {/* ── Prospect tabs ── */}
      <div className="rep-tabs">
        <div style={{ padding:"10px 13px", borderBottom:"1px solid var(--line)", flexShrink:0 }}>
          <div className="mono" style={{ fontSize:8, color:"var(--tx3)", letterSpacing:".1em", textTransform:"uppercase", marginBottom:2 }}>Reports</div>
          <div style={{ fontSize:11.5, fontWeight:600 }}>{prospects.length} Prospect{prospects.length !== 1 ? "s" : ""}</div>
        </div>
        <div style={{ flex:1, overflowY:"auto", padding:"5px" }}>
          {prospects.map((p) => {
            const done = !!reps[p.id] && !reps[p.id]?._err;
            const isL  = loading[p.id];
            return (
              <div
                key={p.id}
                className={`rtb${active === p.id ? " on" : ""}`}
                onClick={() => { setActive(p.id); setEmailTab(0); }}
              >
                <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:2 }}>
                  <div style={{
                    width:6, height:6, borderRadius:"50%", flexShrink:0,
                    background: reps[p.id]?._err ? "var(--re)" : isL ? "var(--au)" : done ? "var(--gr)" : "var(--ln2)",
                    animation: isL ? "pulse 1s infinite" : "none",
                  }} />
                  <div style={{ fontSize:11, fontWeight:600, color:active === p.id ? "var(--tx)" : "var(--tx2)", lineHeight:1.3 }}>{p.name}</div>
                </div>
                <div className="mono" style={{ fontSize:8.5, color:"var(--tx3)", paddingLeft:13 }}>{p.city}</div>
              </div>
            );
          })}
        </div>
        <div style={{ padding:"9px 11px", borderTop:"1px solid var(--line)" }}>
          <button className="btn bw" style={{ width:"100%", justifyContent:"center", fontSize:10.5, padding:"6px" }} onClick={back}>
            ← Back to List
          </button>
        </div>
      </div>

      {/* ── Report content ── */}
      <div className="rep-body">

        {/* Loading */}
        {ap && isLd && (
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"55vh", gap:16 }}>
            <Radar size={60} />
            <div style={{ textAlign:"center" }}>
              <div className="mono" style={{ fontSize:8, letterSpacing:".14em", textTransform:"uppercase", color:"var(--au)", marginBottom:5 }}>Building report</div>
              <div className="serif" style={{ fontSize:16, fontWeight:700 }}>{ap.name}</div>
              <div style={{ color:"var(--tx3)", fontSize:11, marginTop:2 }}>Personalizing to {profile.name}'s voice…</div>
            </div>
          </div>
        )}

        {/* Error */}
        {ar?._err && (
          <div style={{ padding:16 }}>
            <div className="err">Report failed: {ar._err}</div>
            <button className="btn bw" style={{ marginTop:8 }} onClick={() => generate(ap)}>Retry</button>
          </div>
        )}

        {/* Full report */}
        {ap && ar && !ar._err && !isLd && (
          <div className="fi">

            {/* Header */}
            <div style={{ borderBottom:"1px solid var(--line)", paddingBottom:16, marginBottom:14 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
                <div>
                  <Tag label="Intelligence Report" v="ta" />
                  <div className="serif" style={{ marginTop:6, fontSize:"clamp(16px,2.5vw,22px)", fontWeight:900, letterSpacing:"-.02em", lineHeight:1.1, color:"var(--tx)" }}>
                    {ap.name}
                  </div>
                  <div style={{ color:"var(--tx3)", fontSize:10.5, marginTop:3 }}>
                    📍 {ap.city} · {ap.industry}
                    {ap.contactName && ` · ${ap.contactName}`}
                    {ap.contactTitle && `, ${ap.contactTitle}`}
                  </div>
                </div>
                <div className="mono" style={{ fontSize:7.5, color:"var(--tx3)", textAlign:"right", lineHeight:1.9 }}>
                  <div>For {profile.name}</div>
                  <div>{new Date().toLocaleDateString()}</div>
                </div>
              </div>

              <div style={{ display:"flex", gap:14, flexWrap:"wrap", alignItems:"flex-start" }}>
                <div style={{ display:"flex", gap:10 }}>
                  {[
                    { s: ar.relevanceScore || 0,    l: "ICP Match" },
                    { s: ar.digitalHealthScore || 0, l: "Digital Health" },
                    { s: ap.opportunityScore || 0,   l: "Opp Score" },
                  ].map(({ s, l }) => (
                    <div key={l} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
                      <Ring score={s} />
                      <div className="mono" style={{ fontSize:7, color:"var(--tx3)", textTransform:"uppercase", letterSpacing:".08em" }}>{l}</div>
                    </div>
                  ))}
                </div>
                <div style={{ flex:1, minWidth:150, paddingLeft:12, borderLeft:"1px solid var(--line)" }}>
                  <div className="mono" style={{ fontSize:8, color:"var(--au)", textTransform:"uppercase", letterSpacing:".1em", marginBottom:4 }}>Executive Summary</div>
                  <p style={{ color:"var(--tx2)", fontSize:10.5, lineHeight:1.7 }}>{ar.executiveSummary}</p>
                  {ar.outreachAngle && (
                    <div style={{ marginTop:7, padding:"6px 9px", background:"rgba(232,164,48,.05)", borderLeft:"2px solid var(--au)" }}>
                      <div className="mono" style={{ fontSize:7.5, color:"var(--au)", textTransform:"uppercase", letterSpacing:".09em", marginBottom:2 }}>Core Angle</div>
                      <div style={{ fontSize:10.5, fontWeight:600, color:"var(--tx)" }}>{ar.outreachAngle}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Pain Matrix */}
            <div className="rc">
              <div className="rh">
                <div className="ri">⚠️</div>
                <div>
                  <div style={{ fontWeight:700, fontSize:11.5 }}>Pain Point Matrix</div>
                  <div style={{ color:"var(--tx3)", fontSize:10, marginTop:1 }}>Evidence-backed issues + {profile.company}'s exact solution</div>
                </div>
              </div>
              <div className="pmatr">
                {["Issue + Evidence", "Business Impact", `${profile.company}'s Fix`].map((h) => (
                  <div key={h} className="pmh">{h}</div>
                ))}
              </div>
              {(ar.painPoints || []).map((p, i) => (
                <div key={i} className="pmr">
                  <div className="pmc">
                    <div style={{ display:"flex", gap:3, flexWrap:"wrap", marginBottom:4 }}>
                      <Tag label={(p.urgency || "").toUpperCase()} v={urgV(p.urgency)} />
                      <Tag label={p.category || ""} v={catV(p.category)} />
                    </div>
                    <div style={{ fontWeight:600, fontSize:10.5, color:"var(--tx)" }}>{p.pain}</div>
                    <div style={{ fontSize:9.5, color:"var(--tx3)", marginTop:2 }}>{p.evidence}</div>
                  </div>
                  <div className="pmc" style={{ color:"var(--tx2)", fontSize:10.5 }}>{p.impact}</div>
                  <div className="pmc" style={{ color:"var(--gr)", fontSize:10.5, background:"rgba(15,212,168,.02)" }}>{p.fix}</div>
                </div>
              ))}
            </div>

            {/* Competitor Gap */}
            {ar.competitorGap && (
              <div style={{ marginBottom:10, padding:"10px 13px", background:"rgba(155,114,247,.05)", border:"1px solid rgba(155,114,247,.18)", borderLeft:"3px solid var(--vi)" }}>
                <div className="mono" style={{ fontSize:7.5, color:"var(--vi)", letterSpacing:".1em", textTransform:"uppercase", marginBottom:4 }}>🔎 Competitor Context</div>
                <p style={{ fontSize:10.5, color:"var(--tx2)", lineHeight:1.65 }}>{ar.competitorGap}</p>
              </div>
            )}

            {/* Email Sequences */}
            <div className="rc">
              <div className="rh">
                <div className="ri">✉️</div>
                <div>
                  <div style={{ fontWeight:700, fontSize:11.5 }}>Cold Email Sequences</div>
                  <div style={{ color:"var(--tx3)", fontSize:10, marginTop:1 }}>Written in {profile.name}'s voice · 3-touch campaign</div>
                </div>
              </div>
              <div style={{ display:"flex", borderBottom:"1px solid var(--line)", padding:"0 15px" }}>
                {(ar.emailSequence || []).map((e, i) => (
                  <button key={i} className={`etab${emailTab === i ? " on" : ""}`} onClick={() => setEmailTab(i)}>
                    Email {e.touch || i + 1}
                  </button>
                ))}
              </div>
              <div className="rbody">
                {(ar.emailSequence || []).map((e, i) => (
                  <div key={i} style={{ display: emailTab === i ? "block" : "none" }}>
                    <div className="eblk">
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:7, gap:7 }}>
                        <div>
                          {e.timing && <div className="mono" style={{ fontSize:7.5, color:"var(--au)", letterSpacing:".1em", textTransform:"uppercase", marginBottom:2 }}>{e.timing}</div>}
                          <div style={{ fontWeight:700, fontSize:10.5, color:"var(--tx)" }}>Subject: {e.subject}</div>
                        </div>
                        <CopyBtn text={`Subject: ${e.subject}\n\n${e.body}`} />
                      </div>
                      <div style={{ whiteSpace:"pre-wrap", fontSize:10.5, color:"var(--tx2)", lineHeight:1.8, borderTop:"1px solid var(--line)", paddingTop:8 }}>{e.body}</div>
                      {e.cta && (
                        <div style={{ marginTop:6, padding:"5px 8px", background:"rgba(232,164,48,.04)", borderLeft:"2px solid rgba(232,164,48,.22)", fontSize:9.5, color:"var(--tx3)" }}>
                          <span className="mono" style={{ fontSize:7.5, color:"var(--au)", textTransform:"uppercase", letterSpacing:".08em", marginRight:5 }}>CTA</span>
                          {e.cta}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* LinkedIn + SMS */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:9, marginBottom:10 }}>
              {ar.linkedinMessage && (
                <div className="rc" style={{ margin:0, borderColor:"rgba(155,114,247,.25)" }}>
                  <div className="rh">
                    <div className="ri" style={{ background:"rgba(155,114,247,.07)", borderColor:"rgba(155,114,247,.2)" }}>💼</div>
                    <div style={{ fontWeight:700, fontSize:11 }}>LinkedIn DM</div>
                  </div>
                  <div className="rbody">
                    <div style={{ fontSize:10.5, color:"var(--tx2)", lineHeight:1.7, marginBottom:7 }}>{ar.linkedinMessage}</div>
                    <CopyBtn text={ar.linkedinMessage} />
                  </div>
                </div>
              )}
              {ar.smsMessage && (
                <div className="rc" style={{ margin:0, borderColor:"rgba(15,212,168,.2)" }}>
                  <div className="rh">
                    <div className="ri" style={{ background:"rgba(15,212,168,.06)", borderColor:"rgba(15,212,168,.18)" }}>📱</div>
                    <div style={{ fontWeight:700, fontSize:11 }}>SMS Intro</div>
                  </div>
                  <div className="rbody">
                    <div style={{ background:"var(--bg4)", border:"1px solid var(--line)", padding:8, fontSize:10.5, color:"var(--tx2)", lineHeight:1.65, marginBottom:7 }}>{ar.smsMessage}</div>
                    <CopyBtn text={ar.smsMessage} />
                  </div>
                </div>
              )}
            </div>

            {/* Elevator Pitch */}
            {ar.elevatorPitch && (
              <div className="rc" style={{ marginBottom:10 }}>
                <div className="rh">
                  <div className="ri">🎤</div>
                  <div>
                    <div style={{ fontWeight:700, fontSize:11.5 }}>Elevator Pitch Script</div>
                    <div style={{ color:"var(--tx3)", fontSize:10, marginTop:1 }}>60 seconds · in {profile.name}'s voice</div>
                  </div>
                </div>
                <div className="rbody">
                  <div className="pitch">{ar.elevatorPitch}</div>
                  <div style={{ marginTop:7 }}><CopyBtn text={ar.elevatorPitch} /></div>
                </div>
              </div>
            )}

            {/* Objection Handlers */}
            {(ar.objectionHandlers || []).length > 0 && (
              <div className="rc" style={{ marginBottom:10 }}>
                <div className="rh">
                  <div className="ri">🥊</div>
                  <div>
                    <div style={{ fontWeight:700, fontSize:11.5 }}>Objection Handlers</div>
                    <div style={{ color:"var(--tx3)", fontSize:10, marginTop:1 }}>Tailored to {profile.name}'s closing style</div>
                  </div>
                </div>
                <div className="rbody">
                  {ar.objectionHandlers.map((o, i) => (
                    <div key={i} style={{ marginBottom: i < ar.objectionHandlers.length - 1 ? 12 : 0 }}>
                      <div style={{ fontSize:10.5, fontWeight:600, color:"var(--re)", marginBottom:4 }}>"{o.obj}"</div>
                      <div style={{ fontSize:11, color:"var(--tx2)", lineHeight:1.65, paddingLeft:10, borderLeft:"2px solid var(--ln2)" }}>{o.response}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Win */}
            {ar.quickWin && (
              <div style={{ padding:"10px 13px", background:"rgba(15,212,168,.04)", border:"1px solid rgba(15,212,168,.15)", borderLeft:"3px solid var(--gr)" }}>
                <div className="mono" style={{ fontSize:7.5, color:"var(--gr)", letterSpacing:".12em", textTransform:"uppercase", marginBottom:5 }}>⚡ 30-Day Quick Win</div>
                <p style={{ fontSize:10.5, color:"var(--tx)", lineHeight:1.65 }}>{ar.quickWin}</p>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}
