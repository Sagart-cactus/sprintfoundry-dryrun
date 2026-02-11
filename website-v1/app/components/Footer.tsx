import { Zap, Github, Twitter, Linkedin } from "lucide-react";

const links = {
  Product: ["Features", "How It Works", "Pricing", "Changelog"],
  Company: ["About", "Blog", "Careers", "Contact"],
  Resources: ["Docs", "API Reference", "GitHub", "Status"],
};

export default function Footer() {
  return (
    <footer
      role="contentinfo"
      className="border-t border-[#1F2330]"
      style={{ background: "#111318" }}
    >
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand column */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#6366F1] flex items-center justify-center">
                <Zap size={16} className="text-white" aria-hidden="true" />
              </div>
              <span className="text-[#F0F2F8] font-bold text-lg">SprintFoundry</span>
            </div>
            <p className="text-sm text-[#555C72] max-w-[200px] leading-relaxed">
              Built for engineering teams that ship.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-3 mt-6">
              <a
                href="#"
                aria-label="SprintFoundry on GitHub"
                className="text-[#555C72] hover:text-[#F0F2F8] transition-colors"
              >
                <Github size={18} />
              </a>
              <a
                href="#"
                aria-label="SprintFoundry on X (formerly Twitter)"
                className="text-[#555C72] hover:text-[#F0F2F8] transition-colors"
              >
                <Twitter size={18} />
              </a>
              <a
                href="#"
                aria-label="SprintFoundry on LinkedIn"
                className="text-[#555C72] hover:text-[#F0F2F8] transition-colors"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([column, items]) => (
            <nav key={column} aria-label={`Footer navigation: ${column}`}>
              <strong className="text-xs font-semibold uppercase tracking-widest text-[#555C72] block mb-4">
                {column}
              </strong>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-[#8B91A8] hover:text-[#F0F2F8] transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Legal bar */}
        <div className="border-t border-[#1F2330] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#555C72]">
            &copy; {new Date().getFullYear()} SprintFoundry, Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs text-[#555C72] hover:text-[#8B91A8] transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-xs text-[#555C72] hover:text-[#8B91A8] transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
