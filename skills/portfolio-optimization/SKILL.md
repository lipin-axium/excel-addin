---
name: portfolio-optimization
description: Optimize portfolio weights using Modern Portfolio Theory — build efficient frontier, maximize Sharpe ratio, run mean-variance optimization with Excel Solver, or compute correlation/covariance matrices
platform: excel
---

> **IMPORTANT**: READ THIS ENTIRE FILE before implementing any portfolio optimization. Do not rely on memory — follow the exact Excel formulas and Solver configurations described here.

# Portfolio Optimization Skill — MPT & Excel Solver

## 1. Expected Return

For a portfolio of N assets with weights w_i and expected returns μ_i:
```
E[Rp] = Σ w_i × μ_i = SUMPRODUCT(weights, returns)
```

Excel (weights in B2:B4, returns in C2:C4):
```excel
=SUMPRODUCT(B2:B4, C2:C4)
```

---

## 2. Covariance Matrix

### Historical Covariance
Given a returns matrix (rows = dates, columns = assets):

For assets A, B, C with return histories in columns D, E, F:

| | Asset A | Asset B | Asset C |
|-|---------|---------|---------|
| Asset A | `=COVARIANCE.S(D:D,D:D)` | `=COVARIANCE.S(D:D,E:E)` | `=COVARIANCE.S(D:D,F:F)` |
| Asset B | `=COVARIANCE.S(E:E,D:D)` | `=COVARIANCE.S(E:E,E:E)` | `=COVARIANCE.S(E:E,F:F)` |
| Asset C | `=COVARIANCE.S(F:F,D:D)` | `=COVARIANCE.S(F:F,E:E)` | `=COVARIANCE.S(F:F,F:F)` |

Note: `COVARIANCE.S` divides by (n−1) — use for sample data. `COVARIANCE.P` divides by n.

### Correlation Matrix
```excel
=CORREL(returns_col_i, returns_col_j)
```
Or: `Correlation(i,j) = Covariance(i,j) / (σ_i × σ_j)`

---

## 3. Portfolio Variance

```
σ²p = w' Σ w = MMULT(TRANSPOSE(w), MMULT(Σ, w))
```

Excel (weights in H2:H4, covariance matrix in I2:K4):
```excel
=MMULT(TRANSPOSE(H2:H4), MMULT(I2:K4, H2:H4))
```
Array formula — press Ctrl+Shift+Enter in older Excel, or just Enter in Excel 365.

Portfolio volatility: `=SQRT(portfolio_variance_cell)`

---

## 4. Sharpe Ratio

```
Sharpe = (E[Rp] − Rf) / σp
```

Excel (Rf in B6, E[Rp] in B8, σp in B10):
```excel
=(B8-B6)/B10
```

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
- B8: Expected return = `=SUMPRODUCT(B2:B4, C2:C4)`
- B9: Portfolio variance = `=MMULT(TRANSPOSE(B2:B4), MMULT(E2:G4, B2:B4))`
- B10: Portfolio std dev = `=SQRT(B9)`
- B11: Sharpe ratio = `=(B8-B6)/B10`
- B12: Sum of weights = `=SUM(B2:B4)` (must equal 1)

### Solver for Maximum Sharpe Ratio
1. **Data → Solver**
2. Set Objective: `$B$11` (Sharpe ratio)
3. To: **Max**
4. By Changing Variable Cells: `$B$2:$B$4`
5. Add Constraints:
   - `$B$12 = 1` (weights sum to 1)
   - `$B$2:$B$4 >= 0` (long-only)
6. Solving Method: **GRG Nonlinear**
7. Options → check **Multistart** (tries multiple starting points, avoids local optima)
8. Click Solve

### Solver for Minimum Variance Portfolio
Same setup but:
- Set Objective: `$B$9` (variance)
- To: **Min**

---

## 6. Efficient Frontier

The efficient frontier = set of portfolios that maximize return for a given risk level.

### Step-by-Step
1. Find minimum variance portfolio (Solver: minimize B9)
2. Record (σp, E[Rp]) at min variance
3. Set target return slightly above minimum; add constraint `$B$8 >= target`
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

```
MCTR_i = (Σ × w)_i / σp
```

Excel (returns a vector for all assets):
```excel
=MMULT(E2:G4, B2:B4) / B10
```

Weighted MCTR (percentage contribution — sums to 1):
```excel
=B2:B4 * MMULT(E2:G4, B2:B4) / B9
```

---

## Reference Examples

- `examples/efficient-frontier.md` — Complete 3-asset efficient frontier with Solver walk-through
- `examples/solver-setup.md` — Exact cell addresses and Solver dialog configuration for copy-paste setup
