import { TrackOrderForm } from "@/components/track-order/track-order-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Track Order | QRNetra",
  description: "Track your QRNetra physical product order with your order number and contact details.",
};

export default function TrackOrderPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-12 sm:py-16">
      <h1 className="text-3xl font-bold text-white">Track your order</h1>
      <p className="mt-3 text-sm text-qn-muted">
        Enter the order number from your confirmation email and the email or mobile number you
        used at checkout.
      </p>
      <div className="mt-8">
        <TrackOrderForm />
      </div>
    </div>
  );
}
