# Bug Report — SprintFoundry Marketing Website (website-v1)

## CRITICAL Issues

(none found)

## MAJOR Issues

(none found)

## MINOR Issues

### BUG-2: Emoji rendering in AgentOrbitDiagram may be inconsistent cross-platform
- **Severity**: MINOR
- **File**: `website-v1/app/components/AgentOrbitDiagram.tsx:185-189`
- **Steps to reproduce**: View the Hero diagram on Windows Chrome
- **Expected**: Agent icons render consistently as recognizable symbols
- **Actual**: SVG `<text>` elements contain emoji characters (💡, 🔀, ⌨, ✓, 🛡, 🚀) which render differently across OS/browser combinations. Windows may show blank boxes for some characters.
- **Note**: Developer acknowledged this in handoff notes as a known limitation. macOS rendering is fine.
- **Suggested fix**: Replace emoji `<text>` elements with `<foreignObject>` containing Lucide SVG icons (which are already imported), or embed the SVG paths directly in the diagram.

## Resolved (from previous sprint)

### RESOLVED: Pricing CTA buttons use placeholder hrefs
- Previous BUG-1 (all three CTAs used `href="#"`) has been fixed by the developer in step-903. Free → `/signup`, Pro → `/signup?plan=pro`, Enterprise → `/contact`. Verified by 4/4 passing tests. ✅

### RESOLVED: Pricing price mismatch
- Previous BUG (Pro tier at $49 vs $79) was resolved by the product agent in `artifacts/product-spec.md`. The canonical price is $79/mo (monthly) / $63/mo (annual). Implementation matches canonical spec. ✅

### RESOLVED: "Watch Demo" button non-functional
- HeroSection contains an `onClick` handler that smooth-scrolls to the `#how-it-works` section. ✅

### RESOLVED: Mobile drawer focus trap not implemented
- SiteNav implements a full focus trap using `querySelectorAll`, Tab/Shift+Tab cycling, Escape key close, and focus return to hamburger on close. ✅

## Spec / Ambiguity Notes

- **Annual pricing math**: The "Save 20%" badge is shown for annual billing. $79 → $63 represents a 20.25% savings (acceptable rounding per spec).
- **Docs link**: The "Docs" nav link points to `#` (a placeholder). Expected for marketing MVP.
- **All footer links**: All footer nav links point to `#`. Expected for MVP but should be replaced before launch.
