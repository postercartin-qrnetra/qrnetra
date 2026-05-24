import { BusinessFleetPage } from "@/components/business-fleet/business-fleet-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Business & Fleet Solutions",
  description:
    "Bulk QR safety tags for fleets, schools, housing societies, and enterprises across India.",
};

export default function BusinessFleetRoute() {
  return <BusinessFleetPage />;
}
