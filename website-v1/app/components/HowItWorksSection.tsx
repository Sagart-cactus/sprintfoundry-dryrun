"use client";

import { useEffect, useRef, useState } from "react";
import { Ticket, Brain, Users2, GitPullRequest, type LucideIcon } from "lucide-react";

interface Step {
  number: string;
  title: string;
  description: string;
  Icon: LucideIcon;
  accent: string;
}

const steps: Step[] = [
  {
    number: "01",
    title: "Submit a Ticket",
    description:
      "Connect Jira, Linear, or GitHub Issues. SprintFoundry picks up your ticket the moment it's assigned.",
    Icon: Ticket,
    accent: "#6366F1",
  },
  {
    number: "02",
    title: "AI Orchestrator Plans",
    description:
      "Our orchestrator classifies the ticket and assembles the optimal sequence of agents — no over-engineering, no missing steps.",
    Icon: Brain,
    accent: "#7C3AED",
  },
  {
    number: "03",
    title: "Agents Collaborate",
    description:
      "Each agent completes its role in sequence or in parallel. Output from one feeds the next — specs inform design, design informs code.",
    Icon: Users2,
    accent: "#0EA5E9",
  },
  {
    number: "04",
    title: "PR Delivered",
    description:
      "A tested, reviewed pull request lands in your repo. Your engineers review and merge — or let the DevOps agent deploy it.",
    Icon: GitPullRequest,
    accent: "#10B981",
  },
];

export default function HowItWorksSection() {
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
      id="how-it-works"
      className="py-20 md:py-32"
      style={{ background: "#111318" }}
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
            The Process
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#F0F2F8] mb-4">
            From Ticket to PR, Automatically
          </h2>
          <p className="text-lg text-[#8B91A8] max-w-2xl mx-auto">
            SprintFoundry&apos;s orchestrator analyzes your ticket, assembles the right agents, and delivers
            tested, reviewed code — no manual handoffs.
          </p>
        </div>

        {/* Steps */}
        <ol className="relative">
          {/* Desktop connector line */}
          <div
            className="hidden lg:block absolute top-[52px] left-[12.5%] right-[12.5%] h-px"
            style={{ background: "linear-gradient(90deg, #6366F1, #7C3AED, #0EA5E9, #10B981)" }}
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <li
                key={step.number}
                className="relative"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(32px)",
                  transition: `opacity 600ms ${i * 150}ms cubic-bezier(0.16,1,0.3,1), transform 600ms ${i * 150}ms cubic-bezier(0.16,1,0.3,1)`,
                }}
              >
                {/* Mobile connector */}
                {i < steps.length - 1 && (
                  <div
                    className="lg:hidden absolute left-6 top-full w-px h-8 mt-1"
                    style={{ background: step.accent + "60" }}
                    aria-hidden="true"
                  />
                )}

                <div
                  className="bg-[#0A0B0E] border border-[#1F2330] rounded-2xl p-6 h-full flex flex-col lg:items-center lg:text-center transition-all duration-200 group hover:border-opacity-60"
                  style={{
                    ["--hover-border" as string]: step.accent,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = step.accent + "60";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "";
                  }}
                >
                  {/* Mobile left accent bar */}
                  <div
                    className="lg:hidden absolute left-0 top-6 bottom-6 w-1 rounded-full"
                    style={{ background: step.accent }}
                    aria-hidden="true"
                  />

                  {/* Step number */}
                  <span
                    className="text-5xl font-extrabold block mb-4 leading-none"
                    style={{ color: "#555C72", opacity: 0.4 }}
                    aria-hidden="true"
                  >
                    {step.number}
                  </span>

                  {/* Icon */}
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                    style={{ background: step.accent + "22" }}
                  >
                    <step.Icon size={20} color={step.accent} aria-hidden="true" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-semibold text-[#F0F2F8] mb-2">
                    <span className="sr-only">Step {i + 1}: </span>
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-[#8B91A8] leading-relaxed">{step.description}</p>
                </div>
              </li>
            ))}
          </div>
        </ol>
      </div>
    </section>
  );
}
