---
name: portfolio-rebalance
description: Analyze portfolio allocation drift and generate tax-aware rebalancing trade recommendations in Excel. Considers tax implications, transaction costs, and wash sale rules across account types. Use when checking if a portfolio is out of balance, generating rebalancing trades, or reviewing asset location. Triggers on "rebalance portfolio", "portfolio drift", "allocation check", "rebalancing trades", "my portfolio is out of balance", or "check allocation for [client]".
platform: excel
---

# Portfolio Rebalance Analysis

READ THIS ENTIRE FILE before building a rebalancing analysis.

## Step 1: Current Portfolio State

For each account, gather:
- Account type (Taxable / IRA / Roth / 401k / Trust)
- Holdings with current market value
- Cost basis and holding period (for taxable accounts)
- Unrealized gains/losses per position

---

## Sheet Structure

1. **Drift Analysis** — current vs. target allocation with variance flags
2. **Trade Recommendations** — tax-aware buy/sell list
3. **Asset Location Review** — are assets in the right account types?
4. **Tax Impact Summary** — estimated gains/losses from proposed trades

---

## Tab 1: Drift Analysis

| Asset Class | Target % | Current % | $ Value | Drift % | $ Over/Under | Action |
|------------|----------|-----------|---------|---------|-------------|--------|
| US Large Cap Equity | | | | =Curr-Target | =Drift*TotalPort | |
| US Small/Mid Cap | | | | | | |
| International Developed | | | | | | |
| Emerging Markets | | | | | | |
| Investment Grade Bonds | | | | | | |
| High Yield / Credit | | | | | | |
| TIPS / Inflation Protected | | | | | | |
| Alternatives / Real Assets | | | | | | |
| Cash | | | | | | |
| **Total** | 100% | =SUM | =SUM | | | |

**Flag positions exceeding rebalancing band (typically ±3–5%):**
```excel
=IF(ABS(Drift%)>=RebalancingBand, "⚠️ Rebalance", "✅ Within Band")
```

---

## Tab 2: Trade Recommendations

**Tax-Aware Rebalancing Rules (apply in this order):**

1. **Prefer tax-advantaged accounts first** (IRA, Roth, 401k) — no tax consequences
2. **In taxable accounts:** avoid selling positions with large short-term gains
3. **Harvest losses** in taxable accounts where possible while rebalancing
4. **Watch wash sale rules**: 30-day window before and after — no substantially identical securities
5. **Direct new contributions** to underweight asset classes instead of trading (most tax-efficient)

**Trade List:**

| Account | Account Type | Action | Security | Ticker | Shares / $ | Reason | Tax Impact |
|---------|-------------|--------|----------|--------|-----------|--------|------------|
| | Taxable / IRA / Roth | Buy / Sell | | | | Rebalance / TLH / Both | ST gain / LT gain / ST loss / LT loss / None |

**Prioritization:**
- First: rebalance within IRA/Roth/401k (no tax cost)
- Second: use new contributions/deposits for underweight classes
- Third: taxable account sells — only if drift is significant and tax cost is justified

---

## Tab 3: Asset Location Review

Optimal placement by account type:

| Asset Class | Best Account Type | Why |
|------------|-----------------|-----|
| Bonds / Fixed Income | Tax-Deferred (IRA, 401k) | Interest taxed at ordinary income — defer it |
| REITs | Tax-Deferred (IRA, 401k) | High dividend yield, ordinary income treatment |
| High-Turnover Funds | Tax-Deferred | Frequent distributions create drag in taxable |
| Highest-Growth Equities | Roth IRA | Tax-free growth on best performers |
| Tax-Efficient Index ETFs | Taxable | Low turnover, qualified dividends, TLH candidates |
| Municipal Bonds | Taxable | Already tax-exempt — wasted inside IRA |
| International Equities | Taxable | Foreign tax credit only available in taxable |

**Review table:**

| Security | Current Account | Recommended Account | Action Required |
|----------|----------------|---------------------|----------------|
| | | | Move / Keep / New purchases only |

---

## Tab 4: Tax Impact Summary

| Trade | Account | Security | Action | Holding Period | Cost Basis | Proceeds | Gain/(Loss) | Tax Rate | Est. Tax |
|-------|---------|----------|--------|----------------|-----------|----------|-------------|---------|---------|
| | Taxable | | Sell | ST / LT | | | | 37% / 20% | |

```
Total Realized Gains:       =SUMIF(Gain/Loss, ">0")
Total Realized Losses:      =SUMIF(Gain/Loss, "<0")
Net Realized Gain/(Loss):   =SUM
Estimated Total Tax:        =SUMPRODUCT(Gains, TaxRates)
```

**Breakeven analysis:**
- How many years of improved allocation return does it take to offset the tax cost?
- If breakeven >3 years, consider phasing the rebalance or waiting for lower-gain opportunities

---

## Important Notes

- **Don't rebalance for rebalancing's sake** — small drift within the band is fine; tax costs can outweigh benefits
- **Calculate the breakeven** before harvesting large gains in taxable accounts
- **Consider pending cash flows** (contributions, RMDs, withdrawals) — they may naturally rebalance
- **Check for client-specific restrictions** (ESG preferences, concentrated stock, lockup periods)
- **Wash sale rules apply across ALL accounts** — coordinate trades across the entire household
- **Document the rationale** for every trade for compliance records
