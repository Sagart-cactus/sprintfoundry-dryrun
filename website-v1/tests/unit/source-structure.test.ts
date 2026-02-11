/**
 * Static source-structure tests.
 * These tests verify the source code contains all required sections,
 * IDs, components, and dark theme tokens — without needing a browser.
 */
import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";

const ROOT = resolve(__dirname, "../../");

function readSrc(relPath: string): string {
  return readFileSync(resolve(ROOT, relPath), "utf-8");
}

// ─── Required section IDs ────────────────────────────────────────────────

describe("Page structure — required section IDs", () => {
  const pageSrc = readSrc("app/page.tsx");

  it("page.tsx imports HeroSection", () => {
    expect(pageSrc).toContain('import HeroSection');
  });

  it("page.tsx imports FeaturesSection", () => {
    expect(pageSrc).toContain('import FeaturesSection');
  });

  it("page.tsx imports HowItWorksSection", () => {
    expect(pageSrc).toContain('import HowItWorksSection');
  });

  it("page.tsx imports PricingSection", () => {
    expect(pageSrc).toContain('import PricingSection');
  });

  it("page.tsx renders all 4 required sections in main", () => {
    expect(pageSrc).toContain('<HeroSection');
    expect(pageSrc).toContain('<FeaturesSection');
    expect(pageSrc).toContain('<HowItWorksSection');
    expect(pageSrc).toContain('<PricingSection');
  });
});

describe("Section IDs — present in component HTML", () => {
  it('HeroSection has id="hero"', () => {
    const src = readSrc("app/components/HeroSection.tsx");
    expect(src).toContain('id="hero"');
  });

  it('FeaturesSection has id="features"', () => {
    const src = readSrc("app/components/FeaturesSection.tsx");
    expect(src).toContain('id="features"');
  });

  it('HowItWorksSection has id="how-it-works"', () => {
    const src = readSrc("app/components/HowItWorksSection.tsx");
    expect(src).toContain('id="how-it-works"');
  });

  it('PricingSection has id="pricing"', () => {
    const src = readSrc("app/components/PricingSection.tsx");
    expect(src).toContain('id="pricing"');
  });
});

// ─── Dark theme ──────────────────────────────────────────────────────────

describe("Dark theme — background color applied", () => {
  const globalsCss = readSrc("app/globals.css");

  it("globals.css sets dark background #0A0B0E on body", () => {
    expect(globalsCss).toContain("#0A0B0E");
  });

  it("globals.css sets light text color #F0F2F8", () => {
    expect(globalsCss).toContain("#F0F2F8");
  });

  it("globals.css defines brand primary color #6366F1", () => {
    expect(globalsCss).toContain("#6366F1");
  });

  it("@theme block defines agent color tokens", () => {
    expect(globalsCss).toContain("--color-agent-product");
    expect(globalsCss).toContain("--color-agent-architect");
    expect(globalsCss).toContain("--color-agent-developer");
    expect(globalsCss).toContain("--color-agent-qa");
    expect(globalsCss).toContain("--color-agent-security");
    expect(globalsCss).toContain("--color-agent-devops");
  });
});

describe("Dark theme — prefers-reduced-motion media query", () => {
  it("globals.css contains prefers-reduced-motion override", () => {
    const globalsCss = readSrc("app/globals.css");
    expect(globalsCss).toContain("prefers-reduced-motion: reduce");
    expect(globalsCss).toContain("animation-duration: 0.01ms");
    expect(globalsCss).toContain("transition-duration: 0.01ms");
  });

  it("AgentOrbitDiagram reads prefers-reduced-motion", () => {
    const src = readSrc("app/components/AgentOrbitDiagram.tsx");
    expect(src).toContain("prefers-reduced-motion");
    expect(src).toContain("setPrefersReduced");
  });
});

// ─── Accessibility ───────────────────────────────────────────────────────

describe("Accessibility — ARIA attributes", () => {
  it("SiteNav has aria-label on header", () => {
    const src = readSrc("app/components/SiteNav.tsx");
    expect(src).toContain('aria-label="Main navigation"');
  });

  it("SiteNav mobile button has aria-expanded and aria-label", () => {
    const src = readSrc("app/components/SiteNav.tsx");
    expect(src).toContain("aria-expanded");
    expect(src).toContain("aria-label");
  });

  it("SiteNav mobile drawer has role=dialog and aria-modal", () => {
    const src = readSrc("app/components/SiteNav.tsx");
    expect(src).toContain('role="dialog"');
    expect(src).toContain('aria-modal="true"');
  });

  it("AgentOrbitDiagram has descriptive role=img and aria-label", () => {
    const src = readSrc("app/components/AgentOrbitDiagram.tsx");
    expect(src).toContain('role="img"');
    expect(src).toContain("aria-label");
    expect(src).toContain("Product");
  });

  it("PricingSection billing toggle has role=group and aria-label", () => {
    const src = readSrc("app/components/PricingSection.tsx");
    expect(src).toContain('role="group"');
    expect(src).toContain('aria-label="Billing period"');
  });

  it("HowItWorksSection step cards have sr-only step numbering", () => {
    const src = readSrc("app/components/HowItWorksSection.tsx");
    expect(src).toContain("sr-only");
    expect(src).toContain("Step");
  });

  it("Footer has role=contentinfo", () => {
    const src = readSrc("app/components/Footer.tsx");
    expect(src).toContain('role="contentinfo"');
  });
});

// ─── Navigation — keyboard / escape support ───────────────────────────────

describe("Navigation — keyboard support", () => {
  it("SiteNav listens for Escape key to close mobile drawer", () => {
    const src = readSrc("app/components/SiteNav.tsx");
    expect(src).toContain('"Escape"');
    expect(src).toContain("closeMobile");
  });

  it("SiteNav locks body scroll when mobile drawer is open", () => {
    const src = readSrc("app/components/SiteNav.tsx");
    expect(src).toContain("overflow");
    expect(src).toContain("hidden");
  });
});

// ─── Copyright year ──────────────────────────────────────────────────────

describe("Footer — dynamic copyright year", () => {
  it("Footer uses new Date().getFullYear() for copyright year", () => {
    const src = readSrc("app/components/Footer.tsx");
    expect(src).toContain("new Date().getFullYear()");
  });
});

// ─── Client component boundaries ─────────────────────────────────────────

describe("Client components — use client directive", () => {
  const clientComponents = [
    "app/components/SiteNav.tsx",
    "app/components/HeroSection.tsx",
    "app/components/AgentOrbitDiagram.tsx",
    "app/components/StatsBanner.tsx",
    "app/components/FeaturesSection.tsx",
    "app/components/HowItWorksSection.tsx",
    "app/components/PricingSection.tsx",
    "app/components/AgentFeatureCard.tsx",
  ];

  clientComponents.forEach((comp) => {
    it(`${comp} has "use client" directive`, () => {
      const src = readSrc(comp);
      expect(src.trimStart().startsWith('"use client"')).toBe(true);
    });
  });
});

// ─── Layout — metadata ───────────────────────────────────────────────────

describe("Layout — metadata", () => {
  it("layout.tsx has a page title", () => {
    const src = readSrc("app/layout.tsx");
    expect(src).toContain("SprintFoundry");
    expect(src).toContain("title:");
  });

  it("layout.tsx has lang=en on html element", () => {
    const src = readSrc("app/layout.tsx");
    expect(src).toContain('lang="en"');
  });

  it("layout.tsx has Open Graph metadata", () => {
    const src = readSrc("app/layout.tsx");
    expect(src).toContain("openGraph");
  });
});
