"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Menu, X, Zap } from "lucide-react";

type ActiveSection = "hero" | "features" | "how-it-works" | "pricing";

const navLinks = [
  { label: "Features", href: "#features", section: "features" as ActiveSection },
  { label: "How It Works", href: "#how-it-works", section: "how-it-works" as ActiveSection },
  { label: "Pricing", href: "#pricing", section: "pricing" as ActiveSection },
  { label: "Docs", href: "#", external: true },
];

export default function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<ActiveSection>("hero");
  const drawerRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sectionIds: ActiveSection[] = ["hero", "features", "how-it-works", "pricing"];
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { threshold: 0.3 }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMobile();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [closeMobile]);

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // Focus trap: when drawer opens, move focus inside; constrain Tab/Shift+Tab within drawer;
  // when drawer closes, return focus to the hamburger button.
  const wasOpenRef = useRef(false);
  useEffect(() => {
    if (!mobileOpen) {
      if (wasOpenRef.current) {
        hamburgerRef.current?.focus();
      }
      wasOpenRef.current = false;
      return;
    }

    wasOpenRef.current = true;
    const drawer = drawerRef.current;
    if (!drawer) return;

    const focusableSelectors =
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

    const getFocusable = () =>
      Array.from(drawer.querySelectorAll<HTMLElement>(focusableSelectors)).filter(
        (el) => !el.closest("[aria-hidden='true']")
      );

    const focusables = getFocusable();
    focusables[0]?.focus();

    const onTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const elements = getFocusable();
      if (elements.length === 0) return;
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onTab);
    return () => document.removeEventListener("keydown", onTab);
  }, [mobileOpen]);

  return (
    <>
      <header
        role="navigation"
        aria-label="Main navigation"
        style={{ zIndex: 200 }}
        className={[
          "fixed top-0 left-0 right-0 transition-all duration-300",
          scrolled
            ? "bg-[#111318]/80 backdrop-blur-md border-b border-[#1F2330]"
            : "bg-transparent",
        ].join(" ")}
      >
        <div className="max-w-[1280px] mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
          {/* Logo */}
          <a href="#hero" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-[#6366F1] flex items-center justify-center">
              <Zap size={16} className="text-white" aria-hidden="true" />
            </div>
            <span className="text-[#F0F2F8] font-bold text-lg tracking-tight">
              SprintFoundry
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = link.section && activeSection === link.section;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  className={[
                    "text-sm font-medium transition-colors duration-150 relative",
                    isActive
                      ? "text-[#818CF8]"
                      : "text-[#8B91A8] hover:text-[#F0F2F8]",
                  ].join(" ")}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#6366F1] rounded-full" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="#pricing"
              className="px-5 py-2.5 rounded-lg bg-[#6366F1] text-white text-sm font-semibold transition-all duration-150 hover:bg-[#818CF8] hover:-translate-y-px active:bg-[#4F46E5] active:translate-y-0"
            >
              Get Started
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            ref={hamburgerRef}
            className="md:hidden p-2 text-[#8B91A8] hover:text-[#F0F2F8] transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-[195]"
          onClick={closeMobile}
          aria-hidden="true"
        />
      )}

      {/* Mobile drawer */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        style={{ zIndex: 199 }}
        className={[
          "fixed top-0 right-0 h-full w-72 bg-[#1A1D25] border-l border-[#1F2330] flex flex-col pt-20 pb-8 px-6 transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        <nav className="flex flex-col gap-2">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              onClick={closeMobile}
              className="px-4 py-3 rounded-lg text-[#8B91A8] hover:text-[#F0F2F8] hover:bg-[#242836] text-sm font-medium transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="mt-auto">
          <a
            href="#pricing"
            onClick={closeMobile}
            className="block w-full text-center px-5 py-3 rounded-lg bg-[#6366F1] text-white text-sm font-semibold hover:bg-[#818CF8] transition-colors"
          >
            Get Started
          </a>
        </div>
      </div>
    </>
  );
}
