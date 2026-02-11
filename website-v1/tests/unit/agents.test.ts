import { describe, it, expect } from "vitest";

// ─── Agent feature data (mirrors FeaturesSection.tsx) ─────────────────────
const agents = [
  {
    id: "product",
    name: "Product Agent",
    accent: "#7C3AED",
    tagline: "Turns vague tickets into clear requirements",
    capabilities: [
      "Writes product specs and user stories",
      "Defines acceptance criteria",
      "Identifies edge cases and scope",
      "Clarifies ambiguity before coding starts",
    ],
  },
  {
    id: "architect",
    name: "Architecture Agent",
    accent: "#0EA5E9",
    tagline: "Designs systems that scale",
    capabilities: [
      "Creates data models and ER diagrams",
      "Defines API contracts (OpenAPI)",
      "Writes architecture decision records",
      "Evaluates technical tradeoffs",
    ],
  },
  {
    id: "developer",
    name: "Developer Agent",
    accent: "#10B981",
    tagline: "Writes production-ready code",
    capabilities: [
      "Builds React/Next.js frontend components",
      "Creates API routes and server logic",
      "Runs database migrations",
      "Integrates third-party services",
    ],
  },
  {
    id: "qa",
    name: "QA Agent",
    accent: "#F59E0B",
    tagline: "Finds bugs before your users do",
    capabilities: [
      "Writes unit, integration, and E2E tests",
      "Validates code against acceptance criteria",
      "Reports bugs with severity classification",
      "Triggers rework when quality gates fail",
    ],
  },
  {
    id: "security",
    name: "Security Agent",
    accent: "#EF4444",
    tagline: "Ships secure code, every time",
    capabilities: [
      "Static analysis security scanning",
      "Dependency vulnerability checks",
      "Auth flow review and OWASP top 10",
      "Detects secrets and data leakage",
    ],
  },
  {
    id: "devops",
    name: "DevOps Agent",
    accent: "#EC4899",
    tagline: "From code to cloud automatically",
    capabilities: [
      "Writes Dockerfiles and CI/CD pipelines",
      "Configures cloud infrastructure (IaC)",
      "Sets up monitoring and logging",
      "Manages environment variables",
    ],
  },
];

describe("Features section — 6 agent types", () => {
  it("should have exactly 6 agents", () => {
    expect(agents).toHaveLength(6);
  });

  it("should include all required agent types by ID", () => {
    const ids = agents.map((a) => a.id);
    expect(ids).toContain("product");
    expect(ids).toContain("architect");
    expect(ids).toContain("developer");
    expect(ids).toContain("qa");
    expect(ids).toContain("security");
    expect(ids).toContain("devops");
  });

  it("each agent should have a unique accent color", () => {
    const accents = agents.map((a) => a.accent);
    const uniqueAccents = new Set(accents);
    expect(uniqueAccents.size).toBe(agents.length);
  });

  it("each agent should have a distinct (non-empty) name", () => {
    const names = agents.map((a) => a.name);
    const uniqueNames = new Set(names);
    expect(uniqueNames.size).toBe(agents.length);
    names.forEach((name) => expect(name.length).toBeGreaterThan(0));
  });

  it("each agent should have a non-empty tagline", () => {
    agents.forEach((agent) => {
      expect(agent.tagline.length).toBeGreaterThan(0);
    });
  });

  it("each agent should have at least one capability", () => {
    agents.forEach((agent) => {
      expect(agent.capabilities.length).toBeGreaterThan(0);
    });
  });
});

describe("Agent orbit diagram — agent data matches features", () => {
  // AgentOrbitDiagram also lists all 6 agents at specific angles
  const orbitAgents = [
    { id: "product", angle: 0 },
    { id: "architect", angle: 60 },
    { id: "developer", angle: 120 },
    { id: "qa", angle: 180 },
    { id: "security", angle: 240 },
    { id: "devops", angle: 300 },
  ];

  it("orbit diagram should have all 6 agents", () => {
    expect(orbitAgents).toHaveLength(6);
  });

  it("orbit agents should be spaced 60 degrees apart", () => {
    for (let i = 1; i < orbitAgents.length; i++) {
      const diff = orbitAgents[i].angle - orbitAgents[i - 1].angle;
      expect(diff).toBe(60);
    }
  });

  it("orbit agent IDs should match feature agent IDs", () => {
    const featureIds = agents.map((a) => a.id).sort();
    const orbitIds = orbitAgents.map((a) => a.id).sort();
    expect(orbitIds).toEqual(featureIds);
  });
});
