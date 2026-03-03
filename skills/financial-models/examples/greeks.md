# Example: Greeks Dashboard

## Scenario
Greeks for a near-the-money call option:
- S = 100, K = 100, T = 0.5 (6 months), r = 0.04, σ = 0.25

## Layout (extend from SKILL.md base layout)

Assumes d1 in B8, d2 in B9 from the standard pricer layout.

| Cell | Greek | Formula | Expected Value |
|------|-------|---------|----------------|
| D2 | Call Delta | `=NORM.S.DIST(B8,TRUE)` | ≈ 0.560 |
| D3 | Put Delta | `=NORM.S.DIST(B8,TRUE)-1` | ≈ −0.440 |
| D4 | Gamma | `=NORM.S.DIST(B8,FALSE)/(B2*B6*SQRT(B4))` | ≈ 0.0225 |
| D5 | Call Theta/day | `=(-B2*NORM.S.DIST(B8,FALSE)*B6/(2*SQRT(B4))-B5*B3*EXP(-B5*B4)*NORM.S.DIST(B9,TRUE))/365` | ≈ −0.0180 |
| D6 | Vega (per 1%) | `=B2*NORM.S.DIST(B8,FALSE)*SQRT(B4)/100` | ≈ 0.281 |
| D7 | Call Rho (per 1%) | `=B3*B4*EXP(-B5*B4)*NORM.S.DIST(B9,TRUE)/100` | ≈ 0.258 |

## Interpretation Guide

- **Delta 0.560**: For every $1 the stock rises, the call gains ~$0.56
- **Gamma 0.0225**: Delta itself increases by 0.0225 per $1 stock move (acceleration)
- **Theta −$0.018/day**: The option loses ~1.8 cents of time value per calendar day
- **Vega $0.281**: If vol rises from 25% to 26%, the call gains ~$0.28
- **Rho $0.258**: If rates rise from 4% to 5%, the call gains ~$0.26

## Delta-Hedging Check
To delta-hedge 100 short calls, go long `100 × Delta × 100 shares = 5,600 shares`.
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
