---
name: deal-sourcing
description: Build a PE deal sourcing tracker in Excel — organize target companies by sector and deal parameters, track relationship status, and draft founder outreach email templates. Use when building a target list, tracking sourcing pipeline, or preparing outreach materials. Triggers on "find companies", "source deals", "draft founder email", "deal sourcing", "target list", or "outreach to founder".
platform: excel
---

# Deal Sourcing

READ THIS ENTIRE FILE before building a deal sourcing tracker.

## Workflow

This skill builds a 3-tab sourcing workbook in Excel.

### Tab 1: Target Universe

Build a target company list based on the user's criteria:

- **Sector/industry focus**: Ask what space they're looking in (e.g., "B2B SaaS in healthcare", "industrial services in the Southeast")
- **Deal parameters**: Revenue range, EBITDA range, growth profile, geography, ownership type (founder-owned, PE-backed, corporate carve-out)
- **Output table**:

| Company | Description | Est. Revenue | EBITDA | Location | Ownership | Founder/CEO | Website | Thesis Fit | Status |
|---------|-------------|-------------|--------|----------|-----------|-------------|---------|-----------|--------|
| | | | | | | | | | New / Contacted / Passed |

Note: Use Finnhub or Databricks data if available; otherwise prompt user to fill in company data manually.

### Tab 2: Pipeline Tracker

Track outreach status and relationship history:

| Company | First Contact | Last Contact | Contact Name | Status | Next Step | Notes |
|---------|--------------|-------------|--------------|--------|-----------|-------|
| | | | | New / Reached Out / In Dialogue / Passed / Closed | | |

Status key:
- **New** — no prior contact
- **Reached Out** — email sent, no response yet
- **In Dialogue** — active conversation
- **Previously Passed** — firm passed on prior review (note reason)

### Tab 3: Outreach Templates

Draft personalized cold email templates for the user to customize and send:

**Email Structure:**
1. Brief intro — who you are and your firm (ask user for their firm intro if not provided)
2. Why this company caught your attention — reference something specific (product, market position, growth)
3. What you're looking for — partnership, not just a transaction
4. Soft ask — "Would you be open to a brief conversation?"

**Tone guidelines:**
- Professional but warm — founders respond better to genuine, concise outreach
- 4-6 sentences max. Founders are busy
- Subject line: short and specific — reference the company or sector, not "Investment Opportunity"
- No attachments on first touch

## Important Notes

- Always present the target list for user review before drafting emails
- Never send emails without explicit user approval
- If the user's firm intro or investment criteria aren't clear, ask before drafting
- Prioritize quality over quantity — 5 well-researched targets beat 20 generic ones
