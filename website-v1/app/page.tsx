import SiteNav from "./components/SiteNav";
import HeroSection from "./components/HeroSection";
import StatsBanner from "./components/StatsBanner";
import FeaturesSection from "./components/FeaturesSection";
import HowItWorksSection from "./components/HowItWorksSection";
import PricingSection from "./components/PricingSection";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: "#0A0B0E" }}>
      <SiteNav />
      <main>
        <HeroSection />
        <StatsBanner />
        <FeaturesSection />
        <HowItWorksSection />
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
}
