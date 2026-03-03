---
name: fixed-income
description: Price bonds, calculate yield-to-maturity with RATE/YIELD functions, compute Macaulay/modified duration and convexity, bootstrap spot rate curves, or analyze fixed income securities in Excel
platform: excel
---

> **IMPORTANT**: READ THIS ENTIRE FILE before implementing any bond pricing or fixed income calculations. Do not rely on memory — follow the exact Excel formulas described here.

# Fixed Income Skill — Bond Pricing, Duration, Convexity, Yield Curves

## 1. Bond Pricing

A bond's price is the present value of all future cash flows discounted at YTM (y):

```
Price = Σ [C / (1+y/m)^t] + F / (1+y/m)^(m×T)
```

Where:
- C = periodic coupon = (coupon rate × F) / m
- F = face value (par, typically 1000)
- y = annual YTM
- m = coupon frequency per year (2 for semi-annual, 1 for annual)
- T = years to maturity

### Excel PV Function
```excel
=PV(rate, nper, pmt, fv)
```
- `rate` = y/m (yield per period)
- `nper` = m×T (total periods)
- `pmt` = −C (coupon per period, negative because it's a cash inflow)
- `fv` = −F (face value, negative)

**Example**: 5-year bond, 4% semi-annual coupon, F=1000, YTM=3.5%:
```excel
=PV(0.035/2, 5*2, -1000*0.04/2, -1000)
```
Result: ≈ **$1,022.88** (premium bond since coupon > YTM)

### Cell-by-Cell Layout

| Cell | Label | Value/Formula |
|------|-------|---------------|
| B2 | Face Value | 1000 |
| B3 | Coupon Rate (annual) | 0.04 |
| B4 | YTM (annual) | 0.035 |
| B5 | Maturity (years) | 5 |
| B6 | Frequency (m) | 2 |
| B7 | Coupon Payment | `=B2*B3/B6` → 20 |
| B8 | Periods | `=B5*B6` → 10 |
| B9 | Period Rate | `=B4/B6` → 0.0175 |
| B10 | **Bond Price** | `=PV(B9, B8, -B7, -B2)` → 1022.88 |

### Excel PRICE Function (day-count aware)
For real settlement/maturity dates with actual/actual or 30/360:
```excel
=PRICE(settlement, maturity, rate, yld, redemption, frequency, [basis])
```
- `settlement`: settlement date (e.g. TODAY())
- `maturity`: maturity date
- `rate`: annual coupon rate
- `yld`: annual YTM
- `redemption`: 100 (per $100 face)
- `frequency`: 2 for semi-annual
- `basis`: 0=US 30/360, 1=actual/actual, 2=actual/360, 3=actual/365

Example:
```excel
=PRICE(DATE(2024,1,15), DATE(2029,1,15), 0.04, 0.035, 100, 2, 0)
```

---

## 2. Yield to Maturity (YTM)

YTM = the discount rate y that makes bond price = PV of cash flows.

### Excel RATE Function
```excel
=RATE(nper, pmt, pv, [fv]) × m
```
- `nper` = m×T
- `pmt` = coupon per period (positive, cash received)
- `pv` = −Price (negative, cash paid)
- `fv` = F (face value at maturity)
- Multiply result by m to annualize

**Example**: Bond trading at $980, 4% semi-annual coupon, 5 years to maturity, F=1000:
```excel
=RATE(10, 20, -980, 1000) * 2
```
Result: ≈ **4.41%** annualized YTM

### Cell map for YTM
| Cell | Formula |
|------|---------|
| B12 | Market Price = 980 |
| B13 | YTM = `=RATE(B8, B7, -B12, B2) * B6` |

### Excel YIELD Function (date-based)
```excel
=YIELD(settlement, maturity, rate, pr, redemption, frequency, [basis])
```
- `pr` = dirty price per $100 face
- Returns annual YTM respecting day counts

---

## 3. Macaulay Duration

Duration = weighted average time to receive cash flows (in years):

```
MacD = Σ [t × CF_t / (1+y/m)^t] / Price
```
where t is in periods, then divide by m to convert to years.

### Excel DURATION Function
```excel
=DURATION(settlement, maturity, coupon, yld, frequency, [basis])
```
Returns Macaulay duration in years.

Example (same bond as above, settlement=today):
```excel
=DURATION(DATE(2024,1,15), DATE(2029,1,15), 0.04, 0.035, 2, 0)
```
Result: ≈ **4.55 years**

### Manual Calculation (without dates)

| Cell | Formula | Description |
|------|---------|-------------|
| A15:A24 | 1,2,...,10 | Period numbers |
| B15:B24 | `=$B$7` (periods 1-9), `=$B$7+$B$2` (period 10) | Cash flows |
| C15 | `=B15/(1+$B$9)^A15` | PV of cash flow |
| D15 | `=A15*C15` | t × PV(CF) |
| B26 | `=SUM(C15:C24)` | Verify = Price |
| B27 | `=SUM(D15:D24)/B26/B6` | **Macaulay Duration (years)** |

---

## 4. Modified Duration

```
ModD = MacD / (1 + y/m)
```

Price sensitivity: a 1bp (0.01%) rise in yield reduces price by approximately ModD × Price × 0.0001.

Excel:
```excel
=B27 / (1 + B9)
```
Or directly:
```excel
=MDURATION(settlement, maturity, coupon, yld, frequency, [basis])
```

**Interpretation**: ModD = 4.47 means a 100bp yield increase → price falls ≈ 4.47%.

Dollar Duration (DV01):
```excel
= ModD × Price / 10000
```
This is the dollar price change per 1bp yield change.

---

## 5. Convexity

Convexity captures the curvature in the price-yield relationship (second-order correction):

```
Convexity = Σ [t(t+1) × CF_t / (1+y/m)^(t+2)] / (Price × m²)
```

### Excel Manual Calculation

Extending the layout from section 3:
| Cell | Formula | Description |
|------|---------|-------------|
| E15 | `=A15*(A15+1)*C15/(1+$B$9)^2` | t(t+1) × PV(CF) / (1+y/m)² |
| B28 | `=SUM(E15:E24)/(B26*B6^2)` | **Convexity (in years²)** |

### Price Change Approximation

Full price change for a yield move of Δy:
```
ΔP/P ≈ −ModD × Δy + ½ × Convexity × (Δy)²
```

Excel (with Δy in B30):
```excel
= B10 * (-B28_mod * B30 + 0.5 * B28_conv * B30^2)
```

Example: ModD=4.47, Convexity=23.5, Price=1022.88, Δy=+1% (=0.01):
- Duration term: −4.47 × 0.01 = −4.47%
- Convexity term: +0.5 × 23.5 × 0.0001 = +0.12%
- Total ≈ −4.35% → New price ≈ $978.40

---

## 6. Yield Curve Bootstrapping

Extract spot rates from coupon bond prices to build a zero-coupon curve.

### Concept
A 2-year 5% annual coupon bond (price = $1020) implies:
```
1020 = 50/(1+s₁) + 1050/(1+s₂)²
```
If s₁ is known from a 1-year zero bond, solve for s₂.

### Excel Layout

| Col A | Col B | Col C | Col D |
|-------|-------|-------|-------|
| Maturity | Coupon Rate | Bond Price | Spot Rate |
| 1 | 0% | 950 | `=1000/B2-1` → s₁=5.26% |
| 2 | 5% | 1020 | *bootstrapped* |
| 3 | 5% | 1035 | *bootstrapped* |

For D3 (2-year spot rate s₂), solve:
```
B3 = 0.05×1000/(1+D2) + 1050/(1+D3)²
```
Excel Goal Seek: Set B3=1020, change D3. Or rearrange:
```excel
=((B3 - 50/(1+D2)) / 1050)^(-1/2) - 1
```

For longer maturities, bootstrap iteratively — each new spot rate uses all previously derived rates.

### Linear Interpolation Between Tenors
For a tenor not in your curve (e.g. 2.5 years given 2Y and 3Y spots):
```excel
= s2 + (s3 - s2) * (2.5 - 2) / (3 - 2)
```

---

## Common Pitfalls

| Issue | Solution |
|-------|----------|
| RATE returns wrong sign | Remember: `pv` is negative (you pay), `fv` is positive (you receive par) |
| PRICE/YIELD errors | Dates must be valid; settlement must be before maturity |
| Duration > maturity | Impossible — check coupon payments are positive in PV formula |
| Convexity is negative | Error in formula — convexity is always positive for plain vanilla bonds |
| YTM vs current yield confusion | YTM accounts for capital gain/loss; current yield = coupon/price only |
| Semi-annual to annual conversion | RATE×2 (not (1+RATE)²−1) for bond market convention |

---

## Reference Examples

- `examples/bond-pricing.md` — Complete bond pricing with cash flow table and sensitivity analysis
- `examples/duration-convexity.md` — Duration/convexity ladder for a 3-bond portfolio with DV01 hedging
