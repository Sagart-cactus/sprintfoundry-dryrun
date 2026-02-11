"use client";

import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";
import AgentOrbitDiagram from "./AgentOrbitDiagram";

export default function HeroSection() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ paddingTop: "80px", paddingBottom: "80px" }}
    >
      {/* Background gradient blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div
          className="absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle, #6366F1 0%, #7C3AED 40%, transparent 70%)",
            filter: "blur(80px)",
            animation: "blob-drift 8s ease-in-out infinite",
          }}
        />
        <div
          className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] rounded-full opacity-10"
          style={{
            background:
              "radial-gradient(circle, #0EA5E9 0%, transparent 70%)",
            filter: "blur(60px)",
            animation: "blob-drift 10s ease-in-out infinite reverse",
          }}
        />
      </div>

      <div className="max-w-[1280px] mx-auto px-6 md:px-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] xl:grid-cols-[1fr_480px] gap-12 lg:gap-16 items-center">
          {/* Left: text content */}
          <div ref={ref} className="relative z-10">
            {/* Eyebrow badge */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold uppercase tracking-widest mb-6"
              style={{
                background: "#111827",
                borderColor: "rgba(99,102,241,0.3)",
                color: "#818CF8",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(16px)",
                transition: "opacity 600ms cubic-bezier(0.16,1,0.3,1), transform 600ms cubic-bezier(0.16,1,0.3,1)",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full bg-[#6366F1]"
                style={{ animation: "pulse-glow 2s ease-in-out infinite" }}
              />
              AI-Powered Engineering
            </div>

            {/* Headline */}
            <h1
              className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6"
              style={{
                background: "linear-gradient(135deg, #F0F2F8 0%, #818CF8 50%, #7C3AED 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(24px)",
                transition: "opacity 600ms 100ms cubic-bezier(0.16,1,0.3,1), transform 600ms 100ms cubic-bezier(0.16,1,0.3,1)",
              }}
            >
              Your AI Engineering
              <br />
              Team, On Demand
            </h1>

            {/* Sub-copy */}
            <p
              className="text-lg md:text-xl max-w-2xl mb-10"
              style={{
                color: "#8B91A8",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(24px)",
                transition: "opacity 600ms 200ms cubic-bezier(0.16,1,0.3,1), transform 600ms 200ms cubic-bezier(0.16,1,0.3,1)",
              }}
            >
              SprintFoundry orchestrates specialized AI agents — from product spec to tested PR —
              so your team ships faster without bottlenecks.
            </p>

            {/* CTAs */}
            <div
              className="flex flex-col sm:flex-row gap-4"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(24px)",
                transition: "opacity 600ms 350ms cubic-bezier(0.16,1,0.3,1), transform 600ms 350ms cubic-bezier(0.16,1,0.3,1)",
              }}
            >
              <a
                href="#pricing"
                className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-[#6366F1] text-white font-semibold text-base transition-all duration-150 hover:bg-[#818CF8] hover:-translate-y-px active:bg-[#4F46E5] active:translate-y-0 shadow-lg"
                style={{ boxShadow: "0 0 40px rgba(99,102,241,0.25)" }}
              >
                Start Building Free
              </a>
              <button
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg border border-[#2D3245] text-[#8B91A8] font-semibold text-base bg-transparent transition-all duration-150 hover:border-[#3D4460] hover:text-[#F0F2F8] hover:bg-[#242836]"
                type="button"
                onClick={() => {
                  document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <Play size={16} aria-hidden="true" />
                Watch Demo
              </button>
            </div>

            {/* Social proof micro-stats */}
            <div
              className="flex flex-wrap items-center gap-6 mt-10 pt-8 border-t border-[#1F2330]"
              style={{
                opacity: visible ? 1 : 0,
                transition: "opacity 600ms 500ms cubic-bezier(0.16,1,0.3,1)",
              }}
            >
              {[
                { value: "200+", label: "Teams using SprintFoundry" },
                { value: "50K+", label: "Tickets automated" },
                { value: "3×", label: "Faster ship time" },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col">
                  <span className="text-2xl font-bold text-[#F0F2F8]">{stat.value}</span>
                  <span className="text-sm text-[#555C72]">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: diagram */}
          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(32px)",
              transition: "opacity 800ms 500ms cubic-bezier(0.16,1,0.3,1), transform 800ms 500ms cubic-bezier(0.16,1,0.3,1)",
            }}
            className="flex justify-center lg:justify-end"
          >
            <AgentOrbitDiagram className="w-full max-w-[420px] lg:max-w-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
