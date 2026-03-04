---
name: financial-plan
description: Build or update a comprehensive financial plan covering retirement projections, cash flow analysis, education funding, and estate planning in Excel. Use for new client onboarding, annual plan reviews, or scenario modeling. Triggers on "financial plan", "retirement plan", "can I retire", "retirement projections", "education funding", "estate plan", "cash flow analysis", or "plan update for [client]".
platform: excel
---

# Comprehensive Financial Plan

READ THIS ENTIRE FILE before building a financial plan.

## Step 1: Client Profile

Gather or confirm:

**Demographics:**
- Client age, spouse age, dependents, target life expectancy (default to 90)

**Employment & Income:**
- Current annual income (salary, bonus, self-employment)
- Expected raise rate per year
- Target retirement age

**Accounts & Assets:**
- All investment accounts with balances: 401k, IRA, Roth, taxable, savings
- Asset allocation for each account
- Real estate equity (home, investment properties)

**Income Sources in Retirement:**
- Social Security estimates at ages 62, 67, and 70 (run the 3 scenarios)
- Pension income (if any) — annual amount and start age
- Rental income

**Expenses:**
- Current annual spending
- Expected changes (mortgage payoff date, kids' independence, healthcare increases)
- Target retirement spending (often 70–80% of pre-retirement income)

**Liabilities:**
- Mortgage balance, rate, remaining years
- Student loans, other debt

**Insurance:**
- Life insurance face value
- Disability coverage
- Long-term care (in place or needed)

---

## Sheet Structure

1. **Dashboard** — plan summary with key outputs
2. **Cash Flow** — year-by-year projections through retirement
3. **Retirement** — accumulation through distribution, probability of success
4. **Education** — 529 funding analysis (if applicable)
5. **Estate** — estate value, tax exposure, gifting strategy
6. **Scenarios** — stress tests and what-if analysis
7. **Action Items** — prioritized recommendations

---

## Tab 2: Cash Flow Projections

Build annual projections from today through age 90+:

| Year | Age | Gross Income | Taxes | Living Expenses | Savings | Net Cash Flow | Portfolio Value |
|------|-----|-------------|-------|-----------------|---------|---------------|----------------|
| 2025 | 45 | | =Income*TaxRate | | =Income-Taxes-Expenses | | |
| 2026 | 46 | =prior*(1+raise) | | =prior*(1+inflation) | | | |
...

**Key inputs (Assumptions tab):**
```
Inflation rate:          2.5–3.0%
Salary raise rate:       2–3% (or 0% at retirement)
Investment return:       4–7% (varies by allocation, be conservative)
Tax rate (effective):    [input based on income]
```

---

## Tab 3: Retirement Projections

### Accumulation Phase

| Year | Age | Portfolio BOY | Contributions | Return (%) | Return ($) | Portfolio EOY |
|------|-----|--------------|--------------|-----------|-----------|--------------|
| | | | =401k+IRA+Taxable | | =Portfolio*ReturnRate | =BOY+Contrib+Return |

### Distribution Phase (Post-Retirement)

| Year | Age | Portfolio BOY | Withdrawals | SS Income | Pension | Return | Portfolio EOY |
|------|-----|--------------|-------------|-----------|---------|--------|--------------|
| | | | =(TargetSpend-SS-Pension) | =SSBenefit*(1+COLA)^yr | | | |

**Key outputs:**
```excel
Portfolio at Retirement:      [from accumulation table]
Sustainable Withdrawal Rate:  =AnnualWithdrawal / PortfolioAtRetirement
Years Portfolio Lasts:        =NPER(ReturnRate, -AnnualWithdrawal, PortfolioAtRetirement)
Age Portfolio Depleted:       =RetirementAge + YearsPortfolioLasts
```

**Probability of success (Monte Carlo approximation):**
- Run 3 scenarios: Base (avg return), Bear (-2% from avg), Bull (+2% from avg)
- If Bear case portfolio lasts to age 90, probability of success is high (>85%)

**Social Security timing sensitivity:**

| SS Start Age | Annual Benefit | Total Lifetime Benefit (to age 87) | Break-even vs. Age 62 |
|-------------|---------------|-----------------------------------|-----------------------|
| 62 | =FRA_benefit*0.70 | | |
| 67 (FRA) | =FRA_benefit | | |
| 70 | =FRA_benefit*1.24 | | |

Rule of thumb: Delay to 70 if healthy and portfolio can cover the gap — adds 24% permanently.

---

## Tab 4: Education Funding

| Child | Birth Year | College Start | Target ($) | Current 529 | Required Monthly Savings | On Track? |
|-------|-----------|--------------|-----------|------------|------------------------|-----------|
| | | =BirthYear+18 | | | =PMT(return/12, months, -current, target) | |

**Assumptions:**
- 4-year cost: In-state ~$120K, Private ~$300K (today's dollars)
- Inflation rate for college costs: 4–5%
- 529 return assumption: 5–7% (age-based allocation)

---

## Tab 5: Estate Planning

| Asset | Current Value | Growth Rate | Value at Death (age 90) |
|-------|--------------|-------------|------------------------|
| Investment Portfolio | | | |
| Primary Residence | | | |
| Other Real Estate | | | |
| Business / Other | | | |
| **Total Estate Value** | =SUM | | =SUM |

**Federal estate tax exposure:**
```excel
Federal Exemption (2025):      $13.61mm per person
Taxable Estate:                =MAX(0, TotalEstate - Exemption)
Estimated Federal Tax (40%):   =TaxableEstate * 0.40
Note: Check current law — exemption sunsets in 2026
```

**Gifting strategy:**
```
Annual Exclusion Per Recipient (2025): $18,000
Total Annual Gifting Capacity:         =RecipientCount * 18000
Lifetime Exemption Remaining:          =Exemption - PriorGifting
```

---

## Tab 6: Scenarios

| Scenario | Key Assumption | Probability | Portfolio at 90 | Action Required |
|----------|---------------|-------------|----------------|----------------|
| Base Case | 6% return, retire at 67 | | | |
| Retire 2 years early | Retire at 65 | | | |
| Market downturn year 1 | -25% in Year 1 of retirement | | | |
| Higher spending (+20%) | Lifestyle inflation | | | |
| One spouse lives to 95 | Extended longevity | | | |
| Long-term care event | $150K/yr for 3 years | | | |

---

## Tab 7: Prioritized Action Items

| Priority | Recommendation | Category | Timeline | Estimated Impact |
|----------|---------------|----------|----------|-----------------|
| 1 | Increase 401k contribution to max ($23,500) | Savings | This year | +$X to retirement |
| 2 | Open backdoor Roth IRA | Tax planning | This year | |
| 3 | Review life insurance coverage | Insurance | 90 days | |
| 4 | Update beneficiary designations | Estate | 30 days | |
| 5 | Consider Roth conversion | Tax | Before year-end | |

---

## Important Notes

- **Financial plans are living documents** — review annually or after major life events
- **Be conservative with return assumptions** — overestimating returns gives false confidence; use 5–6% for balanced portfolios
- **Tax planning is as important as investment returns** — model the tax impact of every major decision
- **Social Security timing is a major lever** — always model ages 62, 67, and 70 side-by-side
- **Always stress-test the plan** — a plan that only works in the base case isn't a good plan
- **LTC planning** — the cost of a 3-year LTC event ($400–600K) can devastate a retirement plan; address it early
- **Compliance:** ensure recommendations align with fiduciary standards and suitability requirements
