import { FaqSection } from "./faq-section";
import { FinalCtaSection } from "./final-cta-section";
import { HeroSection } from "./hero-section";
import { HowSection } from "./how-section";
import { SocialSection } from "./social-section";
import { TrustSection } from "./trust-section";

export function LandingPage() {
  return (
    <>
      <HeroSection />
      <TrustSection />
      <HowSection />
      <SocialSection />
      <FaqSection />
      <FinalCtaSection />
    </>
  );
}
