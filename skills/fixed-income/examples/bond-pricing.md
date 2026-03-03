# Example: Bond Pricing with Cash Flow Table

## Scenario
Price a 10-year US Treasury note:
- Face value: $1,000
- Coupon rate: 4.5% semi-annual
- YTM: 4.0%
- Issue: bond should trade at a **premium** (coupon > YTM)

## Complete Excel Layout

### Parameters (B2:B9)
| Cell | Label | Value |
|------|-------|-------|
| B2 | Face Value | 1000 |
| B3 | Coupon Rate | 0.045 |
| B4 | YTM | 0.040 |
| B5 | Maturity (years) | 10 |
| B6 | Frequency | 2 |
| B7 | Coupon/period | `=B2*B3/B6` → 22.50 |
| B8 | Total periods | `=B5*B6` → 20 |
| B9 | Period yield | `=B4/B6` → 0.02 |

### Price Formula
- B10: `=PV(B9, B8, -B7, -B2)` → **$1,040.55**

### Cash Flow Table (A13:D33)

| Cell | Period | Cash Flow | PV of CF | Cumulative PV |
|------|--------|-----------|----------|---------------|
| A13 | 1 | `=$B$7` | `=C13/(1+$B$9)^A13` | `=D13` |
| A14 | 2 | `=$B$7` | (same pattern) | `=E13+D14` |
| ... | ... | ... | ... | ... |
| A32 | 20 | `=$B$7+$B$2` | `=C32/(1+$B$9)^A32` | |

Build this by:
1. A13: `=1`, A14: `=A13+1`, copy down to A32
2. C13: `=$B$7`, C14-C31 same, C32: `=$B$7+$B$2`
3. D13: `=C13/(1+$B$9)^A13`, copy down to D32
4. E13: `=D13`, E14: `=E13+D14`, copy to E32

**Verify**: SUM(D13:D32) should equal B10 = $1,040.55 ✓

### Key Output Row (B34:B37)
| Cell | Label | Formula | Value |
|------|-------|---------|-------|
| B34 | PV of Coupons | `=SUM(D13:D31)` | $364.51 |
| B35 | PV of Par | `=D32` | $676.04 |
| B36 | Total Price | `=B34+B35` | $1,040.55 |
| B37 | Premium | `=B36-B2` | $40.55 |

## Price Sensitivity Table

Vary YTM from 2% to 6% in a one-variable data table:

| F | G |
|---|---|
| YTM | Price |
| 0.02 | `=B10` (formula reference) |
| 0.025 | |
| 0.03 | |
| 0.035 | |
| 0.04 | |
| 0.045 | |
| 0.05 | |
| 0.055 | |
| 0.06 | |

Select F:G data range, Data → What-If Analysis → Data Table, Column input cell = B4.

| YTM | Price | Change from 4% |
|-----|-------|----------------|
| 2.0% | $1,218.15 | +$177.60 |
| 3.0% | $1,125.51 | +$84.96 |
| 3.5% | $1,082.02 | +$41.47 |
| **4.0%** | **$1,040.55** | 0 |
| 4.5% | $1,000.00 | −$40.55 |
| 5.0% | $961.39 | −$79.16 |
| 6.0% | $889.60 | −$150.95 |

Note the **asymmetry**: price rise from 4%→2% (+$177.60) > price fall from 4%→6% (−$150.95).
This asymmetry is convexity at work.
