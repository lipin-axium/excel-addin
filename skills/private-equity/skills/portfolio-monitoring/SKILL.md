---
name: portfolio-monitoring
description: Track and analyze portfolio company performance against budget and prior periods in Excel. Extracts KPIs, flags variances, and produces summary dashboards for board materials or GP reviews. Use when reviewing portfolio company financials, preparing board materials, or monitoring covenant compliance. Triggers on "portfolio monitoring", "review portfolio company", "monthly financials", "how is [company] performing", "variance analysis", "covenant check", or "portfolio update".
platform: excel
---

# Portfolio Company Monitoring

READ THIS ENTIRE FILE before building a monitoring dashboard.

## Step 1: Ingest Financial Package

Accept:
- Monthly or quarterly P&L, balance sheet, cash flow (Excel or PDF upload)
- Budget/plan for the same periods
- Prior year actuals for YoY comparison
- Credit agreement covenant levels (if applicable)

Extract: Revenue, EBITDA, Cash balance, Net Debt, CapEx, Working Capital, key operational KPIs.

---

## Sheet Structure

1. **Dashboard** — one-page executive summary with traffic light status
2. **P&L** — actuals vs. budget vs. prior year
3. **Balance Sheet** — current snapshot
4. **Covenant Compliance** — if leverage covenants exist
5. **Trend Charts** — key metrics over rolling 12 months
6. **Questions for Management** — items to address in next call

---

## Tab 1: Dashboard

**Header:**
```
[Company Name] — [Reporting Period]
PE Sponsor: [Fund name]
Investment Date: [Date] | Hold Period: [X years]
```

**Financial KPI Table (traffic light):**

| KPI | Budget | Actual | Prior Period | vs. Budget | vs. Prior | Status |
|-----|--------|--------|-------------|------------|-----------|--------|
| Revenue ($mm) | | | | =Act/Bud-1 | =Act/Prior-1 | |
| EBITDA ($mm) | | | | | | |
| EBITDA Margin % | | | | | | |
| Cash Balance ($mm) | | | | | | |
| Net Debt ($mm) | | | | | | |
| Leverage (Net Debt/EBITDA) | | | | | | |
| Interest Coverage | | | | | | |
| CapEx ($mm) | | | | | | |
| FCF ($mm) | | | | | | |

**Traffic light formula:**
```excel
=IF(ABS(vs_budget)<=0.05, "🟢",
 IF(vs_budget>=-0.15, "🟡", "🔴"))
```

- 🟢 **Green**: Within 5% of budget
- 🟡 **Yellow**: 5–15% below budget — flag for discussion
- 🔴 **Red**: >15% below budget OR covenant breach risk — immediate attention

**One-paragraph summary (fill manually):**
```
[Company] is tracking [ahead of / in line with / behind] plan for [period].
Revenue is [X% above/below] budget driven by [key driver].
EBITDA margin of [X%] compares to budgeted [Y%] due to [reason].
Key areas requiring attention: [1–2 items].
```

---

## Tab 2: P&L vs. Budget vs. Prior Year

```
                        Actual    Budget    $ Var    % Var    Prior Yr    YoY%
Revenue                 [act]     [bud]     =A-B     =Var/Bud  [py]      =A/PY-1
  Revenue by Segment
Gross Profit            [=]       [=]       [=]      [=]       [=]       [=]
  Gross Margin %        [=]       [=]       [=pt]    -         [=]       [=pt]
EBITDA                  [=]       [=]       [=]      [=]       [=]       [=]
  EBITDA Margin %
D&A                     [=]       [=]       [=]      [=]
EBIT                    [=]
Interest Expense        [=]
EBT / Net Income        [=]
```

**Formatting:** red fill for negative variances >5%, green fill for positive variances >5%.

---

## Tab 3: Balance Sheet Snapshot

Current period vs. prior period:
- Working Capital = Current Assets − Current Liabilities
- Net Debt = Total Debt − Cash
- Leverage = Net Debt / LTM EBITDA
- Interest Coverage = LTM EBITDA / LTM Interest Expense

**Cash bridge:**
```
Beginning Cash
+ Cash from Operations
- CapEx
+/- Net Debt Change
+/- Other
= Ending Cash
Variance to Budget:
```

---

## Tab 4: Covenant Compliance

| Covenant | Threshold | Actual | Headroom | Status |
|----------|-----------|--------|----------|--------|
| Max Leverage (Net Debt/EBITDA) | ≤5.5x | | =Threshold-Actual | =IF(Actual>Threshold,"⚠️ BREACH","✅") |
| Min Interest Coverage (EBITDA/Interest) | ≥2.0x | | =Actual-Threshold | |
| Min Liquidity (Cash) | ≥$Xmm | | | |

**EBITDA definition for covenant purposes** may differ from reported EBITDA — confirm with credit agreement.

**Covenant headroom trend** (add rolling 4-quarter table):
```
Quarter | Leverage Actual | Leverage Threshold | Headroom
Q1      |                 |                    |
Q2      |                 |                    |
...
```

---

## Tab 5: Operational KPIs

Customize by sector. Common examples:

**SaaS:** ARR, Net Retention %, New Logos, Churn %, Customer Count
**Manufacturing:** Units Produced, Capacity Utilization %, Inventory Turns, Backlog
**Services:** Revenue per Employee, Headcount, Utilization %, Client Count
**Healthcare:** Locations, Patient Visits, Revenue per Visit, Occupancy %
**Retail:** Store Count, SSS%, Revenue per Store, Inventory Turns

---

## Tab 6: Questions for Management

Generate a list of questions based on red/yellow flags:

| # | Topic | Question | Priority | Status |
|---|-------|----------|----------|--------|
| 1 | Revenue miss | What drove the $X miss vs. budget in [segment]? | P0 | Open |
| 2 | Margin compression | Is the COGS increase structural or one-time? | P1 | Open |

---

## Important Notes

- **Always ask for the budget** to compare against — actuals without context are noise
- **Ask what sector KPIs matter** — don't assume generic metrics apply to every business
- **If covenant levels aren't known**, ask for the credit agreement terms before building the tracker
- **Output should be board-ready** — concise, factual, no jargon or filler
- **Trend the key metrics** over 4–8 quarters to spot inflection points before they become problems
- **Cash flow is the ultimate truth** — EBITDA can be managed, cash cannot
