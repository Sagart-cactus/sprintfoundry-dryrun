# Scope — SprintFoundry Pricing Canonical Definition

## In Scope

| Item | Detail |
|------|--------|
| Free tier price | $0/month |
| Free tier limits | 5 tickets/month, 1 project |
| Free tier agents | Developer + QA only |
| Free tier integrations | GitHub only |
| Free tier support | Community |
| Pro tier price (monthly) | $79/month per seat |
| Pro tier price (annual) | $63/month per seat (~20% savings) |
| Pro tier limits | Unlimited tickets, up to 20 projects |
| Pro tier agents | All 6 (Product, Architecture, Developer, QA, Security, DevOps) |
| Pro tier integrations | GitHub, GitLab, Jira, Linear |
| Pro tier extras | Custom agent configuration, parallel agent execution |
| Pro tier support | Priority |
| Enterprise tier price | Custom (both billing periods) |
| Enterprise tier limits | Unlimited tickets, unlimited projects |
| Enterprise features | Everything in Pro + SSO/SAML, SOC 2 Type II, custom fine-tuning, on-premise option, 99.9% SLA, dedicated success manager |
| Annual billing toggle | Switches Pro price display; no effect on Free or Enterprise |
| "Most Popular" badge | On Pro card only |
| CTA links | Free → `/signup`, Pro → `/signup?plan=pro`, Enterprise → `/contact` |
| Accessibility | Price `aria-label` includes full human-readable value; CTA `aria-label` includes plan name |

## Out of Scope

| Item | Reason |
|------|--------|
| Trial period length | Not specified in ticket; trial mechanics are a product/billing decision |
| Payment / billing system | This is a marketing website; no payment flow is implemented here |
| Additional tiers (e.g. Team, Starter) | Ticket specifies exactly three tiers |
| Regional pricing variations | No such requirement in ticket |
| Seat calculator widget | Not requested; "per seat" label is sufficient |
| Pricing page (separate from marketing site) | This ticket covers the pricing _section_ on the single-page marketing site only |
| API or backend pricing enforcement | Marketing website is fully static |

## Conflict Resolution

The "$49/mo Pro with 10 tickets" figure cited by QA does **not appear** in the original ticket or any prior agent artifact. It is untraced. The UI/UX agent's $79/mo figure, introduced in `artifacts/ui-specs/components.md` with a full feature breakdown, is the only documented pricing specification in the pipeline.

**Authoritative pricing source:** `artifacts/ui-specs/components.md` → PricingSection tier data.
**No changes to the current implementation are required for pricing.**
