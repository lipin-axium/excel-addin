# Example: 5-Year DCF Model

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
- C3: `=$B$2*(1+C2)`
- D3: `=C3*(1+D2)`
- E3: `=D3*(1+E2)`, F3, G3 follow same pattern

**Row 4** (EBIT margin): C4=0.20, D4=0.21, E4=0.22, F4=0.235, G4=0.25

**Row 5** (NOPAT = EBIT × (1-Tax)):
- C5: `=C3*C4*(1-$B$5)`

**Row 6** (D&A): `=C3*$B$6`
**Row 7** (Capex): `=C3*$B$7`
**Row 8** (ΔWC): `=C3*$B$8`

**Row 9** (FCFF):
- C9: `=C5+C6-C7-C8`

**Row 10** (Discount factor): `=1/(1+$B$3)^C1`
**Row 11** (PV of FCFF): `=C9*C10`

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
| B13 | Sum PV(FCFFs) | `=SUM(C11:G11)` | $370.1M |
| B14 | Terminal Value | `=G9*(1+B4)/(B3-B4)` | $1,868M |
| B15 | PV(Terminal Value) | `=B14/(1+B3)^5` | $1,160M |
| B16 | Enterprise Value | `=B13+B15` | $1,530M |
| B17 | Equity Value | `=B16-B9` | $1,730M |
| B18 | **Intrinsic Price** | `=B17/B10` | **$17.30** |

## Sensitivity Analysis

Two-variable data table varying WACC (rows) and Terminal Growth (columns):

Setup:
- Corner cell (e.g. J2): `=$B$18` (reference to intrinsic price)
- Row headers (K2:O2): 2.0%, 2.5%, 3.0%, 3.5%, 4.0% (terminal growth)
- Column headers (J3:J7): 8%, 9%, 10%, 11%, 12% (WACC)

Select J2:O7 → Data → What-If Analysis → Data Table
- Row input cell: B4 (terminal growth)
- Column input cell: B3 (WACC)

| WACC \ g | 2.0% | 2.5% | **3.0%** | 3.5% | 4.0% |
|----------|------|------|----------|------|------|
| 8% | $24.10 | $26.80 | $30.20 | $34.90 | $41.50 |
| 9% | $19.40 | $21.30 | $23.60 | $26.60 | $30.70 |
| **10%** | $15.90 | $17.30 | **$17.30** | $21.10 | $24.00 |
| 11% | $13.20 | $14.20 | $15.50 | $17.10 | $19.20 |
| 12% | $11.10 | $11.90 | $12.90 | $14.10 | $15.70 |

Color code: green if > current market price, red if below. This shows the range of outcomes under different assumptions.
