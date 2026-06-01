import { MarketingPageLayout } from "@/components/content/marketing-page-layout";
import { aboutContent } from "@/content/company/about";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | QRNetra",
  description: aboutContent.description,
};

export default function AboutPage() {
  return (
    <MarketingPageLayout
      content={aboutContent}
      breadcrumb={[{ href: "/", label: "Home" }, { href: "/about", label: "About" }]}
    />
  );
}
