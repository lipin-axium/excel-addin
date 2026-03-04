---
name: 3-statements
description: Build or complete integrated 3-statement financial models (Income Statement, Balance Sheet, Cash Flow Statement) in Excel with proper linkages, scenario toggles, and audit checks. Use when building a full financial model, linking IS/BS/CF statements, or populating an existing template. Triggers on "3-statement model", "financial model", "link the statements", "income statement balance sheet cash flow", "build a model for [company]", or "populate this template".
platform: excel
---

# 3-Statement Financial Model

READ THIS ENTIRE FILE before building or completing any 3-statement model.

## Model Structure

### Standard Tab Organization

| Tab Name | Contents |
|----------|----------|
| Assumptions | Revenue drivers, margin %, capex %, DSO/DIO/DPO, tax rate, scenario toggle |
| IS (Income Statement) | Revenue → Gross Profit → EBIT → EBT → Net Income |
| BS (Balance Sheet) | Assets, Liabilities, Equity — must balance every period |
| CF (Cash Flow) | Operating / Investing / Financing — ending cash ties to BS |
| DA (Depreciation) | PP&E roll-forward, D&A schedule |
| Debt | Debt schedule, interest calculation, amortization |
| WC (Working Capital) | AR, Inventory, AP roll-forwards from DSO/DIO/DPO |
| Checks | Audit dashboard — all integrity checks in one place |

Review all existing tabs before populating — understand what feeds what.

---

## Formatting Conventions

- **Blue text**: hardcoded inputs (historical data, assumption drivers)
- **Black text**: formulas
- **Green text**: cross-tab links
- Projections must reference Assumptions tab — no hardcodes in projection formulas

---

## Projection Period

Typically 5 years. Columns: `FY2021A | FY2022A | FY2023A | FY2024E | FY2025E | FY2026E | FY2027E | FY2028E`

The vertical border between A (actual) and E (estimate) columns should be clearly marked.

---

## Income Statement

```
Revenue                   [historical inputs; projections = prior * (1 + growth%)]
  % growth                [=current/prior - 1]
Cost of Revenue           [=Revenue * COGS%]
Gross Profit              [=Revenue - COGS]
  Gross Margin %          [=GP/Revenue]
S&M Expense               [=Revenue * SM%]
R&D Expense               [=Revenue * RD%]
G&A Expense               [=Revenue * GA%]
Total OpEx                [=SUM(SM+RD+GA)]
EBIT                      [=GP - OpEx]
  EBIT Margin %           [=EBIT/Revenue]
EBITDA                    [=EBIT + D&A]
  EBITDA Margin %         [=EBITDA/Revenue]
Interest Expense          [=link from Debt schedule]
EBT                       [=EBIT - Interest]
Tax Expense               [=MAX(0, EBT) * TaxRate]   ← no tax if pre-tax loss
Net Income                [=EBT - Taxes]
  Net Margin %            [=NI/Revenue]
```

**Sign convention:** Expenses are positive; EBT = EBIT − Interest (positive interest = expense).

---

## Balance Sheet

```
ASSETS
Current Assets:
  Cash & Equivalents        [=CF Ending Cash]
  Accounts Receivable       [=Revenue * DSO / 365]
  Inventory                 [=COGS * DIO / 365]
  Other Current Assets      [input or % of revenue]
Total Current Assets        [=SUM]
PP&E, net                   [=prior PP&E + CapEx - D&A]
Intangibles / Goodwill      [input — from acquisitions]
Total Assets                [=SUM]

LIABILITIES
Current Liabilities:
  Accounts Payable          [=COGS * DPO / 365]
  Accrued Expenses          [=OpEx * accrual%]
  Current Portion of Debt   [=link from Debt schedule]
Total Current Liabilities   [=SUM]
Long-Term Debt              [=link from Debt schedule]
Deferred Tax Liabilities    [if applicable]
Total Liabilities           [=SUM]

EQUITY
Common Stock / APIC         [roll-forward: prior + equity raises + SBC]
Retained Earnings           [=prior RE + NI - Dividends]
Total Equity                [=SUM]
Total Liabilities + Equity  [=Liabilities + Equity]

CHECK: Assets - (Liabilities + Equity) = 0 ← MUST = 0 every period
```

---

## Cash Flow Statement (Indirect Method)

