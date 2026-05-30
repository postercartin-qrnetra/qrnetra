import { StubPage } from "@/components/stub-page";
import Link from "next/link";

export default function ReturnsPolicyPage() {
  return (
    <div>
      <StubPage
        title="Returns policy"
        description="Returns and replacements for QRNetra physical tags purchased from Amazon, Flipkart, or qrnetra.com."
        breadcrumb={[
          { href: "/", label: "Home" },
          { href: "/returns-policy", label: "Returns policy" },
        ]}
      />
      <div className="mx-auto -mt-8 max-w-2xl space-y-4 px-4 pb-16 text-sm text-qn-muted sm:px-6">
        <div className="qn-card p-5">
          <h2 className="font-semibold text-white">Damaged or defective tags</h2>
          <p className="mt-2">
            Contact support with your order ID and Tag ID. We can issue a replacement
            unit and disable the defective tag.
          </p>
        </div>
        <div className="qn-card p-5">
          <h2 className="font-semibold text-white">Lost tags</h2>
          <p className="mt-2">
            You may request a replacement tag; your profile can be migrated to the new
            unit after verification.
          </p>
        </div>
        <Link href="/contact" className="qn-btn-secondary inline-flex">
          Contact support
        </Link>
      </div>
    </div>
  );
}
