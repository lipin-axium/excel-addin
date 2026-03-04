---
name: earnings-preview
description: Build pre-earnings analysis with estimate models, bull/bear/base scenarios, and key metrics to watch before a company reports. Use to prepare positioning notes, set up scenarios, and identify what will move the stock on earnings day. Triggers on "earnings preview", "what to watch for [company] earnings", "pre-earnings", "earnings setup", "preview Q[X] for [company]", or "[company] reports this week".
platform: excel
---

# Earnings Preview

READ THIS ENTIRE FILE before building an earnings preview.

## Step 1: Gather Context

- Company name, ticker, reporting quarter (e.g., Q3 2024)
- Earnings date and time (pre-market vs. after-hours)
- Consensus estimates: revenue, EPS, key segment metrics (use Finnhub MCP if available, or web search)
- Prior quarter results and management commentary/guidance
- Options-implied move (search "[ticker] options implied move earnings")

---

## Step 2: Key Metrics Framework

Build a "what to watch" table specific to this company and sector:

**Core Financial Metrics (always):**
| Metric | Consensus Est. | Bear | Base | Bull | Notes |
|--------|---------------|------|------|------|-------|
| Revenue ($mm) | | | | | |
| EPS (adj.) | | | | | |
| Gross Margin % | | | | | |
| EBITDA Margin % | | | | | |
| Free Cash Flow ($mm) | | | | | |
| Next Quarter Guidance | | | | | |

**Sector-Specific Metrics (add the relevant ones):**

| Sector | Key Metrics to Watch |
|--------|---------------------|
| Tech/SaaS | ARR/RPO growth, Net Retention Rate, New customer adds, Cloud revenue mix |
| Retail | Same-store sales, Traffic, Basket size, Inventory levels |
| Industrials | Backlog, Book-to-bill ratio, Price vs. volume mix, Margin trajectory |
| Financials | NIM, Credit quality (NCOs, NPLs), Loan growth, Fee income |
| Healthcare | Script volumes, Patient visits, Pipeline updates, Reimbursement trends |
| Consumer | Volume vs. price mix, Market share, Brand investment levels |

---

## Step 3: Scenario Analysis

Build 3 scenarios with stock reaction estimate:

| Scenario | Revenue | EPS | Key Driver | Stock Reaction Est. | Probability |
|----------|---------|-----|------------|---------------------|-------------|
| Bull | | | | | |
| Base | | | | | |
| Bear | | | | | |

For each scenario, answer:
- **What would need to happen operationally?**
- **What management commentary would signal this?**
- **Historical context**: how has this stock reacted to similar prints? (search "[ticker] earnings reaction history")

---

## Step 4: Catalyst Checklist

Rank the 3–5 things that will determine the stock's reaction:

| # | Catalyst | Consensus Expectation | Bull Signal | Bear Signal | Importance |
|---|----------|----------------------|-------------|-------------|------------|
| 1 | | | | | High |
| 2 | | | | | High |
| 3 | | | | | Medium |

The most important catalyst is typically **forward guidance**, not the current quarter results.

---

## Step 5: Output — One-Page Earnings Preview

Deliver as a formatted table in Excel with:

**Header:**
```
[Company] (Ticker) — Q[X] 2024 Earnings Preview
Reports: [Date], [Pre-market / After-hours]
Options-implied move: ±X%
```

**Sections:**
1. Consensus Estimates Table (from Step 2)
2. Key Metrics to Watch (ranked by importance)
3. Bull / Base / Bear Scenario Table (Step 3)
4. Catalyst Checklist (Step 4)
5. Recent stock performance: `=price change over last 30/60/90 days`

---

## Important Notes

- **Consensus estimates change** — always note the source and date
- **"Whisper numbers"** from buy-side surveys are often more relevant than published consensus — check if available
- **Historical earnings reactions** calibrate expectations — look for the pattern (does this stock sell the news?)
- **Options-implied move** tells you what the market expects — compare to your scenario spread
- **Forward guidance matters most** — a beat with weak guidance typically sells off; miss with raised guidance often rallies
