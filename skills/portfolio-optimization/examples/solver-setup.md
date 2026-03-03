# Example: Step-by-Step Solver Configuration

## Prerequisite: Enable Solver Add-In
1. File → Options → Add-Ins
2. At bottom: "Manage: Excel Add-ins" → Go
3. Check "Solver Add-in" → OK
4. Solver now appears under the Data tab

## Complete Cell Map for Copy-Paste

Paste this exact layout starting at cell A1:

**Column A (labels)**:
- A1: Portfolio Optimizer
- A2: Asset, A3: Stock A, A4: Stock B, A5: Stock C
- A7: Rf (risk-free), A8: E[Rp], A9: Variance
- A10: Std Dev (σp), A11: Sharpe Ratio, A12: Sum of Weights

**Column B (weights & metrics)**:
- B2: Weight *(header)*
- B3: `0.333` ← Solver changes this
- B4: `0.333` ← Solver changes this
- B5: `0.333` ← Solver changes this
- B7: `0.03` (risk-free rate)
- B8: `=SUMPRODUCT(B3:B5,C3:C5)`
- B9: `=MMULT(TRANSPOSE(B3:B5),MMULT(E3:G5,B3:B5))`
- B10: `=SQRT(B9)`
- B11: `=(B8-B7)/B10`
- B12: `=SUM(B3:B5)`

**Column C (expected returns)**:
- C2: Exp Return *(header)*
- C3: `0.10`, C4: `0.08`, C5: `0.12`

**Covariance Matrix (E3:G5)**:
```
E3: 0.0400   F3: 0.0100   G3: 0.0150
E4: 0.0100   F4: 0.0225   G4: 0.0075
E5: 0.0150   F5: 0.0075   G5: 0.0625
```

## Solver Dialog: Maximize Sharpe Ratio

```
Set Objective:        $B$11
To:                   Max
By Changing Cells:    $B$3:$B$5

Constraints:
  $B$12 = 1          (weights sum to 1)
  $B$3 >= 0
  $B$4 >= 0
  $B$5 >= 0

Solving Method:       GRG Nonlinear
Options:              Check "Multistart" (avoids local optima)
```

Click **Solve** → Keep Solver Solution

**Expected result**: B3 ≈ 0.35, B4 ≈ 0.45, B5 ≈ 0.20, Sharpe ≈ 0.58

## Solver Dialog: Minimize Variance

```
Set Objective:        $B$9
To:                   Min
By Changing Cells:    $B$3:$B$5

Same constraints as above.
```

**Expected result**: B3 ≈ 0.10, B4 ≈ 0.65, B5 ≈ 0.25, σp ≈ 12.8%

## Common Solver Errors

| Error | Fix |
|-------|-----|
| "Solver could not find feasible solution" | Check $B$12=1 constraint; verify covariance matrix is square and symmetric |
| Weights sum to 0.999 | Normal floating-point; acceptable |
| All weight goes to one asset | Use Multistart; add max weight constraint (e.g., B3<=0.60) |
| Solver returns starting values | Non-convex local minimum; try random starting weights |
| MMULT returns #VALUE! | Matrix dimensions wrong — covariance must be N×N matching N weight cells |
| Sharpe is negative | Expected return < risk-free rate; check input values |
