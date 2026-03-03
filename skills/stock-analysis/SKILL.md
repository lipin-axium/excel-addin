---
name: stock-analysis
description: Analyze stocks with DCF valuation, comparable company analysis (EV/EBITDA, P/E, P/S multiples), financial ratios (ROE, ROIC, debt/equity), or read income statements and balance sheets — with step-by-step Excel implementations
platform: excel
---

> **IMPORTANT**: READ THIS ENTIRE FILE before implementing any stock analysis or valuation model. Follow the exact formulas and Excel layouts described here.

# Stock Analysis Skill — Valuation & Financial Analysis in Excel

## 1. DCF Model (Discounted Cash Flow)

DCF estimates intrinsic value by discounting projected free cash flows to the present.

### Key Inputs
| Input | Description | Typical Source |
|-------|-------------|----------------|
| Revenue | Current annual revenue | Income statement |
| Revenue growth rate | Projected annual growth | Analyst estimates / historical CAGR |
| EBIT margin | Operating income / Revenue | Historical average |
| Tax rate | Effective tax rate | Income statement |
| D&A | Depreciation & Amortization | Cash flow statement |
| Capex | Capital expenditures | Cash flow statement |
| ΔWorking Capital | Change in net working capital | Balance sheet |
| WACC | Weighted average cost of capital | Calculated (see below) |
| Terminal growth rate | Long-run FCF growth (typically 2-3%) | GDP growth proxy |
| Shares outstanding | Diluted share count | Income statement footnotes |
| Net debt | Total debt − Cash | Balance sheet |

### Free Cash Flow to Firm (FCFF)
```
FCFF = EBIT × (1 − Tax Rate) + D&A − Capex − ΔWorking Capital
```

### WACC
```
WACC = (E/V) × Re + (D/V) × Rd × (1 − Tax Rate)
```
- E = market cap, D = market value of debt, V = E + D
- Re = cost of equity (CAPM: Rf + β × Market Risk Premium)
- Rd = cost of debt (interest expense / total debt)
- Market Risk Premium ≈ 5.5% (US historical)

### Terminal Value
```
TV = FCFF_final × (1 + g) / (WACC − g)
```
where g = terminal growth rate.

### Enterprise Value & Equity Value
```
EV = PV(FCFFs) + PV(Terminal Value)
Equity Value = EV − Net Debt
Intrinsic Price = Equity Value / Shares Outstanding
```

### Excel Cell-by-Cell Layout

**Inputs (B2:B12)**:
| Cell | Label | Example |
|------|-------|---------|
| B2 | Revenue (Year 0) | 10,000 |
| B3 | Revenue Growth Rate | 0.10 |
| B4 | EBIT Margin | 0.18 |
| B5 | Tax Rate | 0.21 |
| B6 | D&A (% of Revenue) | 0.04 |
| B7 | Capex (% of Revenue) | 0.05 |
| B8 | ΔWC (% of Revenue) | 0.01 |
| B9 | WACC | 0.09 |
| B10 | Terminal Growth Rate | 0.025 |
| B11 | Net Debt | 2,000 |
| B12 | Shares Outstanding | 500 |

**Projection Table (Years 1-5, columns C-G)**:

Row 15: Revenue
- C15: `=$B$2*(1+$B$3)^1`
- D15: `=$B$2*(1+$B$3)^2` ... through G15 (year 5)

Row 16: EBIT = `=C15*$B$4`
Row 17: NOPAT = `=C16*(1-$B$5)` (Net Operating Profit After Tax)
Row 18: D&A = `=C15*$B$6`
Row 19: Capex = `=C15*$B$7`
Row 20: ΔWC = `=C15*$B$8`
Row 21: FCFF = `=C17+C18-C19-C20`
Row 22: Discount Factor = `=1/(1+$B$9)^C14` (C14 = year number 1-5)
Row 23: PV of FCFF = `=C21*C22`

**Summary (B25:B30)**:
| Cell | Label | Formula |
|------|-------|---------|
| B25 | Sum PV(FCFFs) | `=SUM(C23:G23)` |
| B26 | Terminal Value | `=G21*(1+B10)/(B9-B10)` |
| B27 | PV(Terminal Value) | `=B26*G22` |
| B28 | Enterprise Value | `=B25+B27` |
| B29 | Equity Value | `=B28-B11` |
| B30 | **Intrinsic Price** | `=B29/B12` |

**Margin of Safety**:
- B31: Current Market Price (input)
- B32: Upside/Downside: `=(B30-B31)/B31` → format as %

---

## 2. Comparable Company Analysis (Comps)

Value a company relative to peers using market multiples.

### Key Multiples
| Multiple | Formula | What It Measures |
|----------|---------|-----------------|
| EV/EBITDA | Enterprise Value / EBITDA | Operational value, capital-structure neutral |
| EV/Revenue | Enterprise Value / Revenue | Used for high-growth / unprofitable companies |
| P/E | Price / EPS | Equity value relative to earnings |
| P/S | Market Cap / Revenue | Equity value relative to sales |
| P/B | Market Cap / Book Value of Equity | Value vs. accounting book value |
| EV/EBIT | Enterprise Value / EBIT | Like EV/EBITDA but penalizes heavy D&A |

### Enterprise Value
```
EV = Market Cap + Total Debt + Preferred Stock + Minority Interest − Cash
```
Excel:
```excel
= MarketCap + TotalDebt + PrefStock + MinorityInt - Cash
```

### Comps Table Layout

