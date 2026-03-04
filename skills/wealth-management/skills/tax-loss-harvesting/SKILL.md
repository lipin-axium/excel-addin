---
name: tax-loss-harvesting
description: Identify tax-loss harvesting opportunities across taxable accounts in Excel. Finds positions with unrealized losses, suggests replacement securities, and tracks wash sale windows. Use for year-end tax planning, reducing capital gains, or optimizing after-tax returns. Triggers on "tax-loss harvesting", "TLH", "harvest losses", "tax losses", "unrealized losses", or "year-end tax planning".
platform: excel
---

# Tax-Loss Harvesting

READ THIS ENTIRE FILE before building a tax-loss harvesting analysis.

## Step 1: Identify Harvest Candidates

Scan all taxable accounts for positions with unrealized losses:

| Security | Asset Class | Cost Basis | Current Value | Unrealized Loss | Holding Period | % Loss | Priority |
|----------|-----------|-----------|---------------|-----------------|---------------|--------|----------|
| | | | | =CV-Basis | ST (<1yr) / LT (>1yr) | =Loss/Basis | |

**Prioritize by:**
1. Largest **absolute** loss (biggest tax benefit in dollars)
2. **Short-term losses** first (offset ordinary income rates, not just capital gains rates)
3. Largest **% loss** (less likely to recover quickly, reduces opportunity cost of waiting)

---

## Step 2: Gain/Loss Budget

Calculate the client's current tax position:

| Category | YTD Amount |
|----------|-----------|
| Realized short-term gains | |
| Realized long-term gains | |
| Realized losses (all) | |
| Net realized gain/(loss) | =ST+LT+Losses |
| Carryforward losses from prior years | |
| **Target harvesting amount** | = net gains to offset |

**Tax savings estimate:**
```excel
ST Loss Tax Savings = ST_Loss * Marginal_Ordinary_Rate
LT Loss Tax Savings = LT_Loss * Capital_Gains_Rate
Ordinary Income Deduction = MIN(3000, RemainingNetLoss) * Marginal_Rate
Total Estimated Savings = SUM
```

Key rules:
- Up to $3,000 net loss can be deducted against ordinary income per year
- Excess losses carry forward indefinitely to future years
- Short-term losses first offset short-term gains (taxed at ordinary income rates)
- Long-term losses first offset long-term gains (taxed at preferential rates)

---

## Step 3: Replacement Securities

For each harvest candidate, suggest a replacement that:
- Maintains similar market exposure (same asset class, sector, geography)
- Is **NOT** "substantially identical" (wash sale rule)
- Has similar risk/return characteristics

| Sell | Replace With | Rationale | Tracking Error Risk |
|------|-------------|-----------|-------------------|
| SPDR S&P 500 (SPY) | iShares Core S&P 500 (IVV) | Same index, different fund family | Minimal |
| Vanguard Total Intl (VXUS) | iShares MSCI ACWI ex-US (ACWX) | Similar exposure, different index | Low |
| Vanguard Total Bond (BND) | iShares Core US Agg Bond (AGG) | Same benchmark, different family | Minimal |
| Individual stock XYZ | Sector ETF (e.g., XLK, XLF) | Broader exposure — no wash sale risk | Moderate |
| Mutual Fund ABC | Similar ETF from different family | Different share class / structure | Low–Moderate |

**Rule:** ETFs tracking **different indexes** from different fund families are generally NOT substantially identical, even if similar. Mutual funds from the same family with the same portfolio ARE substantially identical.

---

## Step 4: Wash Sale Check

**Wash sale rule:** Cannot claim the loss if you bought substantially identical securities within 30 days before OR 30 days after the sale.

| Security Sold | Sale Date | Wash Sale Window Start | Window End | DRIP Active? | Accounts to Check | Risk |
|--------------|-----------|----------------------|-----------|-------------|------------------|------|
| | | =SaleDate-30 | =SaleDate+30 | Yes/No | Taxable, IRA, Roth, Spouse | |

**Check ALL accounts in the household:**
- Taxable accounts
- IRA and Roth accounts (wash sale rules apply here too)
- Spouse's accounts
- DRIP (dividend reinvestment) plans that could trigger an automatic purchase

**If wash sale triggered:** The loss is DISALLOWED and adds to the cost basis of the replacement security. Track this carefully.

---

## Step 5: Execution Plan

| Trade # | Account | Action | Security | Shares | Est. Proceeds | Est. Loss | Replacement | Notes |
|---------|---------|--------|----------|--------|--------------|-----------|-------------|-------|
| 1 | | Sell | | | | | | |
| 2 | | Buy | [Replacement] | | | | | Buy immediately after sell |

**Summary:**
```
Total estimated losses harvested:   $
Estimated tax savings at [XX%] rate: $
Net portfolio impact:                Minimal (replacement maintains exposure)
Wash sale windows:                   [list security and 30-day end dates]
```

---

## Step 6: Post-Harvest Tracking

After 30+ days:
- **Swap back** to original securities if preferred (and if no tax reason to stay in replacement)
- **Maintain replacements** if no reason to switch back (lower expense ratio, better fit)
- **Update cost basis records** — replacement securities take on a different cost basis
- **Document for tax reporting** — every harvest needs to be reported on Schedule D

---

## Important Notes

- **Wash sale violations are costly** — the loss is disallowed AND adjusts cost basis, which can create confusion
- **Substantially identical ≠ same asset class** — ETFs tracking different indexes are generally fine
- **Coordinate across ALL household accounts** — a buy in the IRA can invalidate a taxable account harvest
- **Long-term cost basis step-down** — harvesting resets cost basis lower, which means more gains when you eventually sell the replacement
- **Year-end urgency** — December is prime season, but opportunities exist throughout the year
- **Mutual fund distributions** in December can create unexpected gains — harvest before ex-dividend date
- **Not all losses are worth harvesting** — transaction costs, tracking error, and timing risk have real costs; calculate the breakeven
