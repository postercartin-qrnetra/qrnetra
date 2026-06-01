import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Returns & Replacements | QRNetra",
  description: "Replacement policy for defective or damaged QRNetra physical tags.",
};

export default function ReturnsPolicyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:py-16">
      <h1 className="text-3xl font-bold text-white">Returns & replacements</h1>
      <p className="mt-4 text-sm leading-relaxed text-qn-muted">
        QRNetra tags are personalized products. Refunds follow our{" "}
        <Link href="/refund-policy" className="font-semibold text-qn-accent">
          Refund Policy
        </Link>
        . This page covers replacements when something arrives damaged or defective.
      </p>
      <div className="qn-card mt-8 space-y-4 p-6 text-sm text-qn-muted">
        <p>
          Contact support with your order ID and Tag ID. Include photos of the product and
          packaging if the item arrived damaged.
        </p>
        <p>
          Approved replacements are shipped after we verify the issue. Activation codes on
          replacement units are new; we can help transfer your profile where possible.
        </p>
        <Link href="/contact" className="qn-btn-secondary inline-flex">
          Contact support
        </Link>
      </div>
    </div>
  );
}
