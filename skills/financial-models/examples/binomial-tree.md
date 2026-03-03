# Example: Binomial Tree (10-Step American Put)

## Scenario
American put option (early exercise possible):
- S = 50, K = 52, T = 0.5 (6 months), r = 0.05, σ = 0.30
- N = 10 steps, Δt = 0.05

## Parameters

| Cell | Label | Formula / Value |
|------|-------|-----------------|
| B2 | S | 50 |
| B3 | K | 52 |
| B4 | T | 0.5 |
| B5 | r | 0.05 |
| B6 | σ | 0.30 |
| B7 | N (steps) | 10 |
| B8 | Δt | `=B4/B7` → 0.05 |
| B9 | u | `=EXP(B6*SQRT(B8))` → 1.0690 |
| B10 | d | `=1/B9` → 0.9355 |
| B11 | p | `=(EXP(B5*B8)-B10)/(B9-B10)` → 0.5126 |
| B12 | Discount | `=EXP(-B5*B8)` → 0.9975 |

## Tree Structure in Excel

Place node (step i, j up-moves) at row `(12+j)`, column `(2+i)` (column B = step 0):

### Stock Price Tree

**Step 0** (column B):
- B12: `=$B$2` → 50

**Step 1** (column C):
- C12: `=B12*$B$10` → 46.77 (down)
- C13: `=B12*$B$9` → 53.45 (up)

**Step 2** (column D):
- D12: `=C12*$B$10` → 43.74
- D13: `=C12*$B$9` (= `=C13*$B$10`) → 50.00 (recombining)
- D14: `=C13*$B$9` → 57.10

General pattern at column `COL`, row `ROW`:
```excel
= LEFT_DOWN_CELL * $B$10    (down move)
= LEFT_UP_CELL * $B$9       (up move)
```
The tree recombines: u × d = 1, so S×u×d = S.

### Terminal Payoffs (column L = step 10, rows 12 to 22)
For American put: `=MAX($B$3 - L12, 0)` through `=MAX($B$3 - L22, 0)`

### Backward Induction (columns K through B)

At each non-terminal node, American put = MAX(intrinsic, continuation):
```excel
=MAX($B$3 - K12, $B$12*($B$11*L13 + (1-$B$11)*L12))
```
Where:
- `$B$3 - K12` = early exercise value (put intrinsic)
- `$B$12*(...)` = risk-neutral discounted continuation value

Copy this backward from column K to column B, adjusting references.

### Node at B12 (Step 0) = Option Price
```excel
=MAX($B$3-B12, $B$12*($B$11*C13+(1-$B$11)*C12))
```

## Expected Result
- American put price ≈ **$4.49**
- European put (no early exercise) ≈ $4.28
- Early exercise premium ≈ $0.21

## Identifying Early Exercise Nodes
In the backward induction step, flag cells where early exercise is optimal:
```excel
=IF(MAX_INTRINSIC > CONTINUATION, "EXERCISE", "HOLD")
```
Early exercise is most likely for deep in-the-money nodes near expiry, especially when dividends or high interest rates are present.

## Extending to Calls
For an American call on a non-dividend-paying stock, early exercise is **never optimal** — the binomial price will equal the Black-Scholes European call price. This is a useful sanity check.
