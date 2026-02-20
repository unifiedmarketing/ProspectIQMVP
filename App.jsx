import { useState } from "react";
import "./styles.css";
import { STEPS_META } from "./constants.js";
import Step1 from "./Step1.jsx";
import Step2 from "./Step2.jsx";
import Step3 from "./Step3.jsx";
import Step4 from "./Step4.jsx";
import Step5 from "./Step5.jsx";
import { Radar } from "./components.jsx";

export default function App() {
  const [step, setStep]     = useState(0);
  const [profile, setProfile] = useState({ name:"", title:"", company:"", website:"", service:"", dealSize:"", contact:"" });
  const [persona, setPersona] = useState({});
  const [crit, setCrit]     = useState({ count: 10 });
  const [selP, setSelP]     = useState([]);

  const progress = Math.round((step / (STEPS_META.length - 1)) * 100);

  return (
    <div className="wrap">

      {/* ═══ LEFT SIDEBAR ═══ */}
      <div className="left">

        {/* Logo */}
        <div className="logo">
          <div className="hex">P</div>
          <div>
            <div className="serif" style={{ fontSize:13, fontWeight:900, color:"var(--tx)", lineHeight:1.1 }}>ProspectIQ</div>
            <div className="mono" style={{ fontSize:7, color:"var(--tx3)", letterSpacing:".1em", textTransform:"uppercase", marginTop:1 }}>Sales Intelligence v2</div>
          </div>
        </div>

        {/* Step nav */}
        <div className="nav">
          {STEPS_META.map((s, i) => (
            <div
              key={i}
              className={`ni${step === i ? " on" : ""}${step > i ? " done" : ""}`}
              onClick={() => { if (i < step) setStep(i); }}
            >
              <div className={`nb nb-${step > i ? "d" : step === i ? "a" : "i"}`}>
                {step > i ? "✓" : i + 1}
              </div>
              <div>
                <div style={{ fontSize:11, fontWeight: step === i ? 600 : 400, lineHeight:1.3 }}>{s.label}</div>
                <div className="mono" style={{ fontSize:8.5, color:"var(--tx3)", marginTop:1, letterSpacing:".04em" }}>{s.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer progress */}
        <div className="foot">
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
            <div className="mono" style={{ fontSize:7.5, color:"var(--tx3)", letterSpacing:".08em", textTransform:"uppercase" }}>Progress</div>
            <div className="mono" style={{ fontSize:8.5, color:"var(--au)" }}>{progress}%</div>
          </div>
          <div className="pt"><div className="pb" style={{ width:`${progress}%` }} /></div>
          {profile.name && (
            <div style={{ marginTop:9, padding:"8px 10px", background:"rgba(212,236,255,.03)", border:"1px solid var(--line)" }}>
              <div className="mono" style={{ fontSize:7.5, color:"var(--tx3)", letterSpacing:".1em", textTransform:"uppercase", marginBottom:3 }}>Active session</div>
              <div style={{ fontSize:11, fontWeight:600, color:"var(--tx)" }}>{profile.name}</div>
              <div style={{ fontSize:10.5, color:"var(--tx3)" }}>{profile.company}</div>
            </div>
          )}
        </div>

        {/* Form lives in sidebar for steps 0–2 */}
        {step <= 2 && (
          <div className="scr">
            {step === 0 && <Step1 data={profile} set={setProfile} next={() => setStep(1)} />}
            {step === 1 && <Step2 ans={persona} set={setPersona} next={() => setStep(2)} back={() => setStep(0)} />}
            {step === 2 && <Step3 crit={crit} set={setCrit} next={() => setStep(3)} back={() => setStep(1)} />}
          </div>
        )}
      </div>

      {/* ═══ RIGHT PANEL ═══ */}
      <div className="right">

        {/* Empty state for steps 0–2 */}
        {step <= 2 && (
          <div className="empty-r">
            <Radar size={72} />
            <div style={{ maxWidth:300 }}>
              <div className="serif" style={{ fontSize:20, fontWeight:900, color:"var(--tx)", marginBottom:7, lineHeight:1.2 }}>
                Your reports<br />will appear here
              </div>
              <p style={{ color:"var(--tx3)", fontSize:12, lineHeight:1.7 }}>
                Fill in the form on the left to discover and rank prospects, then
                generate deep intelligence reports with personalized outreach in your exact voice.
              </p>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:9, maxWidth:420, width:"100%" }}>
              {[
                { e:"🎯", t:"Prospect Discovery", d:"AI-ranked by opportunity score" },
                { e:"✉️", t:"Personalized Emails", d:"3-touch in your exact voice" },
                { e:"🥊", t:"Objection Scripts",  d:"Handlers for your exact style" },
              ].map(({ e, t, d }) => (
                <div key={t} style={{ background:"var(--bg3)", border:"1px solid var(--line)", padding:"14px 11px", textAlign:"center" }}>
                  <div style={{ fontSize:18, marginBottom:5 }}>{e}</div>
                  <div style={{ fontSize:10.5, fontWeight:600, color:"var(--tx)", marginBottom:3 }}>{t}</div>
                  <div style={{ fontSize:9.5, color:"var(--tx3)", lineHeight:1.5 }}>{d}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <Step4
            profile={profile}
            persona={persona}
            crit={crit}
            onDone={(list) => { setSelP(list); setStep(4); }}
            back={() => setStep(2)}
          />
        )}

        {step === 4 && (
          <Step5
            prospects={selP}
            profile={profile}
            persona={persona}
            back={() => setStep(3)}
          />
        )}
      </div>

    </div>
  );
}
