---
name: deal-tracker
description: Track live M&A and investment banking deals with milestones, deadlines, action items, and status updates in Excel. Maintains a deal pipeline view and surfaces upcoming deadlines and overdue items. Use when managing a deal book, tracking process milestones, or preparing for weekly deal reviews. Triggers on "deal tracker", "track my deals", "deal status", "process update", "deal pipeline", or "weekly deal review".
platform: excel
---

# Deal Tracker

READ THIS ENTIRE FILE before building or updating a deal tracker.

## Sheet Structure

Create an Excel workbook with these tabs:

1. **Pipeline** — all deals in one row each (the "dashboard" view)
2. **[Deal Name]** — one tab per active deal with milestone details
3. **Action Items** — master list of outstanding items across all deals
4. **Weekly Review** — formatted summary for team meetings

---

## Tab 1: Pipeline Overview

One row per deal:

| Deal Name | Client | Type | Role | Est. EV ($mm) | Stage | Next Milestone | Next Date | Status | Team |
|-----------|--------|------|------|--------------|-------|----------------|-----------|--------|------|

**Stage options:** Pre-Mandate → Engaged → Marketing → IOI → Diligence → Final Bids → Signing → Closed → Dead

**Status colors (conditional formatting):**
- 🟢 On Track
- 🟡 At Risk (milestone within 7 days or recently slipped)
- 🔴 Delayed (missed milestone, stalled process)
- ⬜ Complete

**Summary stats at bottom:**
```
Active deals:           =COUNTIF(Status, "<>Closed") - COUNTIF(Status, "Dead")
Closing this quarter:   =COUNTIFS(Stage, "Signing", NextDate, "<="&EOMONTH(TODAY(),0))
Total pipeline EV:      =SUMIF(Status, "Active", EV_column)
```

---

## Tab 2: Per-Deal Milestone Tracker

**Header block:**
```
Deal Name: Project [Name]
Client: [Seller/Buyer name]
Type: [Sell-side / Buy-side / Financing / Restructuring]
Engagement Date: [date]
Target Close: [date]
```

**Milestone table:**

| Milestone | Target Date | Actual Date | Status | Owner | Notes |
|-----------|------------|-------------|--------|-------|-------|
| Engagement letter signed | | | | | |
| CIM / teaser drafted | | | | | |
| Buyer list approved | | | | | |
| Teaser distributed | | | | | |
| NDA execution complete | | | | | |
| CIM distributed | | | | | |
| IOI deadline | | | | | |
| IOIs received & reviewed | | | | | |
| Shortlist selected | | | | | |
| Management meetings | | | | | |
| Data room opened | | | | | |
| Final bid deadline | | | | | |
| Bids received & reviewed | | | | | |
| Exclusivity granted | | | | | |
| Confirmatory diligence | | | | | |
| Purchase agreement signed | | | | | |
| Regulatory approval | | | | | |
| Close | | | | | |

**Status formula (auto-flag overdue):**
```excel
=IF(ActualDate<>"", "Complete",
 IF(TargetDate<TODAY(), "Overdue",
 IF(TargetDate<=TODAY()+7, "Due Soon", "On Track")))
```

---

## Tab 3: Action Item Master List

| # | Action | Deal | Owner | Due Date | Priority | Status | Notes |
|---|--------|------|-------|----------|----------|--------|-------|

**Priority:** P0 (gating to next milestone) / P1 (important) / P2 (nice to have)
**Status:** Open / In Progress / Done / Blocked

**Filters to apply:** Filter by Deal, Owner, Priority, or Status.

**Overdue flag (conditional formatting):**
```excel
=AND(Status<>"Done", DueDate<TODAY())    // highlight row red
```

**Summary at top:**
```
Open P0 items:      =COUNTIFS(Priority,"P0",Status,"<>Done")
Overdue items:      =COUNTIFS(Status,"<>Done",DueDate,"<"&TODAY())
```

---

## Tab 4: Weekly Review Summary

Auto-generated format for Monday team meetings.

**Per deal (iterate for each active deal):**
```
PROJECT [NAME] — [Stage] — [EV $mm]
Status: [On Track / At Risk / Delayed]
This week: [key developments — manual entry]
Next 2 weeks: [next 2 milestones with dates from milestone table]
Blockers: [open P0 items from action items]
Action items: [owner and due date for each open item]
```

**Pipeline summary:**
- Total active deals by stage (bar or simple count table)
- Deals at risk or delayed
- Expected closings this quarter
- New mandates / pitches in pipeline

---

## Maintenance Notes

- **Update weekly at minimum** — stale trackers are worse than no tracker
- **Flag milestone slippage early** — pattern of delays often signals process breakdown
- **Every action item needs an owner and due date** — otherwise it won't get done
- **Archive closed/dead deals** to a separate tab — keep the active pipeline view clean
- **Track buyer/investor feedback** in notes — patterns inform process adjustments