| Col A | B | C | D | E | F | G |
|-------|---|---|---|---|---|---|
| Company | Market Cap | EV | Revenue | EBITDA | EPS | EV/EBITDA |
| Peer 1 | input | input | input | input | input | `=C2/E2` |
| Peer 2 | | | | | | |
| Target | | | | | | |
| **Median** | | | `=MEDIAN(D2:D5)` | | | `=MEDIAN(G2:G4)` |

**Implied Value of Target**:
```excel
Implied EV = Median EV/EBITDA × Target EBITDA
Implied Price = (Implied EV - Net Debt) / Shares
```

### Reading the Multiples
- **EV/EBITDA < 8x**: Often considered cheap; >15x = growth premium priced in
- **P/E < 15x**: Historically cheap for S&P 500; >30x = high expectations
- **P/S < 1x**: Cheap; >10x = high-growth SaaS territory
- Always compare within the same sector — multiples vary widely by industry

---

## 3. Financial Ratios

### Profitability
| Ratio | Formula | Excel |
|-------|---------|-------|
| Gross Margin | Gross Profit / Revenue | `=GrossProfit/Revenue` |
| EBIT Margin | EBIT / Revenue | `=EBIT/Revenue` |
| Net Margin | Net Income / Revenue | `=NetIncome/Revenue` |
| ROE | Net Income / Avg Equity | `=NetIncome/AVERAGE(Equity_t,Equity_t1)` |
| ROIC | NOPAT / Invested Capital | `=NOPAT/(TotalDebt+Equity-Cash)` |
| ROA | Net Income / Avg Assets | `=NetIncome/AVERAGE(Assets_t,Assets_t1)` |

**ROIC > WACC** = company is creating value. ROIC < WACC = destroying value.

### Leverage & Liquidity
| Ratio | Formula | Healthy Range |
|-------|---------|--------------|
| Debt/Equity | Total Debt / Equity | <1x for most sectors |
| Net Debt/EBITDA | (Debt − Cash) / EBITDA | <3x comfortable; >5x stressed |
| Interest Coverage | EBIT / Interest Expense | >3x; <1.5x = distress risk |
| Current Ratio | Current Assets / Current Liabilities | >1.5x |
| Quick Ratio | (Cash + Receivables) / Current Liabilities | >1x |

### Efficiency
| Ratio | Formula | Note |
|-------|---------|------|
| Asset Turnover | Revenue / Avg Assets | Higher = more efficient |
| Inventory Days | Inventory / (COGS/365) | Lower = faster turns |
| DSO (Days Sales Outstanding) | Receivables / (Revenue/365) | Lower = faster collection |
| DPO (Days Payable Outstanding) | Payables / (COGS/365) | Higher = better for cash |
| Cash Conversion Cycle | DSO + Inventory Days − DPO | Lower = better working capital |

---

## 4. Reading Financial Statements

### Income Statement — What to Look For
```
Revenue
− Cost of Goods Sold (COGS)
= Gross Profit              ← Gross Margin = Gross Profit / Revenue
− Operating Expenses (SG&A, R&D)
= EBIT (Operating Income)   ← EBIT Margin
− Interest Expense
= EBT (Pre-tax Income)
− Taxes
= Net Income                ← Net Margin
÷ Diluted Shares
= EPS (Diluted)
```

**Red flags**: Revenue growth without margin expansion; large one-time gains inflating net income; EPS growing faster than revenue (buybacks masking stagnation).

**Green flags**: Expanding gross margins (pricing power); growing R&D as % of revenue (investment in future); operating leverage (revenue grows faster than opex).

### Balance Sheet — Key Items
```
ASSETS                          LIABILITIES & EQUITY
Current Assets:                 Current Liabilities:
  Cash & Equivalents              Accounts Payable
  Accounts Receivable             Short-term Debt
  Inventory                       Accrued Expenses
Non-Current Assets:             Long-term Debt
  PP&E (net)                    Total Liabilities
  Goodwill & Intangibles        Shareholders' Equity:
  Long-term Investments           Common Stock + APIC
                                  Retained Earnings
```

**Key checks**:
- Cash trend: growing = healthy; shrinking without investment = concern
- Goodwill spike: may signal acquisition at premium (watch for impairment)
- Debt maturity: when is debt due? Refinancing risk?
- Book value vs. market cap: P/B > 1 means market values intangibles/future growth

### Cash Flow Statement — Most Important Statement
```
Operating Cash Flow (OCF)       ← "Quality of earnings" — should track net income
− Capex
= Free Cash Flow (FCF)          ← What the business actually generates
− Dividends
= Free Cash Flow to Equity
```

**Rule of thumb**: Net Income > 0 but OCF < 0 = earnings manipulation risk. FCF consistently > Net Income = high-quality earnings (conservatively accounted).

---

## 5. Quick Valuation Sanity Checks

| Check | How |
|-------|-----|
| DCF vs. Comps | Both should point in same direction; >20% divergence = re-examine assumptions |
| Reverse DCF | What growth does the current price imply? `=RATE(n, 0, -EV, FCF_terminal_implied)` |
| Rule of 40 | For SaaS: Revenue Growth % + FCF Margin % > 40 = healthy |
| PEG Ratio | P/E / EPS Growth Rate; <1 = potentially undervalued |
| Graham Number | √(22.5 × EPS × Book Value Per Share) = conservative intrinsic value estimate |

---

## Reference Examples

- `examples/dcf-model.md` — Complete 5-year DCF for a sample company with sensitivity table
- `examples/comps-table.md` — Comparable company analysis with EV/EBITDA, P/E, P/S multiples and implied valuation
