---
name: returns-analysis
description: Build IRR and MOIC sensitivity tables for private equity deal evaluation in Excel. Models returns across entry multiple, leverage, exit multiple, growth rate, and hold period scenarios. Use when sizing up a PE deal, stress-testing returns, or preparing IC returns exhibits. Triggers on "returns analysis", "IRR sensitivity", "MOIC table", "PE returns", "what's the IRR at", "model the returns", or "back of the envelope LBO returns".
platform: excel
---

# PE Returns Analysis

READ THIS ENTIRE FILE before building a returns analysis.

## Key Formulas

```excel
MOIC   = Exit Equity Value / Equity Invested
IRR    = IRR({-EquityInvested, 0, 0, ..., ExitProceeds})
       = XIRR({-EquityInvested, ExitProceeds}, {EntryDate, ExitDate})   ← more precise
```

**Cash flow signs for IRR:** Investment = **negative**, Proceeds = **positive**. This is critical — wrong signs give nonsensical IRR.

---

## Sheet Structure

1. **Assumptions** — all deal inputs
2. **Returns Build** — base case calculation with waterfall
3. **Sensitivity Tables** — 2D IRR/MOIC grids
4. **Scenarios** — Bull / Base / Bear

---

## Tab 1: Assumptions

**Entry:**
```
Entry EBITDA (LTM)          [input]
Entry EV/EBITDA Multiple    [input]
Enterprise Value            [=EBITDA * Multiple]
Net Debt at Close           [input]
Equity Purchase Price       [=EV - NetDebt]
Transaction Fees (%)        [input, typically 2-3% of EV]
Financing Fees              [input]
Total Equity Invested       [=EquityPurchase + TransFees + FinFees * equityPortion]
```

**Financing:**
```
Senior Debt                 [x EBITDA or $ amount, rate, amortization %/yr]
Subordinated Debt           [x EBITDA, rate]
Total Debt                  [=Senior + Sub]
Leverage at Entry           [=TotalDebt/EntryEBITDA]
```

**Operating:**
```
Revenue CAGR                [input by year or flat rate]
EBITDA Margin (exit yr)     [input]
CapEx % of Revenue          [input]
Tax Rate                    [input]
Hold Period (years)         [input, typically 3-7]
```

**Exit:**
```
Exit Multiple (EV/EBITDA)   [input]
Exit EBITDA                 [=EntryEBITDA * (1+CAGR)^holdPeriod]
Exit Enterprise Value       [=ExitEBITDA * ExitMultiple]
```

---

## Tab 2: Returns Build

```
Entry EV                    [=EntryEBITDA * EntryMultiple]
(-) Entry Equity            [=EV - Debt]
Total Equity Invested       [=Equity + Fees]

Exit EBITDA                 [=EntryEBITDA * (1+CAGR)^N]
Exit EV                     [=ExitEBITDA * ExitMultiple]
(-) Net Debt at Exit        [=Debt at close - cumulative paydown]
Exit Equity Value           [=ExitEV - NetDebtAtExit]

MOIC                        [=ExitEquity / EquityInvested]
IRR                         [=IRR({-Invested, 0, 0, ..., ExitEquity})]
Cash-on-Cash                [same as MOIC for standard PE deal]
```

**Returns Attribution Waterfall:**

| Driver | Contribution to Equity Value |
|--------|------------------------------|
| EBITDA Growth | `=(ExitEBITDA - EntryEBITDA) * ExitMultiple` |
| Multiple Expansion/(Compression) | `=(ExitMultiple - EntryMultiple) * EntryEBITDA` |
| Debt Paydown | `=Total debt paid down over hold period` |
| Fees/Expense Drag | `=-(TransFees + FinFees)` |
| **Total Exit Equity** | `=SUM of above` |

---

## Tab 3: Sensitivity Tables

All cells must contain formulas — NOT hardcoded values. Each cell recalculates IRR/MOIC for that specific row/column combination.

### Table 1: Entry Multiple × Exit Multiple

Row headers: Entry multiples (e.g., 7x, 8x, 9x, 10x, 11x)
Column headers: Exit multiples (e.g., 6x, 7x, 8x, 9x, 10x)

Each cell format: `"2.5x / 22%"` — show MOIC and IRR.

```excel
// Example cell formula structure (B88):
// Row header in A88 = entry multiple, Col header in B87 = exit multiple
ExitEBITDA   = EntryEBITDA * (1+CAGR)^N
ExitEV       = ExitEBITDA * B$87              // col header = exit multiple
EntryEQ      = EntryEBITDA * $A88 - Debt      // row header = entry multiple
ExitEQ       = ExitEV - NetDebtAtExit
MOIC         = ExitEQ / EntryEQ
IRR          = (ExitEQ/EntryEQ)^(1/N) - 1    // simplified; use IRR() for interim CFs
```

### Table 2: EBITDA Growth × Exit Multiple (at fixed entry)

Row headers: Revenue CAGR (e.g., 0%, 5%, 10%, 15%, 20%)
Column headers: Exit multiple (e.g., 6x, 7x, 8x, 9x, 10x)

### Table 3: Leverage × Exit Multiple (at fixed entry and growth)

Row headers: Total leverage at entry (e.g., 3x, 4x, 5x, 6x, 7x EBITDA)
Column headers: Exit multiple

### Table 4: Hold Period × Exit Multiple

Row headers: Hold period years (3, 4, 5, 6, 7)
Column headers: Exit multiple

**Conditional formatting** on all tables:
- Green fill: IRR >20% (strong returns)
- Yellow fill: IRR 15–20%
- Red fill: IRR <15% (below typical PE hurdle)

---

## Tab 4: Scenario Summary

| | Bull | Base | Bear |
|---|------|------|------|
| Revenue CAGR | 15% | 10% | 5% |
| Exit EBITDA Margin | | | |
| Exit Multiple | 10x | 8x | 6.5x |
| Exit EBITDA ($mm) | | | |
| Exit Equity ($mm) | | | |
| **MOIC** | | | |
| **IRR** | | | |

---

## Important Notes

- **Always show gross and net of fees/carry** where applicable
- **Management rollover** changes the effective equity check — ask if relevant
- **Dividend recaps** or interim distributions materially affect IRR (returned capital earlier) — include if planned
- **Transaction costs** (2–4% of EV) reduce Day 1 equity — don't overlook
- **Asset vs. stock deal** tax treatment can affect after-tax returns — note the structure
- **Debt paydown** contribution is often underestimated in early hold years — model the schedule properly
