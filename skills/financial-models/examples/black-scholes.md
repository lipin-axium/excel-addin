# Example: Black-Scholes Call & Put Pricing

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
| A2 | S — Stock Price | `175` |
| A3 | K — Strike | `180` |
| A4 | T — Years to Expiry | `0.25` |
| A5 | r — Risk-free Rate | `0.053` |
| A6 | σ — Volatility | `0.28` |
| A8 | d1 | `=(LN(A2/A3)+(A5+A6^2/2)*A4)/(A6*SQRT(A4))` |
| A9 | d2 | `=A8-A6*SQRT(A4)` |
| A11 | **Call Price** | `=A2*NORM.S.DIST(A8,TRUE)-A3*EXP(-A5*A4)*NORM.S.DIST(A9,TRUE)` |
| A12 | **Put Price** | `=A3*EXP(-A5*A4)*NORM.S.DIST(-A9,TRUE)-A2*NORM.S.DIST(-A8,TRUE)` |
| A14 | Put-Call Parity Check | `=A11-A12-(A2-A3*EXP(-A5*A4))` |

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
| `=A2` (ref cell, hide row) | `=A11` |
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
