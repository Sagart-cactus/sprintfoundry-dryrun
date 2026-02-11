"use client";

import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";

interface PricingTier {
  name: string;
  monthlyPrice: string;
  annualPrice: string;
  priceSuffix?: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  ctaVariant: "primary" | "secondary" | "outline";
  highlight: boolean;
  badge?: string;
  features: string[];
}

const tiers: PricingTier[] = [
  {
    name: "Free",
    monthlyPrice: "$0",
    annualPrice: "$0",
    description: "For individuals exploring AI-assisted development.",
    ctaLabel: "Start Building Free",
    ctaHref: "/signup",
    ctaVariant: "secondary",
    highlight: false,
    features: [
      "5 tickets per month",
      "Developer + QA agents",
      "GitHub integration",
      "Community support",
      "1 project",
    ],
  },
  {
    name: "Pro",
    monthlyPrice: "$79",
    annualPrice: "$63",
    priceSuffix: "/month per seat",
    description: "For engineering teams shipping production features.",
    ctaLabel: "Start Free Trial",
    ctaHref: "/signup?plan=pro",
    ctaVariant: "primary",
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
  },
  {
    name: "Enterprise",
    monthlyPrice: "Custom",
    annualPrice: "Custom",
    description: "For organizations needing compliance, SSO, and dedicated support.",
    ctaLabel: "Contact Sales",
    ctaHref: "/contact",
    ctaVariant: "outline",
    highlight: false,
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
  },
];

export default function PricingSection() {
  const [annual, setAnnual] = useState(false);
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
      id="pricing"
      className="py-20 md:py-32"
      style={{ background: "#0A0B0E" }}
      ref={ref}
    >
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        {/* Section header */}
        <div
          className="text-center mb-12"
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
            Pricing
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#F0F2F8] mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-[#8B91A8] max-w-xl mx-auto mb-8">
            Start free. Scale as your team grows. No surprises.
          </p>

          {/* Billing toggle */}
          <div
            role="group"
            aria-label="Billing period"
            className="inline-flex items-center gap-1 p-1 rounded-lg bg-[#111318] border border-[#1F2330]"
          >
            <button
              type="button"
              aria-pressed={!annual}
              onClick={() => setAnnual(false)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-150 ${
                !annual
                  ? "bg-[#1A1D25] text-[#F0F2F8]"
                  : "text-[#8B91A8] hover:text-[#F0F2F8]"
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              aria-pressed={annual}
              onClick={() => setAnnual(true)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-150 flex items-center gap-2 ${
                annual
                  ? "bg-[#1A1D25] text-[#F0F2F8]"
                  : "text-[#8B91A8] hover:text-[#F0F2F8]"
              }`}
            >
              Annual
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{ background: "#10B98122", color: "#10B981" }}
              >
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {tiers.map((tier, i) => (
            <div
              key={tier.name}
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(32px)",
                transition: `opacity 600ms ${i * 100}ms cubic-bezier(0.16,1,0.3,1), transform 600ms ${i * 100}ms cubic-bezier(0.16,1,0.3,1)`,
              }}
            >
              <PricingCard tier={tier} annual={annual} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingCard({ tier, annual }: { tier: PricingTier; annual: boolean }) {
  const price = annual ? tier.annualPrice : tier.monthlyPrice;
  const isCustom = price === "Custom";

  return (
    <article
      aria-label={`${tier.name} plan`}
      className="relative rounded-2xl border flex flex-col p-8 h-full transition-all duration-150 hover:-translate-y-0.5"
      style={{
        background: tier.highlight ? "#1A1D25" : "#111318",
        borderColor: tier.highlight ? "#6366F1" : "#2D3245",
        boxShadow: tier.highlight ? "0 0 40px rgba(99,102,241,0.2)" : "none",
      }}
      onMouseEnter={(e) => {
        if (!tier.highlight) e.currentTarget.style.borderColor = "#3D4460";
      }}
      onMouseLeave={(e) => {
        if (!tier.highlight) e.currentTarget.style.borderColor = "#2D3245";
      }}
    >
      {/* Most popular badge */}
      {tier.badge && (
        <div
          className="absolute -top-3 right-6 text-xs font-semibold px-3 py-1 rounded-full text-white"
          style={{ background: "#6366F1" }}
        >
          {tier.badge}
        </div>
      )}

      {/* Tier name */}
      <p className="text-lg font-semibold text-[#F0F2F8]">{tier.name}</p>

      {/* Price */}
      <div className="mt-4 flex items-end gap-1">
        <span
          className="font-extrabold text-[#F0F2F8]"
          style={{ fontSize: isCustom ? "2rem" : "2.5rem", lineHeight: 1 }}
          aria-label={
            isCustom
              ? "Custom pricing"
              : `${price} ${tier.priceSuffix ?? "per month"}`
          }
        >
          {price}
        </span>
        {tier.priceSuffix && !isCustom && (
          <span className="text-sm text-[#8B91A8] mb-1">{tier.priceSuffix}</span>
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-[#8B91A8] mt-2 mb-6">{tier.description}</p>

      {/* CTA */}
      <a
        href={tier.ctaHref}
        aria-label={`${tier.ctaLabel} for ${tier.name} plan`}
        className={`block w-full text-center py-3 rounded-lg font-semibold text-sm transition-all duration-150 ${
          tier.ctaVariant === "primary"
            ? "bg-[#6366F1] text-white hover:bg-[#818CF8]"
            : tier.ctaVariant === "secondary"
            ? "bg-[#1A1D25] text-[#F0F2F8] border border-[#2D3245] hover:border-[#3D4460] hover:bg-[#242836]"
            : "border border-[#2D3245] text-[#8B91A8] hover:text-[#F0F2F8] hover:border-[#3D4460]"
        }`}
      >
        {tier.ctaLabel}
      </a>

      {/* Divider */}
      <hr className="border-[#1F2330] my-6" />

      {/* Features */}
      <ul className="space-y-3 flex-1">
        {tier.features.map((feature) => (
          <li key={feature} className="flex items-start gap-3">
            <Check
              size={16}
              className="mt-0.5 shrink-0"
              style={{ color: tier.highlight ? "#6366F1" : "#10B981" }}
              aria-hidden="true"
            />
            <span className="text-sm text-[#8B91A8]">{feature}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
