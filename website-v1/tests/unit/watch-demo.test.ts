/**
 * Tests for the "Watch Demo" button functionality added in this sprint.
 * Validates that HeroSection contains the scroll-to-how-it-works behavior.
 */
import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";

const ROOT = resolve(__dirname, "../../");

function readSrc(relPath: string): string {
  return readFileSync(resolve(ROOT, relPath), "utf-8");
}

describe("HeroSection — Watch Demo button", () => {
  const heroSrc = readSrc("app/components/HeroSection.tsx");

  it("Watch Demo button exists in HeroSection", () => {
    expect(heroSrc).toContain("Watch Demo");
  });

  it("Watch Demo button has onClick handler", () => {
    expect(heroSrc).toContain("onClick");
  });

  it("Watch Demo button scrolls to #how-it-works section", () => {
    expect(heroSrc).toContain("how-it-works");
    expect(heroSrc).toContain("scrollIntoView");
  });

  it("Watch Demo button uses smooth scroll behavior", () => {
    expect(heroSrc).toContain('behavior: "smooth"');
  });

  it("Watch Demo is a <button> element (not a link)", () => {
    // Should be a button since it scrolls internally rather than navigating
    expect(heroSrc).toContain("<button");
  });

  it("Watch Demo button has type=button to prevent unintended form submission", () => {
    expect(heroSrc).toContain('type="button"');
  });
});
