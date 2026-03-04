---
name: dd-checklist
description: Generate and track comprehensive due diligence checklists tailored to a target company's sector, deal type, and complexity in Excel. Covers all major workstreams with request lists, status tracking, and red flag escalation. Use when kicking off diligence, organizing a data room review, or tracking outstanding items. Triggers on "dd checklist", "due diligence tracker", "diligence request list", "data room review", "what do we still need", or "kick off diligence for [company]".
platform: excel
---

# Due Diligence Checklist & Tracker

READ THIS ENTIRE FILE before building a diligence tracker.

## Step 1: Scope the Diligence

Gather from the user:
- **Target company**: name, sector, business model
- **Deal type**: Platform acquisition / Add-on / Growth equity / Recap / Carve-out
- **Deal size / complexity**: determines depth (small add-on vs. large platform = very different scope)
- **Known concerns**: customer concentration, regulatory exposure, environmental, IT tech debt
- **Timeline**: when is LOI / close targeted?

---

## Sheet Structure

Create an Excel workbook with:

1. **Dashboard** — summary by workstream (% complete, red flags, outstanding P0s)
2. **[Workstream]** — one tab per major workstream (Financial, Commercial, Legal, Operational, HR, IT, ESG)
3. **Red Flags** — consolidated log of all red flags found
4. **Weekly Status** — formatted update for the deal team

---

## Tab 2–8: Workstream Checklists

### Format for each tab:

| Item | Category | Priority | Status | Owner | Due Date | Notes / Red Flag |
|------|----------|----------|--------|-------|----------|-----------------|
| Quality of earnings report | Financial | P0 | Not Started | | | |
| Working capital analysis | Financial | P0 | In Progress | | | |

**Priority:**
- **P0**: Gating to LOI or close — must complete before proceeding
- **P1**: Important, needs completion before IC
- **P2**: Nice to have / confirmatory

**Status options:**
`Not Started → Requested → Received → In Review → Complete → Red Flag`

---

### Financial Due Diligence

- Quality of earnings (QoE) — revenue and EBITDA adjustments and normalization
- Working capital analysis — normalized NWC peg
- Debt and debt-like items (off-balance sheet, leases, deferred revenue, pension)
- CapEx — maintenance vs. growth split
- Tax structure and exposures (NOLs, audits, transfer pricing)
- Audit history and accounting policy changes
- Pro forma adjustments (run-rate, acquired revenue, synergies)
- Cash flow quality — is EBITDA converting to cash?

### Commercial Due Diligence

- Market size and growth (TAM/SAM)
- Competitive positioning and market share
- Customer analysis: top 10 concentration, NPS, churn/renewal history
- Pricing power and contract structure (fixed vs. variable, auto-renewal)
- Sales pipeline and backlog quality
- Go-to-market effectiveness and sales productivity

### Legal Due Diligence

- Corporate structure and cap table
- Material contracts (customer, supplier, partnership, exclusivity)
- Litigation history and pending claims
- IP portfolio and protection (patents, trademarks, trade secrets)
- Regulatory compliance history
- Employment agreements and non-competes / non-solicitations

### Operational Due Diligence

- Management team assessment (key person risk, succession)
- Organizational structure and reporting lines
- IT systems and infrastructure (ERP, CRM, integrations)
- Supply chain and vendor dependencies / concentration
- Facilities and real estate (owned vs. leased, lease terms)
- Insurance coverage adequacy

### HR / People Due Diligence

- Org chart and headcount trends (net adds, attrition by level)
- Compensation benchmarking vs. market
- Benefits and pension obligations
- Key employee retention risk (unvested equity, flight risk)
- Culture assessment (engagement surveys, Glassdoor)
- Union / labor agreements

### IT / Technology (tech-enabled businesses)

- Technology stack and architecture (monolith vs. microservices)
- Technical debt assessment
- Cybersecurity posture (recent audits, breach history, SOC 2 status)
- Data privacy compliance (GDPR, CCPA, HIPAA if applicable)
- Product roadmap and R&D spend vs. plan
- Scalability — can infrastructure support 2-3x growth?

### ESG / Environmental (where applicable)

- Environmental liabilities (remediation, Superfund exposure)
- Regulatory compliance history
- ESG risks and opportunities relevant to the sector
- Governance (board composition, related party transactions)

---

## Red Flags Tab

| # | Date Found | Workstream | Description | Severity | Impact on Value | Mitigant / Path to Resolution | Status |
|---|------------|-----------|-------------|----------|----------------|------------------------------|--------|
| | | | | Deal-Breaker / Significant / Manageable | | | Open / Resolved |

**Severity escalation:**
- **Deal-Breaker**: Terminates deal or requires material price change
- **Significant**: Requires rep & warranty coverage, escrow, or indemnification
- **Manageable**: Noted in model or addressed in purchase agreement

---

## Dashboard Tab

For each workstream:
```
Workstream         | Total Items | Complete | In Progress | Not Started | Red Flags | % Complete
Financial          | [count]     | [count]  | [count]     | [count]     | [count]   | =Complete/Total
Commercial         | ...
```

**Master status:**
```
Overall completion:  =SUM(complete)/SUM(total)
Open P0 items:       =COUNTIFS(priority,"P0",status,"<>Complete")
Open red flags:      =COUNTIF(red_flag_status,"Open")
```

---

## Sector-Specific Additions

Automatically add when applicable:

| Sector | Add to Checklist |
|--------|-----------------|
| Software/SaaS | ARR quality & cohort analysis, hosting cost structure, SOC 2 compliance |
| Healthcare | Regulatory approvals (FDA, state licensing), payor mix & reimbursement risk |
| Industrial | Equipment condition reports, environmental remediation risk, safety record |
| Financial Services | Regulatory capital ratios, compliance program history, credit quality |
| Consumer | Brand health metrics, channel mix, seasonality, inventory management |

---

## Important Notes

- **Prioritize P0 items** — these are gating; don't let other work distract from them
- **Flag slow responses** — sellers who are slow to provide items may be hiding issues
- **Cross-reference the data room** against the checklist to identify gaps systematically
- **Update continuously** — the checklist is a living document, not a one-time exercise
- **Red flags are negotiating points** — document them carefully for purchase price adjustment conversations
