---
name: datapack-builder
description: Build professional financial data packs and standardized investment workbooks in Excel from CIMs, SEC filings, or financial data. Extract, normalize, and structure financial statements into IC-ready Excel workbooks with 8-tab standard structure. Use for M&A due diligence, PE analysis, or standardizing financial reporting. Triggers on "build a datapack", "data pack", "financial data pack", "standardize financials", "extract financials from CIM", or "IC materials".
platform: excel
---

# Financial Data Pack Builder

READ THIS ENTIRE FILE before building any data pack.

## Critical Rules

1. **Financial data (money)** → currency format with `$` — Revenue, EBITDA, Income, Debt, Assets
2. **Operational data (counts)** → number format, NO `$` — Units, Stores, Employees, Customers
3. **Rates and ratios** → percentage format `0.0%` — Margins, Growth, Yield, Occupancy
4. **Years** → text format to prevent comma insertion: `2024` not `2,024`
5. **All calculations** → formulas only — never hardcode a computed value
6. **Negatives** → parentheses format `$(123.0)` not `-$123`

## Color Conventions

- **Blue text**: ALL hardcoded inputs (historical data entered from source)
- **Black text**: ALL formulas and calculations
- **Green text**: Cross-tab links

---

## Standard 8-Tab Structure

Unless instructed otherwise, create these tabs in order:

1. **Executive Summary** — one-page overview
2. **Historical Financials** — Income Statement
3. **Balance Sheet**
4. **Cash Flow Statement**
5. **Operating Metrics** — non-financial KPIs
6. **Segment Performance** — if applicable
7. **Market Analysis** — industry context
8. **Investment Highlights** — investment thesis narrative

---

## Tab 1: Executive Summary

Contents:
- Company overview (2–3 sentences: business model, products, geography)
- Key investment highlights (3–5 bullet points)
- Financial snapshot table:

| Metric | 2021A | 2022A | 2023A | 2024E |
|--------|-------|-------|-------|-------|
| Revenue ($mm) | | | | |
| EBITDA ($mm) | | | | |
| EBITDA Margin | | | | |
| Revenue Growth | | | | |

- Transaction overview if applicable
- File naming: `CompanyName_DataPack_YYYY-MM-DD.xlsx`

---

## Tab 2: Historical Financials (IS)

```
Revenue by Segment / Product Line    [$ millions]
  Segment A                          [blue input]
  Segment B                          [blue input]
Total Revenue                        [=SUM, formula]
  % growth YoY                       [=current/prior-1]

Cost of Revenue                      [=Revenue*COGS%]
Gross Profit                         [=Revenue-COGS]
  Gross Margin %                     [=GP/Revenue]

Operating Expenses:
  Sales & Marketing                  [input or % formula]
  Research & Development             [input or % formula]
  General & Administrative           [input or % formula]
Total OpEx                           [=SUM]

EBITDA                               [=GP - OpEx + D&A back-add if needed]
  EBITDA Margin %                    [=EBITDA/Revenue]
Adjusted EBITDA                      [=EBITDA + adjustments]

Depreciation & Amortization          [input]
EBIT                                 [=EBITDA - D&A]
Interest Expense                     [input]
EBT                                  [=EBIT - Interest]
Tax Expense                          [=MAX(0,EBT)*TaxRate]
Net Income                           [=EBT - Taxes]
```

Format: years as columns (text: `2021A`, `2022A`), line items as rows. Single underline above subtotals, double underline below Net Income.

---

## Tab 3: Balance Sheet

Follow standard structure:
- Current Assets (Cash, AR, Inventory, Prepaid, Other)
- Long-Term Assets (PP&E net, Intangibles, Goodwill, Other)
- Current Liabilities (AP, Accrued, Current Debt, Other)
- Long-Term Liabilities (LT Debt, Deferred Tax, Other)
- Shareholders' Equity (Common Stock, Retained Earnings)

**Mandatory check formula:**
```excel
=TotalAssets - (TotalLiabilities + TotalEquity)    // must = 0 every period
```

