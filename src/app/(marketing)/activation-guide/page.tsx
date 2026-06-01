import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Activation Guide | QRNetra",
  description: "How to activate your QRNetra physical tag after purchase.",
};

const STEPS = [
  "Scan the QR code on your QRNetra product (or open the activation link in your package).",
  "Sign in with your email — no Google account required.",
  "Enter the activation code printed on your packaging next to your Tag ID.",
  "Fill in your emergency profile (vehicle, pet, child, or business details).",
  "Attach the product as directed — your tag stays linked to the same scan URL when you update details later.",
];

export default function ActivationGuidePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:py-16">
      <nav className="mb-6 text-sm text-qn-muted-2">
        <Link href="/" className="hover:text-white">
          Home
        </Link>
        {" / "}
        <Link href="/help" className="hover:text-white">
          Help
        </Link>
        {" / "}
        <span className="text-white">Activation guide</span>
      </nav>
      <h1 className="text-3xl font-bold text-white">Activation guide</h1>
      <p className="mt-4 text-qn-muted">
        Activate a physical QRNetra tag in a few minutes after purchase from our website, Amazon,
        or a retail partner.
      </p>
      <ol className="qn-card mt-8 list-decimal space-y-4 p-6 pl-10 text-sm leading-relaxed text-qn-muted">
        {STEPS.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
      <section id="care" className="mt-10 qn-card p-6">
        <h2 className="font-semibold text-white">Product care</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-qn-muted">
          <li>Clean the surface before applying adhesive stickers; press firmly for 30 seconds.</li>
          <li>Keep the QR code flat and avoid scratching the printed area.</li>
          <li>Update phone numbers and emergency contacts in the dashboard when they change.</li>
        </ul>
      </section>
      <Link href="/activate" className="qn-btn-primary mt-8 inline-flex px-8">
        Activate your tag
      </Link>
    </div>
  );
}
