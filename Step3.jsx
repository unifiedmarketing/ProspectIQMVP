import { Chip } from "./components.jsx";
import { INDUSTRIES, REGIONS, REVENUE_OPTS, EMPLOYEE_OPTS, SIGNAL_OPTS } from "./constants.js";

export default function Step3({ crit, set, next, back }) {
  const u   = (k, v) => set((c) => ({ ...c, [k]: v }));
  const tog = (k, v) =>
    set((c) => {
      const a = c[k] || [];
      return { ...c, [k]: a.includes(v) ? a.filter((x) => x !== v) : [...a, v] };
    });

  const ok = (crit.industries || []).length > 0 && (crit.regions || []).length > 0;

  return (
    <div className="pg u0">
      <div className="ey">Step 3 of 4 — Target Market</div>
      <h1 className="ti">
        Define your <em>ideal prospect</em>
      </h1>
      <p className="su">
        Set your filters and we'll discover and rank matching businesses by
        sales opportunity — no manual prospecting needed.
      </p>

      <div className="fld u1" style={{ marginBottom: 18 }}>
        <label className="lb">Target Industries * — select up to 5</label>
        <div className="chs">
          {INDUSTRIES.map((ind) => (
            <Chip
              key={ind}
              label={ind}
              on={(crit.industries || []).includes(ind)}
              onClick={() => {
                const a = crit.industries || [];
                if (a.includes(ind) || a.length < 5) tog("industries", ind);
              }}
            />
          ))}
        </div>
      </div>

      <div className="fld u2" style={{ marginBottom: 18 }}>
        <label className="lb">Geographic Areas * — select all that apply</label>
        <div className="chs">
          {REGIONS.map((r) => (
            <Chip key={r} label={r} on={(crit.regions || []).includes(r)} onClick={() => tog("regions", r)} />
          ))}
        </div>
        <div style={{ marginTop: 10 }}>
          <label className="lb" style={{ marginBottom: 4 }}>Specific cities / ZIP codes (optional)</label>
          <input className="ip" value={crit.geo || ""} onChange={(e) => u("geo", e.target.value)} placeholder="e.g. Boca Raton FL, Fort Lauderdale FL" />
        </div>
      </div>

      <div className="g2 u3" style={{ marginBottom: 18 }}>
        <div className="fld">
          <label className="lb">Annual Revenue</label>
          <div className="chs" style={{ marginTop: 4 }}>
            {REVENUE_OPTS.map((r) => (
              <Chip key={r} label={r} on={(crit.revenue || []).includes(r)} onClick={() => tog("revenue", r)} />
            ))}
          </div>
        </div>
        <div className="fld">
          <label className="lb">Employee Count</label>
          <div className="chs" style={{ marginTop: 4 }}>
            {EMPLOYEE_OPTS.map((e) => (
              <Chip key={e} label={e} on={(crit.employees || []).includes(e)} onClick={() => tog("employees", e)} />
            ))}
          </div>
        </div>
      </div>

      <div className="fld u4" style={{ marginBottom: 18 }}>
        <label className="lb">Pain Signals to Target</label>
        <div className="chs">
          {SIGNAL_OPTS.map((s) => (
            <Chip key={s} label={s} on={(crit.signals || []).includes(s)} onClick={() => tog("signals", s)} />
          ))}
        </div>
      </div>

      <div className="fld u5" style={{ marginBottom: 22 }}>
        <label className="lb">How many prospects to discover?</label>
        <div className="rr-row">
          <input
            type="range"
            className="rng"
            min={5}
            max={20}
            value={crit.count || 10}
            style={{ "--p": `${((crit.count || 10) - 5) / 15 * 100}%` }}
            onChange={(e) => u("count", parseInt(e.target.value))}
          />
          <span className="rv">{crit.count || 10} prospects</span>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button className="btn bw" onClick={back}>← Back</button>
        <button className="btn bg" onClick={next} disabled={!ok}>
          🔍 Discover &amp; Rank Prospects →
        </button>
      </div>
    </div>
  );
}
