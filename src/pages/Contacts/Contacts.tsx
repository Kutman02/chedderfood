import { PublicHeader } from "@/components/PublicHeader/PublicHeader";
import { PublicFooter } from "@/components/PublicFooter/PublicFooter";

import { HeroSection } from "./components/HeroSection";
import { ContactInfoSection } from "./components/ContactInfoSection";
import { LocationSection } from "./components/LocationSection";

const Contacts = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />

      <main className="flex-1">
        <HeroSection />

        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <ContactInfoSection />
            <LocationSection />
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
};

export default Contacts;