---
name: comps-analysis
description: Build institutional-grade comparable company analyses with operating metrics, valuation multiples, and statistical benchmarking in Excel. Use for public company valuation, M&A pricing, benchmarking performance vs. peers, or IPO pricing. Triggers on "comps", "comparable companies", "trading comps", "peer analysis", "valuation multiples", "comp table", or "benchmark [company] against peers".
platform: excel
---

# Comparable Company Analysis

READ THIS ENTIRE FILE before building any comps analysis.

## Core Philosophy

"Build the right structure first, then let the data tell the story." Start with headers that force strategic thinking about what matters, input clean data, build transparent formulas, and let statistics emerge automatically.

## Sheet Structure

**Two sections on one sheet** (or two tabs for large sets):

1. **Operating Statistics** — revenue, growth, margins, profitability
2. **Valuation Multiples** — market cap, EV, EV/Revenue, EV/EBITDA, P/E

**Header Block (rows 1–3):**
```
Row 1: [SECTOR] — COMPARABLE COMPANY ANALYSIS
Row 2: Company A (TICK) • Company B (TICK) • Company C (TICK)
Row 3: As of [Period] | All figures in USD Millions except per-share amounts
```

---

## Section 1: Operating Statistics

### Core Columns (always include)

| Company | Revenue (LTM) | Revenue Growth | Gross Profit | Gross Margin | EBITDA | EBITDA Margin |
|---------|--------------|----------------|--------------|-------------|--------|---------------|

**Formulas:**
```excel
Gross Margin (F7):   =E7/C7        // Gross Profit / Revenue
EBITDA Margin (H7):  =G7/C7        // EBITDA / Revenue
```

### Optional Columns (add based on industry/question)

- **FCF / FCF Margin** — for capital-intensive or SaaS businesses
- **Net Income / Net Margin** — for mature profitable companies
- **Rule of 40** — SaaS: `=RevenueGrowth + FCFMargin`
- **R&D/Revenue**, **CapEx/Revenue** — for tech or asset-heavy

### The 5-10 Rule

5 operating metrics + 5 valuation metrics = 10 total columns. If >15 metrics, cut ruthlessly.

### Statistics Block

After the last company row, leave one blank row, then add:

```excel
Maximum:        =MAX(B7:B12)
75th Pct:       =QUARTILE(B7:B12, 3)
Median:         =MEDIAN(B7:B12)
25th Pct:       =QUARTILE(B7:B12, 1)
Minimum:        =MIN(B7:B12)
```

Apply statistics to: all ratios, margins, growth rates, and multiples.
**Do NOT** apply statistics to absolute size metrics (Revenue $, EBITDA $, Market Cap $).

---

## Section 2: Valuation Multiples

### Core Columns (always include)

| Company | Market Cap | Enterprise Value | EV/Revenue | EV/EBITDA | P/E |

**Formulas:**
```excel
EV = Market Cap + Net Debt   // or Market Cap - Net Cash
EV/Revenue:  =EV / LTM_Revenue    // reference operating section
EV/EBITDA:   =EV / LTM_EBITDA     // reference operating section — NEVER re-input
P/E:         =MarketCap / NetIncome
```

**Cross-reference rule:** Valuation multiples MUST reference the operating section. Never input the same raw data twice.

### Sanity Checks

- EV/Revenue: typically 0.5–20x (varies widely by industry and growth)
- EV/EBITDA: typically 8–25x
- P/E: typically 10–50x
- Gross margin > EBITDA margin > Net margin (always true by definition)
- Higher growth → higher multiples (check if outliers make sense)

---

## Formatting Standards

**Color conventions:**
- **Blue text**: all hardcoded inputs
- **Black text**: all formulas

**Cell comments on all inputs** — format: `"Source: Bloomberg, 2024-12-15"` or `"Q3 2024 10-K, p.42"`. Include hyperlinks to SEC filings where possible.

**Visual layout:**
- Section headers: dark background, white bold text (optional but recommended)
- Column headers: light background, bold
- Statistics rows: light gray background
- One blank row between company data and statistics
- All numbers: right-aligned, center-aligned for cleanliness
- Percentages: `0.0%`; Multiples: `0.0"x"`; Dollars: `#,##0` with thousands separator
- No borders on individual cells — clean minimal appearance

---

## Industry-Specific Metrics

**Software/SaaS:**
- Must have: Revenue Growth, Gross Margin (>70% target), Rule of 40
- Optional: ARR, Net Dollar Retention, CAC Payback

**Financials:**
- Must have: ROE, ROA, P/E
- Skip: Gross Margin, EBITDA (not meaningful for banks)

**Industrials:**
- Must have: EBITDA Margin, Asset Turnover, CapEx/Revenue
- Optional: Backlog, Order Book

**Healthcare:**
- Must have: R&D/Revenue, EBITDA Margin
- Optional: Pipeline value, Reimbursement risk notes

**Consumer/Retail:**
- Must have: Revenue Growth, Gross Margin, SSS (Same-Store Sales)
- Optional: Inventory Turns, Customer Acquisition Cost

---

## Quality Checks

Before delivering:
- [ ] All companies are truly comparable (similar business model/scale)
- [ ] Consistent time periods (don't mix LTM and quarterly for same metric)
- [ ] All formulas reference cells — no hardcoded duplicates
- [ ] Every hardcoded input has a cell comment with source
- [ ] Statistics block covers all comparable metrics (not size metrics)
- [ ] No `#DIV/0!`, `#REF!`, or `#N/A` errors
- [ ] Negative EBITDA companies excluded from EV/EBITDA (use EV/Revenue instead)

## Red Flags

🚩 Different fiscal year ends mixed together
🚩 Mixing pure-play and conglomerates
🚩 Negative EBITDA companies valued on EBITDA multiples
🚩 P/E >100x without a clear hypergrowth story
🚩 Missing data without explanation

**When in doubt, exclude the company.** 3 perfect comps beat 6 questionable ones.
