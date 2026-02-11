"use client";

import { CheckCircle2, type LucideIcon } from "lucide-react";

export interface AgentFeatureCardProps {
  id: string;
  name: string;
  accent: string;
  Icon: LucideIcon;
  tagline: string;
  capabilities: string[];
  animationDelay?: number;
}

export default function AgentFeatureCard({
  name,
  accent,
  Icon,
  tagline,
  capabilities,
  animationDelay = 0,
}: AgentFeatureCardProps) {
  return (
    <div
      className="relative rounded-2xl border border-[#2D3245] bg-[#111318] p-6 flex flex-col transition-all duration-200 hover:-translate-y-1 group"
      style={{
        animationDelay: `${animationDelay}ms`,
        borderTopColor: accent,
        borderTopWidth: 3,
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.borderColor = accent + "80";
        el.style.boxShadow = `0 0 30px ${accent}20`;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.borderColor = "";
        el.style.boxShadow = "";
        el.style.borderTopColor = accent;
        el.style.borderTopWidth = "3px";
      }}
    >
      {/* Icon container */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: accent + "22" }}
      >
        <Icon size={24} color={accent} aria-hidden="true" />
      </div>

      {/* Name */}
      <h3 className="text-xl font-semibold text-[#F0F2F8] mt-4">{name}</h3>

      {/* Tagline */}
      <p className="text-sm text-[#8B91A8] mt-1 mb-4">{tagline}</p>

      {/* Divider */}
      <hr className="border-[#1F2330]" />

      {/* Capabilities */}
      <ul className="mt-4 space-y-2 flex-1">
        {capabilities.map((cap) => (
          <li key={cap} className="flex items-start gap-2">
            <CheckCircle2
              size={12}
              color={accent}
              className="mt-1 shrink-0"
              aria-hidden="true"
            />
            <span className="text-sm text-[#8B91A8]">{cap}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
