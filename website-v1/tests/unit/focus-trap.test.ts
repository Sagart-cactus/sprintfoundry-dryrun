/**
 * Tests for the mobile navigation focus trap added in this sprint.
 * Validates that SiteNav contains focus trap implementation for accessibility.
 */
import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";

const ROOT = resolve(__dirname, "../../");

function readSrc(relPath: string): string {
  return readFileSync(resolve(ROOT, relPath), "utf-8");
}

describe("SiteNav — mobile focus trap implementation", () => {
  const navSrc = readSrc("app/components/SiteNav.tsx");

  it("SiteNav has drawerRef for the mobile drawer", () => {
    expect(navSrc).toContain("drawerRef");
    expect(navSrc).toContain("useRef");
  });

  it("SiteNav has hamburgerRef to return focus on close", () => {
    expect(navSrc).toContain("hamburgerRef");
  });

  it("focus trap queries focusable elements inside the drawer", () => {
    expect(navSrc).toContain("querySelectorAll");
    expect(navSrc).toContain('a[href]');
    expect(navSrc).toContain('button');
  });

  it("focus trap handles Tab key to cycle forward", () => {
    expect(navSrc).toContain('"Tab"');
    expect(navSrc).toContain("e.shiftKey");
  });

  it("focus trap handles Shift+Tab to cycle backward", () => {
    expect(navSrc).toContain("shiftKey");
    expect(navSrc).toContain("last.focus");
  });

  it("focus trap focuses first element when drawer opens", () => {
    expect(navSrc).toContain("focusables[0]?.focus()");
  });

  it("focus trap returns focus to hamburger button on close", () => {
    expect(navSrc).toContain("hamburgerRef.current?.focus()");
  });

  it("wasOpenRef guard prevents premature focus return on page load", () => {
    expect(navSrc).toContain("wasOpenRef");
    expect(navSrc).toContain("wasOpenRef.current");
  });

  it("focus trap excludes aria-hidden elements from focusable set", () => {
    expect(navSrc).toContain("aria-hidden");
    expect(navSrc).toContain("closest");
  });

  it("Escape key closes the mobile drawer", () => {
    expect(navSrc).toContain('"Escape"');
    expect(navSrc).toContain("closeMobile");
  });

  it("clicking the overlay closes the mobile drawer", () => {
    // Overlay should have onClick={closeMobile}
    expect(navSrc).toContain("onClick={closeMobile}");
  });

  it("mobile drawer has role=dialog with aria-modal=true", () => {
    expect(navSrc).toContain('role="dialog"');
    expect(navSrc).toContain('aria-modal="true"');
  });

  it("mobile drawer has aria-label for screen readers", () => {
    expect(navSrc).toContain('aria-label="Navigation menu"');
  });
});
