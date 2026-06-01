"use server";

import { createPublicServerClient } from "@/lib/supabase/public-server";

export type TrackOrderResult = {
  ok: true;
  orderNumber: string;
  paymentStatus: string;
  fulfillmentStatus: string;
  trackingNumber: string | null;
  courierName: string | null;
  productTitle: string | null;
  qrSlug: string | null;
  activated: boolean;
  createdAt: string;
  shippedAt: string | null;
  deliveredAt: string | null;
};

export async function trackOrderAction(
  orderNumber: string,
  contact: string,
): Promise<{ ok: true; order: TrackOrderResult } | { ok: false; error: string }> {
  const num = orderNumber.trim();
  const c = contact.trim();

  if (!num || !c) {
    return { ok: false, error: "Enter your order number and email or mobile number." };
  }

  const supabase = createPublicServerClient();
  if (!supabase) {
    return { ok: false, error: "Service unavailable. Please try again later." };
  }

  const { data, error } = await supabase.rpc("lookup_order_for_tracking", {
    p_order_number: num,
    p_contact: c,
  });

  if (error) {
    return { ok: false, error: "Could not look up your order. Please try again." };
  }

  const raw = data as Record<string, unknown> | null;
  if (!raw?.ok) {
    return {
      ok: false,
      error:
        "No order found with that number and contact details. Check and try again.",
    };
  }

  return {
    ok: true,
    order: {
      ok: true,
      orderNumber: String(raw.order_number ?? num),
      paymentStatus: String(raw.payment_status ?? ""),
      fulfillmentStatus: String(raw.fulfillment_status ?? "pending"),
      trackingNumber: raw.tracking_number ? String(raw.tracking_number) : null,
      courierName: raw.courier_name ? String(raw.courier_name) : null,
      productTitle: raw.product_title ? String(raw.product_title) : null,
      qrSlug: raw.qr_slug ? String(raw.qr_slug) : null,
      activated: raw.activated === true,
      createdAt: String(raw.created_at ?? ""),
      shippedAt: raw.shipped_at ? String(raw.shipped_at) : null,
      deliveredAt: raw.delivered_at ? String(raw.delivered_at) : null,
    },
  };
}
