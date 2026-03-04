---
name: dcf-model
description: Build institutional-quality DCF (Discounted Cash Flow) models for equity valuation in Excel. Covers WACC calculation, revenue projections, FCF build, terminal value, enterprise-to-equity bridge, and sensitivity tables. Use when valuing a company using intrinsic value methodology, building cash flow projections, or stress-testing valuation assumptions. Triggers on "DCF model", "discounted cash flow", "value this company", "intrinsic value", "WACC", or "build a DCF for [company]".
platform: excel
---

# DCF Model Builder

READ THIS ENTIRE FILE before building any DCF model. All Excel formulas and sheet structure are defined here.

## Overview

Build institutional-quality DCF models with Bear/Base/Bull scenarios, WACC sheet, and sensitivity tables — all using native Excel formulas. Output is a two-sheet workbook: **DCF** (main model + sensitivity tables at bottom) and **WACC** (cost of capital calculation).

## Formatting Conventions

- **Blue text**: ALL hardcoded inputs (stock price, shares, historical data, assumptions)
- **Black text**: ALL formulas and calculations
- **Green text**: Cross-sheet links (WACC → DCF references)
- Years formatted as text to prevent comma insertion: `2024`, not `2,024`
- Currency in millions: `$#,##0` — always label units in headers ("Revenue ($mm)")
- Percentages: `0.0%` — negatives in parentheses `(12.3%)`

## Step 1: Data Gathering

Pull from available sources:
1. **MCP servers** (Finnhub or others configured) — current price, beta, shares
2. **User-provided data** — historical financials, guidance
3. **Web search** — 10-K filings, consensus estimates, treasury yield

**Validate before building:**
- Net debt vs. net cash (critical for equity bridge)
- Diluted shares outstanding (check for recent buybacks)
- Historical margins consistent with business model
- Tax rate reasonable (typically 21–28%)

## Step 2: Sheet Architecture

Create **two sheets**:

**Sheet 1: DCF** — Model top to bottom:
1. Header (company, ticker, date, case selector)
2. Market data (price, shares, market cap, net debt)
3. Scenario assumption blocks (Bear / Base / Bull)
4. Consolidation column (INDEX formulas pulling from selected scenario)
5. Historical & projected income statement
6. Free cash flow build
7. Discounting & valuation summary
8. Sensitivity tables (rows 87+)

**Sheet 2: WACC** — Cost of capital:
- Cost of equity (CAPM)
- Cost of debt (after-tax)
- Capital structure weights
- WACC output (linked to DCF sheet)

## Step 3: Scenario Assumption Blocks

Create **three separate blocks** (Bear, Base, Bull), each with a section header, a column header row showing projection years, and data rows:

```
BEAR CASE ASSUMPTIONS
Assumption         | FY1  | FY2  | FY3  | FY4  | FY5
Revenue Growth (%) | 8%   | 7%   | 6%   | 5%   | 4%
EBIT Margin (%)    | 12%  | 12%  | 13%  | 13%  | 14%
Terminal Growth    | 2.0% |      |      |      |
WACC               | 11%  |      |      |      |

BASE CASE ASSUMPTIONS
...

BULL CASE ASSUMPTIONS
...
```

Then create a **consolidation column** using INDEX to pull from the selected scenario:
- Case selector cell (e.g., B6): 1=Bear, 2=Base, 3=Bull
- Consolidation formula: `=INDEX(BearVal:BullVal, 1, $B$6)`
- All projection formulas reference the consolidation column — NOT scattered IF statements

## Step 4: Historical & Projected Financials

```
Income Statement ($mm) | 2020A | 2021A | 2022A | 2023A | 2024E | 2025E | 2026E
Revenue                | XXX   | XXX   | XXX   | XXX   | =D*（1+consol_growth)...
  % growth             |       |       |       |       | =E/D-1...
Gross Profit           |       |       |       |       | =Revenue*gross_margin%
  % margin             |       |       |       |       | =GP/Revenue
OpEx (S&M, R&D, G&A)   |       |       |       |       | each as % of Revenue
EBIT                   |       |       |       |       | =GP-TotalOpEx
  % margin             |       |       |       |       | =EBIT/Revenue
Taxes                  |       |       |       |       | =EBIT*tax_rate
NOPAT                  |       |       |       |       | =EBIT-Taxes
```

**Key rule:** All OpEx lines as % of Revenue (not gross profit).

## Step 5: Free Cash Flow Build

```
NOPAT                  | =NOPAT row
(+) D&A                | =Revenue * DA_pct    (consolidation column assumption)
(-) CapEx              | =Revenue * capex_pct
(-) Δ NWC              | =(Rev_t - Rev_t-1) * nwc_pct
= Unlevered FCF        | =NOPAT + DA - CapEx - ΔNWC
```

