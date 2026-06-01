import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ | QRNetra",
  description: "Frequently asked questions about QRNetra tags, activation, orders, and scans.",
};

const FAQ = [
  {
    q: "Where is my Tag ID and activation code?",
    a: "Both are printed on the card inside your product package and on the production label. Tag IDs look like V-QRN-000001.",
  },
  {
    q: "I bought on Amazon — do I need the website checkout?",
    a: "No. Scan your product QR or go to Activate Tag, sign in, enter your code, and complete your profile. Your Amazon order is separate from website checkout.",
  },
  {
    q: "Can I still create a free digital QR?",
    a: "Yes. Create Free QR is separate from physical tags and does not use a Tag ID from inventory.",
  },
  {
    q: "What if my tag is lost or damaged?",
    a: "Contact support with your order number and Tag ID. We can help with replacements for defective products. See our refund and returns policies.",
  },
  {
    q: "What do finders see when they scan?",
    a: "Only what you put on your public profile—contact options, optional vehicle or medical notes, and messages you enable. You can update details anytime from the dashboard.",
  },
  {
    q: "Will I get notified when someone scans?",
    a: "Yes, if email notifications are enabled in Settings. Scan and emergency alerts can be controlled separately.",
  },
  {
    q: "How do refunds work for personalized tags?",
    a: "Because tags are printed with your unique QR, refunds are limited after production or activation. See our Refund Policy for full details.",
  },
];

export default function FaqPage() {
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
        <span className="text-white">FAQ</span>
      </nav>
      <h1 className="text-3xl font-bold text-white">Frequently asked questions</h1>
      <p className="mt-4 text-qn-muted">
        Quick answers about physical tags, activation, and your dashboard. For step-by-step help, visit
        the{" "}
        <Link href="/help" className="font-semibold text-qn-accent">
          Help Center
        </Link>
        .
      </p>
      <div className="mt-10 space-y-4">
        {FAQ.map((item) => (
          <div key={item.q} className="qn-card p-5">
            <h2 className="font-semibold text-white">{item.q}</h2>
            <p className="mt-2 text-sm leading-relaxed text-qn-muted">{item.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
