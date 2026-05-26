"use server";

import { getCurrentAdminUser } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";

const ALLOWED_FULFILLMENT_STATUSES = new Set([
  "pending",
  "processing",
  "printed",
  "packed",
  "shipped",
  "delivered",
  "cancelled",
]);

export async function updateAdminOrderAction(input: {
  orderId: string;
  fulfillmentStatus: string;
  trackingNumber?: string;
  courierName?: string;
}) {
  const admin = await getCurrentAdminUser();
  if (admin.error) {
    return { error: admin.error };
  }

  if (!ALLOWED_FULFILLMENT_STATUSES.has(input.fulfillmentStatus)) {
    return { error: "Invalid fulfillment status." };
  }

  const supabase = createAdminClient();
  if (!supabase) {
    return { error: "Admin Supabase client is not configured." };
  }

  const now = new Date().toISOString();
  const updatePayload: Record<string, string | null> = {
    fulfillment_status: input.fulfillmentStatus,
    tracking_number: input.trackingNumber?.trim() || null,
    courier_name: input.courierName?.trim() || null,
    updated_at: now,
  };

  if (input.fulfillmentStatus === "shipped") {
    updatePayload.shipped_at = now;
  }
  if (input.fulfillmentStatus === "delivered") {
    updatePayload.delivered_at = now;
  }
  if (input.fulfillmentStatus === "cancelled") {
    updatePayload.cancelled_at = now;
  }

  const { error } = await supabase
    .from("orders")
    .update(updatePayload)
    .eq("id", input.orderId);

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}
