"use client";

import { useState } from "react";
import { trackOrderAction, type TrackOrderResult } from "@/app/actions/track-order";
import Link from "next/link";

const STEPS = [
  { key: "pending", label: "Processing" },
  { key: "processing", label: "Processing" },
  { key: "printed", label: "Printed" },
  { key: "packed", label: "Packed" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
  { key: "activated", label: "Activated" },
] as const;

function stepIndex(status: string, activated: boolean): number {
  if (activated) return 6;
  const map: Record<string, number> = {
    pending: 0,
    processing: 0,
    printed: 1,
    packed: 2,
    shipped: 3,
    delivered: 4,
    cancelled: -1,
  };
  return map[status] ?? 0;
}

function OrderTimeline({ order }: { order: TrackOrderResult }) {
  const current = stepIndex(order.fulfillmentStatus, order.activated);

  return (
    <div className="qn-card mt-8 p-6">
      <h2 className="text-lg font-semibold text-white">Order {order.orderNumber}</h2>
      {order.productTitle ? (
        <p className="mt-1 text-sm text-qn-muted">{order.productTitle}</p>
      ) : null}
      <p className="mt-2 text-xs text-qn-muted-2">
        Payment: {order.paymentStatus.replace(/_/g, " ")}
      </p>

      <ol className="mt-6 space-y-3">
        {STEPS.map((step, i) => {
          const done = i <= current;
          const active = i === current;
          return (
            <li key={step.key + step.label} className="flex items-center gap-3">
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  done
                    ? "bg-qn-accent text-white"
                    : "border border-white/20 text-qn-muted-2"
                } ${active ? "ring-2 ring-qn-accent/40" : ""}`}
              >
                {i + 1}
              </span>
              <span className={done ? "text-white" : "text-qn-muted-2"}>{step.label}</span>
            </li>
          );
        })}
      </ol>

      {order.trackingNumber ? (
        <div className="mt-6 rounded-xl bg-white/[0.04] p-4 text-sm">
          <p className="text-qn-muted-2">Tracking</p>
          <p className="font-mono text-white">{order.trackingNumber}</p>
          {order.courierName ? (
            <p className="mt-1 text-qn-muted">Courier: {order.courierName}</p>
          ) : null}
        </div>
      ) : null}

      {order.qrSlug && order.activated ? (
        <p className="mt-4 text-sm text-qn-muted">
          Your tag is activated.{" "}
          <Link href={`/s/${order.qrSlug}`} className="font-semibold text-qn-accent">
            View public scan page
          </Link>
        </p>
      ) : order.qrSlug ? (
        <p className="mt-4 text-sm text-qn-muted">
          When your product arrives,{" "}
          <Link href="/activate" className="font-semibold text-qn-accent">
            activate your tag
          </Link>{" "}
          using the code in the package.
        </p>
      ) : null}
    </div>
  );
}

export function TrackOrderForm() {
  const [orderNumber, setOrderNumber] = useState("");
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<TrackOrderResult | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOrder(null);
    const result = await trackOrderAction(orderNumber, contact);
    setLoading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setOrder(result.order);
  }

  return (
    <>
      <form onSubmit={(e) => void handleSubmit(e)} className="qn-card space-y-4 p-6">
        <div>
          <label className="block text-sm font-medium text-white">Order number</label>
          <input
            required
            placeholder="e.g. QRN-0001001"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            className="mt-2 w-full rounded-xl border border-white/[0.08] bg-qn-bg px-4 py-3 font-mono text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white">
            Email or mobile used at checkout
          </label>
          <input
            required
            placeholder="Same as on your order"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className="mt-2 w-full rounded-xl border border-white/[0.08] bg-qn-bg px-4 py-3 text-white"
          />
        </div>
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        <button type="submit" disabled={loading} className="qn-btn-primary w-full">
          {loading ? "Looking up…" : "Track order"}
        </button>
      </form>
      {order ? <OrderTimeline order={order} /> : null}
    </>
  );
}
