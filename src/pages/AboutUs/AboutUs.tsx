import { PublicHeader } from "@/components/PublicHeader/PublicHeader";
import { PublicFooter } from "@/components/PublicFooter/PublicFooter";

import { HeroSection } from "./components/HeroSection";
import { HistorySection } from "./components/HistorySection";
import { AdvantagesSection } from "./components/AdvantagesSection";
import { ValuesSection } from "./components/ValuesSection";

const AboutUs = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />

      <main className="flex-1">
        <HeroSection />

        <div className="max-w-7xl mx-auto px-4 py-16">
          <HistorySection />
          <AdvantagesSection />
          <ValuesSection />
        </div>
      </main>

      <PublicFooter />
    </div>
  );
};

export default AboutUs;