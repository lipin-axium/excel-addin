# Example: Comparable Company Analysis (Comps)

## Scenario
Value a mid-cap cloud software company using public peers.

## Peer Group

| Company | Market Cap ($B) | Net Debt ($B) | EV ($B) | Revenue ($B) | EBITDA ($B) | EPS | EV/EBITDA | EV/Rev | P/E |
|---------|----------------|--------------|---------|-------------|------------|-----|----------|--------|-----|
| Peer A | 45.0 | 2.0 | 47.0 | 4.2 | 1.05 | 3.20 | 44.8x | 11.2x | 26.7x |
| Peer B | 28.0 | -1.5 | 26.5 | 2.8 | 0.56 | 1.85 | 47.3x | 9.5x | 31.6x |
| Peer C | 62.0 | 5.0 | 67.0 | 5.5 | 1.93 | 4.10 | 34.7x | 12.2x | 27.0x |
| Peer D | 18.0 | 0.5 | 18.5 | 1.4 | 0.21 | 0.90 | 88.1x | 13.2x | 55.6x |
| **Median** | | | | | | | **46.1x** | **11.7x** | **29.3x** |
| **Mean** | | | | | | | **53.7x** | **11.5x** | **35.2x** |

Note: Peer D is an outlier (high-growth, not yet profitable). Median is more robust than mean here.

## Excel Layout

### Data Table (A1:J6)

| Cell | A | B | C | D | E | F | G | H | I | J |
|------|---|---|---|---|---|---|---|---|---|---|
| 1 | Company | Mkt Cap | Debt | Cash | EV | Revenue | EBITDA | EPS | EV/EBITDA | P/E |
| 2 | Peer A | 45 | 4 | 2 | `=B2+C2-D2` | 4.2 | 1.05 | 3.20 | `=E2/G2` | `=B2/G2/H2*H2` ← simplify: `=B2/H2/SHARES` |

Simpler P/E: `=B2/(H2*shares_outstanding)`

Or if you have share price and EPS directly:
```excel
P/E = Share Price / EPS
EV = Shares * Price + Debt - Cash
```

### Median/Mean Row
- I7 (Median EV/EBITDA): `=MEDIAN(I2:I5)`
- I8 (Mean EV/EBITDA): `=AVERAGE(I2:I5)`

### Target Company Inputs (A10:B14)
| Cell | Label | Value |
|------|-------|-------|
| B10 | Target Revenue | 1.8 |
| B11 | Target EBITDA | 0.36 |
| B12 | Target EPS | 1.20 |
| B13 | Target Net Debt | 0.3 |
| B14 | Target Shares (M) | 80 |

### Implied Valuations (A16:B20)
| Cell | Label | Formula | Value |
|------|-------|---------|-------|
| B16 | Implied EV (EBITDA method) | `=I7*B11` | $16.6B |
| B17 | Implied Equity Value | `=B16-B13` | $16.3B |
| B18 | **Implied Price (EV/EBITDA)** | `=B17/B14*1000` | **$203.75** |
| B19 | Implied Price (EV/Rev) | `=(J7*B10-B13)/B14*1000` | $262.50 |
| B20 | Implied Price (P/E) | `=K7*B12` | $35.16 |

### Valuation Summary
| Method | Implied Price | Weight |
|--------|--------------|--------|
| DCF | $17.30 (from dcf-model.md) | 50% |
| EV/EBITDA Comps | $20.38 | 30% |
| P/E Comps | $35.16 | 20% |
| **Weighted Average** | `=17.30*0.5+20.38*0.3+35.16*0.2` | **$22.18** |

## What to Watch For

| Signal | Interpretation |
|--------|---------------|
| Target trading at discount to median EV/EBITDA | Potential undervaluation — investigate why |
| P/E outlier among peers | Different growth profile or one-time items — use EV/EBITDA instead |
| Large EV/Revenue spread | Revenue quality differs — check gross margins |
| Net debt vs. peers | Higher leverage → higher risk → should trade at discount |
| Recent M&A in peer group | Acquisition premiums inflate comps — adjust down |
