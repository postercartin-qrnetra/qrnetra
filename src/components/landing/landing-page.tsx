import { BulkSection } from "./bulk-section";
import { CompareSection } from "./compare-section";
import { DashboardSection } from "./dashboard-section";
import { FaqSection } from "./faq-section";
import { FeaturesSection } from "./features-section";
import { FinalCtaSection } from "./final-cta-section";
import { HeroSection } from "./hero-section";
import { HowSection } from "./how-section";
import { ProductsSection } from "./products-section";
import { SocialSection } from "./social-section";
import {
  ChildUseCaseSection,
  PetUseCaseSection,
  VehicleUseCaseSection,
} from "./use-cases-section";

export function LandingPage() {
  return (
    <>
      <HeroSection />
      <HowSection />
      <ProductsSection />
      <VehicleUseCaseSection />
      <ChildUseCaseSection />
      <PetUseCaseSection />
      <DashboardSection />
      <FeaturesSection />
      <SocialSection />
      <BulkSection />
      <CompareSection />
      <FaqSection />
      <FinalCtaSection />
    </>
  );
}
