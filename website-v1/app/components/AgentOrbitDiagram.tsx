"use client";

import { useEffect, useRef, useState } from "react";
import {
  Lightbulb,
  GitBranch,
  Code2,
  CheckCircle2,
  Shield,
  Rocket,
  Zap,
  type LucideIcon,
} from "lucide-react";

interface AgentNode {
  id: string;
  name: string;
  accent: string;
  Icon: LucideIcon;
  angle: number; // degrees from top, clockwise
}

const AGENTS: AgentNode[] = [
  { id: "product",    name: "Product",    accent: "#7C3AED", Icon: Lightbulb,    angle: 0   },
  { id: "architect",  name: "Architect",  accent: "#0EA5E9", Icon: GitBranch,    angle: 60  },
  { id: "developer",  name: "Developer",  accent: "#10B981", Icon: Code2,        angle: 120 },
  { id: "qa",         name: "QA",         accent: "#F59E0B", Icon: CheckCircle2, angle: 180 },
  { id: "security",   name: "Security",   accent: "#EF4444", Icon: Shield,       angle: 240 },
  { id: "devops",     name: "DevOps",     accent: "#EC4899", Icon: Rocket,       angle: 300 },
];

const SIZE = 480;
const CENTER = SIZE / 2;
const ORBIT_R = 160;
const NODE_R = 36;

function degToRad(deg: number) {
  return ((deg - 90) * Math.PI) / 180;
}

function getNodePos(angle: number) {
  const rad = degToRad(angle);
  return {
    x: CENTER + ORBIT_R * Math.cos(rad),
    y: CENTER + ORBIT_R * Math.sin(rad),
  };
}

interface AgentOrbitDiagramProps {
  className?: string;
}

