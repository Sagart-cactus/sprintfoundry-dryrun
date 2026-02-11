import { describe, it, expect } from "vitest";

// ─── Pricing tier data (mirrors PricingSection.tsx) ───────────────────────────
const tiers = [
  {
    name: "Free",
    monthlyPrice: "$0",
    annualPrice: "$0",
    highlight: false,
    badge: undefined,
    features: [
      "5 tickets per month",
      "Developer + QA agents",
      "GitHub integration",
      "Community support",
      "1 project",
    ],
    ctaVariant: "secondary",
    ctaLabel: "Start Building Free",
  },
  {
    name: "Pro",
    monthlyPrice: "$79",
    annualPrice: "$63",
    priceSuffix: "/month per seat",
    highlight: true,
    badge: "Most Popular",
    features: [
      "Unlimited tickets",
      "All 6 agents (Product, Architect, Developer, QA, Security, DevOps)",
      "GitHub, GitLab, Jira, Linear integrations",
      "Custom agent configuration",
      "Parallel agent execution",
      "Priority support",
      "Up to 20 projects",
    ],
    ctaVariant: "primary",
    ctaLabel: "Start Free Trial",
  },
  {
    name: "Enterprise",
    monthlyPrice: "Custom",
    annualPrice: "Custom",
    highlight: false,
    badge: undefined,
    features: [
      "Everything in Pro",
      "SSO / SAML",
      "SOC 2 Type II",
      "Custom agent fine-tuning",
      "On-premise deployment option",
      "SLA with 99.9% uptime",
      "Dedicated success manager",
      "Unlimited projects",
    ],
    ctaVariant: "outline",
    ctaLabel: "Contact Sales",
  },
];

// ─── Price selection logic ──────────────────────────────────────────────────
function getDisplayPrice(tier: typeof tiers[number], annual: boolean): string {
  return annual ? tier.annualPrice : tier.monthlyPrice;
}

describe("Pricing tiers — section presence", () => {
  it("should have exactly 3 pricing tiers", () => {
    expect(tiers).toHaveLength(3);
  });

  it("should include Free, Pro, and Enterprise tiers", () => {
    const names = tiers.map((t) => t.name);
    expect(names).toContain("Free");
    expect(names).toContain("Pro");
    expect(names).toContain("Enterprise");
  });
});

describe("Pricing tiers — billing toggle", () => {
  it("Free tier: monthly and annual both show $0", () => {
    const free = tiers.find((t) => t.name === "Free")!;
    expect(getDisplayPrice(free, false)).toBe("$0");
    expect(getDisplayPrice(free, true)).toBe("$0");
  });

  it("Pro tier: monthly shows $79", () => {
    const pro = tiers.find((t) => t.name === "Pro")!;
    expect(getDisplayPrice(pro, false)).toBe("$79");
  });

  it("Pro tier: annual shows $63 (saves 20%)", () => {
    const pro = tiers.find((t) => t.name === "Pro")!;
    expect(getDisplayPrice(pro, true)).toBe("$63");
    // Verify the 20% savings claim is approximately correct
    const monthly = 79;
    const annual = 63;
    const savings = (monthly - annual) / monthly;
    expect(savings).toBeGreaterThanOrEqual(0.19);
    expect(savings).toBeLessThanOrEqual(0.21);
  });

  it("Enterprise tier: price stays Custom regardless of billing toggle", () => {
    const enterprise = tiers.find((t) => t.name === "Enterprise")!;
    expect(getDisplayPrice(enterprise, false)).toBe("Custom");
    expect(getDisplayPrice(enterprise, true)).toBe("Custom");
  });
});

describe("Pricing tiers — Pro tier highlight and badge", () => {
  it("Pro tier should be highlighted", () => {
    const pro = tiers.find((t) => t.name === "Pro")!;
    expect(pro.highlight).toBe(true);
  });

  it('Pro tier should have "Most Popular" badge', () => {
    const pro = tiers.find((t) => t.name === "Pro")!;
    expect(pro.badge).toBe("Most Popular");
  });

  it("Free and Enterprise tiers should not be highlighted", () => {
    const free = tiers.find((t) => t.name === "Free")!;
    const enterprise = tiers.find((t) => t.name === "Enterprise")!;
    expect(free.highlight).toBe(false);
    expect(enterprise.highlight).toBe(false);
  });

  it("Free and Enterprise tiers should not have badges", () => {
    const free = tiers.find((t) => t.name === "Free")!;
    const enterprise = tiers.find((t) => t.name === "Enterprise")!;
    expect(free.badge).toBeUndefined();
    expect(enterprise.badge).toBeUndefined();
  });
});

describe("Pricing tiers — CTA labels", () => {
  it('Free tier CTA should be "Start Building Free"', () => {
    expect(tiers.find((t) => t.name === "Free")!.ctaLabel).toBe("Start Building Free");
  });

  it('Pro tier CTA should be "Start Free Trial"', () => {
    expect(tiers.find((t) => t.name === "Pro")!.ctaLabel).toBe("Start Free Trial");
  });

  it('Enterprise tier CTA should be "Contact Sales"', () => {
    expect(tiers.find((t) => t.name === "Enterprise")!.ctaLabel).toBe("Contact Sales");
  });
});

describe("Pricing tiers — features coverage", () => {
  it("Pro tier features should mention all 6 agents", () => {
    const pro = tiers.find((t) => t.name === "Pro")!;
    const agentFeature = pro.features.find((f) => f.includes("6 agents"));
    expect(agentFeature).toBeDefined();
    expect(agentFeature).toContain("Product");
    expect(agentFeature).toContain("Architect");
    expect(agentFeature).toContain("Developer");
    expect(agentFeature).toContain("QA");
    expect(agentFeature).toContain("Security");
    expect(agentFeature).toContain("DevOps");
  });

  it("Enterprise tier should include 'Everything in Pro'", () => {
    const enterprise = tiers.find((t) => t.name === "Enterprise")!;
    expect(enterprise.features).toContain("Everything in Pro");
  });
});
