export default function Step1({ data, set, next }) {
  const u = (k, v) => set((d) => ({ ...d, [k]: v }));
  const ok = data.name && data.company && data.service;

  return (
    <div className="pg u0">
      <div className="ey">Step 1 of 4 — Your Foundation</div>
      <h1 className="ti">
        Tell us about <em>you</em>
      </h1>
      <p className="su">
        This becomes the DNA of every message we write. The more specific you
        are about your offer, the sharper the outreach.
      </p>

      <div className="g2" style={{ marginBottom: 10 }}>
        <div className="fld">
          <label className="lb">Full Name *</label>
          <input className="ip" value={data.name} onChange={(e) => u("name", e.target.value)} placeholder="Jane Smith" />
        </div>
        <div className="fld">
          <label className="lb">Your Title</label>
          <input className="ip" value={data.title} onChange={(e) => u("title", e.target.value)} placeholder="Founder / VP of Sales" />
        </div>
      </div>

      <div className="g2" style={{ marginBottom: 10 }}>
        <div className="fld">
          <label className="lb">Company Name *</label>
          <input className="ip" value={data.company} onChange={(e) => u("company", e.target.value)} placeholder="Unified Marketing" />
        </div>
        <div className="fld">
          <label className="lb">Company Website</label>
          <input className="ip" value={data.website} onChange={(e) => u("website", e.target.value)} placeholder="https://yourco.com" />
        </div>
      </div>

      <div className="fld">
        <label className="lb">What You Sell — be brutally specific *</label>
        <textarea
          className="ip"
          rows={4}
          value={data.service}
          onChange={(e) => u("service", e.target.value)}
          placeholder="e.g. We help senior living communities cut dependency on paid lead aggregators (A Place for Mom) by building owned digital channels. We do hyper-local SEO, AI Answer Engine Optimization, Google Business Profile optimization, and PPC. Retainer: $1,500–$3,000/mo. Typical result: 10+ direct move-in inquiries within 60 days."
        />
      </div>

      <div className="g2" style={{ marginBottom: 22 }}>
        <div className="fld">
          <label className="lb">Average Deal Size</label>
          <input className="ip" value={data.dealSize} onChange={(e) => u("dealSize", e.target.value)} placeholder="$1,800/mo · $21,600/yr" />
        </div>
        <div className="fld">
          <label className="lb">Your Contact Info</label>
          <input className="ip" value={data.contact} onChange={(e) => u("contact", e.target.value)} placeholder="jane@co.com / (561) 555-0123" />
        </div>
      </div>

      <button className="btn bg" onClick={next} disabled={!ok}>
        Next: Shape Your Persona →
      </button>
    </div>
  );
}
