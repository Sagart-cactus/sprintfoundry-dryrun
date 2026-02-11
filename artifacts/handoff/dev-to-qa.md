# Developer → QA Handoff

## What Changed

- `website-v1/app/components/PricingSection.tsx` — Updated `ctaHref` for all three pricing tiers:
  - Free tier (line 27): `#` → `/signup`
  - Pro tier (line 45): `#` → `/signup?plan=pro`
  - Enterprise tier (line 65): `#` → `/contact`

## How to Test

1. Run the dev server: `cd website-v1 && npm run dev`
2. Navigate to the pricing section on the homepage (`http://localhost:3000/#pricing`)
3. Inspect or hover each CTA button to confirm the href destinations:
   - **Free** "Start Building Free" → `/signup`
   - **Pro** "Start Free Trial" → `/signup?plan=pro`
   - **Enterprise** "Contact Sales" → `/contact`
4. Confirm no `href="#"` placeholders remain on any pricing CTA button

## Environment Setup

- No new env vars
- No new dependencies
- No database migrations

## Notes

- Build passes cleanly (`next build` ✓, TypeScript ✓)
- The `/signup`, `/signup?plan=pro`, and `/contact` routes are not yet implemented (only `/` exists), so clicking the links will reach the 404 page. This is expected — the task scope was to fix the href values per product spec US-3, not to create the destination pages.
