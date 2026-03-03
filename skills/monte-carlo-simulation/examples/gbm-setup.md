# Example: GBM Stock Path in Excel

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
| B7 | `=B5/B6` → 0.003968 |

### Time Column (A10:A262)
- A10: `=0`
- A11: `=A10+$B$7` (copy down — time in years, increments by Δt)

### Price Path Column B (B10:B262)
- B10: `=$B$2` (initial price = 380)
- B11: `=B10*EXP(($B$3-$B$4^2/2)*$B$7+$B$4*SQRT($B$7)*NORM.S.INV(RAND()))`
- Copy B11 down to B262

### Multiple Paths (Columns C through L = 10 paths)
- C10:L10: `=$B$2` (all start at S₀)
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
In B14: `=LN(B262/B10)` → log return for this path
Expected value across many paths ≈ μ − σ²/2 = 0.12 − 0.0392 = 0.0808

## Fixing Random Numbers for Reproducibility
Excel has no built-in seed for RAND(). Workaround:
1. Run simulation, press F9 to generate a set of paths
2. Copy the price range → Paste Special → Values only
3. Now the values are frozen — annotate with date/seed info in a nearby cell
