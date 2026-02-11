# Component Specs — Summary

This document summarizes all component specifications for the SprintFoundry marketing website (`website-v1`).
Full details for each component are in `artifacts/ui-specs/components.md`.
Design tokens and the design system are in `artifacts/ui-specs/design-system.md`.
User flows are in `artifacts/ui-specs/user-flows.md`.

---

## Component Inventory

| Component | File | Section | Status |
|-----------|------|---------|--------|
| `SiteNav` | `components/SiteNav.tsx` | Global | Specified |
| `HeroSection` | `sections/HeroSection.tsx` | Hero | Specified |
| `AgentOrbitDiagram` | `components/AgentOrbitDiagram.tsx` | Hero | Specified |
| `FeaturesSection` | `sections/FeaturesSection.tsx` | Features | Specified |
| `AgentFeatureCard` | `components/AgentFeatureCard.tsx` | Features | Specified |
| `HowItWorksSection` | `sections/HowItWorksSection.tsx` | How It Works | Specified |
| `PricingSection` | `sections/PricingSection.tsx` | Pricing | Specified |
| `PricingCard` | `components/PricingCard.tsx` | Pricing | Specified (inline) |
| `PrimaryButton` | `components/ui/PrimaryButton.tsx` | Global | Specified |
| `GhostButton` | `components/ui/GhostButton.tsx` | Global | Specified |
| `SectionBadge` | `components/ui/SectionBadge.tsx` | Global | Specified |
| `Footer` | `components/Footer.tsx` | Global | Specified |
| `StatsBanner` | `components/StatsBanner.tsx` | Between Hero/Features | Specified (optional) |

---

## Page Structure

```
<SiteNav />                          ← sticky, transparent → glass on scroll
<main>
  <HeroSection>                      ← id="hero"
    <AgentOrbitDiagram />
  </HeroSection>
  <StatsBanner />                    ← optional social proof strip
  <FeaturesSection id="features">   ← id="features"
    <AgentFeatureCard /> × 6
  </FeaturesSection>
  <HowItWorksSection id="how-it-works" />
  <PricingSection id="pricing">
    <PricingCard /> × 3
  </PricingSection>
</main>
<Footer />
```

---

## Design System Summary

See `artifacts/ui-specs/design-system.md` for full details.

### Key Colors
- Background primary: `#0A0B0E`
- Surface: `#111318`
- Text primary: `#F0F2F8`
- Brand CTA: `#6366F1` (indigo)

### Agent Accent Colors
- Product: `#7C3AED` (violet)
- Architecture: `#0EA5E9` (sky blue)
- Developer: `#10B981` (emerald)
- QA: `#F59E0B` (amber)
- Security: `#EF4444` (red)
- DevOps: `#EC4899` (pink)

### Typography
- Font: Inter (sans), JetBrains Mono (code)
- Hero heading: `text-5xl`–`text-7xl`, gradient text treatment
- Section heading: `text-3xl`–`text-4xl`, `font-bold`

### Key Animations
- `fade-up`: section entrance on scroll (600ms, staggered)
- `pulse-glow`: agent node idle (2s loop)
- `flow-dash`: pipeline connector lines (1.5s loop)
- All animations respect `prefers-reduced-motion`

---

## Accessibility Checklist

- [x] All interactive elements keyboard accessible
- [x] Focus indicators defined (2px `primary-500` outline)
- [x] Color contrast: `text-text-primary` (#F0F2F8) on `bg-primary` (#0A0B0E) = 17.5:1 (AAA)
- [x] Color contrast: `text-text-secondary` (#8B91A8) on `bg-primary` (#0A0B0E) = 5.2:1 (AA)
- [x] Decorative images and SVGs use `aria-hidden="true"`
- [x] Content images use descriptive `alt` text
- [x] `AgentOrbitDiagram` has full `aria-label` description
- [x] `PricingCard` uses `<article>` with `aria-label`
- [x] Nav uses `role="navigation"` with `aria-label`
- [x] Mobile nav drawer uses `role="dialog"` with focus trap
- [x] Billing toggle uses `role="group"` with `aria-pressed`
- [x] Ordered steps (`<ol>`) for HowItWorks
- [x] Pricing prices have meaningful `aria-label` (not just "$79")
- [x] `<h1>` only in Hero; section headings use `<h2>`; card titles use `<h3>`
- [x] `prefers-reduced-motion` respected on all animations

---

## Responsive Behavior Summary

| Section | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Nav | Logo + hamburger drawer | Logo + inline links + CTA | Same as tablet |
| Hero | Single column, stacked | Two columns | Two columns, larger diagram |
| Agent Diagram | Simplified vertical | Full hexagonal (400px) | Full hexagonal (500px) |
| Features | 1-col grid | 2-col grid | 3-col grid |
| How It Works | Vertical list | 2-col | 4-col horizontal flow |
| Pricing | Vertical stack or tabs | 3-col (narrow) | 3-col |
| Footer | Stacked, 2×2 links | 4-col | 4-col |

---

## File Organization (website-v1)

Recommended directory structure for the developer agent:

```
website-v1/
├── src/
│   ├── app/
│   │   ├── layout.tsx         ← root layout with fonts, metadata
│   │   └── page.tsx           ← main page composing all sections
│   ├── components/
│   │   ├── ui/
│   │   │   ├── PrimaryButton.tsx
│   │   │   ├── GhostButton.tsx
│   │   │   └── SectionBadge.tsx
│   │   ├── AgentFeatureCard.tsx
│   │   ├── AgentOrbitDiagram.tsx
│   │   ├── PricingCard.tsx
│   │   ├── SiteNav.tsx
│   │   ├── StatsBanner.tsx
│   │   └── Footer.tsx
│   ├── sections/
│   │   ├── HeroSection.tsx
│   │   ├── FeaturesSection.tsx
│   │   ├── HowItWorksSection.tsx
│   │   └── PricingSection.tsx
│   ├── data/
│   │   ├── agents.ts          ← agent definitions (id, name, accent, icon, ...)
│   │   ├── pricing.ts         ← tier definitions
│   │   └── howItWorks.ts      ← step definitions
│   └── lib/
│       └── utils.ts           ← cn(), useIntersection(), useScrollSpy()
├── public/
│   └── fonts/                 ← Inter + JetBrains Mono if self-hosted
├── tailwind.config.js         ← extends with tokens from design-system.md
├── package.json
└── next.config.ts
```

---

## Cross-References

- Full component props and states → `artifacts/ui-specs/components.md`
- Design tokens, colors, type scale, animations → `artifacts/ui-specs/design-system.md`
- User flows and visitor journeys → `artifacts/ui-specs/user-flows.md`
