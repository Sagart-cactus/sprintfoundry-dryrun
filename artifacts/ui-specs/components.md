# Component Specifications — SprintFoundry Marketing Website

All components target the `website-v1` folder. Stack: React + TypeScript + Tailwind CSS.
Design system tokens are defined in `artifacts/ui-specs/design-system.md`.

---

## 1. SiteNav

**Purpose:** Sticky top navigation bar providing section access and primary CTA. Transitions from transparent to blurred glass on scroll.

**Props:**
```ts
interface SiteNavProps {
  activeSection?: 'hero' | 'features' | 'how-it-works' | 'pricing';
}
```

**States:**

| State | Appearance | Behavior |
|-------|------------|----------|
| Default (at top) | `bg-transparent`, no border | Fully transparent over hero |
| Scrolled | `bg-bg-surface/80 backdrop-blur-md border-b border-border-subtle` | Glass effect, visible border |
| Mobile closed | Logo + hamburger icon | Hamburger tap opens drawer |
| Mobile open | Drawer from right, `bg-bg-elevated`, full nav links | Overlay closes on outside tap or Escape |

**Layout:**
- Height: 64px desktop, 56px mobile
- Container: `max-w-content mx-auto px-6 flex items-center justify-between`
- Logo: left-aligned, 120px wide, `text-text-primary font-bold`
- Links: center on desktop, hidden on mobile. `gap-8`, `text-sm font-medium text-text-secondary hover:text-text-primary`
- CTA button: right-aligned. "Get Started" — `PrimaryButton` variant

**Nav Links:** Features | How It Works | Pricing | Docs (external link, opens new tab)

**Active state:** Active link has `text-primary-400` color with a 2px `bg-primary-500` underline.

**Scroll spy:** Uses `IntersectionObserver` to detect active section. Updates `activeSection`.

**Accessibility:**
- `role="navigation"` with `aria-label="Main navigation"`
- Mobile button: `aria-label="Open navigation menu"` / `aria-label="Close navigation menu"` (toggles)
- Mobile drawer: `role="dialog"` with `aria-modal="true"`, focus trap active when open
- Nav links are `<a>` elements with `href="#section-id"` for scroll
- Keyboard: Escape closes mobile drawer

**Responsive:**
- Mobile (< 768px): Logo + hamburger only. Links in off-canvas drawer.
- Tablet (768px+): Logo + inline links + CTA.

---

## 2. HeroSection

**Purpose:** Above-the-fold section that communicates SprintFoundry's value proposition with an animated agent workflow visualization.

**Props:**
```ts
interface HeroSectionProps {
  // No external props; static content section
}
```

**Content:**

- Eyebrow label: `"AI-Powered Engineering"` — pill badge, `bg-primary-muted text-primary-400 border border-primary-500/30 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full`
- Headline: `"Your AI Engineering Team, On Demand"`
  - Font: `text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight`
  - Treatment: gradient text (see design-system.md)
- Sub-copy: `"SprintFoundry orchestrates specialized AI agents — from product spec to tested PR — so your team ships faster without bottlenecks."`
  - Font: `text-lg md:text-xl text-text-secondary max-w-2xl`
- Primary CTA: "Start Building Free" → `PrimaryButton` size `lg`
- Secondary CTA: "Watch Demo" → `GhostButton` size `lg` with a `Play` icon prefix

**Agent Workflow Visualization (`AgentOrbitDiagram`):**
- See dedicated component spec below.

**Layout:**
- Desktop: two-column split. Left column: badge + headline + sub-copy + CTAs (60% width). Right column: `AgentOrbitDiagram` (40% width).
- Mobile: single column, stacked. Badge → headline → sub-copy → CTAs → diagram (below CTAs, full width, simplified vertical layout).
- Vertical padding: `pt-32 pb-24` (accounts for nav height).
- Background: subtle radial gradient noise texture from `bg-primary` behind right column.

