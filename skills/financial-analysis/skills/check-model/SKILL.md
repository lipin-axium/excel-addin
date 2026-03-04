---
name: check-model
description: Debug and audit Excel financial models for errors — broken formulas, hardcoded overrides, balance sheet imbalances, cash flow mismatches, circular references, and logic gaps. Use when a model isn't tying, producing unexpected results, or before sending to a client or IC. Triggers on "debug model", "check my model", "audit model", "model won't balance", "something's off", "QA model", or "model review".
platform: excel
---

# Model Checker & Auditor

READ THIS ENTIRE FILE before auditing any model.

## Step 1: Identify the Model

- Accept the user's Excel model (read the file using the read tool)
- Identify model type: DCF, LBO, merger, 3-statement, comps, returns, or custom
- Map the structure: which tabs exist, how they're linked, where inputs vs. outputs live
- Note any hidden tabs or rows that could contain overrides

---

## Step 2: Structural Checks

**Tab & Layout Review:**
- Are inputs clearly separated from calculations?
- Is there a consistent color-coding convention? (blue = input, black = formula, green = cross-tab link)
- Are there hidden tabs or rows that could contain overrides?
- Is model flow logical? (Assumptions → IS → BS → CF → Valuation)

**Formula Consistency:**
- Hardcoded numbers inside formulas (partial hardcodes like `=B7*1.15`)
- Inconsistent formulas across a row/column range (should be the same formula dragged across)
- `#REF!`, `#VALUE!`, `#N/A`, `#DIV/0!` errors anywhere
- Cells formatted as formulas but containing hardcoded values

---

## Step 3: Integrity Checks by Statement

### Balance Sheet
- Total Assets = Total Liabilities + Equity **every period**
- If imbalanced: quantify the gap, trace where it first breaks
- Retained earnings rolls correctly: Prior RE + Net Income − Dividends = Current RE
- Goodwill / intangibles flow from acquisition assumptions (if M&A model)

### Cash Flow Statement
- Ending cash from CF = Cash on BS every period
- Operating CF + Investing CF + Financing CF = Net Change in Cash
- D&A on CF matches D&A on IS and PP&E schedule
- CapEx on CF matches PP&E roll-forward
- Working capital changes on CF match BS movements (ΔAR, ΔAP, ΔInventory)

### Income Statement
- Revenue build ties to segment/product detail (if applicable)
- COGS and gross margin consistent with assumptions
- Tax expense = Pre-tax income × tax rate (check for deferred tax)
- Share count ties to dilution schedule (options, converts, buybacks)

### Circular References
- Check for circulars: interest expense → debt balance → cash → interest
- If **intentional** (common in LBO/3-statement): verify iterative calculation is enabled and working
- If **unintentional**: trace the loop and identify where to break it (use beginning-period balance)

---

## Step 4: Logic Checks

**Reasonableness:**
- Growth rates make sense (100%+ revenue growth without explanation = red flag)
- Margins within industry norms (flag outliers >2 standard deviations)
- Terminal value dominates DCF (>75% of EV from TV = yellow flag)
- EBITDA hockey-sticking unrealistically in out years
- Terminal growth ≥ WACC (creates infinite value — critical error)

**Edge Cases:**
- What happens at 0% growth? Negative growth?
- Does the model break with negative EBITDA (tax calculation, ratios)?
- Do leverage ratios go negative or exceed realistic bounds?
- Any divide-by-zero risks not protected with IFERROR or IF(denominator=0,...)?

**Cross-Tab Consistency:**
- Linked cells actually match their source (copy-paste errors are common)
- Date headers consistent across all tabs
- Units match across tabs (thousands vs. millions vs. actuals)

---

## Step 5: Common Bugs by Model Type

**DCF:**
- Discount rate applied to wrong period (mid-year vs. end-of-year)
- Terminal value not discounted back correctly
- WACC uses book values instead of market values
- FCF includes interest expense (should be unlevered — NOPAT-based)
- Tax shield double-counted

**LBO:**
- Debt paydown doesn't respect cash sweep mechanics and priority waterfall
- Interest calculated on ending balance instead of beginning (creates circularity)
- Exit multiple applied to wrong EBITDA (LTM vs. NTM)
- Transaction fees not deducted from Day 1 equity
- IRR cash flow signs wrong (investment should be negative)

**Merger Model:**
- Accretion/dilution uses wrong share count (pre- vs. post-deal)
- Synergies not phased in correctly
- Purchase price allocation doesn't balance
- Foregone interest on cash used not deducted from pro forma income
- Transaction fees missing from sources & uses

**3-Statement:**
- Working capital changes have wrong sign convention (↑AR should be negative cash)
- Depreciation doesn't match PP&E schedule
- Cash balance in BS doesn't match CF ending cash
- Dividends paid exceed net income without explanation

---

## Step 6: Audit Report

Generate an issue log:

**Summary:**
- Model type and overall assessment: **Clean** / **Minor Issues** / **Major Issues**
- Issue count by severity

**Issue Log:**

| # | Tab | Cell/Range | Severity | Category | Description | Suggested Fix |
|---|-----|-----------|----------|----------|-------------|--------------|
| 1 | | | Critical/Warning/Info | Formula/Logic/Balance/Hardcode | | |

**Severity Definitions:**
- **Critical**: Model produces wrong output (BS doesn't balance, broken formulas, circular reference producing wrong number)
- **Warning**: Model works but has risks (hardcodes in projections, inconsistent formulas, edge case failures)
- **Info**: Style and best-practice suggestions (color coding, naming, layout)

---

## Step 7: Output

- Issue log table (in chat or as an Excel comment annotation)
- Summary assessment with fix priority
- For each critical issue: exact cell reference + what the correct formula should be

## Important Notes

- **Always check the BS balance first** — if it doesn't balance, nothing else matters until it does
- **Hardcoded overrides are the #1 source of errors** — scan for blue-font convention violations
- **Sign convention errors** (positive vs. negative for cash outflows) are extremely common
- **Models that "work" can still be wrong** — sanity-check outputs against industry benchmarks
- **Don't change the model without asking** — report issues and let the user decide how to fix
- If the model uses VBA macros, note any macro-driven calculations that can't be audited from formulas alone
