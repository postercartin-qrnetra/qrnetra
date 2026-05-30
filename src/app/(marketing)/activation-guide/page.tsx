import { StubPage } from "@/components/stub-page";
import Link from "next/link";

const STEPS = [
  "Scan the QR code on your QRNetra product (or open the activation link in your package).",
  "Sign in with your email — no Google account required.",
  "Enter the activation code printed on your packaging next to your Tag ID.",
  "Fill in your emergency profile (vehicle, pet, child, or business details).",
  "Attach the product as directed — your tag is live at the same scan URL forever.",
];

export default function ActivationGuidePage() {
  return (
    <div>
      <StubPage
        title="Activation guide"
        description="Activate a physical QRNetra tag in a few minutes after purchase from Amazon, Flipkart, our website, or a retail partner."
        breadcrumb={[
          { href: "/", label: "Home" },
          { href: "/activation-guide", label: "Activation guide" },
        ]}
      />
      <div className="mx-auto -mt-8 max-w-2xl px-4 pb-16 sm:px-6">
        <ol className="qn-card list-decimal space-y-4 p-6 pl-10 text-sm text-qn-muted">
          {STEPS.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <Link href="/activate" className="qn-btn-primary mt-8 inline-flex px-8">
          Activate your tag
        </Link>
      </div>
    </div>
  );
}
