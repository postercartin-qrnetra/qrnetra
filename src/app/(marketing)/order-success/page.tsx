import { QnLogoStatic } from "@/components/ui/logo";
import { CheckCircle2, LayoutDashboard, Package } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Order Confirmed · QR Netra",
};

export default function OrderSuccessPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-16">
      <div className="mx-auto w-full max-w-lg text-center">
        <div className="flex justify-center">
          <QnLogoStatic layout="compact" />
        </div>
        <div className="mx-auto mt-6 flex h-20 w-20 items-center justify-center rounded-full border border-qn-success/30 bg-qn-success/10">
          <CheckCircle2 className="h-10 w-10 text-qn-success" strokeWidth={1.5} />
        </div>

        <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-white">
          Order confirmed!
        </h1>
        <p className="mt-3 text-base text-qn-muted">
          Thank you for your order. You&apos;ll receive a confirmation on
          WhatsApp and email shortly.
        </p>

        <div className="qn-card mx-auto mt-10 max-w-sm p-6 text-left">
          <p className="text-sm font-semibold text-white">What happens next?</p>
          <ol className="mt-4 space-y-4">
            {[
              {
                n: "1",
                title: "Profile activation",
                desc: "Your QR profile is live immediately — set it up in your dashboard.",
              },
              {
                n: "2",
                title: "Order processing",
                desc: "Your physical tag is packed and dispatched within 1 business day.",
              },
              {
                n: "3",
                title: "Delivery",
                desc: "Delivered to your door in 3–5 business days.",
              },
              {
                n: "4",
                title: "Activate & protect",
                desc: "Attach your sticker and you're fully protected.",
              },
            ].map((step) => (
              <li key={step.n} className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-qn-accent/40 bg-qn-accent/10 text-xs font-bold text-qn-accent">
                  {step.n}
                </span>
                <div>
                  <p className="text-sm font-medium text-white">{step.title}</p>
                  <p className="mt-0.5 text-xs text-qn-muted">{step.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/dashboard" className="qn-btn-primary gap-2 px-8">
            <LayoutDashboard className="h-4 w-4" strokeWidth={1.75} />
            Go to Dashboard
          </Link>
          <Link href="/products" className="qn-btn-secondary gap-2 px-8">
            <Package className="h-4 w-4" strokeWidth={1.75} />
            Shop More
          </Link>
        </div>
      </div>
    </div>
  );
}
