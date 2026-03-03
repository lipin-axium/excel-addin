---
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
```
d1 = (LN(S/K) + (r + σ²/2) × T) / (σ × √T)
d2 = d1 − σ × √T

Call = S × N(d1) − K × e^(−rT) × N(d2)
Put  = K × e^(−rT) × N(−d2) − S × N(−d1)
```
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
| A8 | d1 | `=(LN(B2/B3)+(B5+B6^2/2)*B4)/(B6*SQRT(B4))` |
| A9 | d2 | `=B8-B6*SQRT(B4)` |
| A11 | Call Price | `=B2*NORM.S.DIST(B8,TRUE)-B3*EXP(-B5*B4)*NORM.S.DIST(B9,TRUE)` |
| A12 | Put Price | `=B3*EXP(-B5*B4)*NORM.S.DIST(-B9,TRUE)-B2*NORM.S.DIST(-B8,TRUE)` |

**Verification** (S=100, K=105, r=5%, σ=20%, T=1):
- d1 ≈ 0.0940, d2 ≈ −0.1060
- Call ≈ 8.02, Put ≈ 7.90

---

## 2. Greeks

Greeks measure option price sensitivity. All formulas assume same S, K, T, r, σ inputs as above.

### Delta (Δ) — Price sensitivity to underlying
```
Call Delta = N(d1)
Put Delta  = N(d1) − 1
```
Excel:
```excel
Call Delta: =NORM.S.DIST(d1_cell, TRUE)
Put Delta:  =NORM.S.DIST(d1_cell, TRUE) - 1
```

### Gamma (Γ) — Delta sensitivity to underlying (same for calls and puts)
```
Gamma = N'(d1) / (S × σ × √T)
```
where N'(x) = standard normal PDF = e^(-x²/2) / √(2π)

Excel:
```excel
=NORM.S.DIST(d1_cell, FALSE) / (B2 * B6 * SQRT(B4))
```
Note: `NORM.S.DIST(x, FALSE)` returns the PDF, `TRUE` returns the CDF.

### Theta (Θ) — Price decay per calendar day
```
Call Theta = [−S × N'(d1) × σ / (2√T) − r × K × e^(−rT) × N(d2)] / 365
Put Theta  = [−S × N'(d1) × σ / (2√T) + r × K × e^(−rT) × N(−d2)] / 365
```
Excel (call):
```excel
=(-B2*NORM.S.DIST(B8,FALSE)*B6/(2*SQRT(B4)) - B5*B3*EXP(-B5*B4)*NORM.S.DIST(B9,TRUE)) / 365
```
Excel (put):
```excel
=(-B2*NORM.S.DIST(B8,FALSE)*B6/(2*SQRT(B4)) + B5*B3*EXP(-B5*B4)*NORM.S.DIST(-B9,TRUE)) / 365
```

### Vega (ν) — Price sensitivity to volatility (1% move in σ)
```
Vega = S × N'(d1) × √T / 100
```
Excel:
```excel
=B2 * NORM.S.DIST(B8,FALSE) * SQRT(B4) / 100
```
(Divide by 100 to express per 1% volatility move)

### Rho (ρ) — Price sensitivity to interest rate (1% move in r)
```
Call Rho = K × T × e^(−rT) × N(d2) / 100
Put Rho  = −K × T × e^(−rT) × N(−d2) / 100
```
Excel (call):
```excel
=B3 * B4 * EXP(-B5*B4) * NORM.S.DIST(B9,TRUE) / 100
```
Excel (put):
```excel
=-B3 * B4 * EXP(-B5*B4) * NORM.S.DIST(-B9,TRUE) / 100
```

### Greeks Summary Table Layout

| Row | A | B (Call) | C (Put) |
|-----|---|----------|---------|
| 15 | Delta | `=NORM.S.DIST(B8,TRUE)` | `=NORM.S.DIST(B8,TRUE)-1` |
| 16 | Gamma | `=NORM.S.DIST(B8,FALSE)/(B2*B6*SQRT(B4))` | *(same as call)* |
| 17 | Theta | *(call formula above)* | *(put formula above)* |
| 18 | Vega | `=B2*NORM.S.DIST(B8,FALSE)*SQRT(B4)/100` | *(same as call)* |
| 19 | Rho | `=B3*B4*EXP(-B5*B4)*NORM.S.DIST(B9,TRUE)/100` | `=-B3*B4*EXP(-B5*B4)*NORM.S.DIST(-B9,TRUE)/100` |

**Verification** (S=100, K=105, r=5%, σ=20%, T=1):
- Call Delta ≈ 0.537, Put Delta ≈ −0.463
- Gamma ≈ 0.0188 (both)
- Call Theta ≈ −0.0152/day, Put Theta ≈ −0.0103/day
- Vega ≈ 0.375 (per 1% vol)
- Call Rho ≈ 0.467, Put Rho ≈ −0.533

---

## 3. Put-Call Parity

```
Call − Put = S − K × e^(−rT)
```

Use as arbitrage check. In Excel:
```excel
=B11 - B12 - (B2 - B3*EXP(-B5*B4))
```
This should equal zero (within floating-point tolerance ~1e-10). If non-zero, the model has an error.

---

## 4. Binomial Tree (Single-Step)

### Risk-Neutral Parameters
```
u = e^(σ√Δt)          (up factor)
d = 1/u = e^(−σ√Δt)   (down factor)
p = (e^(rΔt) − d) / (u − d)   (risk-neutral up probability)
```

### Option Value
```
S_u = S × u    (up state price)
S_d = S × d    (down state price)
C_u = max(S_u − K, 0)   (call payoff up)
C_d = max(S_d − K, 0)   (call payoff down)
C = e^(−rΔt) × (p × C_u + (1−p) × C_d)
```

### Excel Layout (Δt = T, single step)

| Cell | Formula |
|------|---------|
| B20 | `=EXP(B6*SQRT(B4))` → u |
| B21 | `=1/B20` → d |
| B22 | `=(EXP(B5*B4)-B21)/(B20-B21)` → p |
| B23 | `=B2*B20` → S_u |
| B24 | `=B2*B21` → S_d |
| B25 | `=MAX(B23-B3,0)` → C_u (call) |
| B26 | `=MAX(B24-B3,0)` → C_d (call) |
| B27 | `=EXP(-B5*B4)*(B22*B25+(1-B22)*B26)` → Binomial call price |

For multi-step trees, extend by iterating backward from expiry nodes.

---

## 5. Implied Volatility (Newton-Raphson)

Given a market price P_mkt, find σ such that BS(σ) = P_mkt.

### Newton-Raphson iteration
```
σ_new = σ_old − (BS(σ_old) − P_mkt) / Vega(σ_old)
```
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
| Annualizing volatility | Daily σ × √252 for annual (NOT ×252). Use `=daily_vol*SQRT(252)` |
| Day count for T | Use actual/365 for equity options: `=DAYS(expiry,today)/365` |
| r must be continuous | If using discrete rate r_d, convert: `r = LN(1+r_d)` |
| Dividend-paying stocks | Replace S with S×e^(−q×T) where q = continuous dividend yield |
| N() function in Excel | Use `NORM.S.DIST(x, TRUE)` for CDF, `NORM.S.DIST(x, FALSE)` for PDF |
| Deep ITM/OTM precision | Excel handles this correctly; no special treatment needed |

---

## Reference Examples

- `examples/black-scholes.md` — Complete worked example: pricing a call and put with full cell map
- `examples/greeks.md` — Greeks dashboard with sensitivity analysis table
- `examples/binomial-tree.md` — Multi-step binomial tree (10 steps) with backward induction