## Step 6: WACC Sheet

```
COST OF EQUITY
Risk-Free Rate (10Y Treasury)  | [input]
Beta (5Y monthly)              | [input]
Equity Risk Premium            | [input, typically 5.0–6.0%]
Cost of Equity                 | =RFR + Beta*ERP

COST OF DEBT
Pre-Tax Cost of Debt           | [input — from credit rating or interest/debt]
Tax Rate                       | [link from DCF]
After-Tax Cost of Debt         | =PreTax * (1-TaxRate)

CAPITAL STRUCTURE
Market Cap                     | =Price * Shares (linked from DCF)
Net Debt                       | =Total Debt - Cash
Enterprise Value               | =Market Cap + Net Debt
Equity Weight                  | =Market Cap / EV
Debt Weight                    | =Net Debt / EV

WACC                           | =(CoE*EqWt) + (AfterTaxCoD*DebtWt)
```

Typical WACC ranges: Large/stable 7–9%, growth companies 9–12%, high-growth 12–15%.

**Special case:** If Net Debt is negative (net cash), debt weight is negative and WACC is slightly above cost of equity — this is correct.

## Step 7: Discounting (Mid-Year Convention)

```
Period:         0.5   1.5   2.5   3.5   4.5
Discount Factor: =1/(1+WACC)^period
PV of FCF:      =FCF * DiscountFactor
```

## Step 8: Terminal Value

**Perpetuity Growth Method (preferred):**
```
Terminal FCF   = Final Year FCF * (1 + TGR)
Terminal Value = Terminal FCF / (WACC - TGR)
PV of TV       = TV / (1+WACC)^4.5      ← for 5-year model, mid-year
```

Terminal growth rate: 2.0–2.5% (conservative), up to 3.5% for market leaders. **Must be < WACC.**

Sanity check: Terminal value should be 50–70% of Enterprise Value. If >75%, re-examine terminal assumptions.

**Exit Multiple Method (alternative):**
```
Terminal Value = Final Year EBITDA * Exit Multiple (8–15x typical)
```

## Step 9: Enterprise-to-Equity Bridge

```
Sum of PV of FCFs            | =SUM(PV_FCF_range)
PV of Terminal Value         | =TV/(1+WACC)^4.5
Enterprise Value             | =PV_FCFs + PV_TV
(-) Net Debt                 | [or + Net Cash]
Equity Value                 | =EV - NetDebt
÷ Diluted Shares             | [input]
Implied Price Per Share      | =EquityValue / Shares
Current Stock Price          | [input]
Implied Upside/(Downside)    | =ImpliedPrice/CurrentPrice - 1
```

## Step 10: Sensitivity Tables

Build **3 sensitivity tables** at the bottom of the DCF sheet (rows 87+). These are simple 2D grids — regular Excel formulas in each cell, NOT Excel's Data Table feature.

Each table: 5×5 grid = 25 cells. All 75 cells must contain working formulas.

**Table 1: WACC vs. Terminal Growth Rate**
- Row headers: WACC values (e.g., 8%, 9%, 10%, 11%, 12%)
- Column headers: Terminal growth rates (e.g., 1.5%, 2.0%, 2.5%, 3.0%, 3.5%)
- Each cell: recalculate full DCF substituting those specific WACC and TGR values

**Table 2: Revenue Growth vs. EBIT Margin**
- Row headers: revenue growth rates
- Column headers: EBIT margin %
- Each cell: implied share price

**Table 3: Beta vs. Risk-Free Rate**
- Row headers: beta values
- Column headers: risk-free rates
- Each cell: implied share price

Format cells with green-to-red conditional formatting. Bold the base case cell.

## Formatting Checklist

- [ ] Two sheets: DCF + WACC
- [ ] Case selector cell (1/2/3) + consolidation column with INDEX formulas
- [ ] Blue text for all inputs, black for formulas, green for cross-sheet links
- [ ] Cell comments on all hardcoded inputs: "Source: [document], [date], [reference]"
- [ ] Thick borders around major sections (assumptions, FCF, valuation summary)
- [ ] All three sensitivity tables fully populated (75 formulas)
- [ ] Terminal value 50–70% of EV
- [ ] Terminal growth < WACC
- [ ] OpEx based on revenue, not gross profit
- [ ] File named: `[Ticker]_DCF_[Date].xlsx`

## Common Errors to Avoid

1. **Terminal growth ≥ WACC** → creates infinite value
2. **OpEx as % of gross profit** → use revenue instead
3. **IF statements scattered in projections** → use consolidation column with INDEX
4. **WACC uses book values** → always use market-value equity weight
5. **Terminal value not discounted** → must divide by (1+WACC)^period
6. **Unlevered FCF includes interest** → NOPAT already excludes interest (that's the point)
