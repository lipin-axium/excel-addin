---
name: merger-model
description: Build M&A merger models and accretion/dilution analysis in Excel. Models pro forma EPS impact, synergy sensitivities, purchase price allocation, and deal consideration mix. Use when evaluating an acquisition, preparing merger consequences analysis, or advising on deal terms. Triggers on "merger model", "accretion dilution", "M&A model", "pro forma EPS", "merger consequences", "deal impact analysis", or "is this deal accretive".
platform: excel
---

# Merger Model (Accretion/Dilution Analysis)

READ THIS ENTIRE FILE before building any merger model.

## Sheet Structure

1. **Assumptions** — acquirer, target, and deal inputs
2. **Sources & Uses** — Day 1 capital structure
3. **Pro Forma IS** — combined income statement with adjustments
4. **Returns Summary** — accretion/dilution and sensitivity tables

---

## Step 1: Gather Inputs

**Acquirer:**
- Company name, current share price, shares outstanding (diluted)
- LTM and NTM EPS (GAAP and adjusted)
- Current P/E multiple
- Pre-tax cost of debt, tax rate
- Cash on balance sheet, existing debt

**Target:**
- Company name, current share price (if public), shares outstanding
- LTM and NTM Net Income
- Enterprise value (if private)

**Deal Terms:**
- Offer price per share (or premium % to current)
- Consideration mix: % cash vs. % stock
- New debt raised to fund cash portion
- Expected synergies (revenue and cost) and phase-in timeline
- Transaction fees (typically 2–4% of EV)
- Financing fees
- Intangible asset step-up and amortization period

---

## Step 2: Purchase Price Analysis

```
Offer price per share         [input]
Premium to current            [=Offer/TargetPrice - 1]
Equity value                  [=OfferPrice * TargetShares]
(+) Net debt assumed          [=TargetDebt - TargetCash]
Enterprise Value              [=EquityValue + NetDebt]
EV / EBITDA implied           [=EV / TargetEBITDA]
P/E implied                   [=OfferPrice / TargetEPS]
```

---

## Step 3: Sources & Uses

```
SOURCES                       $        USES                          $
New Debt Raised             [input]   Equity Purchase Price        [=Equity Value]
Cash on Hand (acquirer)     [input]   Refinance Target Debt        [=Target Net Debt]
New Shares Issued           [=shares*AcqPrice]  Transaction Fees  [=EV*fee%]
                                      Financing Fees               [input]
Total Sources               [=SUM]    Total Uses                   [=SUM]
Check: Sources - Uses = 0   [must = 0]
```

---

## Step 4: Pro Forma EPS (Accretion / Dilution)

Calculate for Year 1, Year 2, Year 3:

```
                              Standalone    Pro Forma    Delta
Acquirer Net Income           [input]       [+target NI + synergies - costs]
Target Net Income             [input]       [included above]
(+) Synergies (after-tax)                   [=PreTaxSynergies*(1-TaxRate)]
(-) Foregone interest on cash (after-tax)   [=CashUsed*cashRate*(1-TaxRate)]
(-) New debt interest (after-tax)           [=NewDebt*debtRate*(1-TaxRate)]
(-) Intangible amortization (after-tax)     [=StepUp/amortYears*(1-TaxRate)]
Pro Forma Net Income          [=SUM of above adjustments]
Pro Forma Shares              [=AcqShares + NewSharesIssued]
Pro Forma EPS                 [=ProFormaNI/ProFormaShares]
Standalone EPS                [=AcqNI/AcqShares]
Accretion / (Dilution) $      [=ProFormaEPS - StandaloneEPS]
Accretion / (Dilution) %      [=Delta/StandaloneEPS]
```

**Key adjustments explained:**
- **Foregone interest**: Cash used in deal can't earn returns — opportunity cost
- **New debt interest**: After-tax cost of debt raised for the deal
- **Intangible amortization**: Purchase price step-up creates D&A that hits GAAP NI
- **Synergies**: Phase in — Year 1 often only 25–50% of run-rate

---

## Step 5: Sensitivity Tables

**Table 1: Accretion/Dilution % vs. Synergies × Offer Premium**

| | $0M syn | $25M syn | $50M syn | $75M syn | $100M syn |
|---|---------|----------|----------|----------|-----------|
| 15% premium | | | | | |
| 20% premium | | | | | |
| 25% premium | | | | | |
| 30% premium | | | | | |

Each cell: full EPS accretion/dilution recalculation for that synergy + premium combination.

**Table 2: Accretion/Dilution vs. Consideration Mix**

| | 100% cash | 75/25 | 50/50 | 25/75 | 100% stock |
|---|-----------|-------|-------|-------|------------|
| Year 1 EPS impact | | | | | |
| Year 2 EPS impact | | | | | |

---

## Step 6: Breakeven Synergies

Calculate the minimum synergies needed for the deal to be EPS-neutral in Year 1:

```
Breakeven Synergies (pre-tax) = [Total EPS dilution from deal costs] / (1 - TaxRate)
```

Show as a single output cell, then sanity check: is this achievable given the deal rationale?

---

## Output Checklist

- [ ] Sources = Uses (check row = 0)
- [ ] Both GAAP and adjusted EPS shown where relevant
- [ ] Synergy phase-in reflected (Year 1 ≠ Year 3 run-rate)
- [ ] Foregone interest and new debt interest both included
- [ ] Intangible amortization calculated and tax-effected
- [ ] Exchange ratio for stock deals = OfferPrice / AcqCurrentPrice
- [ ] Pro forma shares = AcqShares + new shares issued (stock portion only)
- [ ] Both sensitivity tables fully populated
- [ ] Breakeven synergies calculated

## Important Notes

- Always show both GAAP and adjusted (cash) EPS
- **Stock deals:** use acquirer's current price for exchange ratio; new shares dilute EPS
- **Synergy phase-in is critical** — Year 1 is often only 25–50% of run-rate synergies
- **Don't forget foregone interest** on cash used — it's a real cost
- Tax rate on all adjustments (synergies, interest) should match acquirer's marginal rate
- Transaction fees reduce Day 1 equity value — include in uses
