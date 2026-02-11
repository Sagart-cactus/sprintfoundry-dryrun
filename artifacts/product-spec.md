# Product Spec: SprintFoundry Pricing — Canonical Tier Definition

## Summary

This document resolves a pricing conflict between pipeline artifacts and establishes the **authoritative pricing** for the SprintFoundry marketing website (`website-v1`). The original ticket contained no price points; price figures were independently introduced by the UI/UX agent ($79/mo Pro) and referenced without a source in QA notes ($49/mo Pro). After reviewing all artifact evidence, the **UI/UX agent's pricing is adopted as canonical** — it is the only specification that includes a rationale, an annual discount calculation, and feature-to-price mapping. The developer should update the implementation to match these confirmed tiers.

---

## Canonical Pricing Tiers

### Free
- **Price:** $0/month (no annual variant)
- **Ticket limit:** 5 tickets per month
- **Agents included:** Developer + QA only
- **Integrations:** GitHub only
- **Projects:** 1
- **Support:** Community
- **CTA:** "Start Building Free" → `/signup`

### Pro _(highlighted, "Most Popular")_
- **Price:** $79/month per seat (monthly); $63/month per seat (annual — saves ~20%)
- **Ticket limit:** Unlimited
- **Agents included:** All 6 (Product, Architecture, Developer, QA, Security, DevOps)
- **Integrations:** GitHub, GitLab, Jira, Linear
- **Projects:** Up to 20
- **Other:** Custom agent configuration, parallel agent execution
- **Support:** Priority
- **CTA:** "Start Free Trial" → `/signup?plan=pro`

### Enterprise
- **Price:** Custom (displayed as "Custom" for both billing periods)
- **Ticket limit:** Unlimited
- **Agents included:** Everything in Pro
- **Additional:** SSO/SAML, SOC 2 Type II, custom agent fine-tuning, on-premise deployment option, SLA (99.9% uptime), dedicated success manager, unlimited projects
- **Support:** Dedicated success manager
- **CTA:** "Contact Sales" → `/contact`

---

## User Stories

### US-1: View Canonical Pricing Tiers
**As a** prospective customer visiting the SprintFoundry website, **I want to** see accurate pricing for all three subscription tiers, **so that** I can evaluate the product for my team.

**Acceptance Criteria:**
- [ ] Free tier displays $0/month with 5 tickets/month and Developer + QA agents only
- [ ] Pro tier displays $79/month (monthly) and $63/month (annual) with "per seat" suffix
- [ ] Enterprise tier displays "Custom" for both billing periods
- [ ] All three tiers are visible simultaneously on desktop (3-column layout)
- [ ] "Most Popular" badge appears on the Pro tier card
- [ ] Annual billing toggle switches Pro price from $79 to $63; Free and Enterprise prices do not change

### US-2: Understand What Each Tier Includes
**As a** prospective customer, **I want to** see the features included in each tier, **so that** I can choose the right plan for my needs.

**Acceptance Criteria:**
- [ ] Free tier lists: 5 tickets/month, Developer + QA agents, GitHub integration, community support, 1 project
- [ ] Pro tier lists: unlimited tickets, all 6 agents, GitHub/GitLab/Jira/Linear integrations, custom agent configuration, parallel agent execution, priority support, up to 20 projects
- [ ] Enterprise tier lists: everything in Pro plus SSO/SAML, SOC 2 Type II, custom agent fine-tuning, on-premise option, 99.9% SLA, dedicated success manager, unlimited projects
- [ ] Feature lists use check icons; no feature listed on a lower tier appears missing from a higher tier

### US-3: Take Action from Pricing Section
**As a** prospective customer ready to proceed, **I want to** click a CTA from the pricing section, **so that** I am directed to the appropriate signup or sales flow.

**Acceptance Criteria:**
- [ ] Free tier CTA button reads "Start Building Free" and links to `/signup`
- [ ] Pro tier CTA button reads "Start Free Trial" and links to `/signup?plan=pro`
- [ ] Enterprise tier CTA button reads "Contact Sales" and links to `/contact`
- [ ] All CTA buttons are keyboard-accessible and have `aria-label` including the plan name

---

## Edge Cases

- **Annual toggle with Enterprise**: Enterprise shows "Custom" regardless of billing period toggle — no change expected.
- **Annual savings badge**: "Save 20%" badge should only appear in annual billing view. $79 → $63 is 20.3% savings — acceptable rounding; do not change to "Save 20.3%".
- **Screen reader price**: Price `aria-label` must read the full value (e.g., "$79 per month per seat") not just "$79".
- **Mobile layout**: On mobile, all three pricing cards should be accessible — either stacked vertically or via a tab switcher. The Pro card must not be hidden by default.

---

## Out of Scope

- **Trial period length**: Whether "Start Free Trial" means 7 days, 14 days, or 30 days is not specified in this ticket. The button label and link are in scope; trial mechanics are not.
- **Billing system / payment flow**: The `/signup` and `/contact` pages and payment processing are out of scope for this marketing website ticket.
- **Additional tiers**: No tier other than Free, Pro, and Enterprise should be added.
- **Feature flags by region**: Pricing is global/uniform — no regional variants.
- **Team vs. per-seat pricing display**: The "per seat" suffix is sufficient; a seat calculator widget is out of scope.

---

## Conflict Resolution Notes

The QA agent reported the Pro tier price as "$49/mo with 10 tickets" citing the task spec. After reviewing all source documents:

1. The original ticket (`prompt-1770824852130`) describes only "Free/Pro/Enterprise tiers" — **no price figures appear anywhere in the ticket**.
2. The UI/UX agent (Step 1) introduced the $79/mo figure with a full rationale and feature breakdown in `artifacts/ui-specs/components.md`.
3. The Developer (Step 2) followed the UI spec and noted the discrepancy as an open issue.
4. The source of the "$49/mo, 10 tickets" figure is **untraced** — it does not appear in the ticket, in any agent artifact, or in any context file. It appears to be a hallucination introduced in the QA or planner rework stage.

**Decision: $79/month Pro with unlimited tickets is the canonical pricing.** The developer should verify `PricingSection.tsx` already reflects this (it does) and make no change to pricing data.
