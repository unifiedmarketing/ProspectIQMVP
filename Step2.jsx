import { PERSONA_QS } from "./constants.js";

export default function Step2({ ans, set, next, back }) {
  const sel = (id, v) => set((a) => ({ ...a, [id]: v }));
  const ok = PERSONA_QS.every((q) => ans[q.id]);

  return (
    <div className="pg u0">
      <div className="ey">Step 2 of 4 — Sales Persona</div>
      <h1 className="ti">
        How do you <em>actually</em> sell?
      </h1>
      <p className="su">
        5 quick questions. The AI uses your answers to write every email, pitch,
        and message in your authentic voice — not a generic template.
      </p>

      {PERSONA_QS.map((q, i) => (
        <div
          key={q.id}
          className={`qc u${i}`}
          style={{ animationDelay: `${i * 0.07}s` }}
        >
          <div className="ql">
            Question {i + 1} / {PERSONA_QS.length}
          </div>
          <div className="qt">{q.q}</div>
          <div className="qo">
            {q.opts.map((o) => (
              <div
                key={o}
                className={`qop${ans[q.id] === o ? " on" : ""}`}
                onClick={() => sel(q.id, o)}
              >
                {ans[q.id] === o ? "✓ " : ""}
                {o}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
        <button className="btn bw" onClick={back}>← Back</button>
        <button className="btn bg" onClick={next} disabled={!ok}>
          Next: Target Market →
        </button>
      </div>
    </div>
  );
}
