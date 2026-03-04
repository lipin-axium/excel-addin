---
name: thesis-tracker
description: Maintain and update investment theses for portfolio positions and watchlist names. Track key pillars, data points, catalysts, and conviction over time. Use when updating a thesis with new information, reviewing position rationale, or checking if a thesis is still intact. Triggers on "update thesis for [company]", "is my thesis still intact", "thesis check", "add data point to [company]", "thesis tracker", or "review my position in [company]".
platform: excel
---

# Investment Thesis Tracker

READ THIS ENTIRE FILE before building or updating a thesis tracker.

## Step 1: Define or Load Thesis

**Creating a new thesis entry:**

| Field | Content |
|-------|---------|
| Company | Name and ticker |
| Position | Long / Short / Watchlist |
| Date initiated | |
| Thesis statement | 1–2 sentence core thesis (e.g., "Long ACME — margin expansion from pricing power + operating leverage as mix shifts to software") |
| Entry price | |
| Target price | What is it worth if thesis plays out |
| Stop-loss trigger | What would make you exit |
| Conviction level | High / Medium / Low |
| Time horizon | 6 months / 1 year / 2+ years |

**Thesis pillars (3–5 supporting arguments):**

| # | Pillar | Original Expectation | Measurable Test | Status |
|---|--------|---------------------|-----------------|--------|
| 1 | | | | On Track / Progressing / Stalled / Broken |
| 2 | | | | |
| 3 | | | | |

**Key risks (3–5 invalidating conditions):**

| # | Risk | Probability | Impact | Mitigant |
|---|------|------------|--------|----------|
| 1 | | H/M/L | High/Med/Low | |

---

## Step 2: Thesis Update Log

For each new data point or development, add a row:

| Date | Event Type | Description | Pillar Affected | Thesis Impact | Action | Conviction Change |
|------|-----------|-------------|-----------------|--------------|--------|------------------|
| | Earnings / Guidance / News / Industry / Macro / Expert Call | | Pillar #1, #2, etc. | Strengthens / Weakens / Neutral | Hold / Add / Trim / Exit | High → Medium / etc. |

**Event types:** Earnings, Management guidance, Competitor move, Product launch, Regulatory, Macro, Expert call, Channel check, M&A, Management change.

---

## Step 3: Thesis Scorecard

Running scorecard updated each quarter:

| Pillar | Original Expectation | Latest Data Point | Current Status | Trend |
|--------|---------------------|-------------------|----------------|-------|
| Revenue growth >20% | On track for FY | Q3 was 22% | ✅ On Track | → Stable |
| Margin expansion | +200bps/yr | Margins flat YoY | ⚠️ Watching | ↓ Softening |
| New product launch | Q2 launch | Delayed to Q4 | ⚠️ Behind | → Monitor |
| Management execution | Strong | CFO departure | ⚠️ Risk | ↓ Concern |

**Overall conviction:** =IF(broken_pillars>1, "Low", IF(broken_pillars=1, "Medium", "High"))

---

## Step 4: Catalyst Calendar

Upcoming events that could prove or disprove the thesis:

| Date | Event | Expected Impact | Bull Outcome | Bear Outcome | Resolved? |
|------|-------|-----------------|-------------|-------------|-----------|
| | Earnings Q4 | Moderate | Beat + raised guide | Miss + cut guide | |
| | Product launch | High | Strong adoption metrics | Weak uptake | |
| | Regulatory decision | Medium | Approval | Denial | |

---

## Step 5: Position Summary Output

Format for morning meeting, portfolio review, or risk committee:

```
[COMPANY] (TICKER) — [LONG/SHORT] — Updated [Date]

THESIS: [1-2 sentence thesis]
CONVICTION: [High/Medium/Low] | POSITION: [sizing note] | PT: $XX vs $YY current

SCORECARD:
✅ Pillar 1: [status]
⚠️ Pillar 2: [status — needs monitoring]
❌ Pillar 3: [status — broken or at risk]

RECENT DEVELOPMENTS:
• [Date]: [event] → [thesis impact]
• [Date]: [event] → [thesis impact]

NEXT CATALYSTS:
• [Date]: [event] — expected [outcome]

RISK TO EXIT:
• [What would make you sell / cover]
```

---

## Portfolio Thesis Review

If managing multiple positions, build a summary dashboard:

| Ticker | Direction | Conviction | PT | Current | Upside | Pillars OK | Next Catalyst | Action |
|--------|-----------|-----------|-----|---------|--------|-----------|---------------|--------|

Sort by: Conviction descending, then Upside descending.

**Portfolio health check:**
- How many positions have ≥2 broken pillars? (review for exit)
- How many approaching their stop-loss trigger?
- What's the average time-to-catalyst across positions?

---

## Important Notes

- **A thesis must be falsifiable** — if nothing could disprove it, it's not a thesis
- **Track disconfirming evidence** as rigorously as confirming evidence (avoid confirmation bias)
- **Review all theses quarterly** — even when nothing dramatic has happened
- **A broken pillar ≠ automatic sell** — but it requires explicit re-underwriting to stay long
- **Position sizing should reflect conviction** — if conviction drops, trim before thesis breaks fully
