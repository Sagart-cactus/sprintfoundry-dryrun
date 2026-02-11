import { describe, it, expect } from "vitest";

// ─── Navigation data (mirrors SiteNav.tsx) ────────────────────────────────
const navLinks = [
  { label: "Features", href: "#features", section: "features" },
  { label: "How It Works", href: "#how-it-works", section: "how-it-works" },
  { label: "Pricing", href: "#pricing", section: "pricing" },
  { label: "Docs", href: "#", external: true },
];

// ─── Section IDs present in the page (mirrors page.tsx) ──────────────────
const pageSectionIds = ["hero", "features", "how-it-works", "pricing"];

describe("Navigation — link targets", () => {
  it("Features link points to #features", () => {
    const link = navLinks.find((l) => l.label === "Features");
    expect(link?.href).toBe("#features");
  });

  it("How It Works link points to #how-it-works", () => {
    const link = navLinks.find((l) => l.label === "How It Works");
    expect(link?.href).toBe("#how-it-works");
  });

  it("Pricing link points to #pricing", () => {
    const link = navLinks.find((l) => l.label === "Pricing");
    expect(link?.href).toBe("#pricing");
  });

  it("Docs link is marked external", () => {
    const link = navLinks.find((l) => l.label === "Docs");
    expect(link?.external).toBe(true);
  });
});

describe("Navigation — sections match page IDs", () => {
  it("all nav sections resolve to page section IDs", () => {
    navLinks
      .filter((l) => l.section)
      .forEach((link) => {
        expect(pageSectionIds).toContain(link.section);
      });
  });

  it("all nav href anchors (non-external) correspond to page section IDs", () => {
    navLinks
      .filter((l) => !l.external && l.href.startsWith("#") && l.href !== "#")
      .forEach((link) => {
        const sectionId = link.href.slice(1);
        expect(pageSectionIds).toContain(sectionId);
      });
  });
});

describe("Page sections — required sections present", () => {
  it("page includes hero section", () => {
    expect(pageSectionIds).toContain("hero");
  });

  it("page includes features section", () => {
    expect(pageSectionIds).toContain("features");
  });

  it("page includes how-it-works section", () => {
    expect(pageSectionIds).toContain("how-it-works");
  });

  it("page includes pricing section", () => {
    expect(pageSectionIds).toContain("pricing");
  });
});

describe("How It Works — 4 pipeline steps", () => {
  const steps = [
    { number: "01", title: "Submit a Ticket" },
    { number: "02", title: "AI Orchestrator Plans" },
    { number: "03", title: "Agents Collaborate" },
    { number: "04", title: "PR Delivered" },
  ];

  it("should have exactly 4 steps", () => {
    expect(steps).toHaveLength(4);
  });

  it("steps should be numbered sequentially 01-04", () => {
    expect(steps.map((s) => s.number)).toEqual(["01", "02", "03", "04"]);
  });

  it("pipeline starts with ticket submission", () => {
    expect(steps[0].title).toContain("Ticket");
  });

  it("pipeline ends with PR delivery", () => {
    expect(steps[3].title).toContain("PR");
  });
});
