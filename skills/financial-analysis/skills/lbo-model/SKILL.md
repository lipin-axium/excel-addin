---
name: lbo-model
description: Build LBO (Leveraged Buyout) models in Excel for private equity transactions. Covers sources & uses, operating model, debt schedule with cash sweep, and IRR/MOIC returns analysis. Use when evaluating a PE acquisition, modeling leveraged buyout returns, or preparing IC materials. Triggers on "LBO model", "leveraged buyout", "PE returns model", "IRR model", "sources and uses", or "model a buyout".
platform: excel
---

# LBO Model Builder

READ THIS ENTIRE FILE before building any LBO model. All structure, formulas, and conventions are defined here.

## Core Principles

- **Every calculation must be an Excel formula** — never hardcode computed values
- **Consistent sign convention** — pick one and stick to it throughout (positive outflows OR negative outflows — don't mix)
- **Work section by section** — each section feeds the next; complete one before moving on
- **No circular references from interest** — use beginning-of-period debt balance for interest calculation

## Color Conventions

- **Blue (0000FF)**: Hardcoded inputs — numbers typed directly
- **Black (000000)**: Formulas with calculations (`=B4*B5`, `=SUM()`)
- **Purple (800080)**: Same-tab links — direct cell references with no math (`=B9`)
- **Green (008000)**: Cross-tab links (`=Assumptions!B5`)

## Number Formats

- Currency: `$#,##0;($#,##0);"-"` or `$#,##0.0` for millions
- Percentages: `0.0%`
- Multiples/MOIC: `0.0"x"` or `0.00"x"` for precision
- All numbers: right-aligned

---

## Sheet Structure

Create these tabs:
1. **Assumptions** — all key inputs (entry, financing, operating, exit)
2. **Sources & Uses** — Day 1 capital structure
3. **Operating Model** — revenue, EBITDA, and FCF projections
4. **Debt Schedule** — debt tranches, interest, and paydown
5. **Returns** — exit analysis, IRR, MOIC, and sensitivity tables

---

## Tab 1: Assumptions

Gather and input:

**Entry:**
- Entry EBITDA (LTM)
- Entry EV/EBITDA multiple → Enterprise Value
- Net debt at close → Equity purchase price
- Transaction fees & financing fees (% of EV)

**Financing (Sources):**
- Senior debt (x EBITDA, interest rate, amortization %)
- Subordinated / mezz debt (if any)
- Sponsor equity contribution (plug = Uses − debt)

**Operating:**
- Revenue growth rate by year
- EBITDA margin by year
- CapEx as % of revenue
- Working capital change as % of revenue change
- Tax rate

**Exit:**
- Hold period (years)
- Exit EV/EBITDA multiple

---

## Tab 2: Sources & Uses

```
SOURCES                    $       USES                       $
Senior Debt              [=]      Equity Purchase Price     [=EV - NetDebt]
Subordinated Debt        [input]  Refinance Target Debt     [=NetDebt]
Sponsor Equity           [=plug]  Transaction Fees          [=EV*fee%]
                                  Financing Fees            [input]
Total Sources            [=SUM]   Total Uses                [=SUM]
Check: Sources - Uses    [must = 0]
```

Sponsor equity is the **plug**: `=Total Uses - Total Debt Raised`

---

## Tab 3: Operating Model

```
                    Close   Y1      Y2      Y3      Y4      Y5
Revenue             [input] [=prev*(1+growth)]...
  % growth                  [=Y1/Close-1]...
EBITDA              [=Rev*margin%]...
  % margin          [=EBITDA/Revenue]...
D&A                 [=Rev*da%]...
EBIT                [=EBITDA-DA]...
Interest Expense    [=link from Debt Schedule]
EBT                 [=EBIT-Interest]
Taxes               [=MAX(0,EBT)*taxRate]   ← no tax on losses
Net Income          [=EBT-Taxes]
+ D&A               [=DA row]
- CapEx             [=Rev*capex%]
- ΔNWC              [=(Rev_t-Rev_t-1)*nwc%]
Free Cash Flow      [=NI+DA-CapEx-ΔNWC]
```

---

## Tab 4: Debt Schedule

For each tranche (Senior, Sub-debt, etc.):

```
                    Close   Y1          Y2          ...
Beginning Balance   [=S&U]  [=prior End Balance]
+ New Issuance      [=S&U]  0
- Mandatory Amort.  [=Beg*amort%]...
- Cash Sweep        [=MIN(AvailableCash, RemainingBalance)]
Ending Balance      [=Beg+New-Amort-Sweep]
Interest Expense    [=Beginning Balance * rate]   ← ALWAYS use beginning balance
```

**Cash sweep priority** — pay down in order (senior first):
```
Available for sweep = FCF - mandatory amortization (all tranches)
Senior paydown = MIN(Available, Senior balance)
Sub paydown = MIN(Remaining after Senior, Sub balance)
```

Balances cannot go negative: `=MAX(0, Beg - Amort - Sweep)`

---

## Tab 5: Returns

**Exit Calculation:**
```
Exit EBITDA         [=final year EBITDA from Operating Model]
Exit Enterprise Value = Exit EBITDA * Exit Multiple
- Net Debt at Exit  [=sum of ending debt balances]
Exit Equity Value   [=Exit EV - Net Debt at Exit]

Equity Invested     [=Sponsor Equity from S&U]
MOIC                [=Exit Equity / Equity Invested]
IRR                 [=IRR(cashflows) or XIRR with dates]
```

**Cash flows for IRR:** Investment year = negative equity check, exit year = positive proceeds.
`=IRR({-EquityInvested, 0, 0, 0, 0, ExitEquity})`

**Returns Attribution Waterfall:**
```
EBITDA Growth contribution  = (ExitEBITDA - EntryEBITDA) * ExitMultiple / EquityInvested
Multiple Expansion          = (ExitMultiple - EntryMultiple) * EntryEBITDA / EquityInvested
Debt Paydown                = Total debt paid down / EquityInvested
Fees/Expenses drag          = -(TransFees + FinFees) / EquityInvested
```

**Sensitivity Tables (Entry × Exit multiple):**

| | Exit 6x | Exit 7x | Exit 8x | Exit 9x | Exit 10x |
|---|---------|---------|---------|---------|----------|
| Entry 7x | IRR/MOIC | ... | | | |
| Entry 8x | | | | | |
| Entry 9x | | | | | |
| Entry 10x | | | | | |

Each cell: formula recalculating IRR/MOIC using that row's entry multiple and column's exit multiple.
Format: `"X.Xx / X.X%"` — show both MOIC and IRR.

Also build: **EBITDA Growth × Exit Multiple** and **Leverage × Exit Multiple** tables.

**3-Scenario Summary:**

| | Bull | Base | Bear |
|---|------|------|------|
| Revenue CAGR | | | |
| Exit EBITDA margin | | | |
| Exit multiple | | | |
| MOIC | | | |
| IRR | | | |

---

## Verification Checklist

- [ ] Sources = Uses (check row = 0)
- [ ] Debt balances never go negative (MAX(0,...) guards in place)
- [ ] Interest uses beginning balance (not average/ending — breaks circularity)
- [ ] IRR cash flows: negative investment, positive proceeds
- [ ] Each sensitivity table cell shows a different value (not all the same)
- [ ] MOIC = Exit Equity / Equity Invested (simple ratio, no IRR formula)
- [ ] No hardcoded calculated values anywhere
- [ ] Color conventions applied (blue inputs, black formulas, purple/green links)

## Common Errors

| Error | Fix |
|-------|-----|
| All sensitivity cells same value | Check mixed references: `$A5` for row header, `B$4` for col header |
| Circular reference from interest | Use beginning balance: `=OpeningDebt * rate` |
| Negative debt balance | Wrap with `MAX(0, ...)` |
| IRR error | Verify signs: investment = negative, proceeds = positive |
| Sources ≠ Uses | Equity is the plug — recalculate as `=Uses - Debt` |
