export const INDUSTRIES = [
  "Senior Living / Assisted Living",
  "Dental Practices",
  "Medical Clinics & Urgent Care",
  "Law Firms",
  "Financial Advisors / Wealth Mgmt",
  "Restaurants & Catering",
  "Real Estate Agencies",
  "Auto Dealerships",
  "Home Services (HVAC, Plumbing, Roofing)",
  "Fitness & Wellness Studios",
  "Hotels & Boutique Hospitality",
  "Insurance Agencies",
  "Veterinary Clinics",
  "Salons, Spas & Aesthetics",
  "Contractors & Custom Builders",
  "IT Managed Services",
  "Accounting & CPA Firms",
  "Retail & E-Commerce",
  "Chiropractic / Physical Therapy",
  "Marketing & Creative Agencies",
];

export const REGIONS = [
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

export const PERSONA_QS = [
  {
    id: "style",
    q: "Your natural sales communication style?",
    opts: [
      "Direct & confident — I cut to the chase",
      "Consultative — I ask deep questions first",
      "Data-driven — I lead with proof & numbers",
      "Warm & relational — trust before any pitch",
      "Challenger — I respectfully reframe their problem",
    ],
  },
  {
    id: "hook",
    q: "Your strongest cold outreach opener?",
    opts: [
      "I lead with a specific observation about their business",
      "I open with a surprising stat about their industry",
      "I name-drop a similar client and their results",
      "I identify a gap they probably don't know they have",
      "I ask a question they can't help but answer",
    ],
  },
  {
    id: "obj",
    q: "They say 'we already have someone for that' — you:",
    opts: [
      "Ask what results they're currently getting, then compare",
      "Acknowledge it, pivot to a gap they haven't considered",
      "Share a 30-second story about a client in the same spot",
      "Offer a free audit to show what they're leaving on the table",
      "Respect it and ask to check back in 90 days",
    ],
  },
  {
    id: "close",
    q: "Preferred way to move toward a close?",
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
    q: "What genuinely separates you from competitors?",
    opts: [
      "Deep niche expertise — no generalists on my team",
      "Speed of execution — we move faster than anyone",
      "Radical transparency — clients see everything in real time",
      "Guaranteed outcomes — we put our money where our mouth is",
      "White-glove personal service — not a faceless agency",
      "Best price-to-value ratio in the market",
    ],
  },
];

export const STEPS_META = [
  { label: "Company Profile",     sub: "Who you are & what you sell" },
  { label: "Sales Persona",       sub: "How you communicate & close" },
  { label: "Target Market",       sub: "Industries, geo & signals" },
  { label: "Discovery",           sub: "AI-ranked prospect list" },
  { label: "Reports",             sub: "Deep-dive intelligence" },
];

export const REVENUE_OPTS  = ["Under $500K", "$500K–$1M", "$1M–$5M", "$5M–$25M", "$25M+"];
export const EMPLOYEE_OPTS = ["1–10", "11–50", "51–200", "201–1,000", "1,000+"];
export const SIGNAL_OPTS   = [
  "Low Google rating (under 4.0)",
  "Few / no Google reviews",
  "Incomplete Google Business Profile",
  "No active social media",
  "Heavy dependency on paid lead aggregators",
  "Missing from AI search results",
  "No blog or content marketing",
  "Recent negative press or reviews",
  "New ownership or rebranding",
  "Rapid growth / new locations",
];
