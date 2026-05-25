import { FaqSection } from "./faq-section";
import { FinalCtaSection } from "./final-cta-section";
import { FreeQrCategoriesSection } from "./free-qr-categories-section";
import { HeroSection } from "./hero-section";
import { HowSection } from "./how-section";
import { SocialSection } from "./social-section";
import { TrustSection } from "./trust-section";

export function LandingPage() {
  return (
    <>
      <HeroSection />
      <HowSection />
      <FreeQrCategoriesSection />
      <TrustSection />
      <SocialSection />
      <FaqSection />
      <FinalCtaSection />
    </>
  );
}
