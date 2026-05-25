import { Suspense } from "react";
import { CheckoutPageClient } from "@/components/checkout/checkout-page-client";

export const metadata = {
  title: "Checkout · QR Netra",
};

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-qn-bg">
          <p className="text-sm text-qn-muted">Loading checkout…</p>
        </div>
      }
    >
      <CheckoutPageClient />
    </Suspense>
  );
}
