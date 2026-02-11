# User Stories — SprintFoundry Pricing (Canonical)

---

### US-1: View Canonical Pricing Tiers
**As a** prospective customer visiting the SprintFoundry website, **I want to** see accurate pricing for all three subscription tiers, **so that** I can evaluate the product for my team.

**Acceptance Criteria:**
- [ ] Free tier displays $0/month with 5 tickets/month and Developer + QA agents only
- [ ] Pro tier displays $79/month (monthly) and $63/month (annual) with "per seat" suffix
- [ ] Enterprise tier displays "Custom" for both billing periods
- [ ] All three tiers are visible simultaneously on desktop (3-column layout)
- [ ] "Most Popular" badge appears on the Pro tier card
- [ ] Annual billing toggle switches Pro price from $79 to $63; Free and Enterprise prices do not change

---

### US-2: Understand What Each Tier Includes
**As a** prospective customer, **I want to** see the features included in each tier, **so that** I can choose the right plan for my needs.

**Acceptance Criteria:**
- [ ] Free tier lists: 5 tickets/month, Developer + QA agents, GitHub integration, community support, 1 project
- [ ] Pro tier lists: unlimited tickets, all 6 agents, GitHub/GitLab/Jira/Linear integrations, custom agent configuration, parallel agent execution, priority support, up to 20 projects
- [ ] Enterprise tier lists: everything in Pro plus SSO/SAML, SOC 2 Type II, custom agent fine-tuning, on-premise option, 99.9% SLA, dedicated success manager, unlimited projects
- [ ] Feature lists use check icons; no feature listed on a lower tier appears missing from a higher tier

---

### US-3: Take Action from Pricing Section
**As a** prospective customer ready to proceed, **I want to** click a CTA from the pricing section, **so that** I am directed to the appropriate signup or sales flow.

**Acceptance Criteria:**
- [ ] Free tier CTA button reads "Start Building Free" and links to `/signup`
- [ ] Pro tier CTA button reads "Start Free Trial" and links to `/signup?plan=pro`
- [ ] Enterprise tier CTA button reads "Contact Sales" and links to `/contact`
- [ ] All CTA buttons are keyboard-accessible and have `aria-label` including the plan name
