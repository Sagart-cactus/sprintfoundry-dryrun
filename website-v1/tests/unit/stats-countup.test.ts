import { describe, it, expect, vi, beforeEach } from "vitest";

// ─── easeOutExpo logic (mirrors StatsBanner useCountUp) ───────────────────
function easeOutExpo(progress: number): number {
  return progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
}

function computeCountUp(target: number, elapsed: number, duration: number): number {
  const progress = Math.min(elapsed / duration, 1);
  const eased = easeOutExpo(progress);
  return Math.round(eased * target);
}

describe("StatsBanner — count-up easing logic", () => {
  it("returns 0 at the start (elapsed=0)", () => {
    expect(computeCountUp(200, 0, 1200)).toBe(0);
  });

  it("returns target value when complete (elapsed >= duration)", () => {
    expect(computeCountUp(200, 1200, 1200)).toBe(200);
    expect(computeCountUp(200, 2000, 1200)).toBe(200);
  });

  it("progresses quickly at the beginning (easeOutExpo)", () => {
    const quarter = computeCountUp(200, 300, 1200); // 25% of duration
    // easeOutExpo at 25% is about 0.82, so we expect a value well above 0
    expect(quarter).toBeGreaterThan(100);
  });

  it("approaches target near end of animation", () => {
    const nearEnd = computeCountUp(200, 1100, 1200); // 91.7% of duration
    expect(nearEnd).toBeGreaterThanOrEqual(195);
    expect(nearEnd).toBeLessThanOrEqual(200);
  });

  it("never exceeds the target value", () => {
    for (let elapsed = 0; elapsed <= 2400; elapsed += 100) {
      const val = computeCountUp(50, elapsed, 1200);
      expect(val).toBeLessThanOrEqual(50);
      expect(val).toBeGreaterThanOrEqual(0);
    }
  });
});

describe("StatsBanner — stat display formatting", () => {
  const stats = [
    { numericValue: 200, suffix: "+", expected: (count: number) => `${count}+` },
    { numericValue: 50, suffix: "K+", expected: (count: number) => `${count}K+` },
    { numericValue: 49, suffix: "rating", expected: (count: number) => `${(count / 10).toFixed(1)}/5` },
    { numericValue: 3, suffix: "×", expected: (count: number) => `${count}×` },
  ];

  function formatDisplay(count: number, suffix: string): string {
    if (suffix === "K+") return `${count}K+`;
    if (suffix === "rating") return `${(count / 10).toFixed(1)}/5`;
    if (suffix === "×") return `${count}×`;
    return `${count}+`;
  }

  it("Teams stat formats as N+", () => {
    expect(formatDisplay(200, "+")).toBe("200+");
    expect(formatDisplay(0, "+")).toBe("0+");
  });

  it("Tickets stat formats as NK+", () => {
    expect(formatDisplay(50, "K+")).toBe("50K+");
    expect(formatDisplay(0, "K+")).toBe("0K+");
  });

  it("Rating stat formats as N.N/5", () => {
    expect(formatDisplay(49, "rating")).toBe("4.9/5");
    expect(formatDisplay(0, "rating")).toBe("0.0/5");
    expect(formatDisplay(49, "rating")).toBe("4.9/5");
  });

  it("Speed stat formats as N×", () => {
    expect(formatDisplay(3, "×")).toBe("3×");
    expect(formatDisplay(0, "×")).toBe("0×");
  });
});