export default function AgentOrbitDiagram({ className = "" }: AgentOrbitDiagramProps) {
  const [hoveredAgent, setHoveredAgent] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const stepRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (prefersReduced) return;
    timerRef.current = setInterval(() => {
      stepRef.current = (stepRef.current + 1) % (AGENTS.length + 2);
      setActiveStep(stepRef.current);
    }, 700);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [prefersReduced]);

  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      role="img"
      aria-label="Animated diagram showing AI agents: Product, Architecture, Developer, QA, Security, and DevOps collaborating on a software ticket"
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, rgba(99,102,241,0.08) 0%, transparent 70%)",
        }}
      />

      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        width={SIZE}
        height={SIZE}
        className="w-full h-full max-w-[480px]"
        aria-hidden="true"
      >
        {/* Orbit ring */}
        <circle
          cx={CENTER}
          cy={CENTER}
          r={ORBIT_R}
          fill="none"
          stroke="#1F2330"
          strokeWidth={1}
          strokeDasharray="4 8"
        />

        {/* Connection lines from hub to agents */}
        {AGENTS.map((agent, i) => {
          const pos = getNodePos(agent.angle);
          const isActive = !prefersReduced && activeStep === i + 1;
          return (
            <line
              key={agent.id}
              x1={CENTER}
              y1={CENTER}
              x2={pos.x}
              y2={pos.y}
              stroke={agent.accent}
              strokeWidth={isActive ? 2 : 1}
              strokeOpacity={isActive ? 0.8 : 0.2}
              strokeDasharray={isActive ? "none" : "4 6"}
              style={{
                transition: "stroke-opacity 0.3s, stroke-width 0.3s",
              }}
            />
          );
        })}

        {/* Agent nodes */}
        {AGENTS.map((agent, i) => {
          const pos = getNodePos(agent.angle);
          const isHovered = hoveredAgent === agent.id;
          const isActive = !prefersReduced && activeStep === i + 1;
          const AgentIcon = agent.Icon;

          return (
            <g
              key={agent.id}
              transform={`translate(${pos.x}, ${pos.y})`}
              onMouseEnter={() => setHoveredAgent(agent.id)}
              onMouseLeave={() => setHoveredAgent(null)}
              style={{ cursor: "default" }}
              aria-hidden="true"
            >
              {/* Glow ring */}
              <circle
                cx={0}
                cy={0}
                r={NODE_R + 6}
                fill="none"
                stroke={agent.accent}
                strokeWidth={1.5}
                strokeOpacity={isActive || isHovered ? 0.6 : 0.15}
                style={{ transition: "stroke-opacity 0.3s" }}
              />

              {/* Node background */}
              <rect
                x={-NODE_R}
                y={-NODE_R}
                width={NODE_R * 2}
                height={NODE_R * 2}
                rx={12}
                fill={agent.accent + "22"}
                stroke={agent.accent}
                strokeWidth={isActive || isHovered ? 2 : 1}
                strokeOpacity={isActive || isHovered ? 0.9 : 0.4}
                style={{ transition: "stroke-opacity 0.3s, stroke-width 0.3s" }}
              />

              {/* Icon (as SVG foreignObject) - using unicode replacements */}
              <text
                x={0}
                y={6}
                textAnchor="middle"
                fontSize={22}
                fill={agent.accent}
                style={{ userSelect: "none" }}
              >
                {agent.id === "product" ? "💡" :
                 agent.id === "architect" ? "🔀" :
                 agent.id === "developer" ? "⌨" :
                 agent.id === "qa" ? "✓" :
                 agent.id === "security" ? "🛡" : "🚀"}
              </text>

              {/* Agent name label */}
              <text
                x={0}
                y={NODE_R + 16}
                textAnchor="middle"
                fontSize={10}
                fill={isActive ? agent.accent : "#8B91A8"}
                fontFamily="Inter, system-ui, sans-serif"
                style={{ transition: "fill 0.3s" }}
              >
                {agent.name}
              </text>

              {/* Tooltip */}
              {isHovered && (
                <g>
                  <rect
                    x={-50}
                    y={-NODE_R - 34}
                    width={100}
                    height={22}
                    rx={4}
                    fill="#1A1D25"
                    stroke="#2D3245"
                    strokeWidth={1}
                  />
                  <text
                    x={0}
                    y={-NODE_R - 18}
                    textAnchor="middle"
                    fontSize={9}
                    fill="#F0F2F8"
                    fontFamily="Inter, system-ui, sans-serif"
                  >
                    {agent.name} Agent
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* Central hub */}
        <g transform={`translate(${CENTER}, ${CENTER})`} aria-hidden="true">
          {/* Hub glow */}
          <circle
            cx={0}
            cy={0}
            r={50}
            fill="rgba(99,102,241,0.08)"
            style={{
              animation: prefersReduced ? "none" : "pulse-glow 2s ease-in-out infinite",
            }}
          />
          {/* Hub circle */}
          <circle
            cx={0}
            cy={0}
            r={38}
            fill="#1A1D25"
            stroke="#6366F1"
            strokeWidth={2}
          />
          {/* SF monogram */}
          <text
            x={0}
            y={5}
            textAnchor="middle"
            fontSize={16}
            fontWeight={700}
            fill="#6366F1"
            fontFamily="Inter, system-ui, sans-serif"
          >
            SF
          </text>
        </g>

        {/* Ticket token */}
        {!prefersReduced && activeStep === 0 && (
          <g transform={`translate(${CENTER - 60}, ${CENTER - 80})`}>
            <rect
              x={-28}
              y={-16}
              width={56}
              height={32}
              rx={6}
              fill="#1A1D25"
              stroke="#6366F1"
              strokeWidth={1.5}
            />
            <text
              x={0}
              y={5}
              textAnchor="middle"
              fontSize={9}
              fill="#818CF8"
              fontFamily="Inter, system-ui, sans-serif"
            >
              TICKET
            </text>
          </g>
        )}

        {/* PR token */}
        {!prefersReduced && activeStep >= AGENTS.length + 1 && (
          <g transform={`translate(${CENTER + 70}, ${CENTER + 70})`}>
            <rect
              x={-24}
              y={-16}
              width={48}
              height={32}
              rx={6}
              fill="#071A14"
              stroke="#10B981"
              strokeWidth={1.5}
            />
            <text
              x={0}
              y={5}
              textAnchor="middle"
              fontSize={9}
              fill="#10B981"
              fontFamily="Inter, system-ui, sans-serif"
            >
              PR #42
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}
