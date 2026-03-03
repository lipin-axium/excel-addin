# Example: VaR and CVaR with Monte Carlo

## Scenario
Calculate 1-day VaR and CVaR for a $100,000 position in SPY:
- S₀ = 100 (normalized), σ = 0.18 (18% annual), μ = 0.07, T = 1/252 (1 day), M = 1000 paths

## Setup

Since T = 1 day and N = 1 step, each path is just one GBM step:
```
S₁ = S₀ × EXP((μ − σ²/2)×Δt + σ×√Δt×Z)
```
where Δt = 1/252 ≈ 0.003968.

### Parameters (B2:B6)
| Cell | Label | Value |
|------|-------|-------|
| B2 | S₀ | 100 |
| B3 | μ | 0.07 |
| B4 | σ | 0.18 |
| B5 | Δt | `=1/252` |
| B6 | Position ($) | 100000 |

### Generate 1000 Terminal Prices (C2:C1001)
- C2: `=$B$2*EXP(($B$3-$B$4^2/2)*$B$5+$B$4*SQRT($B$5)*NORM.S.INV(RAND()))`
- Copy C2 down to C1001

### P&L Column (D2:D1001)
- D2: `=(C2-$B$2)/$B$2*$B$6` → dollar P&L scaled to position size
- Copy down to D1001

### Risk Metrics (F2:F8)
| Cell | Label | Formula | Expected |
|------|-------|---------|---------|
| F2 | Mean P&L | `=AVERAGE(D2:D1001)` | ≈ +$27 |
| F3 | Std Dev | `=STDEV(D2:D1001)` | ≈ $1,134 |
| F4 | VaR_95 (1-day) | `=-PERCENTILE(D2:D1001,0.05)` | ≈ $1,845 |
| F5 | VaR_99 (1-day) | `=-PERCENTILE(D2:D1001,0.01)` | ≈ $2,590 |
| F6 | CVaR_95 | `=-AVERAGEIF(D2:D1001,"<"&-F4)` | ≈ $2,440 |
| F7 | Min P&L | `=MIN(D2:D1001)` | worst scenario |
| F8 | Max P&L | `=MAX(D2:D1001)` | best scenario |

## Interpretation
- **VaR_95 ≈ $1,845**: On a typical trading day, your maximum loss (95% confidence) is $1,845
- **CVaR_95 ≈ $2,440**: On the worst 5% of days, you lose on average $2,440

## Parametric VaR (for comparison)
The analytical 1-day VaR:
```
σ_daily = 0.18/√252 = 0.01134
VaR_95 = σ_daily × 1.645 × Position = 0.01134 × 1.645 × 100,000 ≈ $1,865
```
MC and parametric should agree closely — if they don't, check your formula.

## Histogram
1. Create bins in H2:H22: -3000, -2750, -2500, ..., +3000 (step 250)
2. In I2:I22: `=FREQUENCY(D2:D1001, H2:H22)` (array formula — Ctrl+Shift+Enter in older Excel)
3. Insert bar chart on H:I columns
4. The distribution should be roughly normal, slightly right-skewed

## Scaling VaR to Multiple Days
The square-root-of-time rule (approximate, assumes i.i.d. returns):
```
VaR_10day = VaR_1day × √10 ≈ $1,845 × 3.162 ≈ $5,834
```
Excel: `=F4*SQRT(10)`

This approximation breaks down for longer horizons where path dependency matters.
