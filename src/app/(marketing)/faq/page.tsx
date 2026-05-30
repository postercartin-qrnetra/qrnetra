import { StubPage } from "@/components/stub-page";

const FAQ = [
  {
    q: "Where is my Tag ID and activation code?",
    a: "Both are printed on the card inside your product package and on the production label. Tag IDs look like V-QRN-000001.",
  },
  {
    q: "I bought on Amazon — do I need the website checkout?",
    a: "No. Scan your product QR or go to Activate Tag, sign in, enter your code, and complete your profile.",
  },
  {
    q: "Can I still create a free digital QR?",
    a: "Yes. Create Free QR is separate from physical tags and does not use a Tag ID from inventory.",
  },
  {
    q: "What if my tag is lost?",
    a: "Contact support to request a replacement. Your old tag can be disabled and a new one linked to your profile.",
  },
];

export default function FaqPage() {
  return (
    <div>
      <StubPage
        title="FAQ"
        description="Common questions about activating and using QRNetra physical tags."
        breadcrumb={[{ href: "/", label: "Home" }, { href: "/faq", label: "FAQ" }]}
      />
      <div className="mx-auto -mt-8 max-w-2xl space-y-4 px-4 pb-16 sm:px-6">
        {FAQ.map((item) => (
          <div key={item.q} className="qn-card p-5">
            <h2 className="font-semibold text-white">{item.q}</h2>
            <p className="mt-2 text-sm text-qn-muted">{item.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
