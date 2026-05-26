import { QnLogoStatic } from "@/components/ui/logo";
import { createClient } from "@/lib/supabase/server";
import { getOrderForUser } from "@/lib/orders/queries";
import { CheckCircle2, LayoutDashboard, Package, QrCode, Truck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Order Confirmed · QR Netra",
};

type Props = {
  searchParams: Promise<{ order?: string }>;
};

export default async function OrderSuccessPage({ searchParams }: Props) {
  const { order: orderId } = await searchParams;

  const supabase = await createClient();
  let order = null;

  if (supabase && orderId) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      order = await getOrderForUser(supabase, user.id, orderId);
    }
  }

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
          Your QR is already live in the dashboard, and your physical product has
          moved into fulfillment.
        </p>

        <div className="qn-card mx-auto mt-10 max-w-sm p-6 text-left">
          <p className="text-sm font-semibold text-white">Order summary</p>
          {order ? (
            <div className="mt-4 space-y-4 text-sm text-qn-muted">
              <div>
                <p className="text-xs uppercase tracking-wide text-qn-muted-2">Order number</p>
                <p className="mt-1 font-semibold text-white">{order.orderNumber}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-qn-muted-2">Product</p>
                <p className="mt-1 font-semibold text-white">
                  {order.product?.title ?? "QRNetra product"}
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-wide text-qn-muted-2">Payment</p>
                  <p className="mt-1 font-semibold capitalize text-white">
                    {order.paymentStatus.replace(/_/g, " ")}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-qn-muted-2">Fulfillment</p>
                  <p className="mt-1 font-semibold capitalize text-white">
                    {order.fulfillmentStatus.replace(/_/g, " ")}
                  </p>
                </div>
              </div>
              {order.qrSlug ? (
                <div className="rounded-xl border border-white/[0.08] bg-qn-card-2 p-4">
                  <div className="flex items-center gap-2">
                    <QrCode className="h-4 w-4 text-qn-accent" strokeWidth={1.75} />
                    <p className="font-medium text-white">Linked QR</p>
                  </div>
                  <p className="mt-2 font-mono text-xs text-qn-muted">/s/{order.qrSlug}</p>
                </div>
              ) : null}
            </div>
          ) : (
            <ol className="mt-4 space-y-4">
              {[
                {
                  n: "1",
                  title: "QR profile live",
                  desc: "Your linked QR is already available from the dashboard.",
                },
                {
                  n: "2",
                  title: "Order processing",
                  desc: "Your physical product moves into printing and packing.",
                },
                {
                  n: "3",
                  title: "Delivery",
                  desc: "Tracking becomes visible in the dashboard after dispatch.",
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
          )}
        </div>

        <div className="qn-card mx-auto mt-6 max-w-sm p-5 text-left">
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-qn-accent" strokeWidth={1.75} />
            <p className="text-sm font-semibold text-white">Delivery expectation</p>
          </div>
          <p className="mt-3 text-sm text-qn-muted">
            Orders are typically printed and packed within 1 business day, then
            delivered in 3-5 business days across India.
          </p>
        </div>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/dashboard" className="qn-btn-primary gap-2 px-8">
            <LayoutDashboard className="h-4 w-4" strokeWidth={1.75} />
            Go to Dashboard
          </Link>
          {order ? (
            <Link
              href={`/dashboard/orders/${order.id}`}
              className="qn-btn-secondary gap-2 px-8"
            >
              <Package className="h-4 w-4" strokeWidth={1.75} />
              View Order
            </Link>
          ) : null}
          <Link href="/products" className="qn-btn-secondary gap-2 px-8">
            <Package className="h-4 w-4" strokeWidth={1.75} />
            Shop More
          </Link>
        </div>
      </div>
    </div>
  );
}
