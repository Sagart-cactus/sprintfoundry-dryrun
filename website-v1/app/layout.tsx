import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "SprintFoundry — AI Engineering Team, On Demand",
  description:
    "SprintFoundry orchestrates specialized AI agents — from product spec to tested PR — so your team ships faster without bottlenecks.",
  keywords: ["AI agents", "software development", "automated engineering", "PR automation"],
  openGraph: {
    title: "SprintFoundry — AI Engineering Team, On Demand",
    description:
      "Orchestrate Product, Architecture, Developer, QA, Security, and DevOps AI agents to ship production-ready code automatically.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