```
OPERATING ACTIVITIES
Net Income                  [=IS Net Income]
(+) D&A                     [=link from DA schedule]
(+) SBC                     [=link from IS or Assumptions]
(-) Δ Accounts Receivable   [=-(AR_t - AR_t-1)]    ← increase = use of cash
(-) Δ Inventory             [=-(Inv_t - Inv_t-1)]
(+) Δ Accounts Payable      [=AP_t - AP_t-1]        ← increase = source of cash
(+/-) Other WC changes
Cash from Operations        [=SUM]

INVESTING ACTIVITIES
(-) CapEx                   [=-(CapEx from Assumptions)]
(+/-) Acquisitions/Divestitures [input if applicable]
Cash from Investing         [=SUM]

FINANCING ACTIVITIES
(+) Debt Issuance           [=link from Debt schedule]
(-) Debt Repayment          [=link from Debt schedule]
(+) Equity Raised           [input]
(-) Dividends               [input]
Cash from Financing         [=SUM]

Net Change in Cash          [=CFO + CFI + CFF]
Beginning Cash              [=prior period ending cash]
Ending Cash                 [=Beginning + Net Change]

CHECK: Ending Cash - BS Cash = 0 ← MUST = 0
```

**Sign rules:** Cash inflows = positive. Cash outflows = negative. Increase in current asset = negative (use of cash). Increase in current liability = positive (source of cash).

---

## Supporting Schedules

### Depreciation / PP&E Roll-Forward
```
Beginning PP&E (gross)   [=prior ending]
+ CapEx                  [=Assumptions]
- Disposals              [input or 0]
Ending PP&E (gross)      [=SUM]
- Accumulated Depreciation [roll-forward: prior + D&A]
PP&E, net                [=Gross - Accum Depr]
D&A                      [=Beginning PP&E * depr% or straight-line]
```

### Debt Schedule
```
Beginning Balance        [=prior ending]
+ New Issuance           [input]
- Repayments             [input or amort schedule]
Ending Balance           [=SUM]
Interest Expense         [=Beginning Balance * rate]   ← beginning balance avoids circularity
```

### Working Capital (from DSO / DIO / DPO)
```
AR  = Revenue * DSO / 365
Inv = COGS * DIO / 365
AP  = COGS * DPO / 365
```

---

## Scenario Toggle

In Assumptions tab, create a dropdown:
- 1 = Base Case
- 2 = Upside Case
- 3 = Downside Case

Use `CHOOSE` or `INDEX` to pull the right assumption set:
```excel
=CHOOSE(ScenarioCell, BaseGrowth, UpsideGrowth, DownsideGrowth)
```

**Scenario hierarchy check:** Upside > Base > Downside for Revenue, EBITDA, Net Income, FCF, and margins.

---

## Checks Tab (Audit Dashboard)

| Check | Formula | Status |
|-------|---------|--------|
| BS Balance | =Assets-(Liabilities+Equity) | Must = 0 |
| Cash Tie-Out | =CF Ending Cash - BS Cash | Must = 0 |
| Net Income Link | =IS NI - CF Starting NI | Must = 0 |
| Retained Earnings | =Prior RE + NI - Dividends - Current RE | Must = 0 |
| D&A tie | =DA Schedule total - CF D&A | Must = 0 |
| CapEx tie | =Assumptions CapEx - CF CapEx | Must = 0 |

Color code checks: **Green** = 0, **Red** = non-zero. Add a master status cell:
```excel
=IF(SUM(ABS(AllChecks))=0, "✓ ALL CHECKS PASS", "✗ ERRORS — REVIEW CHECKS")
```

---

## Circular Reference Handling

Interest expense creates circularity: Interest → NI → Cash → Debt balance → Interest.

**Fix:** Use beginning-of-period debt balance for interest (not ending or average). This breaks the circle cleanly.

If the model requires iterative calculations (e.g., revolver draws): File → Options → Formulas → Enable Iterative Calculation (max 100 iterations, max change 0.001). Add a circuit breaker toggle in Assumptions.

---

## Quality Checklist

- [ ] BS balances every period (check tab shows 0)
- [ ] Cash ties from CF to BS every period
- [ ] Net Income links from IS to top of CF
- [ ] D&A and CapEx tie to their schedules
- [ ] Working capital changes have correct signs (increase in AR = negative)
- [ ] Projection formulas reference Assumptions (no hardcodes)
- [ ] Consistent formulas across all projection columns
- [ ] No #REF!, #DIV/0!, #VALUE! errors
- [ ] Scenario toggle switches all three statements correctly
