# SprintFoundry Design System

## Brand Identity

SprintFoundry is an AI orchestration platform. The visual language should convey: intelligence, automation, precision, and collaboration. Dark theme with vibrant agent accent colors on a near-black canvas.

---

## Color Palette

### Base (Dark Theme)

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-bg-primary` | `#0A0B0E` | Page background, darkest surface |
| `--color-bg-surface` | `#111318` | Card backgrounds, sections |
| `--color-bg-elevated` | `#1A1D25` | Modals, dropdowns, raised cards |
| `--color-bg-overlay` | `#242836` | Hover states, subtle fills |
| `--color-border-subtle` | `#1F2330` | Dividers, subtle borders |
| `--color-border-default` | `#2D3245` | Default borders |
| `--color-border-strong` | `#3D4460` | Emphasis borders |

### Text

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-text-primary` | `#F0F2F8` | Headings, primary copy |
| `--color-text-secondary` | `#8B91A8` | Body text, descriptions |
| `--color-text-muted` | `#555C72` | Labels, captions, placeholders |
| `--color-text-inverse` | `#0A0B0E` | Text on light backgrounds |

### Agent Accent Colors

Each agent has a primary accent and a muted variant for backgrounds/glows.

| Agent | Accent | Muted BG | Hex |
|-------|--------|----------|-----|
| Product | `--color-agent-product` | `--color-agent-product-muted` | `#7C3AED` / `#1A1030` |
| Architecture | `--color-agent-architect` | `--color-agent-architect-muted` | `#0EA5E9` / `#071525` |
| Developer | `--color-agent-developer` | `--color-agent-developer-muted` | `#10B981` / `#071A14` |
| QA | `--color-agent-qa` | `--color-agent-qa-muted` | `#F59E0B` / `#1C1507` |
| Security | `--color-agent-security` | `--color-agent-security-muted` | `#EF4444` / `#1C0707` |
| DevOps | `--color-agent-devops` | `--color-agent-devops-muted` | `#EC4899` / `#1C0712` |

### Functional Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-success` | `#10B981` | Success states |
| `--color-warning` | `#F59E0B` | Warning states |
| `--color-error` | `#EF4444` | Error states |
| `--color-info` | `#0EA5E9` | Info states |

### Brand Primary (CTA / Interactive)

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-primary-500` | `#6366F1` | Primary buttons, links, focus rings |
| `--color-primary-400` | `#818CF8` | Hover state |
| `--color-primary-600` | `#4F46E5` | Active/pressed state |
| `--color-primary-muted` | `#111827` | Primary-tinted backgrounds |

---

## Typography

### Font Stack

```
--font-sans: 'Inter', system-ui, -apple-system, sans-serif
--font-mono: 'JetBrains Mono', 'Fira Code', monospace
```

Inter for all UI text. JetBrains Mono for code snippets and technical labels.

### Type Scale

| Token | Size | Line Height | Weight | Usage |
|-------|------|-------------|--------|-------|
| `--text-xs` | 12px | 16px | 400 | Captions, labels |
| `--text-sm` | 14px | 20px | 400 | Body small, meta |
| `--text-base` | 16px | 24px | 400 | Body text |
| `--text-lg` | 18px | 28px | 400/500 | Lead text |
| `--text-xl` | 20px | 28px | 500 | Section sub-heads |
| `--text-2xl` | 24px | 32px | 600 | Card titles |
| `--text-3xl` | 30px | 36px | 700 | Section headings (mobile) |
| `--text-4xl` | 36px | 44px | 700 | Section headings (tablet) |
| `--text-5xl` | 48px | 56px | 800 | Hero heading (mobile) |
| `--text-6xl` | 64px | 72px | 800 | Hero heading (desktop) |
| `--text-7xl` | 80px | 88px | 800 | Hero heading (wide) |

### Heading Styles

Hero headings use a gradient text treatment:
```css
background: linear-gradient(135deg, #F0F2F8 0%, #818CF8 50%, #7C3AED 100%);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
```

---

## Spacing Scale

Uses 4px base unit.

| Token | Value |
|-------|-------|
| `--space-1` | 4px |
| `--space-2` | 8px |
| `--space-3` | 12px |
| `--space-4` | 16px |
| `--space-5` | 20px |
| `--space-6` | 24px |
| `--space-8` | 32px |
| `--space-10` | 40px |
| `--space-12` | 48px |
| `--space-16` | 64px |
| `--space-20` | 80px |
| `--space-24` | 96px |
| `--space-32` | 128px |