Include working capital calculation:
```
Working Capital = Current Assets - Current Liabilities
Net Debt = Total Debt - Cash
```

---

## Tab 4: Cash Flow Statement

Indirect method:
- CFO: Net Income → add back non-cash → WC changes
- CFI: CapEx, acquisitions
- CFF: Debt issuance/repayment, equity, dividends

**Tie-out check:**
```excel
=CF_EndingCash - BS_Cash    // must = 0
```

Label cash outflows consistently (all negative or all in parentheses — pick one).

---

## Tab 5: Operating Metrics

**CRITICAL: NO dollar signs on operational metrics.**

Examples by industry:

**SaaS/Software:** ARR ($), Customer Count (number), Churn Rate (%), NRR (%), CAC Payback (months)
**Manufacturing:** Units Produced (number), Capacity Utilization (%), Inventory Turns (number), Revenue per Unit ($)
**Real Estate:** Properties (number), Occupancy Rate (%), ADR ($), RevPAR ($), NOI ($)
**Healthcare:** Locations (number), Providers (number), Revenue per Visit ($), Payor Mix (%)
**Retail:** Store Count (number), SSS Growth (%), Revenue per Store ($), Inventory Turns (number)

Format: counts as `#,##0`, currency as `$#,##0.0`, rates as `0.0%`

---

## Tab 6: Segment Performance (if applicable)

Revenue and profitability by business unit/geography/product line:
- Each segment: Revenue, Gross Profit, GP%, EBITDA, EBITDA%
- Segment roll-up formula ties to Tab 2 total revenue

---

## Tab 7: Market Analysis

- Market size and growth (TAM, SAM)
- Competitive positioning and market share
- Industry trends and benchmarks
- Peer comparisons (reference comps-analysis skill if needed)
- Regulatory environment if relevant

Cite sources for market data (web search, industry reports).

---

## Tab 8: Investment Highlights

- Competitive strengths (product differentiation, IP, relationships)
- Growth opportunities (new markets, products, M&A)
- Risk factors and mitigants
- Management assessment
- Investment thesis summary

---

## EBITDA Normalization

For each adjustment, document: what, why, amount by year, source.

**Common add-backs:**
- Restructuring charges (only if truly non-recurring)
- Stock-based compensation (standard for PE analysis)
- Acquisition-related costs (transaction fees, integration)
- Legal settlements (only if isolated incident)
- Related party normalization (management fees, above-market rent)

Show reconciliation: Reported EBITDA → Adjusted EBITDA with each line item.

**Management Case vs. Base Case:**
- Management Case: accept all proposed adjustments
- Base Case: only clearly non-recurring items — more conservative and defensible to IC

---

## Scenarios (if projections included)

- **Management Case**: company projections as-provided, clearly labeled
- **Base Case**: apply conservative haircut to growth and margins based on track record
- **Downside Case**: stress test for recession/competition, check covenant compliance

Document all adjustment rationale — IC will ask.

---

## Professional Formatting Standards

- Bold headers, left-aligned; numbers right-aligned
- 2-space indentation for sub-items
- Single underline above subtotals; double underline below final totals
- Freeze panes on row/column headers
- Consistent font (Calibri or Arial, 11pt)
- Minimal borders (only where structurally needed)
- Column widths 12–15 characters

---

## Delivery Checklist

- [ ] All 8 tabs present and logically sequenced
- [ ] Every number traced to source — cell comments with citations
- [ ] All calculations are formula-based (no hardcoded computed values)
- [ ] Balance sheet balances (check formula = 0)
- [ ] Cash flow ties to balance sheet
- [ ] Years display without commas
- [ ] Financial data has `$`; operational data does NOT have `$`
- [ ] Percentages formatted as `0.0%`
- [ ] Negatives in parentheses
- [ ] Normalization adjustments documented with rationale
- [ ] File named: `CompanyName_DataPack_YYYY-MM-DD.xlsx`
