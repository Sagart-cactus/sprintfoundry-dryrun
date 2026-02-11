"use client";

import { useEffect, useRef, useState } from "react";

interface Stat {
  value: string;
  numericValue: number;
  suffix: string;
  label: string;
  ariaLabel: string;
}

const stats: Stat[] = [
  { value: "200+", numericValue: 200, suffix: "+", label: "Teams", ariaLabel: "Over 200 teams" },
  {
    value: "50K+",
    numericValue: 50,
    suffix: "K+",
    label: "Tickets Automated",
    ariaLabel: "Over 50,000 tickets automated",
  },
  {
    value: "4.9/5",
    numericValue: 49,
    suffix: "rating",
    label: "Developer Rating",
    ariaLabel: "4.9 out of 5 developer rating",
  },
  {
    value: "3×",
    numericValue: 3,
    suffix: "×",
    label: "Faster Ship Time",
    ariaLabel: "3 times faster ship time",
  },
];

function useCountUp(target: number, active: boolean, duration = 1200) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    let raf: number;

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCurrent(Math.round(eased * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active, duration]);

  return current;
}

function StatItem({ stat, active }: { stat: Stat; active: boolean }) {
  const count = useCountUp(stat.numericValue, active);

  const display =
    stat.suffix === "K+"
      ? `${count}K+`
      : stat.suffix === "rating"
      ? `${(count / 10).toFixed(1)}/5`
      : stat.suffix === "×"
      ? `${count}×`
      : `${count}+`;

  return (
    <div className="flex flex-col items-center">
      <span
        className="text-2xl font-bold text-[#F0F2F8]"
        aria-label={stat.ariaLabel}
      >
        {active ? display : stat.value}
      </span>
      <span className="text-sm text-[#8B91A8] mt-1">{stat.label}</span>
    </div>
  );
}

export default function StatsBanner() {
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setActive(true);
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      aria-label="SprintFoundry by the numbers"
      className="border-y border-[#1F2330] py-8"
      style={{ background: "#111318" }}
    >
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={stat.label} className="relative">
              {i > 0 && (
                <div
                  className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 w-px h-8 bg-[#1F2330]"
                  aria-hidden="true"
                />
              )}
              <StatItem stat={stat} active={active} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
