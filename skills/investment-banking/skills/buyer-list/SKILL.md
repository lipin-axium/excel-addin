---
name: buyer-list
description: Build and organize a universe of potential acquirers for sell-side M&A processes in Excel. Identifies strategic and financial buyers, assesses fit, and prioritizes outreach by tier. Use when preparing for a sell-side mandate, building a buyer universe, or evaluating potential partners. Triggers on "buyer list", "buyer universe", "potential acquirers", "who would buy this", "strategic buyers", "financial sponsors", or "build a buyer list for [company]".
platform: excel
---

# Buyer Universe Builder

READ THIS ENTIRE FILE before building any buyer list.

## Step 1: Understand the Target

Before building the list, gather:
- Company description, sector, and business model
- Revenue, EBITDA, and growth profile
- Key assets and capabilities (IP, customer base, geographic footprint, team)
- Expected valuation range
- Seller preferences: strategic vs. financial buyer, management continuity, timeline
- Any buyers to include or exclude (ask the seller explicitly)

---

## Sheet Structure

Create an Excel workbook with:

1. **Summary** — buyer count by tier and type, key stats
2. **Strategic Buyers** — sorted by tier
3. **Financial Sponsors** — sorted by tier
4. **Tier 1 Contacts** — decision-maker mapping for top priority buyers

---

## Tab 2: Strategic Buyers

### Buyer Categories

**Direct Competitors** — same space, gain market share
**Adjacent Players** — expand into target's market via acquisition
**Vertical Integrators** — customers or suppliers seeking vertical integration
**Platform Builders** — large companies making tuck-in acquisitions

### Strategic Buyer Table

| Buyer | Ticker | Sector | Revenue ($mm) | EV ($mm) | Strategic Fit | Financial Capacity | M&A Activity | Likelihood | Tier | Rationale |
|-------|--------|--------|--------------|---------|--------------|-------------------|-------------|------------|------|-----------|
| | | | | | H/M/L | Strong/Moderate/Limited | Active/Occasional/None | H/M/L | A/B/C | |

**Tier definitions:**
- **Tier A (5–10 buyers)**: Highest strategic fit, proven acquirers, clear rationale — contact first
- **Tier B (10–15 buyers)**: Good fit, less obvious — contact in second wave
- **Tier C (10–20 buyers)**: Possible but lower probability — broaden process if needed

**Strategic fit rating factors:**
- Revenue synergy potential
- Capability gap the target fills
- Geographic expansion opportunity
- Competitive threat elimination
- Technology/product adjacency

**Financial capacity check:**
- Can they fund the deal? (check leverage, cash, recent financing activity)
- Any competing priorities (recent large deal, integration in progress)?
- Antitrust concerns? (flag direct competitors that may face regulatory scrutiny)

---

## Tab 3: Financial Sponsors

### Sponsor Categories

**Platform Investors** — looking for a new platform in this sector
**Add-on Buyers** — existing portfolio company could acquire the target
**Growth Equity** — minority or majority for earlier-stage/high-growth targets

### Financial Sponsor Table

| Sponsor | Fund Size | Vintage | Sector Focus | Deal Size Range | Portfolio Overlap | Recent Activity | Priority | Notes |
|---------|-----------|---------|-------------|----------------|-------------------|----------------|----------|-------|
| | | | | | Specific portfolio co. | Active/Moderate/None | A/B/C | |

**Key checks for sponsors:**
- **Fund vintage and deployment**: fund nearing end of investment period may be more motivated
- **Dry powder**: does the fund have capacity for a deal this size?
- **Portfolio overlap**: which portfolio company is the natural add-on buyer?
- **Recent exits**: any recent realizations that free up bandwidth?

---

## Tab 4: Tier A Contact Mapping

For each Tier A buyer:

| Buyer | Key Decision Maker | Title | Relationship Status | Contact Channel | Known Preferences | Notes |
|-------|-------------------|-------|---------------------|-----------------|-------------------|-------|
| | Corp Dev Head / CEO | | Existing / Needs Intro / Cold | Direct / Banker / Board | Size range, geography constraints | |

**Relationship status options:**
- **Existing relationship**: can call directly
- **Needs introduction**: need a mutual connection or banker relationship
- **Cold outreach**: no existing relationship — require more effort, right timing

---

## Tab 1: Summary Statistics

```
Total Buyers:           =COUNTA(Strategic!BuyerCol) + COUNTA(Sponsors!SponsorCol)
Strategic / Financial:  =COUNTA(Strategic) / COUNTA(Sponsors)
Tier A / B / C count:   =COUNTIF(TierCol, "A") / "B" / "C"
High-likelihood buyers: =COUNTIF(LikelihoodCol, "H")
Antitrust risk flags:   =COUNTIF(NotesCol, "*antitrust*")
```

---

## One-Page Buyer Universe Summary

Generate a narrative summary for the engagement letter or client pitch:
- Total universe size (strategic + financial)
- Tier A rationale (why these are the most likely buyers)
- Process recommendation (broad vs. targeted, timing)
- Any notable inclusions or exclusions and why

---

## Important Notes

- **Quality over quantity** — 30–40 well-researched buyers beats 200 names
- **Research recent M&A activity** — buyers who just did a deal are either hungry for more or tapped out
- **Check antitrust** — direct competitors may face regulatory scrutiny at certain ownership levels
- **Always ask the seller** about buyers to include or exclude before distributing teasers
- **Update as the process progresses** — move buyers between tiers based on feedback and conversations
- **Financial sponsors**: check fund vintage — a fund in year 5–6 may be more motivated than a recently raised fund
