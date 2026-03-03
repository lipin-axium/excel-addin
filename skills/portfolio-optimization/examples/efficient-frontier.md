# Example: 3-Asset Efficient Frontier

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
| B8 | `=SUMPRODUCT(B2:B4,C2:C4)` | 6.67% |
| B9 | `=MMULT(TRANSPOSE(B2:B4),MMULT(E2:G4,B2:B4))` | 0.00776 |
| B10 | `=SQRT(B9)` | 8.81% |
| B11 | `=(B8-B6)/B10` | 0.527 |
| B12 | `=SUM(B2:B4)` | 1.000 |

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