Section vertical padding: `80px` mobile, `120px` tablet+.
Max content width: `1280px` with `24px` side padding mobile, `40px` tablet, `80px` desktop.

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 4px | Badges, chips |
| `--radius-md` | 8px | Buttons, inputs |
| `--radius-lg` | 12px | Cards |
| `--radius-xl` | 16px | Large cards, modals |
| `--radius-2xl` | 24px | Feature cards, hero elements |
| `--radius-full` | 9999px | Pills, avatars |

---

## Shadows / Glows

```css
--shadow-card: 0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3);
--shadow-elevated: 0 10px 40px rgba(0,0,0,0.5);
--shadow-glow-primary: 0 0 40px rgba(99,102,241,0.25);
```

Agent glow: use `box-shadow: 0 0 30px {agent-color}40` (25% opacity). Applied on hover and active states.

---

## Animation

### Principles
- Purposeful: animation communicates state or flow, not decoration
- Fast: UI transitions ≤ 200ms, entrance animations ≤ 600ms
- Reduced-motion: all non-critical animations respect `prefers-reduced-motion`

### Easing
```css
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);   /* entering elements */
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);        /* transitioning */
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);   /* interactive elements */
```

### Key Animations

**fade-up** (section entrances on scroll):
```css
@keyframes fade-up {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}
duration: 600ms, easing: ease-out-expo, stagger: 100ms per child
```

**pulse-glow** (agent node idle state):
```css
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 16px {color}60; }
  50%       { box-shadow: 0 0 32px {color}90, 0 0 60px {color}30; }
}
duration: 2s, infinite, alternate
```

**flow-dash** (pipeline connectors — moving dashed border):
```css
@keyframes flow-dash {
  from { stroke-dashoffset: 200; }
  to   { stroke-dashoffset: 0; }
}
duration: 1.5s, infinite, linear
```

**counter-up** (stats, numbers counting up on scroll enter):
```
Increment from 0 to final value over 1.2s, easeOutExpo
```

---

## Breakpoints

| Name | Min Width | Usage |
|------|-----------|-------|
| `sm` | 480px | Large phones |
| `md` | 768px | Tablets |
| `lg` | 1024px | Small laptops |
| `xl` | 1280px | Desktop |
| `2xl` | 1536px | Wide screens |

Mobile-first approach. Base styles target mobile (320px+).

---

## Iconography

Use **Lucide React** icon set throughout. Size conventions:
- 16px: inline with text labels
- 20px: button icons, navigation
- 24px: feature icons in prose
- 32px: section icons
- 48px: agent type icons (use custom SVG or Lucide variants)

Agent icons: each agent type has a dedicated icon representing its function.
- Product: `Lightbulb` or `BookOpen`
- Architecture: `GitBranch` or `Layers`
- Developer: `Code2` or `Terminal`
- QA: `CheckCircle2` or `TestTube`
- Security: `Shield` or `Lock`
- DevOps: `Rocket` or `Cloud`

---

## Grid System

12-column grid with `24px` gutters.

Common layouts:
- Full width: 12 cols
- Two halves: 6 / 6
- One-third / Two-thirds: 4 / 8
- Three equal: 4 / 4 / 4
- Four equal: 3 / 3 / 3 / 3 (agent feature cards)

---

## Z-Index Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--z-base` | 0 | Default |
| `--z-raised` | 10 | Cards with hover lift |
| `--z-dropdown` | 100 | Dropdowns, tooltips |
| `--z-sticky` | 200 | Sticky navigation |
| `--z-modal` | 300 | Modals |
| `--z-toast` | 400 | Toast notifications |

---

## Tailwind Config Extension (website-v1)

```js
// tailwind.config.js
module.exports = {
  darkMode: 'class', // site is always dark
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0A0B0E',
          surface: '#111318',
          elevated: '#1A1D25',
          overlay: '#242836',
        },
        border: {
          subtle: '#1F2330',
          default: '#2D3245',
          strong: '#3D4460',
        },
        text: {
          primary: '#F0F2F8',
          secondary: '#8B91A8',
          muted: '#555C72',
        },
        primary: {
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
        },
        agent: {
          product: '#7C3AED',
          architect: '#0EA5E9',
          developer: '#10B981',
          qa: '#F59E0B',
          security: '#EF4444',
          devops: '#EC4899',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        '2xl': '24px',
      },
      maxWidth: {
        content: '1280px',
      },
    },
  },
}
```
