"use client";

import { useEffect, useRef, useState } from "react";
import {
  Lightbulb,
  GitBranch,
  Code2,
  CheckCircle2,
  Shield,
  Rocket,
} from "lucide-react";
import AgentFeatureCard, { type AgentFeatureCardProps } from "./AgentFeatureCard";

const agents: AgentFeatureCardProps[] = [
  {
    id: "product",
    name: "Product Agent",
    accent: "#7C3AED",
    Icon: Lightbulb,
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
    Icon: GitBranch,
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
    Icon: Code2,
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
    Icon: CheckCircle2,
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
    Icon: Shield,
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
    Icon: Rocket,
    tagline: "From code to cloud automatically",
    capabilities: [
      "Writes Dockerfiles and CI/CD pipelines",
      "Configures cloud infrastructure (IaC)",
      "Sets up monitoring and logging",
      "Manages environment variables",
    ],
  },
];

export default function FeaturesSection() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="features"
      className="py-20 md:py-32"
      style={{ background: "#0A0B0E" }}
      ref={ref}
    >
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        {/* Section header */}
        <div
          className="text-center mb-16"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 600ms cubic-bezier(0.16,1,0.3,1), transform 600ms cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <div
            className="inline-flex items-center px-3 py-1 rounded-full border text-xs font-semibold uppercase tracking-widest mb-4"
            style={{
              background: "#111827",
              borderColor: "rgba(99,102,241,0.3)",
              color: "#818CF8",
            }}
          >
            The Team
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#F0F2F8] mb-4">
            Six Specialists. One Unified Platform.
          </h2>
          <p className="text-lg text-[#8B91A8] max-w-2xl mx-auto">
            Each agent is purpose-built for its role, trained on domain knowledge, and works in
            concert with the others.
          </p>
        </div>

        {/* Agent cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {agents.map((agent, i) => (
            <div
              key={agent.id}
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(32px)",
                transition: `opacity 600ms ${i * 100}ms cubic-bezier(0.16,1,0.3,1), transform 600ms ${i * 100}ms cubic-bezier(0.16,1,0.3,1)`,
              }}
            >
              <AgentFeatureCard {...agent} animationDelay={i * 100} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