**Animations:**
- On mount: eyebrow fades in (0ms), headline fades up (100ms delay), sub-copy fades up (200ms), CTAs fade up (350ms), diagram fades in and animates (500ms).
- Background: slow-moving gradient blob using CSS `@keyframes`, 8s loop.

**Accessibility:**
- Headline is `<h1>`.
- Diagram has `aria-label="Animated diagram showing AI agents: Product, Architecture, Developer, QA, Security, and DevOps collaborating on a software ticket"` and `role="img"`.
- Respects `prefers-reduced-motion`: all animations off, diagram static.

---

## 3. AgentOrbitDiagram

**Purpose:** Animated SVG/Canvas visualization of the 6 AI agents orbiting a central hub, with animated data-flow lines between them, showing a ticket flowing through agents.

**Props:**
```ts
interface AgentOrbitDiagramProps {
  variant?: 'full' | 'simplified'; // 'simplified' used on mobile
  autoPlay?: boolean;               // default true
  className?: string;
}
```

**Visual Structure (full variant):**
- Central hub: Circle with the SprintFoundry logo / "SF" monogram. `diameter: 80px`, `bg-bg-elevated border-2 border-primary-500`, subtle glow.
- 6 agent nodes arranged in a hexagonal orbit around the hub. Each node: a rounded square `64x64px` containing the agent icon, colored by `--color-agent-{type}`.
- Agent node labels: agent name below the icon in `text-xs text-text-secondary`.
- Connecting lines: SVG `<path>` elements from the hub to each agent, animated with `flow-dash` (moving dashes in agent's accent color).
- "Ticket" token: a small floating card representing a Jira-like ticket. It animates along a path from outside the diagram → hub → each agent → back to hub → exits as a "PR" card.

**Visual Structure (simplified variant — mobile):**
- Vertical stack: three agent pills on the left, three on the right, connected by a vertical center line.
- Same color coding and icons.
- Animated line runs down the center from top (ticket icon) to bottom (PR icon).

**States:**

| State | Description |
|-------|-------------|
| Idle / Playing | Agents pulse-glow (each their accent color). Connecting lines animate continuously. Ticket token travels loop every 4s. |
| Paused (reduced motion) | Static diagram, no animations. All nodes visible, lines drawn, no movement. |
| Hovered (individual node) | That node's glow intensifies, a tooltip appears: agent name + one-line description. |

**Ticket token animation path (full):**
1. Ticket card enters from top-left (0.0s)
2. Moves to hub center (0.5s)
3. Hub glows and splits token to Product agent (0.8s)
4. Product → Architecture → Developer in sequence (1.5s each)
5. Developer → QA (1.2s)
6. QA → Security (1.0s)
7. Security → hub (0.8s)
8. Hub emits "PR" card that exits to bottom-right (0.8s)
9. Loop restarts (pause 1s)

**Accessibility:**
- `role="img"` on the SVG container
- `aria-label="Animated visualization: A ticket enters, flows through Product, Architecture, Developer, QA, Security, and DevOps agents, and exits as a pull request"`
- All agent nodes have `aria-hidden="true"` (decorative, duplicated in text elsewhere)
- Respects `prefers-reduced-motion: reduce` → all animations halted

**Responsive:**
- Desktop: Full hexagonal diagram, 500×500px canvas
- Tablet: Full diagram, 400×400px
- Mobile: Simplified vertical variant, full width, max-height 320px

---

## 4. FeaturesSection

**Purpose:** Showcases the 6 agent types with their roles, capabilities, and accent colors.

**Props:**
```ts
interface FeaturesSectionProps {
  // Static content; agents list is defined in component
}
```

**Content:**
- Section eyebrow: `"The Team"` — same pill badge style as Hero
- Heading: `"Six Specialists. One Unified Platform."` — `<h2>`, `text-3xl md:text-4xl font-bold text-text-primary`
- Sub-copy: `"Each agent is purpose-built for its role, trained on domain knowledge, and works in concert with the others."` — `text-text-secondary text-lg`
- Grid of 6 `AgentFeatureCard` components

**Agent Data:**

```ts
const agents = [
  {
    id: 'product',
    name: 'Product Agent',
    accent: '#7C3AED',
    icon: 'Lightbulb',
    tagline: 'Turns vague tickets into clear requirements',
    capabilities: [
      'Writes product specs and user stories',
      'Defines acceptance criteria',
      'Identifies edge cases and scope',
      'Clarifies ambiguity before coding starts',
    ],
  },
  {
    id: 'architect',
    name: 'Architecture Agent',
    accent: '#0EA5E9',
    icon: 'GitBranch',
    tagline: 'Designs systems that scale',
    capabilities: [
      'Creates data models and ER diagrams',
      'Defines API contracts (OpenAPI)',
      'Writes architecture decision records',
      'Evaluates technical tradeoffs',
    ],
  },
  {
    id: 'developer',
    name: 'Developer Agent',
    accent: '#10B981',
    icon: 'Code2',
    tagline: 'Writes production-ready code',
    capabilities: [
      'Builds React/Next.js frontend components',
      'Creates API routes and server logic',
      'Runs database migrations',
      'Integrates third-party services',
    ],
  },
  {
    id: 'qa',
    name: 'QA Agent',
    accent: '#F59E0B',
    icon: 'CheckCircle2',
    tagline: 'Finds bugs before your users do',
    capabilities: [
      'Writes unit, integration, and E2E tests',
      'Validates code against acceptance criteria',
      'Reports bugs with severity classification',
      'Triggers rework when quality gates fail',
    ],
  },
  {
    id: 'security',
    name: 'Security Agent',
    accent: '#EF4444',
    icon: 'Shield',
    tagline: 'Ships secure code, every time',
    capabilities: [
      'Static analysis security scanning',
      'Dependency vulnerability checks',
      'Auth flow review and OWASP top 10',
      'Detects secrets and data leakage',
    ],
  },
  {
    id: 'devops',
    name: 'DevOps Agent',
    accent: '#EC4899',
    icon: 'Rocket',
    tagline: 'From code to cloud automatically',
    capabilities: [
      'Writes Dockerfiles and CI/CD pipelines',
      'Configures cloud infrastructure (IaC)',
      'Sets up monitoring and logging',
      'Manages environment variables',
    ],
  },
]
```

**Layout:**
- Desktop: 3-column grid, 2 rows (`grid-cols-3 gap-6`)
- Tablet: 2-column grid (`grid-cols-2 gap-5`)
- Mobile: 1-column stack (`grid-cols-1 gap-4`)

**Animations:**
- Section heading animates in on scroll-enter (fade-up, 600ms)
- Cards stagger in: 100ms delay increment per card (cards 1-6: 0ms, 100ms, 200ms ... 500ms)

---

## 5. AgentFeatureCard

**Purpose:** Individual feature card for an agent type. Displays icon, name, tagline, and capabilities list.

**Props:**
```ts
interface AgentFeatureCardProps {
  id: string;
  name: string;
  accent: string;          // hex color string
  icon: LucideIconName;
  tagline: string;
  capabilities: string[];
}
```

**States:**

| State | Appearance | Behavior |
|-------|------------|----------|
| Default | `bg-bg-surface border border-border-default rounded-2xl p-6` | Static |
| Hover | Border → `border-{accent}/50`, `box-shadow: 0 0 30px {accent}20`, slight `translateY(-4px)` | Smooth 200ms transition |
| Focus-visible | Same as hover + `outline: 2px solid {accent}` | Keyboard navigation |

**Content Structure (top to bottom):**
1. Icon container: `w-12 h-12 rounded-xl flex items-center justify-center` with `background: {accent}20`, icon in `{accent}` color, `24px` size
2. Agent name: `text-xl font-semibold text-text-primary mt-4`
3. Tagline: `text-sm text-text-secondary mt-1 mb-4`
4. Horizontal rule: `border-border-subtle`
5. Capabilities list: `<ul>` with `mt-4 space-y-2`. Each `<li>` has a `CheckCircle2` icon (12px, `{accent}` color) + `text-sm text-text-secondary`

**Accent stripe:** Optional — a 3px top border in `{accent}` color using `border-t-4` (rounded top corners).

**Accessibility:**
- Card is not itself a button/link — purely informational
- `aria-label` not needed; content is fully readable
- Icon is `aria-hidden="true"`; text describes the agent

**Responsive:**
- No internal responsive changes needed (layout is handled by the parent grid)
- Min-height: none (cards can have different heights)

---

## 6. HowItWorksSection

**Purpose:** Illustrates the ticket-to-PR pipeline as a 4-step horizontal (desktop) or vertical (mobile) step flow.

**Props:**
```ts
interface HowItWorksSectionProps {
  // Static content section
}
```

**Content:**
- Section eyebrow: `"The Process"`
- Heading: `"From Ticket to PR, Automatically"` — `<h2>`
- Sub-copy: `"SprintFoundry's orchestrator analyzes your ticket, assembles the right agents, and delivers tested, reviewed code — no manual handoffs."`

**Pipeline Steps:**

```ts
const steps = [
  {
    number: '01',
    title: 'Submit a Ticket',
    description: 'Connect Jira, Linear, or GitHub Issues. SprintFoundry picks up your ticket the moment it\'s assigned.',
    icon: 'Ticket',
    accent: '#6366F1',
  },
  {
    number: '02',
    title: 'AI Orchestrator Plans',
    description: 'Our orchestrator classifies the ticket and assembles the optimal sequence of agents — no over-engineering, no missing steps.',
    icon: 'Brain',
    accent: '#7C3AED',
  },
  {
    number: '03',
    title: 'Agents Collaborate',
    description: 'Each agent completes its role in sequence or in parallel. Output from one feeds the next — specs inform design, design informs code.',
    icon: 'Users2',
    accent: '#0EA5E9',
  },
  {
    number: '04',
    title: 'PR Delivered',
    description: 'A tested, reviewed pull request lands in your repo. Your engineers review and merge — or let the DevOps agent deploy it.',
    icon: 'GitPullRequest',
    accent: '#10B981',
  },
]
```

**Layout:**

Desktop: 4 columns side by side with animated connector lines between them.
- Each step card: centered content, step number top (large, muted), icon, title, description.
- Connector: SVG line between cards with `flow-dash` animation (dashes moving left to right).
- Connector arrows: arrowhead at receiving card.

Mobile: Vertical stack.
- Each step card: full width, left-aligned with a left border accent line.
- Connector: short vertical dashed line between cards.

**Pipeline Animation (desktop):**
- On scroll-enter: steps appear left to right with 150ms stagger (fade-up).
- Connector dashes animate continuously after steps appear.
- A "ticket" icon travels along the connector lines from step 1 → 4, then loops. 3s total duration.

**Step Card anatomy:**
1. Step number: `text-5xl font-extrabold text-text-muted opacity-30` (e.g., "01")
2. Icon: `w-10 h-10 rounded-lg`, `bg-{accent}/15`, icon in `{accent}`
3. Title: `text-xl font-semibold text-text-primary mt-3`
4. Description: `text-sm text-text-secondary mt-2 leading-relaxed`

**States:**
- Default: Subtle border, `bg-bg-surface`
- On scroll-enter: fades and slides up into position
- Hover (desktop): `border-{accent}/40`, icon container brightens

**Accessibility:**
- Steps are `<ol>` with `<li>` elements (ordered, meaningful sequence)
- Each step has a visually hidden `<span>` with "Step N: " prefix for screen readers
- Connector lines are `aria-hidden="true"` (decorative)
- `<h2>` for section heading, `<h3>` for each step title

---

## 7. PricingSection

**Purpose:** Displays three subscription tiers (Free, Pro, Enterprise) with feature comparison and conversion CTAs.

**Props:**
```ts
interface PricingSectionProps {
  // Static content section
}
```

**Content:**
- Section eyebrow: `"Pricing"`
- Heading: `"Simple, Transparent Pricing"` — `<h2>`
- Sub-copy: `"Start free. Scale as your team grows. No surprises."`
- Toggle: Monthly / Annual billing switch. Annual shows "Save 20%" badge.

**Tier Data:**

```ts
const tiers = [
  {
    name: 'Free',
    price: { monthly: '$0', annual: '$0' },
    description: 'For individuals exploring AI-assisted development.',
    cta: { label: 'Start Building Free', href: '/signup', variant: 'secondary' },
    highlight: false,
    features: [
      '5 tickets per month',
      'Developer + QA agents',
      'GitHub integration',
      'Community support',
      '1 project',
    ],
  },
  {
    name: 'Pro',
    price: { monthly: '$79', annual: '$63' },
    priceSuffix: '/month per seat',
    description: 'For engineering teams shipping production features.',
    cta: { label: 'Start Free Trial', href: '/signup?plan=pro', variant: 'primary' },
    highlight: true,
    badge: 'Most Popular',
    features: [
      'Unlimited tickets',
      'All 6 agents (Product, Architect, Developer, QA, Security, DevOps)',
      'GitHub, GitLab, Jira, Linear integrations',
      'Custom agent configuration',
      'Parallel agent execution',
      'Priority support',
      'Up to 20 projects',
    ],
  },
  {
    name: 'Enterprise',
    price: { monthly: 'Custom', annual: 'Custom' },
    description: 'For organizations needing compliance, SSO, and dedicated support.',
    cta: { label: 'Contact Sales', href: '/contact', variant: 'outline' },
    highlight: false,
    features: [
      'Everything in Pro',
      'SSO / SAML',
      'SOC 2 Type II',
      'Custom agent fine-tuning',
      'On-premise deployment option',
      'SLA with 99.9% uptime',
      'Dedicated success manager',
      'Unlimited projects',
    ],
  },
]
```

**Layout:**

Desktop: 3-column grid `grid-cols-3 gap-6`. Pro tier (highlighted) is slightly taller with a colored top border and badge.
Tablet: 3-column grid (narrower cards).
Mobile: Vertical stack, tab switcher at top (Free / Pro / Enterprise) to show one card at a time, or fully stacked.

**PricingCard States:**

| State | Appearance | Behavior |
|-------|------------|----------|
| Default | `bg-bg-surface border border-border-default rounded-2xl p-8` | Static |
| Highlighted (Pro) | `border-primary-500 bg-bg-elevated shadow-glow-primary` | Larger visual weight, "Most Popular" badge |
| Hover | `border-border-strong`, subtle `translateY(-2px)` | Smooth 150ms |
| Feature toggle open | Feature list fully shown | "Compare all features" expander |

**PricingCard anatomy:**
1. (Optional) Badge: "Most Popular" — absolute positioned top-right, `bg-primary-500 text-white text-xs font-semibold px-3 py-1 rounded-full`
2. Tier name: `text-lg font-semibold text-text-primary`
3. Price: `text-4xl font-extrabold text-text-primary` + suffix `text-sm text-text-secondary`
4. Description: `text-sm text-text-secondary mt-2 mb-6`
5. CTA button (full width)
6. Horizontal divider
7. Features list: each feature with `Check` icon (accent color) + `text-sm text-text-secondary`

**Billing Toggle:**
- `role="group"` with `aria-label="Billing period"`
- Toggle buttons: `aria-pressed` to indicate active selection
- "Annual" option shows "(Save 20%)" in `text-success` green

**Accessibility:**
- Each `PricingCard` is an article: `<article aria-label="{name} plan">`
- Price has `aria-label="$79 per month per seat"` (not just "$79")
- Feature list items read naturally as `<li>`
- CTA button `aria-label` includes plan name: `"Start Free Trial for Pro plan"`
- Keyboard: all interactive elements reachable via Tab

---

## 8. PrimaryButton

**Purpose:** Main call-to-action button. Used for the highest-priority actions.

**Props:**
```ts
interface PrimaryButtonProps {
  label: string;
  href?: string;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: LucideIconName; // optional leading icon
}
```

**States:**

| State | Appearance | Behavior |
|-------|------------|----------|
| Default | `bg-primary-500 text-white font-semibold rounded-lg` | Clickable |
| Hover | `bg-primary-400`, `translateY(-1px)`, stronger shadow | Cursor pointer |
| Active/Pressed | `bg-primary-600`, `translateY(0)` | Depressed |
| Loading | Spinner replaces icon, label stays, `opacity-80`, disabled | Not clickable |
| Disabled | `bg-bg-overlay text-text-muted cursor-not-allowed` | `aria-disabled="true"` |

**Sizes:**
- `sm`: `px-4 py-2 text-sm`
- `md`: `px-5 py-2.5 text-sm` (default)
- `lg`: `px-8 py-4 text-base`

**Accessibility:**
- Renders as `<a>` when `href` provided, `<button>` when `onClick` provided
- `role="button"` when rendered as `<a>` for interactive context
- Loading state: `aria-busy="true"` + `aria-label="Loading"` on spinner
- Disabled: `aria-disabled="true"`, no `disabled` attribute on `<a>` (use `pointer-events-none`)

---

## 9. GhostButton

**Purpose:** Secondary / tertiary actions. Transparent background with border.

**Props:** Same as `PrimaryButton`.

**Appearance:**
- Default: `border border-border-default text-text-secondary bg-transparent rounded-lg`
- Hover: `border-border-strong text-text-primary bg-bg-overlay`
- Focus: `outline: 2px solid primary-500 offset 2px`

---

## 10. SectionBadge

**Purpose:** Small eyebrow label above section headings to categorize/label the section.

**Props:**
```ts
interface SectionBadgeProps {
  label: string;
}
```

**Appearance:**
- `inline-flex items-center px-3 py-1 rounded-full border`
- `bg-primary-muted border-primary-500/30 text-primary-400`
- `text-xs font-semibold uppercase tracking-widest`

---

## 11. Footer

**Purpose:** Site footer with navigation links, company info, social links.

**Content:**
- Logo + tagline: "Built for engineering teams that ship."
- Link columns:
  - Product: Features, How It Works, Pricing, Changelog
  - Company: About, Blog, Careers, Contact
  - Resources: Docs, API Reference, GitHub, Status
- Social icons: GitHub, Twitter/X, LinkedIn — `w-5 h-5 text-text-muted hover:text-text-primary`
- Legal: `© 2025 SprintFoundry, Inc. · Privacy Policy · Terms of Service`

**Layout:**
- Desktop: 4-column layout (logo col + 3 link cols) above legal bar
- Mobile: Stacked columns, logo first, links in 2×2 grid, legal bar at bottom

**Accessibility:**
- `<footer role="contentinfo">`
- Column headings: `<h3>` or `<strong>` with nav `aria-label="Footer navigation: {column name}"`
- Legal links: standard `<a>` elements

---

## 12. StatsBanner (Optional — between Hero and Features)

**Purpose:** Social proof strip showing key metrics. Animates on scroll-enter.

**Content (placeholder data; update with real numbers):**
```
200+ Teams · 50,000+ Tickets Automated · 4.9 / 5 Developer Rating · 3x Faster Ship Time
```

**Layout:** Horizontal strip `bg-bg-surface border-y border-border-subtle py-6`. Four stats centered, separated by thin vertical dividers. On mobile, 2×2 grid.

**Stat anatomy:** Large number (`text-2xl font-bold text-text-primary`) + label (`text-sm text-text-secondary`)

**Animation:** Numbers count up from 0 when the section enters the viewport.

**Accessibility:**
- `aria-label` on the container: `"SprintFoundry by the numbers"`
- Static values in `aria-label` on each stat figure: `aria-label="Over 200 teams"` (not just "200+")

