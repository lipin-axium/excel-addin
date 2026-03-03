---
name: monte-carlo-simulation
description: Run Monte Carlo simulations for stock price forecasting (GBM), option pricing, or portfolio risk (VaR/CVaR) using Excel NORM.S.INV/RAND formulas or bash scripts for large simulation runs
platform: excel
---

> **IMPORTANT**: READ THIS ENTIRE FILE before implementing any Monte Carlo simulation. Follow the exact formulas and Excel layouts described here.

# Monte Carlo Simulation Skill — GBM, VaR/CVaR, Option Pricing

## 1. Geometric Brownian Motion (GBM)

### Model
A stock price follows GBM:
```
dS = μ·S·dt + σ·S·dW
```
Discretized over time step Δt:
```
S(t+Δt) = S(t) × exp((μ − σ²/2)·Δt + σ·√Δt·Z)
```
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
```
Δt = T / N
S_next = S_prev × EXP((μ − σ²/2)×Δt + σ×SQRT(Δt)×NORM.S.INV(RAND()))
```

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
| B7 | Δt | `=B5/B6` |

Column A (rows 10 onward): time steps
- A10: `=0`
- A11: `=A10+1` (copy down to A262)

Column B: stock prices
- B10: `=$B$2`
- B11: `=$B$2*EXP(($B$3-$B$4^2/2)*$B$7+$B$4*SQRT($B$7)*NORM.S.INV(RAND()))`

Wait — for a path, each step builds on the prior step:
- B11: `=B10*EXP(($B$3-$B$4^2/2)*$B$7+$B$4*SQRT($B$7)*NORM.S.INV(RAND()))`
- Copy B11 down to B262

**Warning**: Every time the sheet recalculates, all RAND() values refresh. Press F9 to manually recalculate.

### Multiple Paths (Column per Path)

For M=1000 paths, each column C through represents one path:
- C10: `=$B$2`
- C11: `=C10*EXP(($B$3-$B$4^2/2)*$B$7+$B$4*SQRT($B$7)*NORM.S.INV(RAND()))`
- Copy C11 down to C262, then select C10:C262 and copy right across M columns

For large M (>1000), use the Python approach in section 5.

---

## 3. VaR and CVaR

### Setup
After running M paths, collect terminal prices in row 262 (step N):
- Terminal prices: C262 through (C+M)262

### Value at Risk (VaR)
VaR at confidence level α (e.g. 95%) = loss not exceeded with probability α.

```
Terminal P&L = Terminal Price − S₀
VaR_95 = −PERCENTILE(P&L range, 0.05)
```

Excel (terminal P&L in row 263: `=C262-$B$2` copied across):
```excel
B14: =AVERAGE(C262:ZZZ262)          ← Mean terminal price
B15: =STDEV(C262:ZZZ262)            ← Std dev of terminal prices
B16: =-PERCENTILE(C263:ZZZ263, 0.05)   ← VaR at 95%
B17: =-PERCENTILE(C263:ZZZ263, 0.01)   ← VaR at 99%
```

### Conditional VaR (CVaR / Expected Shortfall)
CVaR = average loss in the worst (1−α)% of scenarios:

```excel
B18: =-AVERAGEIF(C263:ZZZ263, "<"&-B16)
```

### Interpretation
- VaR_95 = $12.50: with 95% confidence, loss ≤ $12.50 over horizon T
- CVaR_95 = $18.20: if you fall into the worst 5%, average loss is $18.20

---

## 4. Option Pricing via Monte Carlo

### European Call
At each terminal path, compute payoff and discount:
```
Payoff_i = MAX(S_T_i − K, 0)
Call_Price = e^(−rT) × AVERAGE(Payoff_i)
```

For risk-neutral option pricing, **replace μ with r** (risk-free rate) in the GBM drift.

Excel (K in B20, r in B21, terminal prices in row 262):

Put payoffs in row 264:
- C264: `=MAX(C262-$B$20, 0)` (copy across)
- Call Price: `=EXP(-B21*B5)*AVERAGE(C264:ZZZ264)`
- Standard Error: `=STDEV(C264:ZZZ264)/SQRT(COUNT(C264:ZZZ264))`

---

## 5. Large-Scale Simulation (Python Script)

For M > 10,000 paths, generate in Python and paste terminal values into Excel:

```python
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
```

Run: `python simulate.py` then import `terminal_prices.csv` via Data → From Text/CSV.

---

## 6. Convergence: How Many Paths?

Standard error of Monte Carlo estimate:
```
SE = σ_payoff / √M
```

For ±$0.10 accuracy on a ~$5 option (95% CI):
```
M = (1.96 × σ_payoff / 0.10)²
```

Typical: M = 10,000–100,000 for 2-decimal accuracy.
Excel handles ~50,000 cells practically; use Python for larger.

**Convergence check**: Run M = 1000, 2000, 5000, 10000. Price should stabilize within ±1% by M = 10,000.

---

## Reference Examples

- `examples/gbm-setup.md` — Complete GBM Excel setup with 252-day path visualization
- `examples/var-cvar.md` — VaR/CVaR calculation with 1000-path simulation and histogram
