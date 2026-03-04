// AUTO-GENERATED — do not edit manually.
// Regenerate by running: node scripts/generate-default-skills.js

import type { SkillInput } from "./index";

export interface DefaultSkill {
  name: string;
  files: SkillInput[];
}

export const DEFAULT_SKILLS: DefaultSkill[] = [
  {
    name: "financial-models",
    files: [
      {
        path: "SKILL.md",
        data: `---
name: financial-models
description: Price European/American options using Black-Scholes, calculate Delta/Gamma/Theta/Vega/Rho Greeks, model derivatives with binomial trees, or verify put-call parity — with step-by-step Excel implementations
platform: excel
---

> **IMPORTANT**: READ THIS ENTIRE FILE before implementing any options or derivatives formulas. Do not rely on memory — follow the exact Excel formulas and cell layouts described here.

# Financial Models Skill — Options & Derivatives in Excel

## 1. Black-Scholes Option Pricing

### Assumptions
- European option (exercise only at expiry)
- Underlying follows lognormal GBM with constant σ
- Continuous risk-free rate r, no dividends (use dividend-adjusted version for dividend-paying stocks)
- No transaction costs

### Parameters
| Symbol | Meaning | Typical input |
|--------|---------|---------------|
| S | Current stock price | market price |
| K | Strike price | contract spec |
| T | Time to expiry (years) | days/365 |
| r | Risk-free rate (annual, continuous) | 0.05 for 5% |
| σ | Volatility (annual) | 0.20 for 20% |

### Formulas
\`\`\`
d1 = (LN(S/K) + (r + σ²/2) × T) / (σ × √T)
d2 = d1 − σ × √T

Call = S × N(d1) − K × e^(−rT) × N(d2)
Put  = K × e^(−rT) × N(−d2) − S × N(−d1)
\`\`\`
where N(·) is the cumulative standard normal CDF.

### Excel Cell-by-Cell Layout

Place inputs in column B, rows 2-6:

| Cell | Label (col A) | Formula (col B) |
|------|--------------|-----------------|
| A2 | S (Stock Price) | *(input, e.g. 100)* |
| A3 | K (Strike) | *(input, e.g. 105)* |
| A4 | T (Years) | *(input, e.g. 1)* |
| A5 | r (Risk-free rate) | *(input, e.g. 0.05)* |
| A6 | σ (Volatility) | *(input, e.g. 0.20)* |
| A8 | d1 | \`=(LN(B2/B3)+(B5+B6^2/2)*B4)/(B6*SQRT(B4))\` |
| A9 | d2 | \`=B8-B6*SQRT(B4)\` |
| A11 | Call Price | \`=B2*NORM.S.DIST(B8,TRUE)-B3*EXP(-B5*B4)*NORM.S.DIST(B9,TRUE)\` |
| A12 | Put Price | \`=B3*EXP(-B5*B4)*NORM.S.DIST(-B9,TRUE)-B2*NORM.S.DIST(-B8,TRUE)\` |

**Verification** (S=100, K=105, r=5%, σ=20%, T=1):
- d1 ≈ 0.0940, d2 ≈ −0.1060
- Call ≈ 8.02, Put ≈ 7.90

---

## 2. Greeks

Greeks measure option price sensitivity. All formulas assume same S, K, T, r, σ inputs as above.

### Delta (Δ) — Price sensitivity to underlying
\`\`\`
Call Delta = N(d1)
Put Delta  = N(d1) − 1
\`\`\`
Excel:
\`\`\`excel
Call Delta: =NORM.S.DIST(d1_cell, TRUE)
Put Delta:  =NORM.S.DIST(d1_cell, TRUE) - 1
\`\`\`

### Gamma (Γ) — Delta sensitivity to underlying (same for calls and puts)
\`\`\`
Gamma = N'(d1) / (S × σ × √T)
\`\`\`
where N'(x) = standard normal PDF = e^(-x²/2) / √(2π)

Excel:
\`\`\`excel
=NORM.S.DIST(d1_cell, FALSE) / (B2 * B6 * SQRT(B4))
\`\`\`
Note: \`NORM.S.DIST(x, FALSE)\` returns the PDF, \`TRUE\` returns the CDF.

### Theta (Θ) — Price decay per calendar day
\`\`\`
Call Theta = [−S × N'(d1) × σ / (2√T) − r × K × e^(−rT) × N(d2)] / 365
Put Theta  = [−S × N'(d1) × σ / (2√T) + r × K × e^(−rT) × N(−d2)] / 365
\`\`\`
Excel (call):
\`\`\`excel
=(-B2*NORM.S.DIST(B8,FALSE)*B6/(2*SQRT(B4)) - B5*B3*EXP(-B5*B4)*NORM.S.DIST(B9,TRUE)) / 365
\`\`\`
Excel (put):
\`\`\`excel
=(-B2*NORM.S.DIST(B8,FALSE)*B6/(2*SQRT(B4)) + B5*B3*EXP(-B5*B4)*NORM.S.DIST(-B9,TRUE)) / 365
\`\`\`

### Vega (ν) — Price sensitivity to volatility (1% move in σ)
\`\`\`
Vega = S × N'(d1) × √T / 100
\`\`\`
Excel:
\`\`\`excel
=B2 * NORM.S.DIST(B8,FALSE) * SQRT(B4) / 100
\`\`\`
(Divide by 100 to express per 1% volatility move)

### Rho (ρ) — Price sensitivity to interest rate (1% move in r)
\`\`\`
Call Rho = K × T × e^(−rT) × N(d2) / 100
Put Rho  = −K × T × e^(−rT) × N(−d2) / 100
\`\`\`
Excel (call):
\`\`\`excel
=B3 * B4 * EXP(-B5*B4) * NORM.S.DIST(B9,TRUE) / 100
\`\`\`
Excel (put):
\`\`\`excel
=-B3 * B4 * EXP(-B5*B4) * NORM.S.DIST(-B9,TRUE) / 100
\`\`\`

### Greeks Summary Table Layout

| Row | A | B (Call) | C (Put) |
|-----|---|----------|---------|
| 15 | Delta | \`=NORM.S.DIST(B8,TRUE)\` | \`=NORM.S.DIST(B8,TRUE)-1\` |
| 16 | Gamma | \`=NORM.S.DIST(B8,FALSE)/(B2*B6*SQRT(B4))\` | *(same as call)* |
| 17 | Theta | *(call formula above)* | *(put formula above)* |
| 18 | Vega | \`=B2*NORM.S.DIST(B8,FALSE)*SQRT(B4)/100\` | *(same as call)* |
| 19 | Rho | \`=B3*B4*EXP(-B5*B4)*NORM.S.DIST(B9,TRUE)/100\` | \`=-B3*B4*EXP(-B5*B4)*NORM.S.DIST(-B9,TRUE)/100\` |

**Verification** (S=100, K=105, r=5%, σ=20%, T=1):
- Call Delta ≈ 0.537, Put Delta ≈ −0.463
- Gamma ≈ 0.0188 (both)
- Call Theta ≈ −0.0152/day, Put Theta ≈ −0.0103/day
- Vega ≈ 0.375 (per 1% vol)
- Call Rho ≈ 0.467, Put Rho ≈ −0.533

---

## 3. Put-Call Parity

\`\`\`
Call − Put = S − K × e^(−rT)
\`\`\`

Use as arbitrage check. In Excel:
\`\`\`excel
=B11 - B12 - (B2 - B3*EXP(-B5*B4))
\`\`\`
This should equal zero (within floating-point tolerance ~1e-10). If non-zero, the model has an error.

---

## 4. Binomial Tree (Single-Step)

### Risk-Neutral Parameters
\`\`\`
u = e^(σ√Δt)          (up factor)
d = 1/u = e^(−σ√Δt)   (down factor)
p = (e^(rΔt) − d) / (u − d)   (risk-neutral up probability)
\`\`\`

### Option Value
\`\`\`
S_u = S × u    (up state price)
S_d = S × d    (down state price)
C_u = max(S_u − K, 0)   (call payoff up)
C_d = max(S_d − K, 0)   (call payoff down)
C = e^(−rΔt) × (p × C_u + (1−p) × C_d)
\`\`\`

### Excel Layout (Δt = T, single step)

| Cell | Formula |
|------|---------|
| B20 | \`=EXP(B6*SQRT(B4))\` → u |
| B21 | \`=1/B20\` → d |
| B22 | \`=(EXP(B5*B4)-B21)/(B20-B21)\` → p |
| B23 | \`=B2*B20\` → S_u |
| B24 | \`=B2*B21\` → S_d |
| B25 | \`=MAX(B23-B3,0)\` → C_u (call) |
| B26 | \`=MAX(B24-B3,0)\` → C_d (call) |
| B27 | \`=EXP(-B5*B4)*(B22*B25+(1-B22)*B26)\` → Binomial call price |

For multi-step trees, extend by iterating backward from expiry nodes.

---

## 5. Implied Volatility (Newton-Raphson)

Given a market price P_mkt, find σ such that BS(σ) = P_mkt.

### Newton-Raphson iteration
\`\`\`
σ_new = σ_old − (BS(σ_old) − P_mkt) / Vega(σ_old)
\`\`\`
Repeat until |σ_new − σ_old| < 0.0001.

### Excel Approach
Use Goal Seek or Solver:
1. Put initial σ guess in B6 (e.g. 0.25)
2. Cell B11 has the BS call price formula
3. Target market price in B30
4. **Data → What-If Analysis → Goal Seek**: Set B11 to value in B30 by changing B6

For batch IV across a chain: use Solver with multiple target cells, or an iterative VBA macro.

---

## 6. Common Pitfalls

| Pitfall | How to Avoid |
|---------|-------------|
| Annualizing volatility | Daily σ × √252 for annual (NOT ×252). Use \`=daily_vol*SQRT(252)\` |
| Day count for T | Use actual/365 for equity options: \`=DAYS(expiry,today)/365\` |
| r must be continuous | If using discrete rate r_d, convert: \`r = LN(1+r_d)\` |
| Dividend-paying stocks | Replace S with S×e^(−q×T) where q = continuous dividend yield |
| N() function in Excel | Use \`NORM.S.DIST(x, TRUE)\` for CDF, \`NORM.S.DIST(x, FALSE)\` for PDF |
| Deep ITM/OTM precision | Excel handles this correctly; no special treatment needed |

---

## Reference Examples

- \`examples/black-scholes.md\` — Complete worked example: pricing a call and put with full cell map
- \`examples/greeks.md\` — Greeks dashboard with sensitivity analysis table
- \`examples/binomial-tree.md\` — Multi-step binomial tree (10 steps) with backward induction
`,
      },
      {
        path: "examples/binomial-tree.md",
        data: `# Example: Binomial Tree (10-Step American Put)

## Scenario
American put option (early exercise possible):
- S = 50, K = 52, T = 0.5 (6 months), r = 0.05, σ = 0.30
- N = 10 steps, Δt = 0.05

## Parameters

| Cell | Label | Formula / Value |
|------|-------|-----------------|
| B2 | S | 50 |
| B3 | K | 52 |
| B4 | T | 0.5 |
| B5 | r | 0.05 |
| B6 | σ | 0.30 |
| B7 | N (steps) | 10 |
| B8 | Δt | \`=B4/B7\` → 0.05 |
| B9 | u | \`=EXP(B6*SQRT(B8))\` → 1.0690 |
| B10 | d | \`=1/B9\` → 0.9355 |
| B11 | p | \`=(EXP(B5*B8)-B10)/(B9-B10)\` → 0.5126 |
| B12 | Discount | \`=EXP(-B5*B8)\` → 0.9975 |

## Tree Structure in Excel

Place node (step i, j up-moves) at row \`(12+j)\`, column \`(2+i)\` (column B = step 0):

### Stock Price Tree

**Step 0** (column B):
- B12: \`=$B$2\` → 50

**Step 1** (column C):
- C12: \`=B12*$B$10\` → 46.77 (down)
- C13: \`=B12*$B$9\` → 53.45 (up)

**Step 2** (column D):
- D12: \`=C12*$B$10\` → 43.74
- D13: \`=C12*$B$9\` (= \`=C13*$B$10\`) → 50.00 (recombining)
- D14: \`=C13*$B$9\` → 57.10

General pattern at column \`COL\`, row \`ROW\`:
\`\`\`excel
= LEFT_DOWN_CELL * $B$10    (down move)
= LEFT_UP_CELL * $B$9       (up move)
\`\`\`
The tree recombines: u × d = 1, so S×u×d = S.

### Terminal Payoffs (column L = step 10, rows 12 to 22)
For American put: \`=MAX($B$3 - L12, 0)\` through \`=MAX($B$3 - L22, 0)\`

### Backward Induction (columns K through B)

At each non-terminal node, American put = MAX(intrinsic, continuation):
\`\`\`excel
=MAX($B$3 - K12, $B$12*($B$11*L13 + (1-$B$11)*L12))
\`\`\`
Where:
- \`$B$3 - K12\` = early exercise value (put intrinsic)
- \`$B$12*(...)\` = risk-neutral discounted continuation value

Copy this backward from column K to column B, adjusting references.

### Node at B12 (Step 0) = Option Price
\`\`\`excel
=MAX($B$3-B12, $B$12*($B$11*C13+(1-$B$11)*C12))
\`\`\`

## Expected Result
- American put price ≈ **$4.49**
- European put (no early exercise) ≈ $4.28
- Early exercise premium ≈ $0.21

## Identifying Early Exercise Nodes
In the backward induction step, flag cells where early exercise is optimal:
\`\`\`excel
=IF(MAX_INTRINSIC > CONTINUATION, "EXERCISE", "HOLD")
\`\`\`
Early exercise is most likely for deep in-the-money nodes near expiry, especially when dividends or high interest rates are present.

## Extending to Calls
For an American call on a non-dividend-paying stock, early exercise is **never optimal** — the binomial price will equal the Black-Scholes European call price. This is a useful sanity check.
`,
      },
      {
        path: "examples/black-scholes.md",
        data: `# Example: Black-Scholes Call & Put Pricing

## Scenario
Price a European call and put on AAPL:
- S = 175 (current price)
- K = 180 (strike)
- T = 0.25 (3 months)
- r = 0.053 (5.3% risk-free rate)
- σ = 0.28 (28% implied volatility)

## Complete Excel Layout

| Cell | Label | Value / Formula |
|------|-------|-----------------|
| A2 | S — Stock Price | \`175\` |
| A3 | K — Strike | \`180\` |
| A4 | T — Years to Expiry | \`0.25\` |
| A5 | r — Risk-free Rate | \`0.053\` |
| A6 | σ — Volatility | \`0.28\` |
| A8 | d1 | \`=(LN(A2/A3)+(A5+A6^2/2)*A4)/(A6*SQRT(A4))\` |
| A9 | d2 | \`=A8-A6*SQRT(A4)\` |
| A11 | **Call Price** | \`=A2*NORM.S.DIST(A8,TRUE)-A3*EXP(-A5*A4)*NORM.S.DIST(A9,TRUE)\` |
| A12 | **Put Price** | \`=A3*EXP(-A5*A4)*NORM.S.DIST(-A9,TRUE)-A2*NORM.S.DIST(-A8,TRUE)\` |
| A14 | Put-Call Parity Check | \`=A11-A12-(A2-A3*EXP(-A5*A4))\` |

## Expected Output
- d1 ≈ −0.1211
- d2 ≈ −0.2611
- **Call ≈ $10.06**
- **Put ≈ $12.73**
- Parity check ≈ 0.000 ✓

## Sensitivity: How Price Changes with Spot

Create a data table in column D:

| D | E |
|---|---|
| Spot | Call Price |
| \`=A2\` (ref cell, hide row) | \`=A11\` |
| 155 | |
| 160 | |
| 165 | |
| 170 | |
| 175 | |
| 180 | |
| 185 | |
| 190 | |
| 195 | |
| 200 | |

Select D1:E11, go to **Data → What-If Analysis → Data Table**, set Column input cell to A2. Excel auto-populates all call prices.
`,
      },
      {
        path: "examples/greeks.md",
        data: `# Example: Greeks Dashboard

## Scenario
Greeks for a near-the-money call option:
- S = 100, K = 100, T = 0.5 (6 months), r = 0.04, σ = 0.25

## Layout (extend from SKILL.md base layout)

Assumes d1 in B8, d2 in B9 from the standard pricer layout.

| Cell | Greek | Formula | Expected Value |
|------|-------|---------|----------------|
| D2 | Call Delta | \`=NORM.S.DIST(B8,TRUE)\` | ≈ 0.560 |
| D3 | Put Delta | \`=NORM.S.DIST(B8,TRUE)-1\` | ≈ −0.440 |
| D4 | Gamma | \`=NORM.S.DIST(B8,FALSE)/(B2*B6*SQRT(B4))\` | ≈ 0.0225 |
| D5 | Call Theta/day | \`=(-B2*NORM.S.DIST(B8,FALSE)*B6/(2*SQRT(B4))-B5*B3*EXP(-B5*B4)*NORM.S.DIST(B9,TRUE))/365\` | ≈ −0.0180 |
| D6 | Vega (per 1%) | \`=B2*NORM.S.DIST(B8,FALSE)*SQRT(B4)/100\` | ≈ 0.281 |
| D7 | Call Rho (per 1%) | \`=B3*B4*EXP(-B5*B4)*NORM.S.DIST(B9,TRUE)/100\` | ≈ 0.258 |

## Interpretation Guide

- **Delta 0.560**: For every $1 the stock rises, the call gains ~$0.56
- **Gamma 0.0225**: Delta itself increases by 0.0225 per $1 stock move (acceleration)
- **Theta −$0.018/day**: The option loses ~1.8 cents of time value per calendar day
- **Vega $0.281**: If vol rises from 25% to 26%, the call gains ~$0.28
- **Rho $0.258**: If rates rise from 4% to 5%, the call gains ~$0.26

## Delta-Hedging Check
To delta-hedge 100 short calls, go long \`100 × Delta × 100 shares = 5,600 shares\`.
This neutralizes small moves in S but requires rebalancing as Delta changes.

## Sensitivity Table: Greeks vs Spot Price

Data table varying S from 80 to 120 in steps of 5:

| Spot | Call Price | Delta | Gamma |
|------|-----------|-------|-------|
| 80 | ≈ 0.62 | 0.164 | 0.0158 |
| 85 | ≈ 1.62 | 0.269 | 0.0215 |
| 90 | ≈ 3.48 | 0.394 | 0.0241 |
| 95 | ≈ 6.31 | 0.511 | 0.0237 |
| **100** | **≈ 9.95** | **0.560** | **0.0225** |
| 105 | ≈ 14.44 | 0.641 | 0.0202 |
| 110 | ≈ 19.65 | 0.714 | 0.0172 |
| 115 | ≈ 25.41 | 0.778 | 0.0140 |
| 120 | ≈ 31.57 | 0.832 | 0.0109 |

Create using Data → Data Table with B2 as column input cell.
`,
      },
    ],
  },
  {
    name: "fixed-income",
    files: [
      {
        path: "SKILL.md",
        data: `---
name: fixed-income
description: Price bonds, calculate yield-to-maturity with RATE/YIELD functions, compute Macaulay/modified duration and convexity, bootstrap spot rate curves, or analyze fixed income securities in Excel
platform: excel
---

> **IMPORTANT**: READ THIS ENTIRE FILE before implementing any bond pricing or fixed income calculations. Do not rely on memory — follow the exact Excel formulas described here.

# Fixed Income Skill — Bond Pricing, Duration, Convexity, Yield Curves

## 1. Bond Pricing

A bond's price is the present value of all future cash flows discounted at YTM (y):

\`\`\`
Price = Σ [C / (1+y/m)^t] + F / (1+y/m)^(m×T)
\`\`\`

Where:
- C = periodic coupon = (coupon rate × F) / m
- F = face value (par, typically 1000)
- y = annual YTM
- m = coupon frequency per year (2 for semi-annual, 1 for annual)
- T = years to maturity

### Excel PV Function
\`\`\`excel
=PV(rate, nper, pmt, fv)
\`\`\`
- \`rate\` = y/m (yield per period)
- \`nper\` = m×T (total periods)
- \`pmt\` = −C (coupon per period, negative because it's a cash inflow)
- \`fv\` = −F (face value, negative)

**Example**: 5-year bond, 4% semi-annual coupon, F=1000, YTM=3.5%:
\`\`\`excel
=PV(0.035/2, 5*2, -1000*0.04/2, -1000)
\`\`\`
Result: ≈ **$1,022.88** (premium bond since coupon > YTM)

### Cell-by-Cell Layout

| Cell | Label | Value/Formula |
|------|-------|---------------|
| B2 | Face Value | 1000 |
| B3 | Coupon Rate (annual) | 0.04 |
| B4 | YTM (annual) | 0.035 |
| B5 | Maturity (years) | 5 |
| B6 | Frequency (m) | 2 |
| B7 | Coupon Payment | \`=B2*B3/B6\` → 20 |
| B8 | Periods | \`=B5*B6\` → 10 |
| B9 | Period Rate | \`=B4/B6\` → 0.0175 |
| B10 | **Bond Price** | \`=PV(B9, B8, -B7, -B2)\` → 1022.88 |

### Excel PRICE Function (day-count aware)
For real settlement/maturity dates with actual/actual or 30/360:
\`\`\`excel
=PRICE(settlement, maturity, rate, yld, redemption, frequency, [basis])
\`\`\`
- \`settlement\`: settlement date (e.g. TODAY())
- \`maturity\`: maturity date
- \`rate\`: annual coupon rate
- \`yld\`: annual YTM
- \`redemption\`: 100 (per $100 face)
- \`frequency\`: 2 for semi-annual
- \`basis\`: 0=US 30/360, 1=actual/actual, 2=actual/360, 3=actual/365

Example:
\`\`\`excel
=PRICE(DATE(2024,1,15), DATE(2029,1,15), 0.04, 0.035, 100, 2, 0)
\`\`\`

---

## 2. Yield to Maturity (YTM)

YTM = the discount rate y that makes bond price = PV of cash flows.

### Excel RATE Function
\`\`\`excel
=RATE(nper, pmt, pv, [fv]) × m
\`\`\`
- \`nper\` = m×T
- \`pmt\` = coupon per period (positive, cash received)
- \`pv\` = −Price (negative, cash paid)
- \`fv\` = F (face value at maturity)
- Multiply result by m to annualize

**Example**: Bond trading at $980, 4% semi-annual coupon, 5 years to maturity, F=1000:
\`\`\`excel
=RATE(10, 20, -980, 1000) * 2
\`\`\`
Result: ≈ **4.41%** annualized YTM

### Cell map for YTM
| Cell | Formula |
|------|---------|
| B12 | Market Price = 980 |
| B13 | YTM = \`=RATE(B8, B7, -B12, B2) * B6\` |

### Excel YIELD Function (date-based)
\`\`\`excel
=YIELD(settlement, maturity, rate, pr, redemption, frequency, [basis])
\`\`\`
- \`pr\` = dirty price per $100 face
- Returns annual YTM respecting day counts

---

## 3. Macaulay Duration

Duration = weighted average time to receive cash flows (in years):

\`\`\`
MacD = Σ [t × CF_t / (1+y/m)^t] / Price
\`\`\`
where t is in periods, then divide by m to convert to years.

### Excel DURATION Function
\`\`\`excel
=DURATION(settlement, maturity, coupon, yld, frequency, [basis])
\`\`\`
Returns Macaulay duration in years.

Example (same bond as above, settlement=today):
\`\`\`excel
=DURATION(DATE(2024,1,15), DATE(2029,1,15), 0.04, 0.035, 2, 0)
\`\`\`
Result: ≈ **4.55 years**

### Manual Calculation (without dates)

| Cell | Formula | Description |
|------|---------|-------------|
| A15:A24 | 1,2,...,10 | Period numbers |
| B15:B24 | \`=$B$7\` (periods 1-9), \`=$B$7+$B$2\` (period 10) | Cash flows |
| C15 | \`=B15/(1+$B$9)^A15\` | PV of cash flow |
| D15 | \`=A15*C15\` | t × PV(CF) |
| B26 | \`=SUM(C15:C24)\` | Verify = Price |
| B27 | \`=SUM(D15:D24)/B26/B6\` | **Macaulay Duration (years)** |

---

## 4. Modified Duration

\`\`\`
ModD = MacD / (1 + y/m)
\`\`\`

Price sensitivity: a 1bp (0.01%) rise in yield reduces price by approximately ModD × Price × 0.0001.

Excel:
\`\`\`excel
=B27 / (1 + B9)
\`\`\`
Or directly:
\`\`\`excel
=MDURATION(settlement, maturity, coupon, yld, frequency, [basis])
\`\`\`

**Interpretation**: ModD = 4.47 means a 100bp yield increase → price falls ≈ 4.47%.

Dollar Duration (DV01):
\`\`\`excel
= ModD × Price / 10000
\`\`\`
This is the dollar price change per 1bp yield change.

---

## 5. Convexity

Convexity captures the curvature in the price-yield relationship (second-order correction):

\`\`\`
Convexity = Σ [t(t+1) × CF_t / (1+y/m)^(t+2)] / (Price × m²)
\`\`\`

### Excel Manual Calculation

Extending the layout from section 3:
| Cell | Formula | Description |
|------|---------|-------------|
| E15 | \`=A15*(A15+1)*C15/(1+$B$9)^2\` | t(t+1) × PV(CF) / (1+y/m)² |
| B28 | \`=SUM(E15:E24)/(B26*B6^2)\` | **Convexity (in years²)** |

### Price Change Approximation

Full price change for a yield move of Δy:
\`\`\`
ΔP/P ≈ −ModD × Δy + ½ × Convexity × (Δy)²
\`\`\`

Excel (with Δy in B30):
\`\`\`excel
= B10 * (-B28_mod * B30 + 0.5 * B28_conv * B30^2)
\`\`\`

Example: ModD=4.47, Convexity=23.5, Price=1022.88, Δy=+1% (=0.01):
- Duration term: −4.47 × 0.01 = −4.47%
- Convexity term: +0.5 × 23.5 × 0.0001 = +0.12%
- Total ≈ −4.35% → New price ≈ $978.40

---

## 6. Yield Curve Bootstrapping

Extract spot rates from coupon bond prices to build a zero-coupon curve.

### Concept
A 2-year 5% annual coupon bond (price = $1020) implies:
\`\`\`
1020 = 50/(1+s₁) + 1050/(1+s₂)²
\`\`\`
If s₁ is known from a 1-year zero bond, solve for s₂.

### Excel Layout

| Col A | Col B | Col C | Col D |
|-------|-------|-------|-------|
| Maturity | Coupon Rate | Bond Price | Spot Rate |
| 1 | 0% | 950 | \`=1000/B2-1\` → s₁=5.26% |
| 2 | 5% | 1020 | *bootstrapped* |
| 3 | 5% | 1035 | *bootstrapped* |

For D3 (2-year spot rate s₂), solve:
\`\`\`
B3 = 0.05×1000/(1+D2) + 1050/(1+D3)²
\`\`\`
Excel Goal Seek: Set B3=1020, change D3. Or rearrange:
\`\`\`excel
=((B3 - 50/(1+D2)) / 1050)^(-1/2) - 1
\`\`\`

For longer maturities, bootstrap iteratively — each new spot rate uses all previously derived rates.

### Linear Interpolation Between Tenors
For a tenor not in your curve (e.g. 2.5 years given 2Y and 3Y spots):
\`\`\`excel
= s2 + (s3 - s2) * (2.5 - 2) / (3 - 2)
\`\`\`

---

## Common Pitfalls

| Issue | Solution |
|-------|----------|
| RATE returns wrong sign | Remember: \`pv\` is negative (you pay), \`fv\` is positive (you receive par) |
| PRICE/YIELD errors | Dates must be valid; settlement must be before maturity |
| Duration > maturity | Impossible — check coupon payments are positive in PV formula |
| Convexity is negative | Error in formula — convexity is always positive for plain vanilla bonds |
| YTM vs current yield confusion | YTM accounts for capital gain/loss; current yield = coupon/price only |
| Semi-annual to annual conversion | RATE×2 (not (1+RATE)²−1) for bond market convention |

---

## Reference Examples

- \`examples/bond-pricing.md\` — Complete bond pricing with cash flow table and sensitivity analysis
- \`examples/duration-convexity.md\` — Duration/convexity ladder for a 3-bond portfolio with DV01 hedging
`,
      },
      {
        path: "examples/bond-pricing.md",
        data: `# Example: Bond Pricing with Cash Flow Table

## Scenario
Price a 10-year US Treasury note:
- Face value: $1,000
- Coupon rate: 4.5% semi-annual
- YTM: 4.0%
- Issue: bond should trade at a **premium** (coupon > YTM)

## Complete Excel Layout

### Parameters (B2:B9)
| Cell | Label | Value |
|------|-------|-------|
| B2 | Face Value | 1000 |
| B3 | Coupon Rate | 0.045 |
| B4 | YTM | 0.040 |
| B5 | Maturity (years) | 10 |
| B6 | Frequency | 2 |
| B7 | Coupon/period | \`=B2*B3/B6\` → 22.50 |
| B8 | Total periods | \`=B5*B6\` → 20 |
| B9 | Period yield | \`=B4/B6\` → 0.02 |

### Price Formula
- B10: \`=PV(B9, B8, -B7, -B2)\` → **$1,040.55**

### Cash Flow Table (A13:D33)

| Cell | Period | Cash Flow | PV of CF | Cumulative PV |
|------|--------|-----------|----------|---------------|
| A13 | 1 | \`=$B$7\` | \`=C13/(1+$B$9)^A13\` | \`=D13\` |
| A14 | 2 | \`=$B$7\` | (same pattern) | \`=E13+D14\` |
| ... | ... | ... | ... | ... |
| A32 | 20 | \`=$B$7+$B$2\` | \`=C32/(1+$B$9)^A32\` | |

Build this by:
1. A13: \`=1\`, A14: \`=A13+1\`, copy down to A32
2. C13: \`=$B$7\`, C14-C31 same, C32: \`=$B$7+$B$2\`
3. D13: \`=C13/(1+$B$9)^A13\`, copy down to D32
4. E13: \`=D13\`, E14: \`=E13+D14\`, copy to E32

**Verify**: SUM(D13:D32) should equal B10 = $1,040.55 ✓

### Key Output Row (B34:B37)
| Cell | Label | Formula | Value |
|------|-------|---------|-------|
| B34 | PV of Coupons | \`=SUM(D13:D31)\` | $364.51 |
| B35 | PV of Par | \`=D32\` | $676.04 |
| B36 | Total Price | \`=B34+B35\` | $1,040.55 |
| B37 | Premium | \`=B36-B2\` | $40.55 |

## Price Sensitivity Table

Vary YTM from 2% to 6% in a one-variable data table:

| F | G |
|---|---|
| YTM | Price |
| 0.02 | \`=B10\` (formula reference) |
| 0.025 | |
| 0.03 | |
| 0.035 | |
| 0.04 | |
| 0.045 | |
| 0.05 | |
| 0.055 | |
| 0.06 | |

Select F:G data range, Data → What-If Analysis → Data Table, Column input cell = B4.

| YTM | Price | Change from 4% |
|-----|-------|----------------|
| 2.0% | $1,218.15 | +$177.60 |
| 3.0% | $1,125.51 | +$84.96 |
| 3.5% | $1,082.02 | +$41.47 |
| **4.0%** | **$1,040.55** | 0 |
| 4.5% | $1,000.00 | −$40.55 |
| 5.0% | $961.39 | −$79.16 |
| 6.0% | $889.60 | −$150.95 |

Note the **asymmetry**: price rise from 4%→2% (+$177.60) > price fall from 4%→6% (−$150.95).
This asymmetry is convexity at work.
`,
      },
      {
        path: "examples/duration-convexity.md",
        data: `# Example: Duration, Convexity & DV01 for a Bond Portfolio

## Portfolio
Three bonds with different maturities — typical ladder structure:

| Bond | Coupon | Maturity | YTM | Price |
|------|--------|----------|-----|-------|
| 2-Year | 3.0% semi-annual | 2 years | 3.5% | $990.58 |
| 5-Year | 4.0% semi-annual | 5 years | 4.2% | $991.21 |
| 10-Year | 4.5% semi-annual | 10 years | 4.8% | $972.41 |

## Excel Layout

### Bond Parameters (one block per bond)

**Bond 1 (rows 2-9)**:
| Cell | Value |
|------|-------|
| B2 | 1000 (face) |
| B3 | 0.030 (coupon rate) |
| B4 | 0.035 (YTM) |
| B5 | 2 (years) |
| B6 | 2 (freq) |
| B7 | \`=B2*B3/B6\` → 15 |
| B8 | \`=B5*B6\` → 4 |
| B9 | \`=B4/B6\` → 0.0175 |
| B10 | Price: \`=PV(B9,B8,-B7,-B2)\` → 990.58 |
| B11 | MacD: \`=DURATION(DATE(2024,1,1),DATE(2026,1,1),B3,B4,B6,0)\` → 1.944 yr |
| B12 | ModD: \`=MDURATION(DATE(2024,1,1),DATE(2026,1,1),B3,B4,B6,0)\` → 1.910 yr |
| B13 | DV01: \`=B12*B10/10000\` → $0.189/bond |

Repeat for Bond 2 (columns D-F) and Bond 3 (columns H-J) with appropriate dates/params.

**Expected Values**:
| Metric | Bond 1 (2Y) | Bond 2 (5Y) | Bond 3 (10Y) |
|--------|-------------|-------------|--------------|
| Price | $990.58 | $991.21 | $972.41 |
| Macaulay Duration | 1.944 yr | 4.512 yr | 8.226 yr |
| Modified Duration | 1.910 yr | 4.419 yr | 8.034 yr |
| DV01 (per bond) | $0.189 | $0.438 | $0.781 |

### Convexity (Manual — Bond 3 example)

For 10-year bond: periods 1-20 in column A, cash flows in B, compute:

| Col | Formula | Header |
|-----|---------|--------|
| A | 1 to 20 | Period t |
| B | =22.50 (rows 1-19), =1022.50 (row 20) | CF |
| C | \`=B/(1+0.024)^A\` | PV(CF) |
| D | \`=A*(A+1)*C/(1+0.024)^2\` | t(t+1)×PV(CF)/(1+y)² |

Convexity = SUM(D) / (Price × m²) = SUM(D) / (972.41 × 4) ≈ **78.5**

### Portfolio Summary (rows 20-26)

Assume holding 10 bonds of each:

| Cell | Label | Formula | Value |
|------|-------|---------|-------|
| B20 | Face per bond | 1000 | |
| B21 | Holdings | 10 | |
| B22 | Portfolio Value | \`=10*(B10+D10+H10)\` | $29,542 |
| B23 | Portfolio DV01 | \`=10*(B13+D13+H13)\` | $14.08/bp |
| B24 | Weighted ModD | \`=(B10*B12+D10*D12+H10*H12)/(B10+D10+H10)\` | 4.788 yr |
| B25 | Portfolio Convexity | \`=(B10*B15+D10*D15+H10*H15)/(B10+D10+H10)\` | ≈ 32.1 |

### DV01 Hedging Example

To hedge the 10-year bond position (DV01 = $7.81 for 10 bonds) using the 2-year:
\`\`\`
Hedge ratio = DV01_10Y / DV01_2Y = 7.81 / 1.89 ≈ 4.13
\`\`\`
→ Short 41.3 units of the 2-year bond per 10 units of 10-year bond.

Excel:
\`\`\`excel
= H13*B21 / B13
\`\`\`

## Price Change Simulation

For a parallel shift of +50bp in all yields (Δy = 0.005):

| Bond | ModD | Conv | ΔP (approx) | ΔP (actual) |
|------|------|------|-------------|-------------|
| 2Y | 1.910 | 3.8 | −$9.46 | −$9.44 |
| 5Y | 4.419 | 21.6 | −$21.87 | −$21.81 |
| 10Y | 8.034 | 78.5 | −$38.96 | −$38.71 |

Excel for approximation:
\`\`\`excel
= -ModD * Price * 0.005 + 0.5 * Convexity * Price * 0.005^2
\`\`\`

Higher convexity = less actual loss than duration predicts (convexity cushion).
`,
      },
    ],
  },
  {
    name: "monte-carlo-simulation",
    files: [
      {
        path: "SKILL.md",
        data: `---
name: monte-carlo-simulation
description: Run Monte Carlo simulations for stock price forecasting (GBM), option pricing, or portfolio risk (VaR/CVaR) using Excel NORM.S.INV/RAND formulas or bash scripts for large simulation runs
platform: excel
---

> **IMPORTANT**: READ THIS ENTIRE FILE before implementing any Monte Carlo simulation. Follow the exact formulas and Excel layouts described here.

# Monte Carlo Simulation Skill — GBM, VaR/CVaR, Option Pricing

## 1. Geometric Brownian Motion (GBM)

### Model
A stock price follows GBM:
\`\`\`
dS = μ·S·dt + σ·S·dW
\`\`\`
Discretized over time step Δt:
\`\`\`
S(t+Δt) = S(t) × exp((μ − σ²/2)·Δt + σ·√Δt·Z)
\`\`\`
where Z ~ N(0,1) is a standard normal draw.

### Parameters
| Symbol | Meaning |
|--------|---------|
| S₀ | Initial stock price |
| μ | Drift (expected annual return, e.g. 0.08 for 8%) |
| σ | Annual volatility (e.g. 0.25 for 25%) |
| T | Horizon in years |
| N | Number of time steps |
| M | Number of simulation paths |

### Key Formula
\`\`\`
Δt = T / N
S_next = S_prev × EXP((μ − σ²/2)×Δt + σ×SQRT(Δt)×NORM.S.INV(RAND()))
\`\`\`

---

## 2. Excel Simulation Setup

### Single Path (Column Layout)

Place parameters in B2:B7:

| Cell | Label | Value |
|------|-------|-------|
| B2 | S₀ | 100 |
| B3 | μ (drift) | 0.08 |
| B4 | σ (volatility) | 0.25 |
| B5 | T (years) | 1 |
| B6 | N (steps) | 252 |
| B7 | Δt | \`=B5/B6\` |

Column A (rows 10 onward): time steps
- A10: \`=0\`
- A11: \`=A10+1\` (copy down to A262)

Column B: stock prices
- B10: \`=$B$2\`
- B11: \`=$B$2*EXP(($B$3-$B$4^2/2)*$B$7+$B$4*SQRT($B$7)*NORM.S.INV(RAND()))\`

Wait — for a path, each step builds on the prior step:
- B11: \`=B10*EXP(($B$3-$B$4^2/2)*$B$7+$B$4*SQRT($B$7)*NORM.S.INV(RAND()))\`
- Copy B11 down to B262

**Warning**: Every time the sheet recalculates, all RAND() values refresh. Press F9 to manually recalculate.

### Multiple Paths (Column per Path)

For M=1000 paths, each column C through represents one path:
- C10: \`=$B$2\`
- C11: \`=C10*EXP(($B$3-$B$4^2/2)*$B$7+$B$4*SQRT($B$7)*NORM.S.INV(RAND()))\`
- Copy C11 down to C262, then select C10:C262 and copy right across M columns

For large M (>1000), use the Python approach in section 5.

---

## 3. VaR and CVaR

### Setup
After running M paths, collect terminal prices in row 262 (step N):
- Terminal prices: C262 through (C+M)262

### Value at Risk (VaR)
VaR at confidence level α (e.g. 95%) = loss not exceeded with probability α.

\`\`\`
Terminal P&L = Terminal Price − S₀
VaR_95 = −PERCENTILE(P&L range, 0.05)
\`\`\`

Excel (terminal P&L in row 263: \`=C262-$B$2\` copied across):
\`\`\`excel
B14: =AVERAGE(C262:ZZZ262)          ← Mean terminal price
B15: =STDEV(C262:ZZZ262)            ← Std dev of terminal prices
B16: =-PERCENTILE(C263:ZZZ263, 0.05)   ← VaR at 95%
B17: =-PERCENTILE(C263:ZZZ263, 0.01)   ← VaR at 99%
\`\`\`

### Conditional VaR (CVaR / Expected Shortfall)
CVaR = average loss in the worst (1−α)% of scenarios:

\`\`\`excel
B18: =-AVERAGEIF(C263:ZZZ263, "<"&-B16)
\`\`\`

### Interpretation
- VaR_95 = $12.50: with 95% confidence, loss ≤ $12.50 over horizon T
- CVaR_95 = $18.20: if you fall into the worst 5%, average loss is $18.20

---

## 4. Option Pricing via Monte Carlo

### European Call
At each terminal path, compute payoff and discount:
\`\`\`
Payoff_i = MAX(S_T_i − K, 0)
Call_Price = e^(−rT) × AVERAGE(Payoff_i)
\`\`\`

For risk-neutral option pricing, **replace μ with r** (risk-free rate) in the GBM drift.

Excel (K in B20, r in B21, terminal prices in row 262):

Put payoffs in row 264:
- C264: \`=MAX(C262-$B$20, 0)\` (copy across)
- Call Price: \`=EXP(-B21*B5)*AVERAGE(C264:ZZZ264)\`
- Standard Error: \`=STDEV(C264:ZZZ264)/SQRT(COUNT(C264:ZZZ264))\`

---

## 5. Large-Scale Simulation (Python Script)

For M > 10,000 paths, generate in Python and paste terminal values into Excel:

\`\`\`python
import numpy as np

# Parameters
S0 = 100; mu = 0.08; sigma = 0.25; T = 1; N = 252; M = 10000

dt = T / N
Z = np.random.standard_normal((N, M))  # N×M normal draws

# Simulate paths (log returns)
log_returns = (mu - 0.5*sigma**2)*dt + sigma*np.sqrt(dt)*Z

# Cumulative product for paths
paths = S0 * np.exp(np.cumsum(log_returns, axis=0))
paths = np.vstack([np.full(M, S0), paths])  # (N+1)×M

# Terminal prices and risk metrics
terminal = paths[-1]
pnl = terminal - S0
var_95 = -np.percentile(pnl, 5)
cvar_95 = -pnl[pnl < -var_95].mean()

print(f"VaR_95:  {var_95:.2f}")
print(f"CVaR_95: {cvar_95:.2f}")

# Export to CSV for Excel import
np.savetxt("terminal_prices.csv", terminal, delimiter=",")
\`\`\`

Run: \`python simulate.py\` then import \`terminal_prices.csv\` via Data → From Text/CSV.

---

## 6. Convergence: How Many Paths?

Standard error of Monte Carlo estimate:
\`\`\`
SE = σ_payoff / √M
\`\`\`

For ±$0.10 accuracy on a ~$5 option (95% CI):
\`\`\`
M = (1.96 × σ_payoff / 0.10)²
\`\`\`

Typical: M = 10,000–100,000 for 2-decimal accuracy.
Excel handles ~50,000 cells practically; use Python for larger.

**Convergence check**: Run M = 1000, 2000, 5000, 10000. Price should stabilize within ±1% by M = 10,000.

---

## Reference Examples

- \`examples/gbm-setup.md\` — Complete GBM Excel setup with 252-day path visualization
- \`examples/var-cvar.md\` — VaR/CVaR calculation with 1000-path simulation and histogram
`,
      },
      {
        path: "examples/gbm-setup.md",
        data: `# Example: GBM Stock Path in Excel

## Scenario
Simulate MSFT price paths over 1 year:
- S₀ = 380, μ = 0.12, σ = 0.28, T = 1, N = 252 daily steps

## Complete Setup

### Parameters Block (B2:B7)
| Cell | Value |
|------|-------|
| B2 | 380 |
| B3 | 0.12 |
| B4 | 0.28 |
| B5 | 1 |
| B6 | 252 |
| B7 | \`=B5/B6\` → 0.003968 |

### Time Column (A10:A262)
- A10: \`=0\`
- A11: \`=A10+$B$7\` (copy down — time in years, increments by Δt)

### Price Path Column B (B10:B262)
- B10: \`=$B$2\` (initial price = 380)
- B11: \`=B10*EXP(($B$3-$B$4^2/2)*$B$7+$B$4*SQRT($B$7)*NORM.S.INV(RAND()))\`
- Copy B11 down to B262

### Multiple Paths (Columns C through L = 10 paths)
- C10:L10: \`=$B$2\` (all start at S₀)
- C11: same GBM formula as B11 but referencing C10
- Select C11:L11, copy down to row 262

### Chart
1. Select A10:L262
2. Insert → Line Chart
3. Each series is one simulated path
4. You'll see the "cone" shape typical of GBM — paths fan out over time

## Expected Statistics at T=1
With 10 paths you'll see high variance. With 1000 paths:
- Mean terminal price ≈ S₀ × e^(μT) = 380 × e^0.12 ≈ **428** (lognormal mean)
- Median terminal price ≈ S₀ × e^((μ−σ²/2)T) = 380 × e^0.0408 ≈ **396** (lognormal median)

The mean > median because lognormal is right-skewed — large upside scenarios pull up the average.

## Annualized Return Check
In B14: \`=LN(B262/B10)\` → log return for this path
Expected value across many paths ≈ μ − σ²/2 = 0.12 − 0.0392 = 0.0808

## Fixing Random Numbers for Reproducibility
Excel has no built-in seed for RAND(). Workaround:
1. Run simulation, press F9 to generate a set of paths
2. Copy the price range → Paste Special → Values only
3. Now the values are frozen — annotate with date/seed info in a nearby cell
`,
      },
      {
        path: "examples/var-cvar.md",
        data: `# Example: VaR and CVaR with Monte Carlo

## Scenario
Calculate 1-day VaR and CVaR for a $100,000 position in SPY:
- S₀ = 100 (normalized), σ = 0.18 (18% annual), μ = 0.07, T = 1/252 (1 day), M = 1000 paths

## Setup

Since T = 1 day and N = 1 step, each path is just one GBM step:
\`\`\`
S₁ = S₀ × EXP((μ − σ²/2)×Δt + σ×√Δt×Z)
\`\`\`
where Δt = 1/252 ≈ 0.003968.

### Parameters (B2:B6)
| Cell | Label | Value |
|------|-------|-------|
| B2 | S₀ | 100 |
| B3 | μ | 0.07 |
| B4 | σ | 0.18 |
| B5 | Δt | \`=1/252\` |
| B6 | Position ($) | 100000 |

### Generate 1000 Terminal Prices (C2:C1001)
- C2: \`=$B$2*EXP(($B$3-$B$4^2/2)*$B$5+$B$4*SQRT($B$5)*NORM.S.INV(RAND()))\`
- Copy C2 down to C1001

### P&L Column (D2:D1001)
- D2: \`=(C2-$B$2)/$B$2*$B$6\` → dollar P&L scaled to position size
- Copy down to D1001

### Risk Metrics (F2:F8)
| Cell | Label | Formula | Expected |
|------|-------|---------|---------|
| F2 | Mean P&L | \`=AVERAGE(D2:D1001)\` | ≈ +$27 |
| F3 | Std Dev | \`=STDEV(D2:D1001)\` | ≈ $1,134 |
| F4 | VaR_95 (1-day) | \`=-PERCENTILE(D2:D1001,0.05)\` | ≈ $1,845 |
| F5 | VaR_99 (1-day) | \`=-PERCENTILE(D2:D1001,0.01)\` | ≈ $2,590 |
| F6 | CVaR_95 | \`=-AVERAGEIF(D2:D1001,"<"&-F4)\` | ≈ $2,440 |
| F7 | Min P&L | \`=MIN(D2:D1001)\` | worst scenario |
| F8 | Max P&L | \`=MAX(D2:D1001)\` | best scenario |

## Interpretation
- **VaR_95 ≈ $1,845**: On a typical trading day, your maximum loss (95% confidence) is $1,845
- **CVaR_95 ≈ $2,440**: On the worst 5% of days, you lose on average $2,440

## Parametric VaR (for comparison)
The analytical 1-day VaR:
\`\`\`
σ_daily = 0.18/√252 = 0.01134
VaR_95 = σ_daily × 1.645 × Position = 0.01134 × 1.645 × 100,000 ≈ $1,865
\`\`\`
MC and parametric should agree closely — if they don't, check your formula.

## Histogram
1. Create bins in H2:H22: -3000, -2750, -2500, ..., +3000 (step 250)
2. In I2:I22: \`=FREQUENCY(D2:D1001, H2:H22)\` (array formula — Ctrl+Shift+Enter in older Excel)
3. Insert bar chart on H:I columns
4. The distribution should be roughly normal, slightly right-skewed

## Scaling VaR to Multiple Days
The square-root-of-time rule (approximate, assumes i.i.d. returns):
\`\`\`
VaR_10day = VaR_1day × √10 ≈ $1,845 × 3.162 ≈ $5,834
\`\`\`
Excel: \`=F4*SQRT(10)\`

This approximation breaks down for longer horizons where path dependency matters.
`,
      },
    ],
  },
  {
    name: "portfolio-optimization",
    files: [
      {
        path: "SKILL.md",
        data: `---
name: portfolio-optimization
description: Optimize portfolio weights using Modern Portfolio Theory — build efficient frontier, maximize Sharpe ratio, run mean-variance optimization with Excel Solver, or compute correlation/covariance matrices
platform: excel
---

> **IMPORTANT**: READ THIS ENTIRE FILE before implementing any portfolio optimization. Do not rely on memory — follow the exact Excel formulas and Solver configurations described here.

# Portfolio Optimization Skill — MPT & Excel Solver

## 1. Expected Return

For a portfolio of N assets with weights w_i and expected returns μ_i:
\`\`\`
E[Rp] = Σ w_i × μ_i = SUMPRODUCT(weights, returns)
\`\`\`

Excel (weights in B2:B4, returns in C2:C4):
\`\`\`excel
=SUMPRODUCT(B2:B4, C2:C4)
\`\`\`

---

## 2. Covariance Matrix

### Historical Covariance
Given a returns matrix (rows = dates, columns = assets):

For assets A, B, C with return histories in columns D, E, F:

| | Asset A | Asset B | Asset C |
|-|---------|---------|---------|
| Asset A | \`=COVARIANCE.S(D:D,D:D)\` | \`=COVARIANCE.S(D:D,E:E)\` | \`=COVARIANCE.S(D:D,F:F)\` |
| Asset B | \`=COVARIANCE.S(E:E,D:D)\` | \`=COVARIANCE.S(E:E,E:E)\` | \`=COVARIANCE.S(E:E,F:F)\` |
| Asset C | \`=COVARIANCE.S(F:F,D:D)\` | \`=COVARIANCE.S(F:F,E:E)\` | \`=COVARIANCE.S(F:F,F:F)\` |

Note: \`COVARIANCE.S\` divides by (n−1) — use for sample data. \`COVARIANCE.P\` divides by n.

### Correlation Matrix
\`\`\`excel
=CORREL(returns_col_i, returns_col_j)
\`\`\`
Or: \`Correlation(i,j) = Covariance(i,j) / (σ_i × σ_j)\`

---

## 3. Portfolio Variance

\`\`\`
σ²p = w' Σ w = MMULT(TRANSPOSE(w), MMULT(Σ, w))
\`\`\`

Excel (weights in H2:H4, covariance matrix in I2:K4):
\`\`\`excel
=MMULT(TRANSPOSE(H2:H4), MMULT(I2:K4, H2:H4))
\`\`\`
Array formula — press Ctrl+Shift+Enter in older Excel, or just Enter in Excel 365.

Portfolio volatility: \`=SQRT(portfolio_variance_cell)\`

---

## 4. Sharpe Ratio

\`\`\`
Sharpe = (E[Rp] − Rf) / σp
\`\`\`

Excel (Rf in B6, E[Rp] in B8, σp in B10):
\`\`\`excel
=(B8-B6)/B10
\`\`\`

---

## 5. Excel Solver Setup

### Full Layout for 3-Asset Portfolio

**Inputs (cols A-C, rows 2-4)**:
| Row | Asset | Weight | Expected Return |
|-----|-------|--------|-----------------|
| 2 | Stock A | 0.333 | 0.10 |
| 3 | Stock B | 0.333 | 0.08 |
| 4 | Stock C | 0.333 | 0.12 |

**Covariance Matrix (cols E-G, rows 2-4)** — pre-computed from historical data:
| | A | B | C |
|-|---|---|---|
| A | 0.0400 | 0.0100 | 0.0150 |
| B | 0.0100 | 0.0225 | 0.0075 |
| C | 0.0150 | 0.0075 | 0.0625 |

**Derived Metrics**:
- B6: Risk-free rate = 0.03
- B8: Expected return = \`=SUMPRODUCT(B2:B4, C2:C4)\`
- B9: Portfolio variance = \`=MMULT(TRANSPOSE(B2:B4), MMULT(E2:G4, B2:B4))\`
- B10: Portfolio std dev = \`=SQRT(B9)\`
- B11: Sharpe ratio = \`=(B8-B6)/B10\`
- B12: Sum of weights = \`=SUM(B2:B4)\` (must equal 1)

### Solver for Maximum Sharpe Ratio
1. **Data → Solver**
2. Set Objective: \`$B$11\` (Sharpe ratio)
3. To: **Max**
4. By Changing Variable Cells: \`$B$2:$B$4\`
5. Add Constraints:
   - \`$B$12 = 1\` (weights sum to 1)
   - \`$B$2:$B$4 >= 0\` (long-only)
6. Solving Method: **GRG Nonlinear**
7. Options → check **Multistart** (tries multiple starting points, avoids local optima)
8. Click Solve

### Solver for Minimum Variance Portfolio
Same setup but:
- Set Objective: \`$B$9\` (variance)
- To: **Min**

---

## 6. Efficient Frontier

The efficient frontier = set of portfolios that maximize return for a given risk level.

### Step-by-Step
1. Find minimum variance portfolio (Solver: minimize B9)
2. Record (σp, E[Rp]) at min variance
3. Set target return slightly above minimum; add constraint \`$B$8 >= target\`
4. Solver: minimize variance with this constraint → record (σp, E[Rp])
5. Increase target return by 0.5% increments; repeat 20-30 times up to max asset return
6. Plot σp (X-axis) vs E[Rp] (Y-axis) as scatter chart

### Frontier Data Layout (cols I-J)
| I (σp) | J (E[Rp]) |
|--------|----------|
| min-var result | min-var return |
| Solver output 1 | target 1 |
| ... | ... |

Select I:J → Insert → Scatter → Smooth Lines for the frontier curve.

---

## 7. Risk Decomposition (MCTR)

Marginal Contribution to Risk (MCTR) — each asset's contribution to portfolio volatility:

\`\`\`
MCTR_i = (Σ × w)_i / σp
\`\`\`

Excel (returns a vector for all assets):
\`\`\`excel
=MMULT(E2:G4, B2:B4) / B10
\`\`\`

Weighted MCTR (percentage contribution — sums to 1):
\`\`\`excel
=B2:B4 * MMULT(E2:G4, B2:B4) / B9
\`\`\`

---

## Reference Examples

- \`examples/efficient-frontier.md\` — Complete 3-asset efficient frontier with Solver walk-through
- \`examples/solver-setup.md\` — Exact cell addresses and Solver dialog configuration for copy-paste setup
`,
      },
      {
        path: "examples/efficient-frontier.md",
        data: `# Example: 3-Asset Efficient Frontier

## Assets
- **SPY** (US equity): μ = 10%, σ = 18%
- **AGG** (US bonds): μ = 4%, σ = 6%
- **GLD** (Gold): μ = 6%, σ = 16%

## Correlation Matrix (assumed)
| | SPY | AGG | GLD |
|-|-----|-----|-----|
| SPY | 1.00 | −0.10 | 0.05 |
| AGG | −0.10 | 1.00 | 0.15 |
| GLD | 0.05 | 0.15 | 1.00 |

## Covariance Matrix (Cov_ij = ρ_ij × σ_i × σ_j)
| | SPY | AGG | GLD |
|-|-----|-----|-----|
| SPY | 0.0324 | −0.00108 | 0.00144 |
| AGG | −0.00108 | 0.0036 | 0.00144 |
| GLD | 0.00144 | 0.00144 | 0.0256 |

## Excel Layout

**Parameters (A1:C4)**
| A | B | C |
|---|---|---|
| Asset | Weight | Exp Return |
| SPY | 0.333 | 0.10 |
| AGG | 0.333 | 0.04 |
| GLD | 0.333 | 0.06 |

**Covariance Matrix (E2:G4)**
| E | F | G |
|---|---|---|
| 0.0324 | -0.00108 | 0.00144 |
| -0.00108 | 0.0036 | 0.00144 |
| 0.00144 | 0.00144 | 0.0256 |

**Derived (B6:B12)**
| Cell | Formula | Value |
|------|---------|-------|
| B6 | Rf = | 0.02 |
| B8 | \`=SUMPRODUCT(B2:B4,C2:C4)\` | 6.67% |
| B9 | \`=MMULT(TRANSPOSE(B2:B4),MMULT(E2:G4,B2:B4))\` | 0.00776 |
| B10 | \`=SQRT(B9)\` | 8.81% |
| B11 | \`=(B8-B6)/B10\` | 0.527 |
| B12 | \`=SUM(B2:B4)\` | 1.000 |

## Efficient Frontier Points

Run Solver 8 times with target returns from 4.0% to 10.0%:

| Target E[Rp] | Min Variance σp | SPY | AGG | GLD |
|-------------|----------------|-----|-----|-----|
| 4.00% | 5.96% | 0% | 100% | 0% |
| 4.86% | 5.83% | 6% | 84% | 10% |
| 5.71% | 6.42% | 18% | 62% | 20% |
| 6.57% | 7.82% | 35% | 35% | 30% |
| 7.43% | 9.76% | 56% | 10% | 34% |
| 8.29% | 12.4% | 77% | 0% | 23% |
| 9.14% | 15.5% | 90% | 0% | 10% |
| 10.00% | 18.0% | 100% | 0% | 0% |

## Maximum Sharpe Portfolio
Solver maximizing B11:
- SPY: 42%, AGG: 43%, GLD: 15%
- E[Rp] ≈ 7.3%, σp ≈ 8.9%, Sharpe ≈ 0.596

## Chart Instructions
1. Put frontier σp values in column I, E[Rp] in column J
2. Insert → Scatter → Scatter with Smooth Lines
3. Add a second data series for the tangency (max Sharpe) point
4. Label axes: X = "Portfolio Risk (σ)", Y = "Expected Return"
5. The tangency line from Rf through the max Sharpe point is the Capital Market Line (CML)
`,
      },
      {
        path: "examples/solver-setup.md",
        data: `# Example: Step-by-Step Solver Configuration

## Prerequisite: Enable Solver Add-In
1. File → Options → Add-Ins
2. At bottom: "Manage: Excel Add-ins" → Go
3. Check "Solver Add-in" → OK
4. Solver now appears under the Data tab

## Complete Cell Map for Copy-Paste

Paste this exact layout starting at cell A1:

**Column A (labels)**:
- A1: Portfolio Optimizer
- A2: Asset, A3: Stock A, A4: Stock B, A5: Stock C
- A7: Rf (risk-free), A8: E[Rp], A9: Variance
- A10: Std Dev (σp), A11: Sharpe Ratio, A12: Sum of Weights

**Column B (weights & metrics)**:
- B2: Weight *(header)*
- B3: \`0.333\` ← Solver changes this
- B4: \`0.333\` ← Solver changes this
- B5: \`0.333\` ← Solver changes this
- B7: \`0.03\` (risk-free rate)
- B8: \`=SUMPRODUCT(B3:B5,C3:C5)\`
- B9: \`=MMULT(TRANSPOSE(B3:B5),MMULT(E3:G5,B3:B5))\`
- B10: \`=SQRT(B9)\`
- B11: \`=(B8-B7)/B10\`
- B12: \`=SUM(B3:B5)\`

**Column C (expected returns)**:
- C2: Exp Return *(header)*
- C3: \`0.10\`, C4: \`0.08\`, C5: \`0.12\`

**Covariance Matrix (E3:G5)**:
\`\`\`
E3: 0.0400   F3: 0.0100   G3: 0.0150
E4: 0.0100   F4: 0.0225   G4: 0.0075
E5: 0.0150   F5: 0.0075   G5: 0.0625
\`\`\`

## Solver Dialog: Maximize Sharpe Ratio

\`\`\`
Set Objective:        $B$11
To:                   Max
By Changing Cells:    $B$3:$B$5

Constraints:
  $B$12 = 1          (weights sum to 1)
  $B$3 >= 0
  $B$4 >= 0
  $B$5 >= 0

Solving Method:       GRG Nonlinear
Options:              Check "Multistart" (avoids local optima)
\`\`\`

Click **Solve** → Keep Solver Solution

**Expected result**: B3 ≈ 0.35, B4 ≈ 0.45, B5 ≈ 0.20, Sharpe ≈ 0.58

## Solver Dialog: Minimize Variance

\`\`\`
Set Objective:        $B$9
To:                   Min
By Changing Cells:    $B$3:$B$5

Same constraints as above.
\`\`\`

**Expected result**: B3 ≈ 0.10, B4 ≈ 0.65, B5 ≈ 0.25, σp ≈ 12.8%

## Common Solver Errors

| Error | Fix |
|-------|-----|
| "Solver could not find feasible solution" | Check $B$12=1 constraint; verify covariance matrix is square and symmetric |
| Weights sum to 0.999 | Normal floating-point; acceptable |
| All weight goes to one asset | Use Multistart; add max weight constraint (e.g., B3<=0.60) |
| Solver returns starting values | Non-convex local minimum; try random starting weights |
| MMULT returns #VALUE! | Matrix dimensions wrong — covariance must be N×N matching N weight cells |
| Sharpe is negative | Expected return < risk-free rate; check input values |
`,
      },
    ],
  },
  {
    name: "stock-analysis",
    files: [
      {
        path: "SKILL.md",
        data: `---
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
\`\`\`
FCFF = EBIT × (1 − Tax Rate) + D&A − Capex − ΔWorking Capital
\`\`\`

### WACC
\`\`\`
WACC = (E/V) × Re + (D/V) × Rd × (1 − Tax Rate)
\`\`\`
- E = market cap, D = market value of debt, V = E + D
- Re = cost of equity (CAPM: Rf + β × Market Risk Premium)
- Rd = cost of debt (interest expense / total debt)
- Market Risk Premium ≈ 5.5% (US historical)

### Terminal Value
\`\`\`
TV = FCFF_final × (1 + g) / (WACC − g)
\`\`\`
where g = terminal growth rate.

### Enterprise Value & Equity Value
\`\`\`
EV = PV(FCFFs) + PV(Terminal Value)
Equity Value = EV − Net Debt
Intrinsic Price = Equity Value / Shares Outstanding
\`\`\`

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
- C15: \`=$B$2*(1+$B$3)^1\`
- D15: \`=$B$2*(1+$B$3)^2\` ... through G15 (year 5)

Row 16: EBIT = \`=C15*$B$4\`
Row 17: NOPAT = \`=C16*(1-$B$5)\` (Net Operating Profit After Tax)
Row 18: D&A = \`=C15*$B$6\`
Row 19: Capex = \`=C15*$B$7\`
Row 20: ΔWC = \`=C15*$B$8\`
Row 21: FCFF = \`=C17+C18-C19-C20\`
Row 22: Discount Factor = \`=1/(1+$B$9)^C14\` (C14 = year number 1-5)
Row 23: PV of FCFF = \`=C21*C22\`

**Summary (B25:B30)**:
| Cell | Label | Formula |
|------|-------|---------|
| B25 | Sum PV(FCFFs) | \`=SUM(C23:G23)\` |
| B26 | Terminal Value | \`=G21*(1+B10)/(B9-B10)\` |
| B27 | PV(Terminal Value) | \`=B26*G22\` |
| B28 | Enterprise Value | \`=B25+B27\` |
| B29 | Equity Value | \`=B28-B11\` |
| B30 | **Intrinsic Price** | \`=B29/B12\` |

**Margin of Safety**:
- B31: Current Market Price (input)
- B32: Upside/Downside: \`=(B30-B31)/B31\` → format as %

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
\`\`\`
EV = Market Cap + Total Debt + Preferred Stock + Minority Interest − Cash
\`\`\`
Excel:
\`\`\`excel
= MarketCap + TotalDebt + PrefStock + MinorityInt - Cash
\`\`\`

### Comps Table Layout

| Col A | B | C | D | E | F | G |
|-------|---|---|---|---|---|---|
| Company | Market Cap | EV | Revenue | EBITDA | EPS | EV/EBITDA |
| Peer 1 | input | input | input | input | input | \`=C2/E2\` |
| Peer 2 | | | | | | |
| Target | | | | | | |
| **Median** | | | \`=MEDIAN(D2:D5)\` | | | \`=MEDIAN(G2:G4)\` |

**Implied Value of Target**:
\`\`\`excel
Implied EV = Median EV/EBITDA × Target EBITDA
Implied Price = (Implied EV - Net Debt) / Shares
\`\`\`

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
| Gross Margin | Gross Profit / Revenue | \`=GrossProfit/Revenue\` |
| EBIT Margin | EBIT / Revenue | \`=EBIT/Revenue\` |
| Net Margin | Net Income / Revenue | \`=NetIncome/Revenue\` |
| ROE | Net Income / Avg Equity | \`=NetIncome/AVERAGE(Equity_t,Equity_t1)\` |
| ROIC | NOPAT / Invested Capital | \`=NOPAT/(TotalDebt+Equity-Cash)\` |
| ROA | Net Income / Avg Assets | \`=NetIncome/AVERAGE(Assets_t,Assets_t1)\` |

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
\`\`\`
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
\`\`\`

**Red flags**: Revenue growth without margin expansion; large one-time gains inflating net income; EPS growing faster than revenue (buybacks masking stagnation).

**Green flags**: Expanding gross margins (pricing power); growing R&D as % of revenue (investment in future); operating leverage (revenue grows faster than opex).

### Balance Sheet — Key Items
\`\`\`
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
\`\`\`

**Key checks**:
- Cash trend: growing = healthy; shrinking without investment = concern
- Goodwill spike: may signal acquisition at premium (watch for impairment)
- Debt maturity: when is debt due? Refinancing risk?
- Book value vs. market cap: P/B > 1 means market values intangibles/future growth

### Cash Flow Statement — Most Important Statement
\`\`\`
Operating Cash Flow (OCF)       ← "Quality of earnings" — should track net income
− Capex
= Free Cash Flow (FCF)          ← What the business actually generates
− Dividends
= Free Cash Flow to Equity
\`\`\`

**Rule of thumb**: Net Income > 0 but OCF < 0 = earnings manipulation risk. FCF consistently > Net Income = high-quality earnings (conservatively accounted).

---

## 5. Quick Valuation Sanity Checks

| Check | How |
|-------|-----|
| DCF vs. Comps | Both should point in same direction; >20% divergence = re-examine assumptions |
| Reverse DCF | What growth does the current price imply? \`=RATE(n, 0, -EV, FCF_terminal_implied)\` |
| Rule of 40 | For SaaS: Revenue Growth % + FCF Margin % > 40 = healthy |
| PEG Ratio | P/E / EPS Growth Rate; <1 = potentially undervalued |
| Graham Number | √(22.5 × EPS × Book Value Per Share) = conservative intrinsic value estimate |

---

## Reference Examples

- \`examples/dcf-model.md\` — Complete 5-year DCF for a sample company with sensitivity table
- \`examples/comps-table.md\` — Comparable company analysis with EV/EBITDA, P/E, P/S multiples and implied valuation
`,
      },
      {
        path: "examples/comps-table.md",
        data: `# Example: Comparable Company Analysis (Comps)

## Scenario
Value a mid-cap cloud software company using public peers.

## Peer Group

| Company | Market Cap ($B) | Net Debt ($B) | EV ($B) | Revenue ($B) | EBITDA ($B) | EPS | EV/EBITDA | EV/Rev | P/E |
|---------|----------------|--------------|---------|-------------|------------|-----|----------|--------|-----|
| Peer A | 45.0 | 2.0 | 47.0 | 4.2 | 1.05 | 3.20 | 44.8x | 11.2x | 26.7x |
| Peer B | 28.0 | -1.5 | 26.5 | 2.8 | 0.56 | 1.85 | 47.3x | 9.5x | 31.6x |
| Peer C | 62.0 | 5.0 | 67.0 | 5.5 | 1.93 | 4.10 | 34.7x | 12.2x | 27.0x |
| Peer D | 18.0 | 0.5 | 18.5 | 1.4 | 0.21 | 0.90 | 88.1x | 13.2x | 55.6x |
| **Median** | | | | | | | **46.1x** | **11.7x** | **29.3x** |
| **Mean** | | | | | | | **53.7x** | **11.5x** | **35.2x** |

Note: Peer D is an outlier (high-growth, not yet profitable). Median is more robust than mean here.

## Excel Layout

### Data Table (A1:J6)

| Cell | A | B | C | D | E | F | G | H | I | J |
|------|---|---|---|---|---|---|---|---|---|---|
| 1 | Company | Mkt Cap | Debt | Cash | EV | Revenue | EBITDA | EPS | EV/EBITDA | P/E |
| 2 | Peer A | 45 | 4 | 2 | \`=B2+C2-D2\` | 4.2 | 1.05 | 3.20 | \`=E2/G2\` | \`=B2/G2/H2*H2\` ← simplify: \`=B2/H2/SHARES\` |

Simpler P/E: \`=B2/(H2*shares_outstanding)\`

Or if you have share price and EPS directly:
\`\`\`excel
P/E = Share Price / EPS
EV = Shares * Price + Debt - Cash
\`\`\`

### Median/Mean Row
- I7 (Median EV/EBITDA): \`=MEDIAN(I2:I5)\`
- I8 (Mean EV/EBITDA): \`=AVERAGE(I2:I5)\`

### Target Company Inputs (A10:B14)
| Cell | Label | Value |
|------|-------|-------|
| B10 | Target Revenue | 1.8 |
| B11 | Target EBITDA | 0.36 |
| B12 | Target EPS | 1.20 |
| B13 | Target Net Debt | 0.3 |
| B14 | Target Shares (M) | 80 |

### Implied Valuations (A16:B20)
| Cell | Label | Formula | Value |
|------|-------|---------|-------|
| B16 | Implied EV (EBITDA method) | \`=I7*B11\` | $16.6B |
| B17 | Implied Equity Value | \`=B16-B13\` | $16.3B |
| B18 | **Implied Price (EV/EBITDA)** | \`=B17/B14*1000\` | **$203.75** |
| B19 | Implied Price (EV/Rev) | \`=(J7*B10-B13)/B14*1000\` | $262.50 |
| B20 | Implied Price (P/E) | \`=K7*B12\` | $35.16 |

### Valuation Summary
| Method | Implied Price | Weight |
|--------|--------------|--------|
| DCF | $17.30 (from dcf-model.md) | 50% |
| EV/EBITDA Comps | $20.38 | 30% |
| P/E Comps | $35.16 | 20% |
| **Weighted Average** | \`=17.30*0.5+20.38*0.3+35.16*0.2\` | **$22.18** |

## What to Watch For

| Signal | Interpretation |
|--------|---------------|
| Target trading at discount to median EV/EBITDA | Potential undervaluation — investigate why |
| P/E outlier among peers | Different growth profile or one-time items — use EV/EBITDA instead |
| Large EV/Revenue spread | Revenue quality differs — check gross margins |
| Net debt vs. peers | Higher leverage → higher risk → should trade at discount |
| Recent M&A in peer group | Acquisition premiums inflate comps — adjust down |
`,
      },
      {
        path: "examples/dcf-model.md",
        data: `# Example: 5-Year DCF Model

## Scenario
Value a mid-cap software company:
- Revenue (Year 0): $500M
- Revenue growth: 15% → 12% → 10% → 8% → 7% (decelerating)
- EBIT margin: expanding from 20% to 25% over 5 years
- Tax rate: 21%, D&A: 5% of revenue, Capex: 4% of revenue
- ΔWC: 1% of revenue
- WACC: 10%, Terminal growth: 3%
- Net Debt: −$200M (net cash position)
- Diluted shares: 100M

## Excel Layout

### Parameters (A1:B14)
| Cell | Label | Value |
|------|-------|-------|
| B2 | Revenue Y0 | 500 |
| B3 | WACC | 0.10 |
| B4 | Terminal Growth | 0.03 |
| B5 | Tax Rate | 0.21 |
| B6 | D&A % Rev | 0.05 |
| B7 | Capex % Rev | 0.04 |
| B8 | ΔWC % Rev | 0.01 |
| B9 | Net Debt | -200 |
| B10 | Shares | 100 |

### Projection Table (C1:H9 = Years 1-5)

**Row 1** (Year headers): C1=1, D1=2, E1=3, F1=4, G1=5

**Row 2** (Revenue growth): C2=0.15, D2=0.12, E2=0.10, F2=0.08, G2=0.07

**Row 3** (Revenue):
- C3: \`=$B$2*(1+C2)\`
- D3: \`=C3*(1+D2)\`
- E3: \`=D3*(1+E2)\`, F3, G3 follow same pattern

**Row 4** (EBIT margin): C4=0.20, D4=0.21, E4=0.22, F4=0.235, G4=0.25

**Row 5** (NOPAT = EBIT × (1-Tax)):
- C5: \`=C3*C4*(1-$B$5)\`

**Row 6** (D&A): \`=C3*$B$6\`
**Row 7** (Capex): \`=C3*$B$7\`
**Row 8** (ΔWC): \`=C3*$B$8\`

**Row 9** (FCFF):
- C9: \`=C5+C6-C7-C8\`

**Row 10** (Discount factor): \`=1/(1+$B$3)^C1\`
**Row 11** (PV of FCFF): \`=C9*C10\`

### Projected Values (for reference)
| Year | Revenue | EBIT Margin | FCFF | PV(FCFF) |
|------|---------|-------------|------|----------|
| 1 | $575M | 20.0% | $74.8M | $68.0M |
| 2 | $644M | 21.0% | $87.4M | $72.2M |
| 3 | $708M | 22.0% | $98.7M | $74.1M |
| 4 | $765M | 23.5% | $112.3M | $76.7M |
| 5 | $818M | 25.0% | $127.3M | $79.1M |

### Summary (B13:B19)
| Cell | Label | Formula | Value |
|------|-------|---------|-------|
| B13 | Sum PV(FCFFs) | \`=SUM(C11:G11)\` | $370.1M |
| B14 | Terminal Value | \`=G9*(1+B4)/(B3-B4)\` | $1,868M |
| B15 | PV(Terminal Value) | \`=B14/(1+B3)^5\` | $1,160M |
| B16 | Enterprise Value | \`=B13+B15\` | $1,530M |
| B17 | Equity Value | \`=B16-B9\` | $1,730M |
| B18 | **Intrinsic Price** | \`=B17/B10\` | **$17.30** |

## Sensitivity Analysis

Two-variable data table varying WACC (rows) and Terminal Growth (columns):

Setup:
- Corner cell (e.g. J2): \`=$B$18\` (reference to intrinsic price)
- Row headers (K2:O2): 2.0%, 2.5%, 3.0%, 3.5%, 4.0% (terminal growth)
- Column headers (J3:J7): 8%, 9%, 10%, 11%, 12% (WACC)

Select J2:O7 → Data → What-If Analysis → Data Table
- Row input cell: B4 (terminal growth)
- Column input cell: B3 (WACC)

| WACC \\ g | 2.0% | 2.5% | **3.0%** | 3.5% | 4.0% |
|----------|------|------|----------|------|------|
| 8% | $24.10 | $26.80 | $30.20 | $34.90 | $41.50 |
| 9% | $19.40 | $21.30 | $23.60 | $26.60 | $30.70 |
| **10%** | $15.90 | $17.30 | **$17.30** | $21.10 | $24.00 |
| 11% | $13.20 | $14.20 | $15.50 | $17.10 | $19.20 |
| 12% | $11.10 | $11.90 | $12.90 | $14.10 | $15.70 |

Color code: green if > current market price, red if below. This shows the range of outcomes under different assumptions.
`,
      },
    ],
  },
  {
    name: "dcf-model",
    files: [
      {
        path: "SKILL.md",
        data: `---
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
- Years formatted as text to prevent comma insertion: \`2024\`, not \`2,024\`
- Currency in millions: \`$#,##0\` — always label units in headers ("Revenue ($mm)")
- Percentages: \`0.0%\` — negatives in parentheses \`(12.3%)\`

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

\`\`\`
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
\`\`\`

Then create a **consolidation column** using INDEX to pull from the selected scenario:
- Case selector cell (e.g., B6): 1=Bear, 2=Base, 3=Bull
- Consolidation formula: \`=INDEX(BearVal:BullVal, 1, $B$6)\`
- All projection formulas reference the consolidation column — NOT scattered IF statements

## Step 4: Historical & Projected Financials

\`\`\`
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
\`\`\`

**Key rule:** All OpEx lines as % of Revenue (not gross profit).

## Step 5: Free Cash Flow Build

\`\`\`
NOPAT                  | =NOPAT row
(+) D&A                | =Revenue * DA_pct    (consolidation column assumption)
(-) CapEx              | =Revenue * capex_pct
(-) Δ NWC              | =(Rev_t - Rev_t-1) * nwc_pct
= Unlevered FCF        | =NOPAT + DA - CapEx - ΔNWC
\`\`\`

## Step 6: WACC Sheet

\`\`\`
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
\`\`\`

Typical WACC ranges: Large/stable 7–9%, growth companies 9–12%, high-growth 12–15%.

**Special case:** If Net Debt is negative (net cash), debt weight is negative and WACC is slightly above cost of equity — this is correct.

## Step 7: Discounting (Mid-Year Convention)

\`\`\`
Period:         0.5   1.5   2.5   3.5   4.5
Discount Factor: =1/(1+WACC)^period
PV of FCF:      =FCF * DiscountFactor
\`\`\`

## Step 8: Terminal Value

**Perpetuity Growth Method (preferred):**
\`\`\`
Terminal FCF   = Final Year FCF * (1 + TGR)
Terminal Value = Terminal FCF / (WACC - TGR)
PV of TV       = TV / (1+WACC)^4.5      ← for 5-year model, mid-year
\`\`\`

Terminal growth rate: 2.0–2.5% (conservative), up to 3.5% for market leaders. **Must be < WACC.**

Sanity check: Terminal value should be 50–70% of Enterprise Value. If >75%, re-examine terminal assumptions.

**Exit Multiple Method (alternative):**
\`\`\`
Terminal Value = Final Year EBITDA * Exit Multiple (8–15x typical)
\`\`\`

## Step 9: Enterprise-to-Equity Bridge

\`\`\`
Sum of PV of FCFs            | =SUM(PV_FCF_range)
PV of Terminal Value         | =TV/(1+WACC)^4.5
Enterprise Value             | =PV_FCFs + PV_TV
(-) Net Debt                 | [or + Net Cash]
Equity Value                 | =EV - NetDebt
÷ Diluted Shares             | [input]
Implied Price Per Share      | =EquityValue / Shares
Current Stock Price          | [input]
Implied Upside/(Downside)    | =ImpliedPrice/CurrentPrice - 1
\`\`\`

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
- [ ] File named: \`[Ticker]_DCF_[Date].xlsx\`

## Common Errors to Avoid

1. **Terminal growth ≥ WACC** → creates infinite value
2. **OpEx as % of gross profit** → use revenue instead
3. **IF statements scattered in projections** → use consolidation column with INDEX
4. **WACC uses book values** → always use market-value equity weight
5. **Terminal value not discounted** → must divide by (1+WACC)^period
6. **Unlevered FCF includes interest** → NOPAT already excludes interest (that's the point)
`,
      },
      {
        path: "TROUBLESHOOTING.md",
        data: `# DCF Model Troubleshooting Guide

**When to read this file:** If recalc.py shows errors OR valuation results seem unreasonable OR case selector not working properly.

## Model Returns Error Values

### #REF! Errors
- Usually caused by formulas referencing wrong rows after headers were inserted
- Solution: Rebuild with correct row references, or start over following layout planning
- Prevention: Define all row positions BEFORE writing formulas

### #DIV/0! Errors
- Division by zero or empty cells
- Solution: Add IF statements to handle zeros: \`=IF([Divisor]=0,0,[Numerator]/[Divisor])\`

### #VALUE! Errors
- Wrong data type in calculation (text instead of number)
- Solution: Verify all inputs are formatted as numbers

## Valuation Seems Unreasonable

### Implied price far too high
- Check terminal value isn't >80% of EV
- Verify terminal growth < WACC
- Review if growth assumptions are realistic
- Consider if margins are too optimistic

### Implied price far too low
- Verify net debt vs net cash is correct
- Check if WACC is too high
- Review if projections are too conservative
- Consider if terminal growth is too low

## Case Selector Not Working

### Consolidation column not updating when switching scenarios
- Verify case selector cell contains 1, 2, or 3
- Check INDEX/OFFSET formulas reference correct row range and selector cell
- Ensure absolute references ($B$6) are used for selector
- Test by manually changing the selector cell and verifying projection values update
`,
      },
    ],
  },
  {
    name: "lbo-model",
    files: [
      {
        path: "SKILL.md",
        data: `---
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
- **Black (000000)**: Formulas with calculations (\`=B4*B5\`, \`=SUM()\`)
- **Purple (800080)**: Same-tab links — direct cell references with no math (\`=B9\`)
- **Green (008000)**: Cross-tab links (\`=Assumptions!B5\`)

## Number Formats

- Currency: \`$#,##0;($#,##0);"-"\` or \`$#,##0.0\` for millions
- Percentages: \`0.0%\`
- Multiples/MOIC: \`0.0"x"\` or \`0.00"x"\` for precision
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

\`\`\`
SOURCES                    $       USES                       $
Senior Debt              [=]      Equity Purchase Price     [=EV - NetDebt]
Subordinated Debt        [input]  Refinance Target Debt     [=NetDebt]
Sponsor Equity           [=plug]  Transaction Fees          [=EV*fee%]
                                  Financing Fees            [input]
Total Sources            [=SUM]   Total Uses                [=SUM]
Check: Sources - Uses    [must = 0]
\`\`\`

Sponsor equity is the **plug**: \`=Total Uses - Total Debt Raised\`

---

## Tab 3: Operating Model

\`\`\`
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
\`\`\`

---

## Tab 4: Debt Schedule

For each tranche (Senior, Sub-debt, etc.):

\`\`\`
                    Close   Y1          Y2          ...
Beginning Balance   [=S&U]  [=prior End Balance]
+ New Issuance      [=S&U]  0
- Mandatory Amort.  [=Beg*amort%]...
- Cash Sweep        [=MIN(AvailableCash, RemainingBalance)]
Ending Balance      [=Beg+New-Amort-Sweep]
Interest Expense    [=Beginning Balance * rate]   ← ALWAYS use beginning balance
\`\`\`

**Cash sweep priority** — pay down in order (senior first):
\`\`\`
Available for sweep = FCF - mandatory amortization (all tranches)
Senior paydown = MIN(Available, Senior balance)
Sub paydown = MIN(Remaining after Senior, Sub balance)
\`\`\`

Balances cannot go negative: \`=MAX(0, Beg - Amort - Sweep)\`

---

## Tab 5: Returns

**Exit Calculation:**
\`\`\`
Exit EBITDA         [=final year EBITDA from Operating Model]
Exit Enterprise Value = Exit EBITDA * Exit Multiple
- Net Debt at Exit  [=sum of ending debt balances]
Exit Equity Value   [=Exit EV - Net Debt at Exit]

Equity Invested     [=Sponsor Equity from S&U]
MOIC                [=Exit Equity / Equity Invested]
IRR                 [=IRR(cashflows) or XIRR with dates]
\`\`\`

**Cash flows for IRR:** Investment year = negative equity check, exit year = positive proceeds.
\`=IRR({-EquityInvested, 0, 0, 0, 0, ExitEquity})\`

**Returns Attribution Waterfall:**
\`\`\`
EBITDA Growth contribution  = (ExitEBITDA - EntryEBITDA) * ExitMultiple / EquityInvested
Multiple Expansion          = (ExitMultiple - EntryMultiple) * EntryEBITDA / EquityInvested
Debt Paydown                = Total debt paid down / EquityInvested
Fees/Expenses drag          = -(TransFees + FinFees) / EquityInvested
\`\`\`

**Sensitivity Tables (Entry × Exit multiple):**

| | Exit 6x | Exit 7x | Exit 8x | Exit 9x | Exit 10x |
|---|---------|---------|---------|---------|----------|
| Entry 7x | IRR/MOIC | ... | | | |
| Entry 8x | | | | | |
| Entry 9x | | | | | |
| Entry 10x | | | | | |

Each cell: formula recalculating IRR/MOIC using that row's entry multiple and column's exit multiple.
Format: \`"X.Xx / X.X%"\` — show both MOIC and IRR.

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
| All sensitivity cells same value | Check mixed references: \`$A5\` for row header, \`B$4\` for col header |
| Circular reference from interest | Use beginning balance: \`=OpeningDebt * rate\` |
| Negative debt balance | Wrap with \`MAX(0, ...)\` |
| IRR error | Verify signs: investment = negative, proceeds = positive |
| Sources ≠ Uses | Equity is the plug — recalculate as \`=Uses - Debt\` |
`,
      },
    ],
  },
  {
    name: "comps-analysis",
    files: [
      {
        path: "SKILL.md",
        data: `---
name: comps-analysis
description: Build institutional-grade comparable company analyses with operating metrics, valuation multiples, and statistical benchmarking in Excel. Use for public company valuation, M&A pricing, benchmarking performance vs. peers, or IPO pricing. Triggers on "comps", "comparable companies", "trading comps", "peer analysis", "valuation multiples", "comp table", or "benchmark [company] against peers".
platform: excel
---

# Comparable Company Analysis

READ THIS ENTIRE FILE before building any comps analysis.

## Core Philosophy

"Build the right structure first, then let the data tell the story." Start with headers that force strategic thinking about what matters, input clean data, build transparent formulas, and let statistics emerge automatically.

## Sheet Structure

**Two sections on one sheet** (or two tabs for large sets):

1. **Operating Statistics** — revenue, growth, margins, profitability
2. **Valuation Multiples** — market cap, EV, EV/Revenue, EV/EBITDA, P/E

**Header Block (rows 1–3):**
\`\`\`
Row 1: [SECTOR] — COMPARABLE COMPANY ANALYSIS
Row 2: Company A (TICK) • Company B (TICK) • Company C (TICK)
Row 3: As of [Period] | All figures in USD Millions except per-share amounts
\`\`\`

---

## Section 1: Operating Statistics

### Core Columns (always include)

| Company | Revenue (LTM) | Revenue Growth | Gross Profit | Gross Margin | EBITDA | EBITDA Margin |
|---------|--------------|----------------|--------------|-------------|--------|---------------|

**Formulas:**
\`\`\`excel
Gross Margin (F7):   =E7/C7        // Gross Profit / Revenue
EBITDA Margin (H7):  =G7/C7        // EBITDA / Revenue
\`\`\`

### Optional Columns (add based on industry/question)

- **FCF / FCF Margin** — for capital-intensive or SaaS businesses
- **Net Income / Net Margin** — for mature profitable companies
- **Rule of 40** — SaaS: \`=RevenueGrowth + FCFMargin\`
- **R&D/Revenue**, **CapEx/Revenue** — for tech or asset-heavy

### The 5-10 Rule

5 operating metrics + 5 valuation metrics = 10 total columns. If >15 metrics, cut ruthlessly.

### Statistics Block

After the last company row, leave one blank row, then add:

\`\`\`excel
Maximum:        =MAX(B7:B12)
75th Pct:       =QUARTILE(B7:B12, 3)
Median:         =MEDIAN(B7:B12)
25th Pct:       =QUARTILE(B7:B12, 1)
Minimum:        =MIN(B7:B12)
\`\`\`

Apply statistics to: all ratios, margins, growth rates, and multiples.
**Do NOT** apply statistics to absolute size metrics (Revenue $, EBITDA $, Market Cap $).

---

## Section 2: Valuation Multiples

### Core Columns (always include)

| Company | Market Cap | Enterprise Value | EV/Revenue | EV/EBITDA | P/E |

**Formulas:**
\`\`\`excel
EV = Market Cap + Net Debt   // or Market Cap - Net Cash
EV/Revenue:  =EV / LTM_Revenue    // reference operating section
EV/EBITDA:   =EV / LTM_EBITDA     // reference operating section — NEVER re-input
P/E:         =MarketCap / NetIncome
\`\`\`

**Cross-reference rule:** Valuation multiples MUST reference the operating section. Never input the same raw data twice.

### Sanity Checks

- EV/Revenue: typically 0.5–20x (varies widely by industry and growth)
- EV/EBITDA: typically 8–25x
- P/E: typically 10–50x
- Gross margin > EBITDA margin > Net margin (always true by definition)
- Higher growth → higher multiples (check if outliers make sense)

---

## Formatting Standards

**Color conventions:**
- **Blue text**: all hardcoded inputs
- **Black text**: all formulas

**Cell comments on all inputs** — format: \`"Source: Bloomberg, 2024-12-15"\` or \`"Q3 2024 10-K, p.42"\`. Include hyperlinks to SEC filings where possible.

**Visual layout:**
- Section headers: dark background, white bold text (optional but recommended)
- Column headers: light background, bold
- Statistics rows: light gray background
- One blank row between company data and statistics
- All numbers: right-aligned, center-aligned for cleanliness
- Percentages: \`0.0%\`; Multiples: \`0.0"x"\`; Dollars: \`#,##0\` with thousands separator
- No borders on individual cells — clean minimal appearance

---

## Industry-Specific Metrics

**Software/SaaS:**
- Must have: Revenue Growth, Gross Margin (>70% target), Rule of 40
- Optional: ARR, Net Dollar Retention, CAC Payback

**Financials:**
- Must have: ROE, ROA, P/E
- Skip: Gross Margin, EBITDA (not meaningful for banks)

**Industrials:**
- Must have: EBITDA Margin, Asset Turnover, CapEx/Revenue
- Optional: Backlog, Order Book

**Healthcare:**
- Must have: R&D/Revenue, EBITDA Margin
- Optional: Pipeline value, Reimbursement risk notes

**Consumer/Retail:**
- Must have: Revenue Growth, Gross Margin, SSS (Same-Store Sales)
- Optional: Inventory Turns, Customer Acquisition Cost

---

## Quality Checks

Before delivering:
- [ ] All companies are truly comparable (similar business model/scale)
- [ ] Consistent time periods (don't mix LTM and quarterly for same metric)
- [ ] All formulas reference cells — no hardcoded duplicates
- [ ] Every hardcoded input has a cell comment with source
- [ ] Statistics block covers all comparable metrics (not size metrics)
- [ ] No \`#DIV/0!\`, \`#REF!\`, or \`#N/A\` errors
- [ ] Negative EBITDA companies excluded from EV/EBITDA (use EV/Revenue instead)

## Red Flags

🚩 Different fiscal year ends mixed together
🚩 Mixing pure-play and conglomerates
🚩 Negative EBITDA companies valued on EBITDA multiples
🚩 P/E >100x without a clear hypergrowth story
🚩 Missing data without explanation

**When in doubt, exclude the company.** 3 perfect comps beat 6 questionable ones.
`,
      },
    ],
  },
  {
    name: "3-statements",
    files: [
      {
        path: "SKILL.md",
        data: `---
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

Typically 5 years. Columns: \`FY2021A | FY2022A | FY2023A | FY2024E | FY2025E | FY2026E | FY2027E | FY2028E\`

The vertical border between A (actual) and E (estimate) columns should be clearly marked.

---

## Income Statement

\`\`\`
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
\`\`\`

**Sign convention:** Expenses are positive; EBT = EBIT − Interest (positive interest = expense).

---

## Balance Sheet

\`\`\`
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
\`\`\`

---

## Cash Flow Statement (Indirect Method)

\`\`\`
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
\`\`\`

**Sign rules:** Cash inflows = positive. Cash outflows = negative. Increase in current asset = negative (use of cash). Increase in current liability = positive (source of cash).

---

## Supporting Schedules

### Depreciation / PP&E Roll-Forward
\`\`\`
Beginning PP&E (gross)   [=prior ending]
+ CapEx                  [=Assumptions]
- Disposals              [input or 0]
Ending PP&E (gross)      [=SUM]
- Accumulated Depreciation [roll-forward: prior + D&A]
PP&E, net                [=Gross - Accum Depr]
D&A                      [=Beginning PP&E * depr% or straight-line]
\`\`\`

### Debt Schedule
\`\`\`
Beginning Balance        [=prior ending]
+ New Issuance           [input]
- Repayments             [input or amort schedule]
Ending Balance           [=SUM]
Interest Expense         [=Beginning Balance * rate]   ← beginning balance avoids circularity
\`\`\`

### Working Capital (from DSO / DIO / DPO)
\`\`\`
AR  = Revenue * DSO / 365
Inv = COGS * DIO / 365
AP  = COGS * DPO / 365
\`\`\`

---

## Scenario Toggle

In Assumptions tab, create a dropdown:
- 1 = Base Case
- 2 = Upside Case
- 3 = Downside Case

Use \`CHOOSE\` or \`INDEX\` to pull the right assumption set:
\`\`\`excel
=CHOOSE(ScenarioCell, BaseGrowth, UpsideGrowth, DownsideGrowth)
\`\`\`

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
\`\`\`excel
=IF(SUM(ABS(AllChecks))=0, "✓ ALL CHECKS PASS", "✗ ERRORS — REVIEW CHECKS")
\`\`\`

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
`,
      },
      {
        path: "references/formatting.md",
        data: `# Formatting Standards Reference

| Element | Format |
|---------|--------|
| Hard-coded inputs | Blue font |
| Formulas | Black font |
| Links to other sheets | Green font |
| Check cells | Red if error, green if balanced |
| Negative values | Parentheses, not minus signs |
| Currency | No decimals for large figures, 2 decimals for per-share |
| Percentages | 1 decimal place |
| Headers | Bold, bottom border |
| Units row | Include units row below headers ($ millions, %, etc.) |

## Visual Separation Guidelines

- Thin vertical border between historical and projected columns
- Thick bottom border after section totals (e.g., Total Assets)
- Single bottom border for subtotals
- Double bottom border for grand totals

## Total and Subtotal Row Formatting

All total and subtotal rows must use **bold font formatting** for their numerical values to clearly distinguish aggregated figures from individual line items.

### Income Statement (P&L) Tab
| Row | Formatting |
|-----|------------|
| Gross Revenue | Bold |
| Total Cost of Revenue | Bold |
| Gross Profit | Bold |
| Total SG&A | Bold |
| EBITDA | Bold |
| EBIT | Bold |
| EBT | Bold |
| Net Profit After Tax | Bold |

### Balance Sheet Tab
| Row | Formatting |
|-----|------------|
| Total Current Assets | Bold |
| Total Non-Current Assets | Bold |
| Total Other Assets | Bold |
| Total Assets | Bold |
| Total Current Liabilities | Bold |
| Total Non-Current Liabilities | Bold |
| Total Equity | Bold |
| Total Liabilities and Equity | Bold |

### Cash Flow Statement Tab
| Row | Formatting |
|-----|------------|
| Cash Generated from Operations Before Working Capital Changes | Bold |
| Total Working Capital Changes | Bold |
| Net Cash Generated from Operations | Bold |
| Net Cash Flow from Investing Activities | Bold |
| Net Cash Flow from Financing Activities | Bold |
| Closing Cash Balance | Bold |

**Note:** This list is non-exhaustive. Apply bold formatting to any row that represents a total, subtotal, or summary calculation across the model.

## Balance Sheet Check Row Formatting

The Balance Sheet check row (below Total Liabilities and Equity) uses conditional number formatting that displays non-zero values in red. When the balance sheet balances correctly (check = 0), the values display in black or standard formatting.

| Check Value | Font Color |
|-------------|------------|
| = 0 (balanced) | Black (standard) |
| ≠ 0 (error) | Red |

**Implementation:** Apply custom number format \`[Red][<>0]0.00;[Red][<>0](0.00);0.00\` or use Excel conditional formatting with the rule "Cell Value ≠ 0" → Red font.

## Margin Row Formatting

| Element | Format |
|---------|--------|
| Margin % rows | Indent, italics, 1 decimal place |
| Positive trend | No special formatting (or subtle green) |
| Negative trend | Flag for review (subtle yellow) |
| Below peer average | Consider highlighting for discussion |

## Credit Metric Formatting

| Element | Format |
|---------|--------|
| Leverage multiples | 1 decimal with "x" suffix (e.g., 2.5x) |
| Percentages | 1 decimal with "%" suffix |
| Net Debt negative | Parentheses, indicates net cash position |
| Section header | Bold, "CREDIT METRICS" |
| Separator line | Thin border above credit metrics section |

## Credit Metric Threshold Colors

| Metric | Green | Yellow | Red |
|--------|-------|--------|-----|
| Total Debt / EBITDA | < 2.5x | 2.5x-4.0x | > 4.0x |
| Net Debt / EBITDA | < 2.0x | 2.0x-3.5x | > 3.5x |
| Interest Coverage | > 4.0x | 2.5x-4.0x | < 2.5x |
| Debt / Total Cap | < 40% | 40%-60% | > 60% |
| Current Ratio | > 1.5x | 1.0x-1.5x | < 1.0x |
| Quick Ratio | > 1.0x | 0.75x-1.0x | < 0.75x |

## Conditional Formatting for Checks Tab

- Cell contains pass indicator → Green fill
- Cell contains fail indicator → Red fill
- Cell contains warning → Yellow fill
- Difference cells = 0 → Light green fill
- Difference cells ≠ 0 → Light red fill

## Margin Reasonability Flags

- Gross Margin < 0% → ERROR: Review COGS
- Gross Margin > 80% → WARNING: Verify revenue/COGS
- EBITDA Margin < 0% → FLAG: Operating losses
- EBITDA Margin > 50% → WARNING: Unusually high
- Net Margin < 0% → FLAG: Net losses (may be acceptable in growth phase)
- Net Margin > Gross Margin → ERROR: Formula issue
`,
      },
      {
        path: "references/formulas.md",
        data: `# Formula Reference

**IMPORTANT:** Use the formulas outlined in this reference document unless otherwise specified by the user.

---

## Core Linkages

\`\`\`
Balance Sheet:        Assets = Liabilities + Equity
Net Income:           IS Net Income → CF Operations (starting point)
Cash Flow:            ΔCash = CFO + CFI + CFF
Cash Tie-Out:         Ending Cash (CF) = Cash (BS Asset)
Cash Monthly/Annual:  Closing Cash (Monthly) = Closing Cash (Annual)
Retained Earnings:    Prior RE + Net Income - Dividends = Ending RE
Equity Raise:         ΔCommon Stock/APIC (BS) = Equity Issuance (CFF)
Year 0 Equity:        Equity Raised (Year 0) = Beginning Equity (Year 1)
\`\`\`

## Gross Profit Calculation

**IMPORTANT:** Gross Profit must be calculated from Net Revenue, not Gross Revenue.

\`\`\`
Net Revenue - Cost of Revenue = Gross Profit
\`\`\`

| Term | Definition |
|------|------------|
| Gross Revenue | Total revenue before any deductions |
| Net Revenue | Gross Revenue - Returns - Allowances - Discounts |
| Cost of Revenue | Direct costs attributable to production of goods/services sold |
| Gross Profit | Net Revenue - Cost of Revenue |

**Note:** Always use Net Revenue (also called "Net Sales" or simply "Revenue" on most financial statements) as the starting point for profitability calculations. Gross Revenue overstates the true top-line performance.

## Margin Formulas

\`\`\`
Gross Margin %      = Gross Profit / Net Revenue
EBITDA              = EBIT + D&A  (or = Gross Profit - OpEx)
EBITDA Margin %     = EBITDA / Net Revenue
EBIT Margin %       = EBIT / Net Revenue
Net Income Margin % = Net Income / Net Revenue
\`\`\`

## Credit Metric Formulas

\`\`\`
Total Debt            = Current Portion of Debt + Long-Term Debt
Net Debt              = Total Debt - Cash
Total Debt / EBITDA   = Total Debt / EBITDA (from IS)
Net Debt / EBITDA     = Net Debt / EBITDA (from IS)
Interest Coverage     = EBITDA / Interest Expense (from IS)
Net Int Exp % Debt    = Net Interest Expense / Long-Term Debt
Debt / Total Cap      = Total Debt / (Total Debt + Total Equity)
Debt / Equity         = Total Debt / Total Equity
Current Ratio         = Total Current Assets / Total Current Liabilities
Quick Ratio           = (Total Current Assets - Inventory) / Total Current Liabilities
\`\`\`

## Forecast Formulas (% of Net Revenue Method)

\`\`\`
Cost of Revenue (Forecast) = Net Revenue × Cost of Revenue % Assumption
S&M (Forecast)             = Net Revenue × S&M % Assumption
G&A (Forecast)             = Net Revenue × G&A % Assumption
R&D (Forecast)             = Net Revenue × R&D % Assumption
SBC (Forecast)             = Net Revenue × SBC % Assumption
\`\`\`

## Working Capital Formulas

\`\`\`
Accounts Receivable
  Prior AR
  + Revenue (from IS)
  - Cash Collections (plug)
  = Ending AR
  DSO = (AR / Revenue) × 365

Inventory
  Prior Inventory
  + Purchases (plug)
  - COGS (from IS)
  = Ending Inventory
  DIO = (Inventory / COGS) × 365

Accounts Payable
  Prior AP
  + Purchases (from Inventory calc)
  - Cash Payments (plug)
  = Ending AP
  DPO = (AP / COGS) × 365

Net Working Capital = AR + Inventory - AP
ΔWC = Current NWC - Prior NWC
\`\`\`

## D&A Schedule Formulas

\`\`\`
Beginning PP&E (Gross)
+ CapEx
= Ending PP&E (Gross)

Beginning Accumulated Depreciation
+ Depreciation Expense
= Ending Accumulated Depreciation

PP&E (Net) = Gross PP&E - Accumulated Depreciation
\`\`\`

## Debt Schedule Formulas

\`\`\`
Beginning Debt Balance
+ New Borrowings
- Repayments
= Ending Debt Balance

Interest Expense = Avg Debt Balance × Interest Rate
  (Use beginning balance to avoid circularity, or iterate if circular refs enabled)
\`\`\`

## Retained Earnings Formula

\`\`\`
Beginning Retained Earnings
+ Net Income (from IS)
+ Stock-Based Compensation (SBC) (from IS)
- Dividends
= Ending Retained Earnings
\`\`\`

## NOL (Net Operating Loss) Schedule Formulas

\`\`\`
NOL CARRYFORWARD SCHEDULE

Beginning NOL Balance (Year 1 / Formation = 0)
+ NOL Generated (if EBT < 0, then ABS(EBT), else 0)
- NOL Utilized (limited by taxable income and utilization cap)
= Ending NOL Balance

STARTING BALANCE RULE

For a new business or first modeled period:
  Beginning NOL Balance = 0
  NOL can only increase through realized losses (EBT < 0)
  NOL cannot be created from thin air or assumed

NOL UTILIZATION CALCULATION

Pre-Tax Income (EBT)
  If EBT > 0:
    NOL Available = Beginning NOL Balance
    Utilization Limit = EBT × 80%  (post-2017 federal limit)
    NOL Utilized = MIN(NOL Available, Utilization Limit)
    Taxable Income = EBT - NOL Utilized
  If EBT ≤ 0:
    NOL Utilized = 0
    Taxable Income = 0
    NOL Generated = ABS(EBT)

TAX CALCULATION WITH NOL

Taxes Payable = MAX(0, Taxable Income × Tax Rate)
  (Taxes cannot be negative; losses create NOL asset instead)

DEFERRED TAX ASSET (DTA) FOR NOL

DTA - NOL Carryforward = Ending NOL Balance × Tax Rate
ΔDTA = Current DTA - Prior DTA
  (Increase in DTA = non-cash benefit on CF)
  (Decrease in DTA = non-cash expense on CF)
\`\`\`

## Balance Sheet Structure

\`\`\`
ASSETS
  Cash (from CF ending cash)
  Accounts Receivable (from WC)
  Inventory (from WC)
  Total Current Assets
  
  PP&E, Net (from DA)
  Deferred Tax Asset - NOL (from NOL schedule)
  Total Non-Current Assets
  Total Assets

LIABILITIES
  Accounts Payable (from WC)
  Current Portion of Debt (from Debt)
  Total Current Liabilities
  
  Long-Term Debt (from Debt)
  Total Liabilities

EQUITY
  Common Stock
  Retained Earnings (from RE schedule)
  Total Equity

CHECK: Assets - Liabilities - Equity = 0
\`\`\`

## Cash Flow Statement Structure

\`\`\`
CASH FROM OPERATIONS (CFO)
  Net Income (LINK: IS)
  + D&A (LINK: DA schedule)
  + Stock-Based Compensation (SBC) (LINK: IS or Assumptions)
  - ΔDTA (Deferred Tax Asset) (LINK: NOL schedule; increase in DTA = use of cash)
  - ΔAR (LINK: WC)
  - ΔInventory (LINK: WC)
  + ΔAP (LINK: WC)
  = CFO

CASH FROM INVESTING (CFI)
  - CapEx (LINK: DA schedule)
  = CFI

CASH FROM FINANCING (CFF)
  + Debt Issuance (LINK: Debt)
  - Debt Repayment (LINK: Debt)
  + Equity Issuance (LINK: BS Common Stock/APIC)
  - Dividends (LINK: RE schedule)
  = CFF

Net Change in Cash = CFO + CFI + CFF
Beginning Cash
+ Net Change in Cash
= Ending Cash (LINK TO: BS Cash)
\`\`\`

## Income Statement Structure

\`\`\`
Net Revenue
  Growth %
(-) Cost of Revenue
  % of Net Revenue
────────────────
Gross Profit (= Net Revenue - Cost of Revenue)
  Gross Margin %

(-) S&M
  % of Net Revenue
(-) G&A
  % of Net Revenue
(-) R&D
  % of Net Revenue
(-) D&A
(-) SBC
  % of Net Revenue
────────────────
EBIT
  EBIT Margin %

EBITDA
  EBITDA Margin %

(-) Interest Expense
────────────────
EBT (Pre-Tax Income)
(-) NOL Utilization (from NOL schedule, reduces taxable income)
────────────────
Taxable Income
(-) Taxes (Taxable Income × Tax Rate)
────────────────
Net Income
  Net Income Margin %
\`\`\`

## Check Formulas

\`\`\`
BS Balance Check:       = Assets - Liabilities - Equity  (must = 0)
Cash Tie-Out:           = BS Cash - CF Ending Cash       (must = 0)
RE Roll-Forward:        = Prior RE + NI + SBC - Div - BS RE  (must = 0)
DTA Tie-Out:            = NOL Schedule DTA - BS DTA      (must = 0)
Equity Raise Tie-Out:   = ΔCommon Stock/APIC (BS) - Equity Issuance (CFF)  (must = 0)
Year 0 Equity Tie-Out:  = Equity Raised (Year 0) - Beginning Equity (Year 1)  (must = 0)
Cash Monthly vs Annual: = Closing Cash (Monthly) - Closing Cash (Annual)  (must = 0)
NOL Utilization Cap:    = NOL Utilized ≤ EBT × 80%       (must be TRUE for post-2017)
NOL Non-Negative:       = Ending NOL Balance ≥ 0         (must be TRUE)
NOL Starting Balance:   = Beginning NOL (Year 1) = 0     (must be TRUE for new business)
NOL Accumulation:       = NOL increases only when EBT < 0 (losses generate NOL)
\`\`\`
`,
      },
      {
        path: "references/sec-filings.md",
        data: `# SEC Filings Data Extraction Reference

**When to Use:** Only reference this file when a model template specifically requires pulling data from SEC filings (10-K, 10-Q). For templates that provide data directly or use other data sources, this reference is not needed.

---

## Extracting Data from SEC Filings (10-K / 10-Q)

When populating a model template with public company data, extract financials directly from SEC filings.

### Step 1: Locate the Filing

1. Use SEC EDGAR: \`https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=[TICKER]&type=10-K\`
2. For quarterly data, use \`type=10-Q\`

### Step 2: Identify Filing Currency

Before extracting data, identify the reporting currency:
- Check the cover page or header for reporting currency
- Look at statement headers (e.g., "in thousands of U.S. dollars")
- Review Note 1 (Summary of Significant Accounting Policies)

**Common Currency Indicators**

| Indicator | Currency |
|-----------|----------|
| $, USD | US Dollar |
| €, EUR | Euro |
| £, GBP | British Pound |
| ¥, JPY | Japanese Yen |
| ¥, CNY, RMB | Chinese Yuan |
| CHF | Swiss Franc |
| CAD, C$ | Canadian Dollar |

Set model currency to match filing; document in Assumptions tab.

### Step 3: Navigate to Financial Statements

Within the 10-K or 10-Q, locate:
- **Item 8** (10-K) or **Item 1** (10-Q): Financial Statements
- Key sections to extract:
  - Consolidated Statements of Operations (Income Statement)
  - Consolidated Balance Sheets
  - Consolidated Statements of Cash Flows
  - Notes to Financial Statements (for schedule details)

### Step 4: Data Extraction Mapping

**Income Statement (from Consolidated Statements of Operations)**

| Filing Line Item | Model Line Item |
|------------------|-----------------|
| Net revenues / Net sales | Revenue |
| Cost of goods sold | COGS |
| Selling, general and administrative | SG&A |
| Depreciation and amortization | D&A |
| Interest expense, net | Interest Expense |
| Income tax expense | Taxes |
| Net income | Net Income |

**Balance Sheet (from Consolidated Balance Sheets)**

| Filing Line Item | Model Line Item |
|------------------|-----------------|
| Cash and cash equivalents | Cash |
| Accounts receivable, net | AR |
| Inventories | Inventory |
| Property, plant and equipment, net | PP&E (Net) |
| Total assets | Total Assets |
| Accounts payable | AP |
| Short-term debt / Current portion of LT debt | Current Debt |
| Long-term debt | LT Debt |
| Retained earnings | Retained Earnings |
| Total stockholders' equity | Total Equity |

**Cash Flow Statement (from Consolidated Statements of Cash Flows)**

| Filing Line Item | Model Line Item |
|------------------|-----------------|
| Net income | Net Income |
| Depreciation and amortization | D&A |
| Changes in accounts receivable | ΔAR |
| Changes in inventories | ΔInventory |
| Changes in accounts payable | ΔAP |
| Capital expenditures | CapEx |
| Proceeds from issuance of common stock | Equity Issuance |
| Proceeds from / Repayments of debt | Debt activity |
| Dividends paid | Dividends |

### Step 5: Extract Supporting Detail from Notes

For schedules, pull from Notes to Financial Statements:
- **Note: Debt** → Maturity schedule, interest rates, covenants
- **Note: Property, Plant & Equipment** → Gross PP&E, accumulated depreciation, useful lives
- **Note: Revenue** → Segment breakdowns, geographic splits
- **Note: Leases** → Operating vs. finance lease obligations

### Step 6: Historical Data Requirements

Extract 3 years of historical data minimum:
- 10-K provides 3 years of IS/CF, 2 years of BS
- For 3rd year BS, pull from prior year's 10-K
- Use 10-Qs to fill in quarterly granularity if needed

### Data Extraction Checklist

- Identify reporting currency and scale (thousands, millions)
- 3 years historical Income Statement
- 3 years historical Cash Flow Statement
- 3 years historical Balance Sheet
- Verify IS Net Income = CF starting Net Income (each year)
- Verify BS Cash = CF Ending Cash (each year)
- Extract debt maturity schedule from notes
- Extract D&A detail or useful life assumptions
- Note any non-recurring / one-time items to normalize

### Handling Common Filing Variations

| Variation | How to Handle |
|-----------|---------------|
| D&A embedded in COGS/SG&A | Pull D&A from Cash Flow Statement |
| "Other" line items are material | Check notes for breakdown |
| Restatements | Use restated figures, note in assumptions |
| Fiscal year ≠ calendar year | Label with fiscal year end (e.g., FYE Jan 2025) |
| Non-USD reporting currency | Adapt model currency to match filing |
`,
      },
    ],
  },
  {
    name: "check-model",
    files: [
      {
        path: "SKILL.md",
        data: `---
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
- Hardcoded numbers inside formulas (partial hardcodes like \`=B7*1.15\`)
- Inconsistent formulas across a row/column range (should be the same formula dragged across)
- \`#REF!\`, \`#VALUE!\`, \`#N/A\`, \`#DIV/0!\` errors anywhere
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
`,
      },
    ],
  },
  {
    name: "merger-model",
    files: [
      {
        path: "SKILL.md",
        data: `---
name: merger-model
description: Build M&A merger models and accretion/dilution analysis in Excel. Models pro forma EPS impact, synergy sensitivities, purchase price allocation, and deal consideration mix. Use when evaluating an acquisition, preparing merger consequences analysis, or advising on deal terms. Triggers on "merger model", "accretion dilution", "M&A model", "pro forma EPS", "merger consequences", "deal impact analysis", or "is this deal accretive".
platform: excel
---

# Merger Model (Accretion/Dilution Analysis)

READ THIS ENTIRE FILE before building any merger model.

## Sheet Structure

1. **Assumptions** — acquirer, target, and deal inputs
2. **Sources & Uses** — Day 1 capital structure
3. **Pro Forma IS** — combined income statement with adjustments
4. **Returns Summary** — accretion/dilution and sensitivity tables

---

## Step 1: Gather Inputs

**Acquirer:**
- Company name, current share price, shares outstanding (diluted)
- LTM and NTM EPS (GAAP and adjusted)
- Current P/E multiple
- Pre-tax cost of debt, tax rate
- Cash on balance sheet, existing debt

**Target:**
- Company name, current share price (if public), shares outstanding
- LTM and NTM Net Income
- Enterprise value (if private)

**Deal Terms:**
- Offer price per share (or premium % to current)
- Consideration mix: % cash vs. % stock
- New debt raised to fund cash portion
- Expected synergies (revenue and cost) and phase-in timeline
- Transaction fees (typically 2–4% of EV)
- Financing fees
- Intangible asset step-up and amortization period

---

## Step 2: Purchase Price Analysis

\`\`\`
Offer price per share         [input]
Premium to current            [=Offer/TargetPrice - 1]
Equity value                  [=OfferPrice * TargetShares]
(+) Net debt assumed          [=TargetDebt - TargetCash]
Enterprise Value              [=EquityValue + NetDebt]
EV / EBITDA implied           [=EV / TargetEBITDA]
P/E implied                   [=OfferPrice / TargetEPS]
\`\`\`

---

## Step 3: Sources & Uses

\`\`\`
SOURCES                       $        USES                          $
New Debt Raised             [input]   Equity Purchase Price        [=Equity Value]
Cash on Hand (acquirer)     [input]   Refinance Target Debt        [=Target Net Debt]
New Shares Issued           [=shares*AcqPrice]  Transaction Fees  [=EV*fee%]
                                      Financing Fees               [input]
Total Sources               [=SUM]    Total Uses                   [=SUM]
Check: Sources - Uses = 0   [must = 0]
\`\`\`

---

## Step 4: Pro Forma EPS (Accretion / Dilution)

Calculate for Year 1, Year 2, Year 3:

\`\`\`
                              Standalone    Pro Forma    Delta
Acquirer Net Income           [input]       [+target NI + synergies - costs]
Target Net Income             [input]       [included above]
(+) Synergies (after-tax)                   [=PreTaxSynergies*(1-TaxRate)]
(-) Foregone interest on cash (after-tax)   [=CashUsed*cashRate*(1-TaxRate)]
(-) New debt interest (after-tax)           [=NewDebt*debtRate*(1-TaxRate)]
(-) Intangible amortization (after-tax)     [=StepUp/amortYears*(1-TaxRate)]
Pro Forma Net Income          [=SUM of above adjustments]
Pro Forma Shares              [=AcqShares + NewSharesIssued]
Pro Forma EPS                 [=ProFormaNI/ProFormaShares]
Standalone EPS                [=AcqNI/AcqShares]
Accretion / (Dilution) $      [=ProFormaEPS - StandaloneEPS]
Accretion / (Dilution) %      [=Delta/StandaloneEPS]
\`\`\`

**Key adjustments explained:**
- **Foregone interest**: Cash used in deal can't earn returns — opportunity cost
- **New debt interest**: After-tax cost of debt raised for the deal
- **Intangible amortization**: Purchase price step-up creates D&A that hits GAAP NI
- **Synergies**: Phase in — Year 1 often only 25–50% of run-rate

---

## Step 5: Sensitivity Tables

**Table 1: Accretion/Dilution % vs. Synergies × Offer Premium**

| | $0M syn | $25M syn | $50M syn | $75M syn | $100M syn |
|---|---------|----------|----------|----------|-----------|
| 15% premium | | | | | |
| 20% premium | | | | | |
| 25% premium | | | | | |
| 30% premium | | | | | |

Each cell: full EPS accretion/dilution recalculation for that synergy + premium combination.

**Table 2: Accretion/Dilution vs. Consideration Mix**

| | 100% cash | 75/25 | 50/50 | 25/75 | 100% stock |
|---|-----------|-------|-------|-------|------------|
| Year 1 EPS impact | | | | | |
| Year 2 EPS impact | | | | | |

---

## Step 6: Breakeven Synergies

Calculate the minimum synergies needed for the deal to be EPS-neutral in Year 1:

\`\`\`
Breakeven Synergies (pre-tax) = [Total EPS dilution from deal costs] / (1 - TaxRate)
\`\`\`

Show as a single output cell, then sanity check: is this achievable given the deal rationale?

---

## Output Checklist

- [ ] Sources = Uses (check row = 0)
- [ ] Both GAAP and adjusted EPS shown where relevant
- [ ] Synergy phase-in reflected (Year 1 ≠ Year 3 run-rate)
- [ ] Foregone interest and new debt interest both included
- [ ] Intangible amortization calculated and tax-effected
- [ ] Exchange ratio for stock deals = OfferPrice / AcqCurrentPrice
- [ ] Pro forma shares = AcqShares + new shares issued (stock portion only)
- [ ] Both sensitivity tables fully populated
- [ ] Breakeven synergies calculated

## Important Notes

- Always show both GAAP and adjusted (cash) EPS
- **Stock deals:** use acquirer's current price for exchange ratio; new shares dilute EPS
- **Synergy phase-in is critical** — Year 1 is often only 25–50% of run-rate synergies
- **Don't forget foregone interest** on cash used — it's a real cost
- Tax rate on all adjustments (synergies, interest) should match acquirer's marginal rate
- Transaction fees reduce Day 1 equity value — include in uses
`,
      },
    ],
  },
  {
    name: "datapack-builder",
    files: [
      {
        path: "SKILL.md",
        data: `---
name: datapack-builder
description: Build professional financial data packs and standardized investment workbooks in Excel from CIMs, SEC filings, or financial data. Extract, normalize, and structure financial statements into IC-ready Excel workbooks with 8-tab standard structure. Use for M&A due diligence, PE analysis, or standardizing financial reporting. Triggers on "build a datapack", "data pack", "financial data pack", "standardize financials", "extract financials from CIM", or "IC materials".
platform: excel
---

# Financial Data Pack Builder

READ THIS ENTIRE FILE before building any data pack.

## Critical Rules

1. **Financial data (money)** → currency format with \`$\` — Revenue, EBITDA, Income, Debt, Assets
2. **Operational data (counts)** → number format, NO \`$\` — Units, Stores, Employees, Customers
3. **Rates and ratios** → percentage format \`0.0%\` — Margins, Growth, Yield, Occupancy
4. **Years** → text format to prevent comma insertion: \`2024\` not \`2,024\`
5. **All calculations** → formulas only — never hardcode a computed value
6. **Negatives** → parentheses format \`$(123.0)\` not \`-$123\`

## Color Conventions

- **Blue text**: ALL hardcoded inputs (historical data entered from source)
- **Black text**: ALL formulas and calculations
- **Green text**: Cross-tab links

---

## Standard 8-Tab Structure

Unless instructed otherwise, create these tabs in order:

1. **Executive Summary** — one-page overview
2. **Historical Financials** — Income Statement
3. **Balance Sheet**
4. **Cash Flow Statement**
5. **Operating Metrics** — non-financial KPIs
6. **Segment Performance** — if applicable
7. **Market Analysis** — industry context
8. **Investment Highlights** — investment thesis narrative

---

## Tab 1: Executive Summary

Contents:
- Company overview (2–3 sentences: business model, products, geography)
- Key investment highlights (3–5 bullet points)
- Financial snapshot table:

| Metric | 2021A | 2022A | 2023A | 2024E |
|--------|-------|-------|-------|-------|
| Revenue ($mm) | | | | |
| EBITDA ($mm) | | | | |
| EBITDA Margin | | | | |
| Revenue Growth | | | | |

- Transaction overview if applicable
- File naming: \`CompanyName_DataPack_YYYY-MM-DD.xlsx\`

---

## Tab 2: Historical Financials (IS)

\`\`\`
Revenue by Segment / Product Line    [$ millions]
  Segment A                          [blue input]
  Segment B                          [blue input]
Total Revenue                        [=SUM, formula]
  % growth YoY                       [=current/prior-1]

Cost of Revenue                      [=Revenue*COGS%]
Gross Profit                         [=Revenue-COGS]
  Gross Margin %                     [=GP/Revenue]

Operating Expenses:
  Sales & Marketing                  [input or % formula]
  Research & Development             [input or % formula]
  General & Administrative           [input or % formula]
Total OpEx                           [=SUM]

EBITDA                               [=GP - OpEx + D&A back-add if needed]
  EBITDA Margin %                    [=EBITDA/Revenue]
Adjusted EBITDA                      [=EBITDA + adjustments]

Depreciation & Amortization          [input]
EBIT                                 [=EBITDA - D&A]
Interest Expense                     [input]
EBT                                  [=EBIT - Interest]
Tax Expense                          [=MAX(0,EBT)*TaxRate]
Net Income                           [=EBT - Taxes]
\`\`\`

Format: years as columns (text: \`2021A\`, \`2022A\`), line items as rows. Single underline above subtotals, double underline below Net Income.

---

## Tab 3: Balance Sheet

Follow standard structure:
- Current Assets (Cash, AR, Inventory, Prepaid, Other)
- Long-Term Assets (PP&E net, Intangibles, Goodwill, Other)
- Current Liabilities (AP, Accrued, Current Debt, Other)
- Long-Term Liabilities (LT Debt, Deferred Tax, Other)
- Shareholders' Equity (Common Stock, Retained Earnings)

**Mandatory check formula:**
\`\`\`excel
=TotalAssets - (TotalLiabilities + TotalEquity)    // must = 0 every period
\`\`\`

Include working capital calculation:
\`\`\`
Working Capital = Current Assets - Current Liabilities
Net Debt = Total Debt - Cash
\`\`\`

---

## Tab 4: Cash Flow Statement

Indirect method:
- CFO: Net Income → add back non-cash → WC changes
- CFI: CapEx, acquisitions
- CFF: Debt issuance/repayment, equity, dividends

**Tie-out check:**
\`\`\`excel
=CF_EndingCash - BS_Cash    // must = 0
\`\`\`

Label cash outflows consistently (all negative or all in parentheses — pick one).

---

## Tab 5: Operating Metrics

**CRITICAL: NO dollar signs on operational metrics.**

Examples by industry:

**SaaS/Software:** ARR ($), Customer Count (number), Churn Rate (%), NRR (%), CAC Payback (months)
**Manufacturing:** Units Produced (number), Capacity Utilization (%), Inventory Turns (number), Revenue per Unit ($)
**Real Estate:** Properties (number), Occupancy Rate (%), ADR ($), RevPAR ($), NOI ($)
**Healthcare:** Locations (number), Providers (number), Revenue per Visit ($), Payor Mix (%)
**Retail:** Store Count (number), SSS Growth (%), Revenue per Store ($), Inventory Turns (number)

Format: counts as \`#,##0\`, currency as \`$#,##0.0\`, rates as \`0.0%\`

---

## Tab 6: Segment Performance (if applicable)

Revenue and profitability by business unit/geography/product line:
- Each segment: Revenue, Gross Profit, GP%, EBITDA, EBITDA%
- Segment roll-up formula ties to Tab 2 total revenue

---

## Tab 7: Market Analysis

- Market size and growth (TAM, SAM)
- Competitive positioning and market share
- Industry trends and benchmarks
- Peer comparisons (reference comps-analysis skill if needed)
- Regulatory environment if relevant

Cite sources for market data (web search, industry reports).

---

## Tab 8: Investment Highlights

- Competitive strengths (product differentiation, IP, relationships)
- Growth opportunities (new markets, products, M&A)
- Risk factors and mitigants
- Management assessment
- Investment thesis summary

---

## EBITDA Normalization

For each adjustment, document: what, why, amount by year, source.

**Common add-backs:**
- Restructuring charges (only if truly non-recurring)
- Stock-based compensation (standard for PE analysis)
- Acquisition-related costs (transaction fees, integration)
- Legal settlements (only if isolated incident)
- Related party normalization (management fees, above-market rent)

Show reconciliation: Reported EBITDA → Adjusted EBITDA with each line item.

**Management Case vs. Base Case:**
- Management Case: accept all proposed adjustments
- Base Case: only clearly non-recurring items — more conservative and defensible to IC

---

## Scenarios (if projections included)

- **Management Case**: company projections as-provided, clearly labeled
- **Base Case**: apply conservative haircut to growth and margins based on track record
- **Downside Case**: stress test for recession/competition, check covenant compliance

Document all adjustment rationale — IC will ask.

---

## Professional Formatting Standards

- Bold headers, left-aligned; numbers right-aligned
- 2-space indentation for sub-items
- Single underline above subtotals; double underline below final totals
- Freeze panes on row/column headers
- Consistent font (Calibri or Arial, 11pt)
- Minimal borders (only where structurally needed)
- Column widths 12–15 characters

---

## Delivery Checklist

- [ ] All 8 tabs present and logically sequenced
- [ ] Every number traced to source — cell comments with citations
- [ ] All calculations are formula-based (no hardcoded computed values)
- [ ] Balance sheet balances (check formula = 0)
- [ ] Cash flow ties to balance sheet
- [ ] Years display without commas
- [ ] Financial data has \`$\`; operational data does NOT have \`$\`
- [ ] Percentages formatted as \`0.0%\`
- [ ] Negatives in parentheses
- [ ] Normalization adjustments documented with rationale
- [ ] File named: \`CompanyName_DataPack_YYYY-MM-DD.xlsx\`
`,
      },
    ],
  },
  {
    name: "deal-tracker",
    files: [
      {
        path: "SKILL.md",
        data: `---
name: deal-tracker
description: Track live M&A and investment banking deals with milestones, deadlines, action items, and status updates in Excel. Maintains a deal pipeline view and surfaces upcoming deadlines and overdue items. Use when managing a deal book, tracking process milestones, or preparing for weekly deal reviews. Triggers on "deal tracker", "track my deals", "deal status", "process update", "deal pipeline", or "weekly deal review".
platform: excel
---

# Deal Tracker

READ THIS ENTIRE FILE before building or updating a deal tracker.

## Sheet Structure

Create an Excel workbook with these tabs:

1. **Pipeline** — all deals in one row each (the "dashboard" view)
2. **[Deal Name]** — one tab per active deal with milestone details
3. **Action Items** — master list of outstanding items across all deals
4. **Weekly Review** — formatted summary for team meetings

---

## Tab 1: Pipeline Overview

One row per deal:

| Deal Name | Client | Type | Role | Est. EV ($mm) | Stage | Next Milestone | Next Date | Status | Team |
|-----------|--------|------|------|--------------|-------|----------------|-----------|--------|------|

**Stage options:** Pre-Mandate → Engaged → Marketing → IOI → Diligence → Final Bids → Signing → Closed → Dead

**Status colors (conditional formatting):**
- 🟢 On Track
- 🟡 At Risk (milestone within 7 days or recently slipped)
- 🔴 Delayed (missed milestone, stalled process)
- ⬜ Complete

**Summary stats at bottom:**
\`\`\`
Active deals:           =COUNTIF(Status, "<>Closed") - COUNTIF(Status, "Dead")
Closing this quarter:   =COUNTIFS(Stage, "Signing", NextDate, "<="&EOMONTH(TODAY(),0))
Total pipeline EV:      =SUMIF(Status, "Active", EV_column)
\`\`\`

---

## Tab 2: Per-Deal Milestone Tracker

**Header block:**
\`\`\`
Deal Name: Project [Name]
Client: [Seller/Buyer name]
Type: [Sell-side / Buy-side / Financing / Restructuring]
Engagement Date: [date]
Target Close: [date]
\`\`\`

**Milestone table:**

| Milestone | Target Date | Actual Date | Status | Owner | Notes |
|-----------|------------|-------------|--------|-------|-------|
| Engagement letter signed | | | | | |
| CIM / teaser drafted | | | | | |
| Buyer list approved | | | | | |
| Teaser distributed | | | | | |
| NDA execution complete | | | | | |
| CIM distributed | | | | | |
| IOI deadline | | | | | |
| IOIs received & reviewed | | | | | |
| Shortlist selected | | | | | |
| Management meetings | | | | | |
| Data room opened | | | | | |
| Final bid deadline | | | | | |
| Bids received & reviewed | | | | | |
| Exclusivity granted | | | | | |
| Confirmatory diligence | | | | | |
| Purchase agreement signed | | | | | |
| Regulatory approval | | | | | |
| Close | | | | | |

**Status formula (auto-flag overdue):**
\`\`\`excel
=IF(ActualDate<>"", "Complete",
 IF(TargetDate<TODAY(), "Overdue",
 IF(TargetDate<=TODAY()+7, "Due Soon", "On Track")))
\`\`\`

---

## Tab 3: Action Item Master List

| # | Action | Deal | Owner | Due Date | Priority | Status | Notes |
|---|--------|------|-------|----------|----------|--------|-------|

**Priority:** P0 (gating to next milestone) / P1 (important) / P2 (nice to have)
**Status:** Open / In Progress / Done / Blocked

**Filters to apply:** Filter by Deal, Owner, Priority, or Status.

**Overdue flag (conditional formatting):**
\`\`\`excel
=AND(Status<>"Done", DueDate<TODAY())    // highlight row red
\`\`\`

**Summary at top:**
\`\`\`
Open P0 items:      =COUNTIFS(Priority,"P0",Status,"<>Done")
Overdue items:      =COUNTIFS(Status,"<>Done",DueDate,"<"&TODAY())
\`\`\`

---

## Tab 4: Weekly Review Summary

Auto-generated format for Monday team meetings.

**Per deal (iterate for each active deal):**
\`\`\`
PROJECT [NAME] — [Stage] — [EV $mm]
Status: [On Track / At Risk / Delayed]
This week: [key developments — manual entry]
Next 2 weeks: [next 2 milestones with dates from milestone table]
Blockers: [open P0 items from action items]
Action items: [owner and due date for each open item]
\`\`\`

**Pipeline summary:**
- Total active deals by stage (bar or simple count table)
- Deals at risk or delayed
- Expected closings this quarter
- New mandates / pitches in pipeline

---

## Maintenance Notes

- **Update weekly at minimum** — stale trackers are worse than no tracker
- **Flag milestone slippage early** — pattern of delays often signals process breakdown
- **Every action item needs an owner and due date** — otherwise it won't get done
- **Archive closed/dead deals** to a separate tab — keep the active pipeline view clean
- **Track buyer/investor feedback** in notes — patterns inform process adjustments
`,
      },
    ],
  },
  {
    name: "buyer-list",
    files: [
      {
        path: "SKILL.md",
        data: `---
name: buyer-list
description: Build and organize a universe of potential acquirers for sell-side M&A processes in Excel. Identifies strategic and financial buyers, assesses fit, and prioritizes outreach by tier. Use when preparing for a sell-side mandate, building a buyer universe, or evaluating potential partners. Triggers on "buyer list", "buyer universe", "potential acquirers", "who would buy this", "strategic buyers", "financial sponsors", or "build a buyer list for [company]".
platform: excel
---

# Buyer Universe Builder

READ THIS ENTIRE FILE before building any buyer list.

## Step 1: Understand the Target

Before building the list, gather:
- Company description, sector, and business model
- Revenue, EBITDA, and growth profile
- Key assets and capabilities (IP, customer base, geographic footprint, team)
- Expected valuation range
- Seller preferences: strategic vs. financial buyer, management continuity, timeline
- Any buyers to include or exclude (ask the seller explicitly)

---

## Sheet Structure

Create an Excel workbook with:

1. **Summary** — buyer count by tier and type, key stats
2. **Strategic Buyers** — sorted by tier
3. **Financial Sponsors** — sorted by tier
4. **Tier 1 Contacts** — decision-maker mapping for top priority buyers

---

## Tab 2: Strategic Buyers

### Buyer Categories

**Direct Competitors** — same space, gain market share
**Adjacent Players** — expand into target's market via acquisition
**Vertical Integrators** — customers or suppliers seeking vertical integration
**Platform Builders** — large companies making tuck-in acquisitions

### Strategic Buyer Table

| Buyer | Ticker | Sector | Revenue ($mm) | EV ($mm) | Strategic Fit | Financial Capacity | M&A Activity | Likelihood | Tier | Rationale |
|-------|--------|--------|--------------|---------|--------------|-------------------|-------------|------------|------|-----------|
| | | | | | H/M/L | Strong/Moderate/Limited | Active/Occasional/None | H/M/L | A/B/C | |

**Tier definitions:**
- **Tier A (5–10 buyers)**: Highest strategic fit, proven acquirers, clear rationale — contact first
- **Tier B (10–15 buyers)**: Good fit, less obvious — contact in second wave
- **Tier C (10–20 buyers)**: Possible but lower probability — broaden process if needed

**Strategic fit rating factors:**
- Revenue synergy potential
- Capability gap the target fills
- Geographic expansion opportunity
- Competitive threat elimination
- Technology/product adjacency

**Financial capacity check:**
- Can they fund the deal? (check leverage, cash, recent financing activity)
- Any competing priorities (recent large deal, integration in progress)?
- Antitrust concerns? (flag direct competitors that may face regulatory scrutiny)

---

## Tab 3: Financial Sponsors

### Sponsor Categories

**Platform Investors** — looking for a new platform in this sector
**Add-on Buyers** — existing portfolio company could acquire the target
**Growth Equity** — minority or majority for earlier-stage/high-growth targets

### Financial Sponsor Table

| Sponsor | Fund Size | Vintage | Sector Focus | Deal Size Range | Portfolio Overlap | Recent Activity | Priority | Notes |
|---------|-----------|---------|-------------|----------------|-------------------|----------------|----------|-------|
| | | | | | Specific portfolio co. | Active/Moderate/None | A/B/C | |

**Key checks for sponsors:**
- **Fund vintage and deployment**: fund nearing end of investment period may be more motivated
- **Dry powder**: does the fund have capacity for a deal this size?
- **Portfolio overlap**: which portfolio company is the natural add-on buyer?
- **Recent exits**: any recent realizations that free up bandwidth?

---

## Tab 4: Tier A Contact Mapping

For each Tier A buyer:

| Buyer | Key Decision Maker | Title | Relationship Status | Contact Channel | Known Preferences | Notes |
|-------|-------------------|-------|---------------------|-----------------|-------------------|-------|
| | Corp Dev Head / CEO | | Existing / Needs Intro / Cold | Direct / Banker / Board | Size range, geography constraints | |

**Relationship status options:**
- **Existing relationship**: can call directly
- **Needs introduction**: need a mutual connection or banker relationship
- **Cold outreach**: no existing relationship — require more effort, right timing

---

## Tab 1: Summary Statistics

\`\`\`
Total Buyers:           =COUNTA(Strategic!BuyerCol) + COUNTA(Sponsors!SponsorCol)
Strategic / Financial:  =COUNTA(Strategic) / COUNTA(Sponsors)
Tier A / B / C count:   =COUNTIF(TierCol, "A") / "B" / "C"
High-likelihood buyers: =COUNTIF(LikelihoodCol, "H")
Antitrust risk flags:   =COUNTIF(NotesCol, "*antitrust*")
\`\`\`

---

## One-Page Buyer Universe Summary

Generate a narrative summary for the engagement letter or client pitch:
- Total universe size (strategic + financial)
- Tier A rationale (why these are the most likely buyers)
- Process recommendation (broad vs. targeted, timing)
- Any notable inclusions or exclusions and why

---

## Important Notes

- **Quality over quantity** — 30–40 well-researched buyers beats 200 names
- **Research recent M&A activity** — buyers who just did a deal are either hungry for more or tapped out
- **Check antitrust** — direct competitors may face regulatory scrutiny at certain ownership levels
- **Always ask the seller** about buyers to include or exclude before distributing teasers
- **Update as the process progresses** — move buyers between tiers based on feedback and conversations
- **Financial sponsors**: check fund vintage — a fund in year 5–6 may be more motivated than a recently raised fund
`,
      },
    ],
  },
  {
    name: "earnings-preview",
    files: [
      {
        path: "SKILL.md",
        data: `---
name: earnings-preview
description: Build pre-earnings analysis with estimate models, bull/bear/base scenarios, and key metrics to watch before a company reports. Use to prepare positioning notes, set up scenarios, and identify what will move the stock on earnings day. Triggers on "earnings preview", "what to watch for [company] earnings", "pre-earnings", "earnings setup", "preview Q[X] for [company]", or "[company] reports this week".
platform: excel
---

# Earnings Preview

READ THIS ENTIRE FILE before building an earnings preview.

## Step 1: Gather Context

- Company name, ticker, reporting quarter (e.g., Q3 2024)
- Earnings date and time (pre-market vs. after-hours)
- Consensus estimates: revenue, EPS, key segment metrics (use Finnhub MCP if available, or web search)
- Prior quarter results and management commentary/guidance
- Options-implied move (search "[ticker] options implied move earnings")

---

## Step 2: Key Metrics Framework

Build a "what to watch" table specific to this company and sector:

**Core Financial Metrics (always):**
| Metric | Consensus Est. | Bear | Base | Bull | Notes |
|--------|---------------|------|------|------|-------|
| Revenue ($mm) | | | | | |
| EPS (adj.) | | | | | |
| Gross Margin % | | | | | |
| EBITDA Margin % | | | | | |
| Free Cash Flow ($mm) | | | | | |
| Next Quarter Guidance | | | | | |

**Sector-Specific Metrics (add the relevant ones):**

| Sector | Key Metrics to Watch |
|--------|---------------------|
| Tech/SaaS | ARR/RPO growth, Net Retention Rate, New customer adds, Cloud revenue mix |
| Retail | Same-store sales, Traffic, Basket size, Inventory levels |
| Industrials | Backlog, Book-to-bill ratio, Price vs. volume mix, Margin trajectory |
| Financials | NIM, Credit quality (NCOs, NPLs), Loan growth, Fee income |
| Healthcare | Script volumes, Patient visits, Pipeline updates, Reimbursement trends |
| Consumer | Volume vs. price mix, Market share, Brand investment levels |

---

## Step 3: Scenario Analysis

Build 3 scenarios with stock reaction estimate:

| Scenario | Revenue | EPS | Key Driver | Stock Reaction Est. | Probability |
|----------|---------|-----|------------|---------------------|-------------|
| Bull | | | | | |
| Base | | | | | |
| Bear | | | | | |

For each scenario, answer:
- **What would need to happen operationally?**
- **What management commentary would signal this?**
- **Historical context**: how has this stock reacted to similar prints? (search "[ticker] earnings reaction history")

---

## Step 4: Catalyst Checklist

Rank the 3–5 things that will determine the stock's reaction:

| # | Catalyst | Consensus Expectation | Bull Signal | Bear Signal | Importance |
|---|----------|----------------------|-------------|-------------|------------|
| 1 | | | | | High |
| 2 | | | | | High |
| 3 | | | | | Medium |

The most important catalyst is typically **forward guidance**, not the current quarter results.

---

## Step 5: Output — One-Page Earnings Preview

Deliver as a formatted table in Excel with:

**Header:**
\`\`\`
[Company] (Ticker) — Q[X] 2024 Earnings Preview
Reports: [Date], [Pre-market / After-hours]
Options-implied move: ±X%
\`\`\`

**Sections:**
1. Consensus Estimates Table (from Step 2)
2. Key Metrics to Watch (ranked by importance)
3. Bull / Base / Bear Scenario Table (Step 3)
4. Catalyst Checklist (Step 4)
5. Recent stock performance: \`=price change over last 30/60/90 days\`

---

## Important Notes

- **Consensus estimates change** — always note the source and date
- **"Whisper numbers"** from buy-side surveys are often more relevant than published consensus — check if available
- **Historical earnings reactions** calibrate expectations — look for the pattern (does this stock sell the news?)
- **Options-implied move** tells you what the market expects — compare to your scenario spread
- **Forward guidance matters most** — a beat with weak guidance typically sells off; miss with raised guidance often rallies
`,
      },
    ],
  },
  {
    name: "idea-generation",
    files: [
      {
        path: "SKILL.md",
        data: `---
name: idea-generation
description: Systematic stock screening and investment idea sourcing. Combines quantitative screens, thematic research, and pattern recognition to surface long and short ideas. Use when looking for new investment ideas, running stock screens, or conducting thematic sweeps. Triggers on "idea generation", "stock screen", "find me ideas", "what looks interesting", "screen for stocks", "new long ideas", or "pitch me something".
platform: excel
---

# Investment Idea Generation

READ THIS ENTIRE FILE before starting an idea generation session.

## Step 1: Define Search Parameters

Ask or confirm:
- **Direction**: Long ideas, short ideas, or both
- **Market cap**: Large cap (>$10B), mid cap ($2–10B), small cap (<$2B)
- **Sector**: Specific sector or cross-sector sweep
- **Style**: Value, growth, quality, special situation, or event-driven
- **Geography**: US, international, or global
- **Theme**: Any specific angle (AI infrastructure, reshoring, aging demographics, etc.)

---

## Step 2: Quantitative Screen Criteria

### Value Screen
- P/E below sector median
- EV/EBITDA below 5-year historical average
- Free cash flow yield >5% (\`=FCF/MarketCap\`)
- Price/book below 1.5x
- Insider buying in last 90 days
- Dividend yield above market average

### Growth Screen
- Revenue growth >15% YoY
- Earnings growth >20% YoY
- Revenue acceleration (growth rate increasing sequentially)
- Expanding margins (EBITDA margin up 100+ bps YoY)
- ROIC >15%
- Net Dollar Retention >110% (for SaaS)

### Quality Screen
- Consistent revenue growth (5+ year track record)
- Stable or expanding margins over 3 years
- ROE >15%
- Net debt/EBITDA <2x
- FCF conversion >80% of net income
- Insider ownership >5%

### Short Screen
- Revenue deceleration or decline
- Margin compression (gross or EBITDA)
- Rising receivables/inventory faster than sales growth
- Significant insider selling (net of options)
- Valuation premium to peers without fundamental justification
- High short interest + deteriorating fundamentals
- Accounting red flags (auditor changes, restatements, aggressive revenue recognition)

### Special Situation Screen
- Recent spin-offs (last 12 months — often mispriced as index funds exit)
- Post-restructuring companies (often cheap, improving operations)
- Activist involvement (buyback, strategic review, board changes)
- Recent management change at underperforming company
- Companies near 52-week lows with improving fundamentals

---

## Step 3: Thematic Sweep (for theme-driven ideas)

1. **Define the thesis** — one sentence: "AI infrastructure capex accelerates through 2026"
2. **Map the value chain** — who benefits directly vs. indirectly?
3. **Identify pure-play vs. diversified exposure** — pure-plays have higher beta to the theme
4. **Assess pricing** — which names are already "priced in" vs. under-appreciated?
5. **Find second-order beneficiaries** — companies the market hasn't connected to the theme yet

---

## Step 4: Idea Presentation Table

Build a comparison table for each idea that passes the screen:

| Company | Ticker | Direction | Thesis (1-line) | Market Cap | EV/EBITDA (NTM) | P/E (NTM) | Rev Growth | EBITDA Margin | FCF Yield | vs. Peers |
|---------|--------|-----------|----------------|------------|----------------|-----------|------------|---------------|-----------|-----------|

For each idea, add a quick-hit summary:

\`\`\`
[Company] — [Long/Short] — [One-Line Thesis]

Thesis (3–5 bullets):
• Why this is mispriced
• What the market is missing
• Catalyst to realize value
• Edge vs. consensus

Key Risks:
• What would make this wrong
• Timeline risk

Next Steps:
• Build full model? / Expert call? / Channel checks?
\`\`\`

---

## Step 5: Output — Idea Shortlist

Deliver an Excel workbook with:

1. **Screening Criteria tab** — document all criteria used and why
2. **Screen Results tab** — all companies that passed, with metrics
3. **Top Ideas tab** — 5–10 highest-conviction ideas with quick-hit summaries
4. **Comparison Table** — side-by-side metrics for all shortlisted names

**Prioritization framework:**
- Rank by: (conviction) × (risk/reward) × (catalyst visibility)
- First call: highest-ranked ideas with clearest catalysts

---

## Important Notes

- **Screens surface candidates, not conclusions** — every screen output needs fundamental research
- **The best ideas often sit at intersections** — quality company at value price due to temporary headwind
- **Avoid crowded trades** — check analyst coverage count, ownership breadth, and short interest
- **Contrarian ideas need a catalyst** — being early without a catalyst is the same as being wrong
- **Short ideas need higher conviction** — timing is harder and risk is asymmetric (can always go higher)
- **Track idea hit rates over time** — refine which screens and approaches work best
`,
      },
    ],
  },
  {
    name: "model-update",
    files: [
      {
        path: "SKILL.md",
        data: `---
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
\`\`\`excel
=BlendedTarget / CurrentPrice - 1
\`\`\`

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
`,
      },
    ],
  },
  {
    name: "thesis-tracker",
    files: [
      {
        path: "SKILL.md",
        data: `---
name: thesis-tracker
description: Maintain and update investment theses for portfolio positions and watchlist names. Track key pillars, data points, catalysts, and conviction over time. Use when updating a thesis with new information, reviewing position rationale, or checking if a thesis is still intact. Triggers on "update thesis for [company]", "is my thesis still intact", "thesis check", "add data point to [company]", "thesis tracker", or "review my position in [company]".
platform: excel
---

# Investment Thesis Tracker

READ THIS ENTIRE FILE before building or updating a thesis tracker.

## Step 1: Define or Load Thesis

**Creating a new thesis entry:**

| Field | Content |
|-------|---------|
| Company | Name and ticker |
| Position | Long / Short / Watchlist |
| Date initiated | |
| Thesis statement | 1–2 sentence core thesis (e.g., "Long ACME — margin expansion from pricing power + operating leverage as mix shifts to software") |
| Entry price | |
| Target price | What is it worth if thesis plays out |
| Stop-loss trigger | What would make you exit |
| Conviction level | High / Medium / Low |
| Time horizon | 6 months / 1 year / 2+ years |

**Thesis pillars (3–5 supporting arguments):**

| # | Pillar | Original Expectation | Measurable Test | Status |
|---|--------|---------------------|-----------------|--------|
| 1 | | | | On Track / Progressing / Stalled / Broken |
| 2 | | | | |
| 3 | | | | |

**Key risks (3–5 invalidating conditions):**

| # | Risk | Probability | Impact | Mitigant |
|---|------|------------|--------|----------|
| 1 | | H/M/L | High/Med/Low | |

---

## Step 2: Thesis Update Log

For each new data point or development, add a row:

| Date | Event Type | Description | Pillar Affected | Thesis Impact | Action | Conviction Change |
|------|-----------|-------------|-----------------|--------------|--------|------------------|
| | Earnings / Guidance / News / Industry / Macro / Expert Call | | Pillar #1, #2, etc. | Strengthens / Weakens / Neutral | Hold / Add / Trim / Exit | High → Medium / etc. |

**Event types:** Earnings, Management guidance, Competitor move, Product launch, Regulatory, Macro, Expert call, Channel check, M&A, Management change.

---

## Step 3: Thesis Scorecard

Running scorecard updated each quarter:

| Pillar | Original Expectation | Latest Data Point | Current Status | Trend |
|--------|---------------------|-------------------|----------------|-------|
| Revenue growth >20% | On track for FY | Q3 was 22% | ✅ On Track | → Stable |
| Margin expansion | +200bps/yr | Margins flat YoY | ⚠️ Watching | ↓ Softening |
| New product launch | Q2 launch | Delayed to Q4 | ⚠️ Behind | → Monitor |
| Management execution | Strong | CFO departure | ⚠️ Risk | ↓ Concern |

**Overall conviction:** =IF(broken_pillars>1, "Low", IF(broken_pillars=1, "Medium", "High"))

---

## Step 4: Catalyst Calendar

Upcoming events that could prove or disprove the thesis:

| Date | Event | Expected Impact | Bull Outcome | Bear Outcome | Resolved? |
|------|-------|-----------------|-------------|-------------|-----------|
| | Earnings Q4 | Moderate | Beat + raised guide | Miss + cut guide | |
| | Product launch | High | Strong adoption metrics | Weak uptake | |
| | Regulatory decision | Medium | Approval | Denial | |

---

## Step 5: Position Summary Output

Format for morning meeting, portfolio review, or risk committee:

\`\`\`
[COMPANY] (TICKER) — [LONG/SHORT] — Updated [Date]

THESIS: [1-2 sentence thesis]
CONVICTION: [High/Medium/Low] | POSITION: [sizing note] | PT: $XX vs $YY current

SCORECARD:
✅ Pillar 1: [status]
⚠️ Pillar 2: [status — needs monitoring]
❌ Pillar 3: [status — broken or at risk]

RECENT DEVELOPMENTS:
• [Date]: [event] → [thesis impact]
• [Date]: [event] → [thesis impact]

NEXT CATALYSTS:
• [Date]: [event] — expected [outcome]

RISK TO EXIT:
• [What would make you sell / cover]
\`\`\`

---

## Portfolio Thesis Review

If managing multiple positions, build a summary dashboard:

| Ticker | Direction | Conviction | PT | Current | Upside | Pillars OK | Next Catalyst | Action |
|--------|-----------|-----------|-----|---------|--------|-----------|---------------|--------|

Sort by: Conviction descending, then Upside descending.

**Portfolio health check:**
- How many positions have ≥2 broken pillars? (review for exit)
- How many approaching their stop-loss trigger?
- What's the average time-to-catalyst across positions?

---

## Important Notes

- **A thesis must be falsifiable** — if nothing could disprove it, it's not a thesis
- **Track disconfirming evidence** as rigorously as confirming evidence (avoid confirmation bias)
- **Review all theses quarterly** — even when nothing dramatic has happened
- **A broken pillar ≠ automatic sell** — but it requires explicit re-underwriting to stay long
- **Position sizing should reflect conviction** — if conviction drops, trim before thesis breaks fully
`,
      },
    ],
  },
  {
    name: "catalyst-calendar",
    files: [
      {
        path: "SKILL.md",
        data: `---
name: catalyst-calendar
description: Build and maintain a catalyst calendar in Excel tracking upcoming earnings dates, conferences, product launches, regulatory decisions, and macro events across a coverage universe. Use to prioritize positioning ahead of events. Triggers on "catalyst calendar", "upcoming events", "earnings calendar", "event calendar", or "catalyst tracker".
platform: excel
---

# Catalyst Calendar

READ THIS ENTIRE FILE before building a catalyst calendar.

## Workflow

### Step 1: Define Coverage Universe

- List of companies to track (tickers or names)
- Sector / industry focus
- Include macro events? (Fed meetings, economic data, regulatory deadlines)
- Time horizon (next 2 weeks, month, quarter)

### Step 2: Gather Catalysts

For each company, identify upcoming events:

**Earnings & Financial Events**
- Quarterly earnings date and time (pre/post market)
- Annual shareholder meeting
- Investor day / analyst day
- Capital markets day
- Debt maturity / refinancing dates

**Corporate Events**
- Product launches or announcements
- FDA approvals / regulatory decisions
- Contract renewals or expirations
- M&A milestones (close dates, regulatory approvals)
- Management transitions
- Insider trading windows (lockup expirations)

**Industry Events**
- Major conferences (dates, which companies presenting)
- Trade shows and expos
- Regulatory comment periods or rulings
- Industry data releases (monthly sales, traffic, etc.)

**Macro Events**
- Fed meetings (FOMC dates)
- Jobs report, CPI, GDP releases
- Central bank decisions (ECB, BOJ, etc.)
- Geopolitical events with market impact

### Step 3: Calendar View

| Date | Event | Company/Sector | Type | Impact (H/M/L) | Our Positioning | Notes |
|------|-------|---------------|------|-----------------|----------------|-------|
| | | | Earnings/Corp/Industry/Macro | | Long/Short/Neutral | |

### Step 4: Weekly Preview

Each week, generate a forward-looking summary:

**This Week's Key Events:**
1. [Day]: [Company] Q[X] earnings — consensus [$X EPS], our estimate [$X], key focus: [metric]
2. [Day]: [Event] — why it matters for [stocks]
3. [Day]: [Macro release] — expectations and positioning

**Next Week Preview:**
- Early heads-up on important events coming

**Position Implications:**
- Events that could move specific positions
- Any pre-positioning recommended
- Risk management ahead of binary events

### Step 5: Output

- Excel workbook with calendar view (sortable by date, company, impact)
- Separate sheet for weekly preview summary
- Color-coded by impact level using conditional formatting

## Important Notes

- Earnings dates shift — verify against company IR pages and Bloomberg/FactSet closer to the date
- Pre-announce risk: track companies with a history of pre-announcing (positive or negative)
- Conference attendance lists are valuable — which companies are presenting and which are conspicuously absent?
- Some catalysts are recurring (monthly industry data) — build a template and auto-populate
- Color-code by impact level: Red = high impact, Yellow = moderate, Green = routine
- Archive past catalysts with the actual outcome — builds pattern recognition over time
`,
      },
    ],
  },
  {
    name: "morning-note",
    files: [
      {
        path: "SKILL.md",
        data: `---
name: morning-note
description: Draft concise morning meeting notes in Excel summarizing overnight developments, trade ideas, and key events for coverage stocks. Designed for the 7am morning meeting format — tight, opinionated, actionable. Triggers on "morning note", "morning meeting", "what happened overnight", "trade idea", "morning call prep", or "daily note".
platform: excel
---

# Morning Note

READ THIS ENTIRE FILE before drafting a morning note.

## Workflow

### Step 1: Overnight Developments

Scan for relevant events across coverage universe:

**Earnings & Guidance**
- Any coverage companies reporting overnight or pre-market?
- Earnings surprises (beat/miss on revenue, EPS, key metrics)
- Guidance changes (raised, lowered, maintained)

**News & Events**
- M&A announcements or rumors
- Management changes
- Product launches or regulatory decisions
- Analyst upgrades/downgrades from competitors
- Macro data or policy changes affecting the sector

**Market Context**
- Overnight futures / pre-market moves
- Sector ETF performance
- Relevant commodity or currency moves
- Key economic data releases today

### Step 2: Morning Note Format

Keep it tight — a morning note should be readable in 2 minutes:

---

**[Date] Morning Note — [Analyst Name]**
**[Sector Coverage]**

**Top Call: [Headline — the one thing PMs need to hear]**
- 2-3 sentences on the key development and why it matters
- Stock impact: price target, rating reiteration/change

**Overnight/Pre-Market Developments**
- [Company A]: One-line summary of earnings/news + our take
- [Company B]: One-line summary + our take
- [Sector/Macro]: Relevant sector-wide development

**Key Events Today**
- [Time]: [Company] earnings call
- [Time]: Economic data release (expectations vs. our view)
- [Time]: Conference or investor day

**Trade Ideas** (if any)
- [Long/Short] [Company]: 1-2 sentence thesis + catalyst
- Risk: What would make this wrong

---

### Step 3: Quick Takes on Earnings

If a coverage company reported, provide a quick reaction:

| Metric | Consensus | Actual | Beat/Miss |
|--------|-----------|--------|-----------|
| Revenue | | | |
| EPS | | | |
| [Key metric] | | | |
| Guidance | | | |

**Our Take**: 2-3 sentences — is this good or bad for the stock? Does it change our thesis?

**Action**: Maintain / Upgrade / Downgrade rating? Adjust price target?

### Step 4: Output

- Excel sheet with structured morning note layout (one row per item)
- Text output in chat for quick copy/paste distribution
- Keep to 1 page equivalent — PMs and traders won't read more

## Important Notes

- Be opinionated — morning notes that just summarize news without a view are useless
- Lead with the most important thing — don't bury the headline
- "No news" is a valid morning note — say "nothing material overnight, maintaining positioning"
- Distinguish between actionable events (earnings, M&A) and noise (minor analyst notes, non-events)
- Time-stamp your takes — if you're writing at 6am, note that pre-market may change by open
- If you're wrong, own it in the next morning note — credibility matters more than being right every time
`,
      },
    ],
  },
  {
    name: "dd-checklist",
    files: [
      {
        path: "SKILL.md",
        data: `---
name: dd-checklist
description: Generate and track comprehensive due diligence checklists tailored to a target company's sector, deal type, and complexity in Excel. Covers all major workstreams with request lists, status tracking, and red flag escalation. Use when kicking off diligence, organizing a data room review, or tracking outstanding items. Triggers on "dd checklist", "due diligence tracker", "diligence request list", "data room review", "what do we still need", or "kick off diligence for [company]".
platform: excel
---

# Due Diligence Checklist & Tracker

READ THIS ENTIRE FILE before building a diligence tracker.

## Step 1: Scope the Diligence

Gather from the user:
- **Target company**: name, sector, business model
- **Deal type**: Platform acquisition / Add-on / Growth equity / Recap / Carve-out
- **Deal size / complexity**: determines depth (small add-on vs. large platform = very different scope)
- **Known concerns**: customer concentration, regulatory exposure, environmental, IT tech debt
- **Timeline**: when is LOI / close targeted?

---

## Sheet Structure

Create an Excel workbook with:

1. **Dashboard** — summary by workstream (% complete, red flags, outstanding P0s)
2. **[Workstream]** — one tab per major workstream (Financial, Commercial, Legal, Operational, HR, IT, ESG)
3. **Red Flags** — consolidated log of all red flags found
4. **Weekly Status** — formatted update for the deal team

---

## Tab 2–8: Workstream Checklists

### Format for each tab:

| Item | Category | Priority | Status | Owner | Due Date | Notes / Red Flag |
|------|----------|----------|--------|-------|----------|-----------------|
| Quality of earnings report | Financial | P0 | Not Started | | | |
| Working capital analysis | Financial | P0 | In Progress | | | |

**Priority:**
- **P0**: Gating to LOI or close — must complete before proceeding
- **P1**: Important, needs completion before IC
- **P2**: Nice to have / confirmatory

**Status options:**
\`Not Started → Requested → Received → In Review → Complete → Red Flag\`

---

### Financial Due Diligence

- Quality of earnings (QoE) — revenue and EBITDA adjustments and normalization
- Working capital analysis — normalized NWC peg
- Debt and debt-like items (off-balance sheet, leases, deferred revenue, pension)
- CapEx — maintenance vs. growth split
- Tax structure and exposures (NOLs, audits, transfer pricing)
- Audit history and accounting policy changes
- Pro forma adjustments (run-rate, acquired revenue, synergies)
- Cash flow quality — is EBITDA converting to cash?

### Commercial Due Diligence

- Market size and growth (TAM/SAM)
- Competitive positioning and market share
- Customer analysis: top 10 concentration, NPS, churn/renewal history
- Pricing power and contract structure (fixed vs. variable, auto-renewal)
- Sales pipeline and backlog quality
- Go-to-market effectiveness and sales productivity

### Legal Due Diligence

- Corporate structure and cap table
- Material contracts (customer, supplier, partnership, exclusivity)
- Litigation history and pending claims
- IP portfolio and protection (patents, trademarks, trade secrets)
- Regulatory compliance history
- Employment agreements and non-competes / non-solicitations

### Operational Due Diligence

- Management team assessment (key person risk, succession)
- Organizational structure and reporting lines
- IT systems and infrastructure (ERP, CRM, integrations)
- Supply chain and vendor dependencies / concentration
- Facilities and real estate (owned vs. leased, lease terms)
- Insurance coverage adequacy

### HR / People Due Diligence

- Org chart and headcount trends (net adds, attrition by level)
- Compensation benchmarking vs. market
- Benefits and pension obligations
- Key employee retention risk (unvested equity, flight risk)
- Culture assessment (engagement surveys, Glassdoor)
- Union / labor agreements

### IT / Technology (tech-enabled businesses)

- Technology stack and architecture (monolith vs. microservices)
- Technical debt assessment
- Cybersecurity posture (recent audits, breach history, SOC 2 status)
- Data privacy compliance (GDPR, CCPA, HIPAA if applicable)
- Product roadmap and R&D spend vs. plan
- Scalability — can infrastructure support 2-3x growth?

### ESG / Environmental (where applicable)

- Environmental liabilities (remediation, Superfund exposure)
- Regulatory compliance history
- ESG risks and opportunities relevant to the sector
- Governance (board composition, related party transactions)

---

## Red Flags Tab

| # | Date Found | Workstream | Description | Severity | Impact on Value | Mitigant / Path to Resolution | Status |
|---|------------|-----------|-------------|----------|----------------|------------------------------|--------|
| | | | | Deal-Breaker / Significant / Manageable | | | Open / Resolved |

**Severity escalation:**
- **Deal-Breaker**: Terminates deal or requires material price change
- **Significant**: Requires rep & warranty coverage, escrow, or indemnification
- **Manageable**: Noted in model or addressed in purchase agreement

---

## Dashboard Tab

For each workstream:
\`\`\`
Workstream         | Total Items | Complete | In Progress | Not Started | Red Flags | % Complete
Financial          | [count]     | [count]  | [count]     | [count]     | [count]   | =Complete/Total
Commercial         | ...
\`\`\`

**Master status:**
\`\`\`
Overall completion:  =SUM(complete)/SUM(total)
Open P0 items:       =COUNTIFS(priority,"P0",status,"<>Complete")
Open red flags:      =COUNTIF(red_flag_status,"Open")
\`\`\`

---

## Sector-Specific Additions

Automatically add when applicable:

| Sector | Add to Checklist |
|--------|-----------------|
| Software/SaaS | ARR quality & cohort analysis, hosting cost structure, SOC 2 compliance |
| Healthcare | Regulatory approvals (FDA, state licensing), payor mix & reimbursement risk |
| Industrial | Equipment condition reports, environmental remediation risk, safety record |
| Financial Services | Regulatory capital ratios, compliance program history, credit quality |
| Consumer | Brand health metrics, channel mix, seasonality, inventory management |

---

## Important Notes

- **Prioritize P0 items** — these are gating; don't let other work distract from them
- **Flag slow responses** — sellers who are slow to provide items may be hiding issues
- **Cross-reference the data room** against the checklist to identify gaps systematically
- **Update continuously** — the checklist is a living document, not a one-time exercise
- **Red flags are negotiating points** — document them carefully for purchase price adjustment conversations
`,
      },
    ],
  },
  {
    name: "returns-analysis",
    files: [
      {
        path: "SKILL.md",
        data: `---
name: returns-analysis
description: Build IRR and MOIC sensitivity tables for private equity deal evaluation in Excel. Models returns across entry multiple, leverage, exit multiple, growth rate, and hold period scenarios. Use when sizing up a PE deal, stress-testing returns, or preparing IC returns exhibits. Triggers on "returns analysis", "IRR sensitivity", "MOIC table", "PE returns", "what's the IRR at", "model the returns", or "back of the envelope LBO returns".
platform: excel
---

# PE Returns Analysis

READ THIS ENTIRE FILE before building a returns analysis.

## Key Formulas

\`\`\`excel
MOIC   = Exit Equity Value / Equity Invested
IRR    = IRR({-EquityInvested, 0, 0, ..., ExitProceeds})
       = XIRR({-EquityInvested, ExitProceeds}, {EntryDate, ExitDate})   ← more precise
\`\`\`

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
\`\`\`
Entry EBITDA (LTM)          [input]
Entry EV/EBITDA Multiple    [input]
Enterprise Value            [=EBITDA * Multiple]
Net Debt at Close           [input]
Equity Purchase Price       [=EV - NetDebt]
Transaction Fees (%)        [input, typically 2-3% of EV]
Financing Fees              [input]
Total Equity Invested       [=EquityPurchase + TransFees + FinFees * equityPortion]
\`\`\`

**Financing:**
\`\`\`
Senior Debt                 [x EBITDA or $ amount, rate, amortization %/yr]
Subordinated Debt           [x EBITDA, rate]
Total Debt                  [=Senior + Sub]
Leverage at Entry           [=TotalDebt/EntryEBITDA]
\`\`\`

**Operating:**
\`\`\`
Revenue CAGR                [input by year or flat rate]
EBITDA Margin (exit yr)     [input]
CapEx % of Revenue          [input]
Tax Rate                    [input]
Hold Period (years)         [input, typically 3-7]
\`\`\`

**Exit:**
\`\`\`
Exit Multiple (EV/EBITDA)   [input]
Exit EBITDA                 [=EntryEBITDA * (1+CAGR)^holdPeriod]
Exit Enterprise Value       [=ExitEBITDA * ExitMultiple]
\`\`\`

---

## Tab 2: Returns Build

\`\`\`
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
\`\`\`

**Returns Attribution Waterfall:**

| Driver | Contribution to Equity Value |
|--------|------------------------------|
| EBITDA Growth | \`=(ExitEBITDA - EntryEBITDA) * ExitMultiple\` |
| Multiple Expansion/(Compression) | \`=(ExitMultiple - EntryMultiple) * EntryEBITDA\` |
| Debt Paydown | \`=Total debt paid down over hold period\` |
| Fees/Expense Drag | \`=-(TransFees + FinFees)\` |
| **Total Exit Equity** | \`=SUM of above\` |

---

## Tab 3: Sensitivity Tables

All cells must contain formulas — NOT hardcoded values. Each cell recalculates IRR/MOIC for that specific row/column combination.

### Table 1: Entry Multiple × Exit Multiple

Row headers: Entry multiples (e.g., 7x, 8x, 9x, 10x, 11x)
Column headers: Exit multiples (e.g., 6x, 7x, 8x, 9x, 10x)

Each cell format: \`"2.5x / 22%"\` — show MOIC and IRR.

\`\`\`excel
// Example cell formula structure (B88):
// Row header in A88 = entry multiple, Col header in B87 = exit multiple
ExitEBITDA   = EntryEBITDA * (1+CAGR)^N
ExitEV       = ExitEBITDA * B$87              // col header = exit multiple
EntryEQ      = EntryEBITDA * $A88 - Debt      // row header = entry multiple
ExitEQ       = ExitEV - NetDebtAtExit
MOIC         = ExitEQ / EntryEQ
IRR          = (ExitEQ/EntryEQ)^(1/N) - 1    // simplified; use IRR() for interim CFs
\`\`\`

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
`,
      },
    ],
  },
  {
    name: "unit-economics",
    files: [
      {
        path: "SKILL.md",
        data: `---
name: unit-economics
description: Analyze unit economics for PE targets and SaaS/subscription businesses — ARR bridges, cohort matrices, LTV/CAC, net dollar retention, and payback periods in Excel. Use when evaluating revenue quality, building cohort analysis, or assessing customer economics. Triggers on "unit economics", "cohort analysis", "ARR analysis", "LTV CAC", "net retention", "revenue quality", "customer economics", or "analyze ARR for [company]".
platform: excel
---

# Unit Economics Analysis

READ THIS ENTIRE FILE before building a unit economics analysis.

## Step 1: Identify Business Model

Tailor the analysis to the revenue model:
- **SaaS / Subscription**: ARR, net retention, cohort analysis
- **Recurring services**: Contract value, renewal rates, upsell
- **Transaction / usage-based**: Volume trends, take rate, expansion patterns
- **Hybrid**: Break down by revenue stream, analyze each separately

---

## Sheet Structure

1. **Dashboard** — key metrics summary with benchmarks
2. **ARR Bridge** — waterfall from beginning to ending ARR
3. **Cohort Matrix** — vintage analysis by customer cohort
4. **Customer Economics** — LTV, CAC, payback period
5. **Revenue Quality** — scorecard and red flags

---

## Tab 2: ARR Bridge

Build an annual (and monthly if available) ARR waterfall:

| | FY2021 | FY2022 | FY2023 | FY2024 |
|--|--------|--------|--------|--------|
| Beginning ARR | | | | |
| (+) New Logo ARR | | | | |
| (+) Expansion ARR | | | | |
| (-) Contraction ARR | | | | |
| (-) Churned ARR | | | | |
| **Ending ARR** | =SUM | | | |
| Net New ARR | =New+Exp-Con-Churn | | | |

**Derived metrics:**
\`\`\`excel
Gross Retention Rate  = (EndARR - New - Expansion) / BeginARR    // excludes new & expansion
Net Retention Rate    = (EndARR - New) / BeginARR                // excludes only new logos
Logo Churn Rate       = Churned_Customers / Beginning_Customers
\`\`\`

**Target benchmarks:**
- Gross Retention: Best-in-class >95%, good >90%, concerning <85%
- Net Dollar Retention: Best-in-class >120%, good >110%, concerning <100%

---

## Tab 3: Cohort Matrix

Build a matrix showing ARR indexed to Year 0 = 100%:

| Cohort (Year) | Y0 | Y1 | Y2 | Y3 | Y4 | Y5 |
|------------|-----|-----|-----|-----|-----|-----|
| 2019 | $1.0M | $1.1M | $1.2M | $1.1M | $1.3M | $1.4M |
| 2020 | $1.5M | $1.7M | $1.9M | $1.8M | $2.0M | |
| 2021 | $2.0M | $2.4M | $2.7M | $2.5M | | |
| 2022 | $3.0M | $3.5M | $3.8M | | | |
| 2023 | $4.5M | $5.0M | | | | |

**Indexed view (add below absolute $ view):**

\`\`\`excel
Indexed Value = Actual ARR / Year0_ARR * 100
// e.g., if 2019 cohort started at $1.0M and is $1.4M in Y5, indexed = 140
\`\`\`

**What to look for:**
- Do cohorts grow over time (net retention >100%)?
- Is the growth rate improving for newer cohorts (business improving)?
- Are older cohorts stable or declining (product-market fit)?

---

## Tab 4: Customer Economics

### LTV / CAC Analysis

\`\`\`
CAC (Customer Acquisition Cost)
  = Total S&M Spend / New Customers Acquired in period

ACV (Average Contract Value)
  = ARR / Customer Count

Gross Margin by Revenue Stream
  = (Revenue - Direct COGS) / Revenue   [subscription vs. services separate]

LTV (Lifetime Value)
  = (ACV * Gross Margin %) / Gross Churn Rate

LTV:CAC Ratio
  = LTV / CAC   [target >3x; best-in-class >5x]

CAC Payback Period (months)
  = CAC / (ACV * Gross Margin% / 12)   [target <18 months; best-in-class <12]
\`\`\`

**Segment breakdown (if data available):**

| Segment | ACV | CAC | Gross Margin | LTV | LTV:CAC | Payback |
|---------|-----|-----|-------------|-----|---------|---------|
| Enterprise (>1,000 employees) | | | | | | |
| Mid-Market (100–999) | | | | | | |
| SMB (<100) | | | | | | |

### SaaS Magic Number (sales efficiency)
\`\`\`excel
= Net New ARR in period / Prior Period S&M Spend
// >0.75x = efficient; <0.5x = concern
\`\`\`

### Rule of 40
\`\`\`excel
= Revenue Growth % + EBITDA Margin %
// >40 = healthy SaaS; best-in-class >60
\`\`\`

---

## Tab 5: Revenue Quality Scorecard

| Metric | Actual | Best-in-Class | Good | Concerning | Score (1–5) |
|--------|--------|--------------|------|------------|-------------|
| Recurring Revenue % | | >90% | >80% | <70% | |
| Net Dollar Retention | | >120% | >110% | <100% | |
| Gross Retention | | >95% | >90% | <85% | |
| Customer Concentration (top 10) | | <20% | <30% | >40% | |
| LTV:CAC | | >5x | >3x | <2x | |
| CAC Payback (months) | | <12 | <18 | >24 | |
| Multi-year Contract % | | >50% | >30% | <20% | |
| Cohort Stability | | Growing | Stable | Declining | |

\`\`\`excel
Overall Score = AVERAGE(Score_column)
// 4–5: High quality, premium multiple justified
// 3–4: Good quality, market multiple
// 1–3: Concerning, haircut required
\`\`\`

**Red flags section:**
- Any single customer >10% of ARR
- Net retention <100% (losing revenue from existing customers)
- Cohort analysis shows deterioration in newer cohorts
- CAC payback >24 months
- Expansion ARR from a small number of large customers (masks underlying churn)

---

## Important Notes

- **Always ask for raw customer-level data** if available — aggregate metrics can hide problems
- **NDR >100% can mask high gross churn** if expansion from a few large customers is strong — always show both
- **Cohort analysis is the single most important view** for revenue quality — push for this data even if it's manual
- **Differentiate contracted ARR from recognized revenue** — billings vs. revenue timing differences matter
- **Usage-based models**: focus on consumption trends and net expansion rather than traditional ARR retention
- **Professional services revenue** should be evaluated separately — it's not recurring and margins are typically lower
`,
      },
    ],
  },
  {
    name: "portfolio-monitoring",
    files: [
      {
        path: "SKILL.md",
        data: `---
name: portfolio-monitoring
description: Track and analyze portfolio company performance against budget and prior periods in Excel. Extracts KPIs, flags variances, and produces summary dashboards for board materials or GP reviews. Use when reviewing portfolio company financials, preparing board materials, or monitoring covenant compliance. Triggers on "portfolio monitoring", "review portfolio company", "monthly financials", "how is [company] performing", "variance analysis", "covenant check", or "portfolio update".
platform: excel
---

# Portfolio Company Monitoring

READ THIS ENTIRE FILE before building a monitoring dashboard.

## Step 1: Ingest Financial Package

Accept:
- Monthly or quarterly P&L, balance sheet, cash flow (Excel or PDF upload)
- Budget/plan for the same periods
- Prior year actuals for YoY comparison
- Credit agreement covenant levels (if applicable)

Extract: Revenue, EBITDA, Cash balance, Net Debt, CapEx, Working Capital, key operational KPIs.

---

## Sheet Structure

1. **Dashboard** — one-page executive summary with traffic light status
2. **P&L** — actuals vs. budget vs. prior year
3. **Balance Sheet** — current snapshot
4. **Covenant Compliance** — if leverage covenants exist
5. **Trend Charts** — key metrics over rolling 12 months
6. **Questions for Management** — items to address in next call

---

## Tab 1: Dashboard

**Header:**
\`\`\`
[Company Name] — [Reporting Period]
PE Sponsor: [Fund name]
Investment Date: [Date] | Hold Period: [X years]
\`\`\`

**Financial KPI Table (traffic light):**

| KPI | Budget | Actual | Prior Period | vs. Budget | vs. Prior | Status |
|-----|--------|--------|-------------|------------|-----------|--------|
| Revenue ($mm) | | | | =Act/Bud-1 | =Act/Prior-1 | |
| EBITDA ($mm) | | | | | | |
| EBITDA Margin % | | | | | | |
| Cash Balance ($mm) | | | | | | |
| Net Debt ($mm) | | | | | | |
| Leverage (Net Debt/EBITDA) | | | | | | |
| Interest Coverage | | | | | | |
| CapEx ($mm) | | | | | | |
| FCF ($mm) | | | | | | |

**Traffic light formula:**
\`\`\`excel
=IF(ABS(vs_budget)<=0.05, "🟢",
 IF(vs_budget>=-0.15, "🟡", "🔴"))
\`\`\`

- 🟢 **Green**: Within 5% of budget
- 🟡 **Yellow**: 5–15% below budget — flag for discussion
- 🔴 **Red**: >15% below budget OR covenant breach risk — immediate attention

**One-paragraph summary (fill manually):**
\`\`\`
[Company] is tracking [ahead of / in line with / behind] plan for [period].
Revenue is [X% above/below] budget driven by [key driver].
EBITDA margin of [X%] compares to budgeted [Y%] due to [reason].
Key areas requiring attention: [1–2 items].
\`\`\`

---

## Tab 2: P&L vs. Budget vs. Prior Year

\`\`\`
                        Actual    Budget    $ Var    % Var    Prior Yr    YoY%
Revenue                 [act]     [bud]     =A-B     =Var/Bud  [py]      =A/PY-1
  Revenue by Segment
Gross Profit            [=]       [=]       [=]      [=]       [=]       [=]
  Gross Margin %        [=]       [=]       [=pt]    -         [=]       [=pt]
EBITDA                  [=]       [=]       [=]      [=]       [=]       [=]
  EBITDA Margin %
D&A                     [=]       [=]       [=]      [=]
EBIT                    [=]
Interest Expense        [=]
EBT / Net Income        [=]
\`\`\`

**Formatting:** red fill for negative variances >5%, green fill for positive variances >5%.

---

## Tab 3: Balance Sheet Snapshot

Current period vs. prior period:
- Working Capital = Current Assets − Current Liabilities
- Net Debt = Total Debt − Cash
- Leverage = Net Debt / LTM EBITDA
- Interest Coverage = LTM EBITDA / LTM Interest Expense

**Cash bridge:**
\`\`\`
Beginning Cash
+ Cash from Operations
- CapEx
+/- Net Debt Change
+/- Other
= Ending Cash
Variance to Budget:
\`\`\`

---

## Tab 4: Covenant Compliance

| Covenant | Threshold | Actual | Headroom | Status |
|----------|-----------|--------|----------|--------|
| Max Leverage (Net Debt/EBITDA) | ≤5.5x | | =Threshold-Actual | =IF(Actual>Threshold,"⚠️ BREACH","✅") |
| Min Interest Coverage (EBITDA/Interest) | ≥2.0x | | =Actual-Threshold | |
| Min Liquidity (Cash) | ≥$Xmm | | | |

**EBITDA definition for covenant purposes** may differ from reported EBITDA — confirm with credit agreement.

**Covenant headroom trend** (add rolling 4-quarter table):
\`\`\`
Quarter | Leverage Actual | Leverage Threshold | Headroom
Q1      |                 |                    |
Q2      |                 |                    |
...
\`\`\`

---

## Tab 5: Operational KPIs

Customize by sector. Common examples:

**SaaS:** ARR, Net Retention %, New Logos, Churn %, Customer Count
**Manufacturing:** Units Produced, Capacity Utilization %, Inventory Turns, Backlog
**Services:** Revenue per Employee, Headcount, Utilization %, Client Count
**Healthcare:** Locations, Patient Visits, Revenue per Visit, Occupancy %
**Retail:** Store Count, SSS%, Revenue per Store, Inventory Turns

---

## Tab 6: Questions for Management

Generate a list of questions based on red/yellow flags:

| # | Topic | Question | Priority | Status |
|---|-------|----------|----------|--------|
| 1 | Revenue miss | What drove the $X miss vs. budget in [segment]? | P0 | Open |
| 2 | Margin compression | Is the COGS increase structural or one-time? | P1 | Open |

---

## Important Notes

- **Always ask for the budget** to compare against — actuals without context are noise
- **Ask what sector KPIs matter** — don't assume generic metrics apply to every business
- **If covenant levels aren't known**, ask for the credit agreement terms before building the tracker
- **Output should be board-ready** — concise, factual, no jargon or filler
- **Trend the key metrics** over 4–8 quarters to spot inflection points before they become problems
- **Cash flow is the ultimate truth** — EBITDA can be managed, cash cannot
`,
      },
    ],
  },
  {
    name: "deal-screening",
    files: [
      {
        path: "SKILL.md",
        data: `---
name: deal-screening
description: Quickly screen inbound deal flow — CIMs, teasers, and broker materials — against a fund's investment criteria. Extracts key deal metrics, runs a pass/fail framework, and outputs a one-page screening memo. Use when reviewing new deal opportunities, triaging inbound materials, or deciding whether to take a first call. Triggers on "screen this deal", "review this CIM", "should we look at this", "triage this teaser", "deal screening", or "is this a fit for us".
platform: excel
---

# Deal Screening

READ THIS ENTIRE FILE before screening any deal.

## Step 1: Extract Deal Facts

From the CIM, teaser, or user description, extract:

| Field | Value |
|-------|-------|
| Company name | |
| Location | |
| Sector / subsector | |
| Business description | 1–2 sentences |
| Revenue ($mm) | |
| EBITDA ($mm) | |
| EBITDA Margin % | |
| Revenue Growth (YoY) | |
| Deal type | Platform / Add-on / Recap / Growth / Carve-out |
| Asking valuation | EV ($mm) and EV/EBITDA implied |
| Seller motivation | Why selling now |
| Management | Rolling / Exiting / Partial rollover |
| Top customer concentration | Top 1 / Top 5 / Top 10 as % of revenue |
| Revenue type | Recurring % / Project-based % |
| Key risks (stated) | |

---

## Step 2: Screen Against Investment Criteria

**Ask the user for their fund's criteria if not already known.** Once confirmed, save for future screenings.

| Criterion | Fund Target | Deal Actual | Pass / Fail / ? |
|-----------|------------|-------------|-----------------|
| Revenue range ($mm) | | | |
| EBITDA range ($mm) | | | |
| EBITDA margin threshold | | | |
| Revenue growth profile | | | |
| Sector fit | | | |
| Geography | | | |
| Deal size / EV range | | | |
| Max entry valuation (x EBITDA) | | | |
| Customer concentration (max %) | | | |
| Management continuity | | | |
| Revenue quality (recurring %) | | | |

**Scoring:**
- **Pass**: meets criterion
- **Fail**: does not meet criterion — flag if deal-breaker vs. negotiable
- **?**: unclear — needs first call or more data

---

## Step 3: Quick Assessment

**Verdict:** \`Pass — Further Diligence\` / \`Conditional Pass — First Call\` / \`Hard Pass\`

### Bull Case (2–3 bullets)
Why this could be a good deal:
- Strong fit with thesis because...
- Identifiable value creation levers...
- Attractive entry price relative to...

### Bear Case (2–3 bullets)
Key risks and concerns:
- Customer concentration issue...
- Growth deceleration concerns...
- Competitive dynamics...

### Key Questions for First Call
What you must answer before deciding to proceed:

| # | Question | Why It Matters |
|---|----------|---------------|
| 1 | | |
| 2 | | |
| 3 | | |

---

## Step 4: Screening Memo (One Page)

**Format:**

\`\`\`
DEAL SCREENING MEMO
Company: [Name] | Date: [Today] | Screened by: [Name]

DEAL OVERVIEW
[2–3 sentence description]

KEY METRICS
Revenue: $Xmm | EBITDA: $Ymm | Margin: Z% | Growth: W%
EV: $Amm | EV/EBITDA: Bx | Type: [Platform/Add-on]

CRITERIA CHECK
[Pass/Fail table from Step 2]

VERDICT: [Pass / Conditional / Hard Pass]

BULL CASE:
• [bullet]
• [bullet]

BEAR CASE:
• [bullet]
• [bullet]

KEY QUESTIONS FOR FIRST CALL:
1. [question]
2. [question]
3. [question]

RECOMMENDED NEXT STEP: [Take first call / Pass / Request more info]
\`\`\`

---

## Important Notes

- **Speed matters** — screening should take minutes, not hours; don't over-research before the first call
- **Be direct about red flags** — don't bury concerns in the memo
- **If financials seem inconsistent** (EBITDA % changes dramatically year-to-year, round numbers everywhere), flag it explicitly
- **One hard-pass criterion should kill the deal** — don't rationalize around fundamental mismatches
- **Save the fund's screening criteria** once confirmed — apply consistently to future deals
- **Track pass/fail rate by criterion** over time — helps identify where deal flow is mismatched to strategy
`,
      },
    ],
  },
  {
    name: "dd-meeting-prep",
    files: [
      {
        path: "SKILL.md",
        data: `---
name: dd-meeting-prep
description: Prepare for due diligence meetings in Excel — management presentations, expert network calls, customer references, and advisor sessions. Generates targeted question lists, benchmarks, and red flags to probe. Use before any diligence meeting or call. Triggers on "prep for management meeting", "diligence call prep", "expert call questions", "customer reference questions", or "meeting prep for [company]".
platform: excel
---

# Diligence Meeting Prep

READ THIS ENTIRE FILE before preparing a diligence meeting.

## Workflow

### Step 1: Meeting Context

Ask the user for:
- **Meeting type**: Management presentation, expert call, customer reference, advisor check-in, site visit
- **Attendees**: Who from the target company or third party
- **Topic focus**: Full business overview, or specific workstream (financial, commercial, operational, tech)
- **What you already know**: Prior meetings, CIM, data room findings
- **Key concerns**: Specific issues to probe

### Step 2: Generate Question List

Organize questions by priority and topic. Structure depends on meeting type:

#### Management Presentation
**Business Overview (warm-up)**
- Walk us through the founding story and key milestones
- How do you describe the business to someone unfamiliar with the space?
- What are you most proud of? What would you do differently?

**Revenue & Growth**
- Walk us through revenue by customer/segment/geography
- What's driving growth? Price vs. volume vs. new customers
- What does the sales cycle look like? How has win rate trended?
- Where do you see the biggest growth opportunities in the next 3-5 years?

**Competitive Positioning**
- Who do you lose deals to and why?
- What's your moat? How defensible is it?
- How do customers evaluate you vs. alternatives?

**Operations & Team**
- Walk us through the org chart — who are the key people?
- What roles are you hiring for? What's been hardest to fill?
- What keeps you up at night operationally?

**Financial Deep-Dive**
- Walk us through the margin bridge — what's changed and why?
- Any one-time or non-recurring items we should understand?
- How do you think about capex — maintenance vs. growth?
- Working capital seasonality?

**Forward Look**
- Walk us through the budget/plan for next year
- What assumptions are you most/least confident in?
- What would need to go right/wrong to significantly beat/miss plan?

#### Expert Network Call
- How do you view [company]'s positioning in the market?
- What are the secular trends driving this space?
- Who are the strongest competitors and why?
- What risks should an investor be aware of?
- If you were buying this business, what would you diligence most carefully?

#### Customer Reference Call
- How did you find [company] and why did you choose them?
- What alternatives did you evaluate?
- What do they do well? Where could they improve?
- How likely are you to renew/expand? What would change that?
- If they raised prices 10-20%, how would you react?

### Step 3: Benchmarks & Context

For each key topic, provide relevant benchmarks:
- Industry growth rates and margin profiles
- Comparable company metrics (if comps analysis exists in session)
- Data points from the CIM or data room that warrant follow-up
- Discrepancies between different data sources to clarify

### Step 4: Red Flags to Probe

Based on what's known, flag specific areas to dig into:
- Inconsistencies in the CIM or financials
- Customer concentration or churn signals
- Management team gaps or recent departures
- Unusual accounting treatments
- Missing data room items

### Step 5: Output

Excel meeting prep sheet:
1. **Meeting logistics**: Who, when, where, duration
2. **Objectives**: Top 3 things you need to learn from this meeting
3. **Question list**: Prioritized table grouped by topic (flag must-asks)
4. **Benchmarks**: Key numbers to reference
5. **Red flags**: Specific items to probe
6. **Follow-up items**: What to request after the meeting

## Important Notes

- Lead with open-ended questions — let management talk, then follow up on specifics
- Don't lead the witness — ask neutral questions, not "isn't it true that..."
- Take notes on body language and confidence levels, not just answers
- Always end with: "What haven't we asked about that we should?"
- Keep the question list to 15-20 max — you won't get through more in a 60-90 min session
`,
      },
    ],
  },
  {
    name: "deal-sourcing",
    files: [
      {
        path: "SKILL.md",
        data: `---
name: deal-sourcing
description: Build a PE deal sourcing tracker in Excel — organize target companies by sector and deal parameters, track relationship status, and draft founder outreach email templates. Use when building a target list, tracking sourcing pipeline, or preparing outreach materials. Triggers on "find companies", "source deals", "draft founder email", "deal sourcing", "target list", or "outreach to founder".
platform: excel
---

# Deal Sourcing

READ THIS ENTIRE FILE before building a deal sourcing tracker.

## Workflow

This skill builds a 3-tab sourcing workbook in Excel.

### Tab 1: Target Universe

Build a target company list based on the user's criteria:

- **Sector/industry focus**: Ask what space they're looking in (e.g., "B2B SaaS in healthcare", "industrial services in the Southeast")
- **Deal parameters**: Revenue range, EBITDA range, growth profile, geography, ownership type (founder-owned, PE-backed, corporate carve-out)
- **Output table**:

| Company | Description | Est. Revenue | EBITDA | Location | Ownership | Founder/CEO | Website | Thesis Fit | Status |
|---------|-------------|-------------|--------|----------|-----------|-------------|---------|-----------|--------|
| | | | | | | | | | New / Contacted / Passed |

Note: Use Finnhub or Databricks data if available; otherwise prompt user to fill in company data manually.

### Tab 2: Pipeline Tracker

Track outreach status and relationship history:

| Company | First Contact | Last Contact | Contact Name | Status | Next Step | Notes |
|---------|--------------|-------------|--------------|--------|-----------|-------|
| | | | | New / Reached Out / In Dialogue / Passed / Closed | | |

Status key:
- **New** — no prior contact
- **Reached Out** — email sent, no response yet
- **In Dialogue** — active conversation
- **Previously Passed** — firm passed on prior review (note reason)

### Tab 3: Outreach Templates

Draft personalized cold email templates for the user to customize and send:

**Email Structure:**
1. Brief intro — who you are and your firm (ask user for their firm intro if not provided)
2. Why this company caught your attention — reference something specific (product, market position, growth)
3. What you're looking for — partnership, not just a transaction
4. Soft ask — "Would you be open to a brief conversation?"

**Tone guidelines:**
- Professional but warm — founders respond better to genuine, concise outreach
- 4-6 sentences max. Founders are busy
- Subject line: short and specific — reference the company or sector, not "Investment Opportunity"
- No attachments on first touch

## Important Notes

- Always present the target list for user review before drafting emails
- Never send emails without explicit user approval
- If the user's firm intro or investment criteria aren't clear, ask before drafting
- Prioritize quality over quantity — 5 well-researched targets beat 20 generic ones
`,
      },
    ],
  },
  {
    name: "ic-memo",
    files: [
      {
        path: "SKILL.md",
        data: `---
name: ic-memo
description: Structure an investment committee memo for PE deal approval in Excel. Organizes due diligence findings, financial analysis, deal terms, and returns into an IC-ready workbook with supporting tables. Use when preparing for investment committee, writing up a deal, or creating a formal recommendation. Triggers on "write IC memo", "investment committee memo", "deal write-up", "prepare IC materials", or "recommendation memo".
platform: excel
---

# Investment Committee Memo

READ THIS ENTIRE FILE before building an IC memo.

## Workflow

### Step 1: Gather Inputs

Collect from the user (or from prior analysis in the session):

- Company overview and business description
- Industry/market context
- Historical financials (3-5 years)
- Management assessment
- Deal terms (price, structure, financing)
- Due diligence findings (commercial, financial, legal, operational)
- Value creation plan / 100-day plan
- Returns analysis (base, upside, downside)

### Step 2: Draft Memo Structure

Standard IC memo format:

**I. Executive Summary** (1 page)
- Company description, deal rationale, key terms
- Recommendation and headline returns
- Top 3 risks and mitigants

**II. Company Overview** (1-2 pages)
- Business description, products/services
- Customer base and go-to-market
- Competitive positioning
- Management team

**III. Industry & Market** (1 page)
- Market size and growth
- Competitive landscape
- Secular trends / tailwinds
- Regulatory environment

**IV. Financial Analysis** (2-3 pages)
- Historical performance (revenue, EBITDA, margins, cash flow)
- Quality of earnings adjustments
- Working capital analysis
- Capex requirements

**V. Investment Thesis** (1 page)
- Why this is an attractive investment (3-5 pillars)
- Value creation levers (organic growth, margin expansion, M&A, multiple expansion)
- 100-day priorities

**VI. Deal Terms & Structure** (1 page)
- Enterprise value and implied multiples
- Sources & uses
- Capital structure / leverage
- Key legal terms

**VII. Returns Analysis** (1 page)
- Base, upside, and downside scenarios
- IRR and MOIC across scenarios
- Key assumptions driving returns
- Sensitivity analysis

**VIII. Risk Factors** (1 page)
- Key risks ranked by severity and likelihood
- Mitigants for each risk
- Deal-breaker risks (if any)

**IX. Recommendation**
- Clear recommendation: Proceed / Pass / Conditional proceed
- Key conditions or next steps

### Step 3: Output Format

- Excel workbook with one sheet per section (Executive Summary, Financials, Returns, Risk Factors)
- Each section uses structured tables — no narrative-only sheets
- Include financial tables for EBITDA bridge, S&U, and returns math that tie across sheets

## Important Notes

- IC memos should be factual and balanced — present both bull and bear cases honestly
- Don't minimize risks. IC members will find them anyway; credibility matters
- Use the firm's standard memo template if the user provides one
- Financial tables should tie — check that EBITDA bridges, S&U balances, and returns math is consistent
- Ask for missing inputs rather than making assumptions on deal terms or returns
`,
      },
    ],
  },
  {
    name: "value-creation-plan",
    files: [
      {
        path: "SKILL.md",
        data: `---
name: value-creation-plan
description: Build a post-acquisition value creation plan in Excel with EBITDA bridge, 100-day priorities, KPI dashboard, and accountability tracker. Use when planning post-close execution, preparing operating partner materials, or building a board-ready value creation roadmap. Triggers on "value creation plan", "100-day plan", "post-close plan", "EBITDA bridge", "operating plan", or "value creation levers".
platform: excel
---

# Value Creation Plan

READ THIS ENTIRE FILE before building a value creation plan.

## Workflow

### Step 1: Baseline Assessment

Understand the starting point:
- Current revenue, EBITDA, and margins
- Organizational structure and capabilities
- Key operational metrics by function
- Management team strengths and gaps
- Quick wins already identified during diligence

### Step 2: Value Creation Levers

Map all levers to an EBITDA bridge over the hold period:

#### Revenue Growth Levers
- **Organic growth**: Price increases, volume growth, market expansion
- **Cross-sell / upsell**: New products to existing customers
- **New market entry**: Geographic expansion, new verticals, new channels
- **Sales force effectiveness**: Hire reps, improve conversion, shorten cycle
- **M&A / add-ons**: Bolt-on acquisitions to add revenue and capabilities

For each lever:
- Current state → Target state
- Revenue impact ($)
- Timeline to impact
- Investment required
- Confidence level (high/medium/low)

#### Margin Expansion Levers
- **Pricing optimization**: Price increases, mix shift, bundling
- **COGS reduction**: Procurement savings, supplier consolidation, automation
- **OpEx optimization**: Overhead reduction, shared services, offshoring
- **Technology investment**: Automation, systems integration, data analytics
- **Scale leverage**: Fixed cost leverage as revenue grows

#### Strategic / Multiple Expansion
- **Platform building**: Add-on acquisitions, tuck-ins
- **Recurring revenue shift**: Move from project to recurring/subscription
- **Market positioning**: Category leadership, brand building
- **Management upgrades**: Key hires to professionalize the business
- **ESG / governance**: Board formation, reporting improvements

### Step 3: EBITDA Bridge

Build the walk from current to target EBITDA:

| Lever | Year 1 | Year 2 | Year 3 | Year 4 | Year 5 |
|-------|--------|--------|--------|--------|--------|
| Base EBITDA | | | | | |
| Organic revenue growth | | | | | |
| Pricing | | | | | |
| Add-on M&A | | | | | |
| COGS savings | | | | | |
| OpEx optimization | | | | | |
| Technology investment | | | | | |
| **Pro Forma EBITDA** | | | | | |
| **Margin** | | | | | |

### Step 4: 100-Day Plan

Prioritize the first 100 days post-close:

**Days 1-30: Stabilize & Assess**
- Management alignment and retention (sign employment agreements, set comp)
- Quick wins — pricing, obvious cost cuts, low-hanging fruit
- Detailed operational assessment by function
- Customer communication plan
- Set up reporting and KPI dashboards

**Days 31-60: Plan & Initiate**
- Finalize strategic plan and communicate to organization
- Launch top 3-5 value creation initiatives
- Begin add-on M&A pipeline development
- Hire for critical gaps
- Implement new reporting cadence (weekly flash, monthly review, quarterly board)

**Days 61-100: Execute & Measure**
- First results from quick-win initiatives
- First board meeting with operating metrics
- Progress report on each value creation lever
- Adjust plan based on early learnings

### Step 5: KPI Dashboard

Define the metrics that will track value creation:

| KPI | Current | Year 1 Target | Owner | Reporting Frequency |
|-----|---------|---------------|-------|-------------------|
| Revenue | | | CEO | Monthly |
| EBITDA | | | CFO | Monthly |
| EBITDA margin | | | CFO | Monthly |
| New customer wins | | | CRO | Weekly |
| Net retention | | | CRO | Monthly |
| Employee turnover | | | CHRO | Monthly |
| Cash conversion | | | CFO | Monthly |

### Step 6: Output

Excel workbook with:
1. **Summary** — executive overview with key metrics and headline targets
2. **EBITDA Bridge** — lever-by-lever walk with formulas and year-by-year impact
3. **100-Day Plan** — timeline table with owners, status, and milestones
4. **KPI Dashboard** — current vs. target metrics with conditional formatting
5. **Accountability Matrix** — initiative owners, deadlines, and reporting cadence

## Important Notes

- Be realistic about timing — most PE value creation takes 12-24 months to show in financials
- Quick wins matter for momentum and credibility, but don't over-rotate on cost cuts at the expense of growth
- Management buy-in is critical — co-develop the plan, don't impose it
- Track initiative-level P&L impact, not just top-line EBITDA — you need to know what's working
- Add-on M&A is often the largest value creation lever — start the pipeline on Day 1
- Always pressure-test assumptions with operating partners or industry experts
`,
      },
    ],
  },
  {
    name: "portfolio-rebalance",
    files: [
      {
        path: "SKILL.md",
        data: `---
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
\`\`\`excel
=IF(ABS(Drift%)>=RebalancingBand, "⚠️ Rebalance", "✅ Within Band")
\`\`\`

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

\`\`\`
Total Realized Gains:       =SUMIF(Gain/Loss, ">0")
Total Realized Losses:      =SUMIF(Gain/Loss, "<0")
Net Realized Gain/(Loss):   =SUM
Estimated Total Tax:        =SUMPRODUCT(Gains, TaxRates)
\`\`\`

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
`,
      },
    ],
  },
  {
    name: "tax-loss-harvesting",
    files: [
      {
        path: "SKILL.md",
        data: `---
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
\`\`\`excel
ST Loss Tax Savings = ST_Loss * Marginal_Ordinary_Rate
LT Loss Tax Savings = LT_Loss * Capital_Gains_Rate
Ordinary Income Deduction = MIN(3000, RemainingNetLoss) * Marginal_Rate
Total Estimated Savings = SUM
\`\`\`

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
\`\`\`
Total estimated losses harvested:   $
Estimated tax savings at [XX%] rate: $
Net portfolio impact:                Minimal (replacement maintains exposure)
Wash sale windows:                   [list security and 30-day end dates]
\`\`\`

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
`,
      },
    ],
  },
  {
    name: "financial-plan",
    files: [
      {
        path: "SKILL.md",
        data: `---
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
\`\`\`
Inflation rate:          2.5–3.0%
Salary raise rate:       2–3% (or 0% at retirement)
Investment return:       4–7% (varies by allocation, be conservative)
Tax rate (effective):    [input based on income]
\`\`\`

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
\`\`\`excel
Portfolio at Retirement:      [from accumulation table]
Sustainable Withdrawal Rate:  =AnnualWithdrawal / PortfolioAtRetirement
Years Portfolio Lasts:        =NPER(ReturnRate, -AnnualWithdrawal, PortfolioAtRetirement)
Age Portfolio Depleted:       =RetirementAge + YearsPortfolioLasts
\`\`\`

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
\`\`\`excel
Federal Exemption (2025):      $13.61mm per person
Taxable Estate:                =MAX(0, TotalEstate - Exemption)
Estimated Federal Tax (40%):   =TaxableEstate * 0.40
Note: Check current law — exemption sunsets in 2026
\`\`\`

**Gifting strategy:**
\`\`\`
Annual Exclusion Per Recipient (2025): $18,000
Total Annual Gifting Capacity:         =RecipientCount * 18000
Lifetime Exemption Remaining:          =Exemption - PriorGifting
\`\`\`

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
`,
      },
    ],
  },
  {
    name: "client-review",
    files: [
      {
        path: "SKILL.md",
        data: `---
name: client-review
description: Prepare for client review meetings with portfolio performance summary, allocation analysis, talking points, and action items. Pulls together account data into a concise meeting-ready format in Excel. Use before quarterly reviews, annual checkups, or ad-hoc client meetings. Triggers on "client review", "meeting prep for [client]", "quarterly review", "prep for [client name]", or "client meeting".
platform: excel
---

# Client Review Prep

READ THIS ENTIRE FILE before preparing a client review.

## Workflow

### Step 1: Client Context

Gather or look up:
- **Client name** and household members
- **Account types**: Taxable, IRA, Roth, 401(k), trust, etc.
- **Total AUM** across accounts
- **Investment Policy Statement (IPS)**: Target allocation, risk tolerance, constraints
- **Life stage**: Accumulation, pre-retirement, retirement, legacy
- **Last meeting date** and any outstanding action items

### Step 2: Portfolio Performance

For each account and the household aggregate:

| Metric | QTD | YTD | 1-Year | 3-Year | Since Inception |
|--------|-----|-----|--------|--------|----------------|
| Portfolio return | | | | | |
| Benchmark return | | | | | |
| Alpha | | | | | |

**Performance Attribution:**
- Which asset classes / positions drove returns?
- Top 3 contributors and top 3 detractors
- Any outsized single-position impact?

### Step 3: Allocation Review

Current vs. target allocation:

| Asset Class | Target | Current | Drift | Action |
|------------|--------|---------|-------|--------|
| US Large Cap | | | | |
| US Mid/Small | | | | |
| International Developed | | | | |
| Emerging Markets | | | | |
| Fixed Income | | | | |
| Alternatives | | | | |
| Cash | | | | |

Flag any drift exceeding the IPS rebalancing threshold (typically 3-5%).

### Step 4: Talking Points

Generate a meeting agenda:

1. **Market overview** (2-3 min): Brief macro context and outlook
2. **Portfolio performance** (5 min): How did we do? Why?
3. **Allocation review** (5 min): Any rebalancing needed?
4. **Planning updates** (5-10 min):
   - Life changes? (job, health, family, home, education)
   - Income needs changing?
   - Tax situation updates
   - Estate planning updates
5. **Action items** (5 min): What are we doing before next meeting?

### Step 5: Proactive Recommendations

Based on the review, suggest:
- Rebalancing trades (if drift exceeds thresholds)
- Tax-loss harvesting opportunities
- Cash deployment or withdrawal planning
- Roth conversion opportunities (if applicable)
- Beneficiary updates or estate planning needs
- Insurance review (life, disability, LTC)

### Step 6: Output

- One-page client review summary (Word or PDF)
- Performance table with benchmarks
- Allocation pie chart (current vs. target)
- Recommended action items
- Meeting agenda

## Important Notes

- Know your client before the meeting — review notes from last meeting
- Lead with what the client cares about, not what you want to talk about
- If performance was bad, address it directly — don't hide or spin
- Always end with clear action items and next steps with dates
- Document the meeting notes and any changes to the IPS
- Compliance: ensure all materials are compliant with firm policies and regulatory requirements
`,
      },
    ],
  },
  {
    name: "investment-proposal",
    files: [
      {
        path: "SKILL.md",
        data: `---
name: investment-proposal
description: Create professional investment proposals for prospective clients in Excel. Covers proposed allocation, projected outcomes, and fee structure with scenario modeling. Use when pitching new clients or presenting a new investment strategy. Triggers on "investment proposal", "prospect presentation", "pitch new client", "proposal for [client]", or "new client presentation".
platform: excel
---

# Investment Proposal

READ THIS ENTIRE FILE before building an investment proposal.

## Workflow

### Step 1: Prospect Context

Gather:
- **Prospect name** and household details
- **Current situation**: Existing advisor? Self-directed? What prompted the meeting?
- **Assets**: Estimated AUM, account types, current holdings (if shared)
- **Goals**: Retirement, wealth preservation, growth, income, education, estate
- **Risk tolerance**: Conservative, moderate, aggressive (or questionnaire score)
- **Constraints**: ESG preferences, concentrated stock, illiquidity needs
- **Fee sensitivity**: What are they paying now?
- **Competition**: Who else are they considering?

### Step 2: Proposal Structure

**I. About Our Firm** (1 page)
- Firm overview, history, AUM
- Investment philosophy (in plain English)
- Team bios (relevant to this client)
- Client service model (how often do we meet, who do they call)

**II. Understanding Your Needs** (1 page)
- Restate their goals and concerns — show you listened
- Key planning considerations identified in discovery
- What success looks like for them

**III. Proposed Investment Strategy** (2-3 pages)
- Recommended asset allocation with rationale
- How allocation maps to their goals and risk tolerance
- Investment vehicles (ETFs, mutual funds, individual securities, alternatives)
- Tax-aware strategy (asset location, tax-loss harvesting)

Proposed allocation:

| Asset Class | Allocation | Vehicle | Rationale |
|------------|-----------|---------|-----------|
| | | | |

**IV. Expected Outcomes** (1-2 pages)
- Projected growth scenarios (conservative, moderate, optimistic)
- Monte Carlo probability of meeting goals
- Income projections (if retirement or income-focused)
- Risk metrics (max drawdown, volatility)
- Comparison to current portfolio (if known)

**V. Fee Structure** (1 page)
- Advisory fee schedule (tiered if applicable)
- Underlying fund expenses
- Total all-in cost estimate
- How fees compare to industry averages
- Value proposition — what they get for the fee

**VI. Getting Started** (1 page)
- Account opening process
- Asset transfer timeline
- Transition plan (if moving from another advisor)
- First 90 days — what to expect
- Required documents and next steps

### Step 3: Customization

- Match the tone to the prospect (corporate executive vs. small business owner vs. retiree)
- If they have a concentrated stock position, address it directly
- If they're comparing you to robo-advisors, emphasize the planning and relationship value
- If they're price-sensitive, lead with total value and outcomes, not just fees

### Step 4: Output

- PowerPoint presentation (12-15 slides) with firm branding
- PDF leave-behind version
- One-page summary for follow-up email

## Important Notes

- The proposal should feel personalized, not templated — reference their specific situation
- Don't oversell performance — set realistic expectations and emphasize process
- Always include disclaimers (projections are hypothetical, past performance, etc.)
- The transition plan matters — clients fear the disruption of switching advisors
- Follow up within 48 hours with the proposal and a clear next step
- Compliance must review before presenting to prospects
`,
      },
    ],
  },
  {
    name: "client-report",
    files: [
      {
        path: "SKILL.md",
        data: `---
name: client-report
description: Build professional client-facing performance reports in Excel with portfolio returns, allocation breakdowns, holdings detail, and market commentary. Suitable for quarterly or annual distribution. Triggers on "client report", "performance report", "quarterly report for [client]", "generate reports", or "client statement".
platform: excel
---

# Client Report

READ THIS ENTIRE FILE before building a client report.

## Workflow

### Step 1: Report Parameters

- **Client name** and household
- **Reporting period**: Quarter, YTD, annual, custom range
- **Accounts**: All accounts or specific account
- **Benchmark**: S&P 500, 60/40 blend, custom benchmark matching IPS
- **Firm branding**: Logo, colors, disclaimers

### Step 2: Performance Summary

**Household Summary:**

| | QTD | YTD | 1-Year | 3-Year Ann. | 5-Year Ann. | ITD Ann. |
|---|-----|-----|--------|-------------|-------------|----------|
| Portfolio | | | | | | |
| Benchmark | | | | | | |
| +/- | | | | | | |

**By Account:**

| Account | Type | Value | QTD | YTD | Benchmark |
|---------|------|-------|-----|-----|-----------|
| Joint Taxable | Brokerage | | | | |
| John IRA | Traditional | | | | |
| Jane Roth | Roth IRA | | | | |
| 529 Plan | Education | | | | |
| **Total** | | | | | |

### Step 3: Allocation Overview

Current allocation with visual (pie chart or bar chart):

| Asset Class | % of Portfolio | $ Value | Benchmark % |
|------------|---------------|---------|-------------|
| | | | |

### Step 4: Holdings Detail

| Security | Asset Class | Shares | Price | Value | % of Portfolio | QTD Return |
|----------|-----------|--------|-------|-------|---------------|-----------|
| | | | | | | |

### Step 5: Market Commentary

Brief market summary tailored to the client's level of sophistication:
- What happened in markets this quarter (2-3 sentences)
- How it affected the portfolio
- Outlook and positioning rationale (2-3 sentences)
- No jargon for retail clients; can be more technical for sophisticated investors

### Step 6: Activity Summary

- Trades executed during the period
- Contributions and withdrawals
- Dividends and interest received
- Fees charged
- Rebalancing activity

### Step 7: Planning Notes

- Progress toward financial goals (retirement, education, etc.)
- Any plan changes or recommendations
- Upcoming action items
- Next review date

### Step 8: Output

Excel workbook with one tab per section:
1. **Summary** — client name, period, key performance metrics at a glance
2. **Performance** — returns table vs. benchmark across time periods
3. **Allocation** — current vs. target with conditional formatting for drift
4. **Holdings** — full holdings detail with returns and weights
5. **Activity** — trades, contributions, withdrawals, dividends during the period
6. **Commentary** — structured text cells for market commentary and planning notes
7. **Disclosures** — standard disclaimers (populate once, reuse per client)

## Important Notes

- Performance must be calculated net of fees unless client/compliance requires gross
- Always include appropriate disclaimers and disclosures (past performance, risk factors)
- Reports should be consistent across clients — use a standard template
- Match the level of detail to the client — some want every holding, others want a one-page summary
- Benchmark selection matters — use the benchmark from the IPS, not whatever looks best
- Review for compliance approval before first distribution of a new template
`,
      },
    ],
  },
];
