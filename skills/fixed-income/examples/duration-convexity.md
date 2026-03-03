# Example: Duration, Convexity & DV01 for a Bond Portfolio

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
| B7 | `=B2*B3/B6` → 15 |
| B8 | `=B5*B6` → 4 |
| B9 | `=B4/B6` → 0.0175 |
| B10 | Price: `=PV(B9,B8,-B7,-B2)` → 990.58 |
| B11 | MacD: `=DURATION(DATE(2024,1,1),DATE(2026,1,1),B3,B4,B6,0)` → 1.944 yr |
| B12 | ModD: `=MDURATION(DATE(2024,1,1),DATE(2026,1,1),B3,B4,B6,0)` → 1.910 yr |
| B13 | DV01: `=B12*B10/10000` → $0.189/bond |

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
| C | `=B/(1+0.024)^A` | PV(CF) |
| D | `=A*(A+1)*C/(1+0.024)^2` | t(t+1)×PV(CF)/(1+y)² |

Convexity = SUM(D) / (Price × m²) = SUM(D) / (972.41 × 4) ≈ **78.5**

### Portfolio Summary (rows 20-26)

Assume holding 10 bonds of each:

| Cell | Label | Formula | Value |
|------|-------|---------|-------|
| B20 | Face per bond | 1000 | |
| B21 | Holdings | 10 | |
| B22 | Portfolio Value | `=10*(B10+D10+H10)` | $29,542 |
| B23 | Portfolio DV01 | `=10*(B13+D13+H13)` | $14.08/bp |
| B24 | Weighted ModD | `=(B10*B12+D10*D12+H10*H12)/(B10+D10+H10)` | 4.788 yr |
| B25 | Portfolio Convexity | `=(B10*B15+D10*D15+H10*H15)/(B10+D10+H10)` | ≈ 32.1 |

### DV01 Hedging Example

To hedge the 10-year bond position (DV01 = $7.81 for 10 bonds) using the 2-year:
```
Hedge ratio = DV01_10Y / DV01_2Y = 7.81 / 1.89 ≈ 4.13
```
→ Short 41.3 units of the 2-year bond per 10 units of 10-year bond.

Excel:
```excel
= H13*B21 / B13
```

## Price Change Simulation

For a parallel shift of +50bp in all yields (Δy = 0.005):

| Bond | ModD | Conv | ΔP (approx) | ΔP (actual) |
|------|------|------|-------------|-------------|
| 2Y | 1.910 | 3.8 | −$9.46 | −$9.44 |
| 5Y | 4.419 | 21.6 | −$21.87 | −$21.81 |
| 10Y | 8.034 | 78.5 | −$38.96 | −$38.71 |

Excel for approximation:
```excel
= -ModD * Price * 0.005 + 0.5 * Convexity * Price * 0.005^2
```

Higher convexity = less actual loss than duration predicts (convexity cushion).
