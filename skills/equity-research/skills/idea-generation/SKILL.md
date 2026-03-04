---
name: idea-generation
description: Systematic stock screening and investment idea sourcing. Combines quantitative screens, thematic research, and pattern recognition to surface long and short ideas. Use when looking for new investment ideas, running stock screens, or conducting thematic sweeps. Triggers on "idea generation", "stock screen", "find me ideas", "what looks interesting", "screen for stocks", "new long ideas", or "pitch me something".
platform: excel
---

# Investment Idea Generation

READ THIS ENTIRE FILE before starting an idea generation session.

## Step 1: Define Search Parameters

Ask or confirm:
- **Direction**: Long ideas, short ideas, or both
- **Market cap**: Large cap (>$10B), mid cap ($2–10B), small cap (<$2B)
- **Sector**: Specific sector or cross-sector sweep
- **Style**: Value, growth, quality, special situation, or event-driven
- **Geography**: US, international, or global
- **Theme**: Any specific angle (AI infrastructure, reshoring, aging demographics, etc.)

---

## Step 2: Quantitative Screen Criteria

### Value Screen
- P/E below sector median
- EV/EBITDA below 5-year historical average
- Free cash flow yield >5% (`=FCF/MarketCap`)
- Price/book below 1.5x
- Insider buying in last 90 days
- Dividend yield above market average

### Growth Screen
- Revenue growth >15% YoY
- Earnings growth >20% YoY
- Revenue acceleration (growth rate increasing sequentially)
- Expanding margins (EBITDA margin up 100+ bps YoY)
- ROIC >15%
- Net Dollar Retention >110% (for SaaS)

### Quality Screen
- Consistent revenue growth (5+ year track record)
- Stable or expanding margins over 3 years
- ROE >15%
- Net debt/EBITDA <2x
- FCF conversion >80% of net income
- Insider ownership >5%

### Short Screen
- Revenue deceleration or decline
- Margin compression (gross or EBITDA)
- Rising receivables/inventory faster than sales growth
- Significant insider selling (net of options)
- Valuation premium to peers without fundamental justification
- High short interest + deteriorating fundamentals
- Accounting red flags (auditor changes, restatements, aggressive revenue recognition)

### Special Situation Screen
- Recent spin-offs (last 12 months — often mispriced as index funds exit)
- Post-restructuring companies (often cheap, improving operations)
- Activist involvement (buyback, strategic review, board changes)
- Recent management change at underperforming company
- Companies near 52-week lows with improving fundamentals

---

## Step 3: Thematic Sweep (for theme-driven ideas)

1. **Define the thesis** — one sentence: "AI infrastructure capex accelerates through 2026"
2. **Map the value chain** — who benefits directly vs. indirectly?
3. **Identify pure-play vs. diversified exposure** — pure-plays have higher beta to the theme
4. **Assess pricing** — which names are already "priced in" vs. under-appreciated?
5. **Find second-order beneficiaries** — companies the market hasn't connected to the theme yet

---

## Step 4: Idea Presentation Table

Build a comparison table for each idea that passes the screen:

| Company | Ticker | Direction | Thesis (1-line) | Market Cap | EV/EBITDA (NTM) | P/E (NTM) | Rev Growth | EBITDA Margin | FCF Yield | vs. Peers |
|---------|--------|-----------|----------------|------------|----------------|-----------|------------|---------------|-----------|-----------|

For each idea, add a quick-hit summary:

```
[Company] — [Long/Short] — [One-Line Thesis]

Thesis (3–5 bullets):
• Why this is mispriced
• What the market is missing
• Catalyst to realize value
• Edge vs. consensus

Key Risks:
• What would make this wrong
• Timeline risk

Next Steps:
• Build full model? / Expert call? / Channel checks?
```

---

## Step 5: Output — Idea Shortlist

Deliver an Excel workbook with:

1. **Screening Criteria tab** — document all criteria used and why
2. **Screen Results tab** — all companies that passed, with metrics
3. **Top Ideas tab** — 5–10 highest-conviction ideas with quick-hit summaries
4. **Comparison Table** — side-by-side metrics for all shortlisted names

**Prioritization framework:**
- Rank by: (conviction) × (risk/reward) × (catalyst visibility)
- First call: highest-ranked ideas with clearest catalysts

---

## Important Notes

- **Screens surface candidates, not conclusions** — every screen output needs fundamental research
- **The best ideas often sit at intersections** — quality company at value price due to temporary headwind
- **Avoid crowded trades** — check analyst coverage count, ownership breadth, and short interest
- **Contrarian ideas need a catalyst** — being early without a catalyst is the same as being wrong
- **Short ideas need higher conviction** — timing is harder and risk is asymmetric (can always go higher)
- **Track idea hit rates over time** — refine which screens and approaches work best
