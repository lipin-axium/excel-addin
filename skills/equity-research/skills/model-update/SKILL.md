---
name: model-update
description: Update financial models with new quarterly earnings actuals, guidance changes, or revised assumptions. Adjusts forward estimates, recalculates valuation, and flags material changes. Use after earnings, guidance updates, or when assumptions need refreshing. Triggers on "update model", "plug earnings", "refresh estimates", "update numbers for [company]", "new guidance", or "revise estimates after [company] reported".
platform: excel
---

# Model Update

READ THIS ENTIRE FILE before updating any model.

## Step 1: Identify What Changed

Determine the update trigger:
- **Earnings release**: new quarterly actuals to plug in
- **Guidance change**: company updated forward outlook
- **Estimate revision**: analyst changing assumptions based on new information
- **Macro update**: interest rates, FX, commodity prices changed
- **Event-driven**: M&A, restructuring, new product launch, management change

---

## Step 2: Plug New Actuals (Post-Earnings)

Update the model with reported results:

| Line Item | Prior Estimate | Actual Reported | Delta ($) | Delta (%) | Notes |
|-----------|---------------|----------------|-----------|-----------|-------|
| Revenue | | | =Act-Est | =Delta/Est | |
| Gross Margin % | | | | | |
| Operating Expenses | | | | | |
| EBITDA | | | | | |
| EPS (adj.) | | | | | |
| [Key metric 1] | | | | | |
| [Key metric 2] | | | | | |

**Segment detail** (if applicable):
- Update each segment revenue and margin
- Note any segment mix shifts vs. expectations

**Balance sheet / cash flow updates:**
- Cash and net debt balances
- Diluted share count (buybacks since last quarter, new dilution)
- CapEx actual vs. estimate
- Working capital changes (AR, inventory, AP)

---

## Step 3: Revise Forward Estimates

Based on new actuals and guidance, update the model:

| | Old FY Est. | New FY Est. | $ Change | % Change | Old Next FY | New Next FY | % Change |
|---|------------|------------|---------|---------|------------|------------|---------|
| Revenue | | | | | | | |
| EBITDA | | | | | | | |
| EPS (adj.) | | | | | | | |
| FCF | | | | | | | |

**Document assumption changes:**

| Assumption | Old Value | New Value | Reason |
|-----------|-----------|-----------|--------|
| Revenue growth FY+1 | | | |
| Gross margin % | | | |
| OpEx % of revenue | | | |
| CapEx % of revenue | | | |
| Tax rate | | | |

---

## Step 4: Valuation Impact

Recalculate valuation with updated estimates:

| Method | Multiple / Rate | Prior Fair Value | Updated Fair Value | Change |
|--------|----------------|-----------------|-------------------|--------|
| DCF (WACC=X%, TGR=Y%) | | | | |
| P/E (NTM EPS × Xm target) | | | | |
| EV/EBITDA (NTM × Xx target) | | | | |
| **Blended Price Target** | | | | |

**Upside / downside to current price:**
```excel
=BlendedTarget / CurrentPrice - 1
```

---

## Step 5: Summary & Action

**Estimate Change Summary** — write one paragraph:
- What changed (the facts)
- Why it changed (the analysis)
- What it means for the thesis (is this signal or noise?)
- Thesis impact: Strengthens / Weakens / Neutral / Thesis-changing

**Rating / Price Target Decision:**
- Maintain or change rating?
- New price target if changed, with methodology
- Upside/downside to current price

**Compare to consensus** (use Finnhub MCP or web search for current consensus):
- Are your revised estimates above or below the Street?
- If materially different, articulate why

---

## Model Update Checklist

- [ ] All actuals plugged in for the reported quarter
- [ ] Segment detail updated (if applicable)
- [ ] Share count updated (dilution, buybacks)
- [ ] Balance sheet items updated (cash, debt)
- [ ] Forward estimates revised with documented rationale
- [ ] Valuation multiples recalculated
- [ ] Price target updated
- [ ] Consensus comparison done
- [ ] GAAP vs. adjusted EPS clearly labeled
- [ ] Non-recurring items identified and excluded from adjusted estimates

## Important Notes

- **Reconcile to reported figures first** before projecting forward — understand the print before revising
- **Separate signal from noise** — noisy quarters (inventory destocking, weather, one-time items) can obscure underlying trends
- **Share count matters** — dilution from stock comp or converts can materially affect EPS even if NI is unchanged
- **Forward guidance is the key input** — management's view of next quarter is more actionable than the current quarter beat/miss
- **Track your revision history** — it shows analytical progression and helps calibrate forecasting accuracy
