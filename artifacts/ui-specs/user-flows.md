# User Flows — SprintFoundry Marketing Website

The marketing site is a single-page (or multi-section) website. Visitors have two primary goals: understand the product and convert (sign up / contact sales). All flows begin at the homepage.

---

## Flow 1: Visitor Explores the Product (Primary Discovery Flow)

**Persona:** Software engineering manager or developer who has never heard of SprintFoundry.

1. Visitor lands on the homepage (Hero section is visible above the fold).
2. Visitor reads the headline: "Your AI Engineering Team, On Demand" and sub-copy.
3. Visitor observes the animated agent workflow visualization — 6 agent nodes connected by animated data-flow lines, showing a ticket moving through agents to a PR.
4. Visitor clicks the primary CTA: "Start Building Free" → navigates to sign-up page (out of scope for this site; link target is `#` or `/signup`).
5. Visitor scrolls down to the **Features** section.
6. Visitor reads the six agent type cards (Product, Architecture, Developer, QA, Security, DevOps), each with an accent color, icon, name, and description. Hovering a card expands or glows it.
7. Visitor scrolls to the **How It Works** section.
8. Visitor reads the 4-step ticket-to-PR pipeline (illustrated as a connected step flow): Submit Ticket → AI Orchestrator Plans → Agents Collaborate → PR Delivered.
9. Visitor watches the animated data-flow through the pipeline steps on scroll-in.
10. Visitor scrolls to the **Pricing** section.
11. Visitor reviews the three tiers (Free / Pro / Enterprise) and feature comparison.
12. Visitor clicks "Get Started Free" on the Free tier → navigates to sign-up.
13. Visitor clicks "Contact Sales" on Enterprise tier → navigates to contact form (out of scope; link target `/contact`).

**Decision Point:** If visitor wants to learn more before converting, they may use the nav to jump to any section.

**Happy path result:** Visitor signs up for Free tier.

---

## Flow 2: Returning Visitor Evaluates Pricing

**Persona:** Engineering manager comparing tools, has seen SprintFoundry before.

1. Visitor lands on homepage with the URL anchor `/#pricing` → page scrolls directly to Pricing section.
2. Visitor sees the three-tier layout with feature comparison table.
3. Visitor hovers each tier to see "What's included" highlights.
4. Visitor clicks "Compare all features" toggle (if present) to expand the full comparison table below the tier cards.
5. Visitor selects "Pro" tier and clicks "Start Free Trial" → navigates to sign-up with `?plan=pro` query param.

**Alternative:** Visitor wants custom quote → clicks "Contact Sales" under Enterprise → navigates to contact page.

---

## Flow 3: Mobile Visitor Quick Scan

**Persona:** Developer browsing on a phone, referred by a colleague.

1. Visitor lands on mobile homepage. Hero is a single column with headline, sub-copy, and CTA stacked.
2. Agent workflow visualization is simplified: vertical stack of agent pills with animated connecting line rather than radial diagram.
3. Visitor taps "Learn More" → page-scrolls (smooth) to Features section.
4. Features section is a single-column vertical list of agent cards (no grid).
5. Visitor scrolls through all six agent cards.
6. Visitor taps "How It Works" in the sticky nav → smooth scrolls to that section.
7. How It Works is a vertical step-by-step list with numbered badges.
8. Visitor scrolls to Pricing. Cards stack vertically with a horizontal scroll affordance (chip tabs: Free / Pro / Enterprise) or a full vertical stack.
9. Visitor taps "Start Building Free" → sign-up flow.

---

## Navigation Flow

1. On desktop: Sticky top nav with logo (left), section links (center: Features / How It Works / Pricing / Docs), and CTA button "Get Started" (right).
2. On mobile: Logo + hamburger menu. Drawer opens from right with same links + CTA.
3. Nav transitions from transparent to `bg-surface/80 backdrop-blur` when user scrolls past the hero.
4. Active section is highlighted in nav (scroll spy).

---

## Page Load Flow

1. Page loads with a subtle fade-in of the entire layout (200ms).
2. Hero section animates in: headline fades up, sub-copy fades up (delay 100ms), CTA buttons fade up (delay 200ms), agent visualization fades in and begins animated loop (delay 300ms).
3. Subsequent sections are invisible until they enter the viewport (Intersection Observer), then they animate in using `fade-up`.
4. Navigation is immediately visible and interactive.

---

## Error / Edge States

- **Sign-up link down:** CTA button remains interactive; link target is external. No in-page error state needed for a marketing site.
- **Slow network / no JS:** All sections render with standard HTML/CSS — content is readable without animation. Agent visualization falls back to a static SVG diagram. Nav drawer falls back to an anchor link list.
- **Very wide viewport (>1920px):** Content is max-width constrained at 1280px, centered. Background fills edge-to-edge with gradient noise texture.

