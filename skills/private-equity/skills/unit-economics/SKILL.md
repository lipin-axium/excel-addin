---
name: unit-economics
description: Analyze unit economics for PE targets and SaaS/subscription businesses — ARR bridges, cohort matrices, LTV/CAC, net dollar retention, and payback periods in Excel. Use when evaluating revenue quality, building cohort analysis, or assessing customer economics. Triggers on "unit economics", "cohort analysis", "ARR analysis", "LTV CAC", "net retention", "revenue quality", "customer economics", or "analyze ARR for [company]".
platform: excel
---

# Unit Economics Analysis

READ THIS ENTIRE FILE before building a unit economics analysis.

## Step 1: Identify Business Model

Tailor the analysis to the revenue model:
- **SaaS / Subscription**: ARR, net retention, cohort analysis
- **Recurring services**: Contract value, renewal rates, upsell
- **Transaction / usage-based**: Volume trends, take rate, expansion patterns
- **Hybrid**: Break down by revenue stream, analyze each separately

---

## Sheet Structure

1. **Dashboard** — key metrics summary with benchmarks
2. **ARR Bridge** — waterfall from beginning to ending ARR
3. **Cohort Matrix** — vintage analysis by customer cohort
4. **Customer Economics** — LTV, CAC, payback period
5. **Revenue Quality** — scorecard and red flags

---

## Tab 2: ARR Bridge

Build an annual (and monthly if available) ARR waterfall:

| | FY2021 | FY2022 | FY2023 | FY2024 |
|--|--------|--------|--------|--------|
| Beginning ARR | | | | |
| (+) New Logo ARR | | | | |
| (+) Expansion ARR | | | | |
| (-) Contraction ARR | | | | |
| (-) Churned ARR | | | | |
| **Ending ARR** | =SUM | | | |
| Net New ARR | =New+Exp-Con-Churn | | | |

**Derived metrics:**
```excel
Gross Retention Rate  = (EndARR - New - Expansion) / BeginARR    // excludes new & expansion
Net Retention Rate    = (EndARR - New) / BeginARR                // excludes only new logos
Logo Churn Rate       = Churned_Customers / Beginning_Customers
```

**Target benchmarks:**
- Gross Retention: Best-in-class >95%, good >90%, concerning <85%
- Net Dollar Retention: Best-in-class >120%, good >110%, concerning <100%

---

## Tab 3: Cohort Matrix

Build a matrix showing ARR indexed to Year 0 = 100%:

| Cohort (Year) | Y0 | Y1 | Y2 | Y3 | Y4 | Y5 |
|------------|-----|-----|-----|-----|-----|-----|
| 2019 | $1.0M | $1.1M | $1.2M | $1.1M | $1.3M | $1.4M |
| 2020 | $1.5M | $1.7M | $1.9M | $1.8M | $2.0M | |
| 2021 | $2.0M | $2.4M | $2.7M | $2.5M | | |
| 2022 | $3.0M | $3.5M | $3.8M | | | |
| 2023 | $4.5M | $5.0M | | | | |

**Indexed view (add below absolute $ view):**

```excel
Indexed Value = Actual ARR / Year0_ARR * 100
// e.g., if 2019 cohort started at $1.0M and is $1.4M in Y5, indexed = 140
```

**What to look for:**
- Do cohorts grow over time (net retention >100%)?
- Is the growth rate improving for newer cohorts (business improving)?
- Are older cohorts stable or declining (product-market fit)?

---

## Tab 4: Customer Economics

### LTV / CAC Analysis

```
CAC (Customer Acquisition Cost)
  = Total S&M Spend / New Customers Acquired in period

ACV (Average Contract Value)
  = ARR / Customer Count

Gross Margin by Revenue Stream
  = (Revenue - Direct COGS) / Revenue   [subscription vs. services separate]

LTV (Lifetime Value)
  = (ACV * Gross Margin %) / Gross Churn Rate

LTV:CAC Ratio
  = LTV / CAC   [target >3x; best-in-class >5x]

CAC Payback Period (months)
  = CAC / (ACV * Gross Margin% / 12)   [target <18 months; best-in-class <12]
```

**Segment breakdown (if data available):**

| Segment | ACV | CAC | Gross Margin | LTV | LTV:CAC | Payback |
|---------|-----|-----|-------------|-----|---------|---------|
| Enterprise (>1,000 employees) | | | | | | |
| Mid-Market (100–999) | | | | | | |
| SMB (<100) | | | | | | |

### SaaS Magic Number (sales efficiency)
```excel
= Net New ARR in period / Prior Period S&M Spend
// >0.75x = efficient; <0.5x = concern
```

### Rule of 40
```excel
= Revenue Growth % + EBITDA Margin %
// >40 = healthy SaaS; best-in-class >60
```

---

## Tab 5: Revenue Quality Scorecard

| Metric | Actual | Best-in-Class | Good | Concerning | Score (1–5) |
|--------|--------|--------------|------|------------|-------------|
| Recurring Revenue % | | >90% | >80% | <70% | |
| Net Dollar Retention | | >120% | >110% | <100% | |
| Gross Retention | | >95% | >90% | <85% | |
| Customer Concentration (top 10) | | <20% | <30% | >40% | |
| LTV:CAC | | >5x | >3x | <2x | |
| CAC Payback (months) | | <12 | <18 | >24 | |
| Multi-year Contract % | | >50% | >30% | <20% | |
| Cohort Stability | | Growing | Stable | Declining | |

```excel
Overall Score = AVERAGE(Score_column)
// 4–5: High quality, premium multiple justified
// 3–4: Good quality, market multiple
// 1–3: Concerning, haircut required
```

**Red flags section:**
- Any single customer >10% of ARR
- Net retention <100% (losing revenue from existing customers)
- Cohort analysis shows deterioration in newer cohorts
- CAC payback >24 months
- Expansion ARR from a small number of large customers (masks underlying churn)

---

## Important Notes

- **Always ask for raw customer-level data** if available — aggregate metrics can hide problems
- **NDR >100% can mask high gross churn** if expansion from a few large customers is strong — always show both
- **Cohort analysis is the single most important view** for revenue quality — push for this data even if it's manual
- **Differentiate contracted ARR from recognized revenue** — billings vs. revenue timing differences matter
- **Usage-based models**: focus on consumption trends and net expansion rather than traditional ARR retention
- **Professional services revenue** should be evaluated separately — it's not recurring and margins are typically lower
