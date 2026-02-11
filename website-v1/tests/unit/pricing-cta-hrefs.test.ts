/**
 * US-3: Pricing CTA href validation
 * Verifies that each pricing tier CTA links to the correct destination per product spec.
 */
import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";

// Parse the PricingSection source to extract ctaHref values statically
// This avoids JSDOM rendering issues with Next.js "use client" components
const source = readFileSync(
  resolve(__dirname, "../../app/components/PricingSection.tsx"),
  "utf-8"
);

// Extract tiers array block from source
function extractCtaHrefs(src: string): Record<string, string> {
  const result: Record<string, string> = {};
  // Match each tier block: name followed eventually by ctaHref
  const tierBlocks = src.matchAll(
    /name:\s*"([^"]+)"[\s\S]*?ctaHref:\s*"([^"]+)"/g
  );
  for (const match of tierBlocks) {
    result[match[1]] = match[2];
  }
  return result;
}

describe("Pricing CTA hrefs (US-3)", () => {
  const hrefs = extractCtaHrefs(source);

  it("Free tier CTA should link to /signup", () => {
    expect(hrefs["Free"]).toBe("/signup");
  });

  it("Pro tier CTA should link to /signup?plan=pro", () => {
    expect(hrefs["Pro"]).toBe("/signup?plan=pro");
  });

  it("Enterprise tier CTA should link to /contact", () => {
    expect(hrefs["Enterprise"]).toBe("/contact");
  });

  it("No CTA should use the placeholder href '#'", () => {
    const hasPlaceholder = Object.values(hrefs).some((href) => href === "#");
    expect(hasPlaceholder).toBe(false);
  });
});
