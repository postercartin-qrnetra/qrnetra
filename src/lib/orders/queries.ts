import type { SupabaseClient } from "@supabase/supabase-js";

export type OrderSummary = {
  id: string;
  orderNumber: string;
  createdAt: string;
  amountPaise: number;
  paymentStatus: string;
  fulfillmentStatus: string;
  trackingNumber: string | null;
  courierName: string | null;
  qrId: string | null;
  qrSlug: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  shippingAddress: Record<string, string>;
  product: {
    id: string;
    title: string;
    slug: string;
    category: string;
  } | null;
};

type OrderRow = {
  id: string;
  order_number: string | null;
  created_at: string;
  amount_paise: number | null;
  total_paise: number | null;
  payment_status: string | null;
  fulfillment_status: string | null;
  tracking_number: string | null;
  courier_name: string | null;
  qr_code_id: string | null;
  qr_slug: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  shipping_address_json: Record<string, string> | null;
  product_id: string | null;
  product: {
    id: string;
    title: string;
    slug: string;
    primary_category: string;
  } | null;
};

function mapOrderRow(row: OrderRow): OrderSummary {
  return {
    id: row.id,
    orderNumber: row.order_number ?? row.id,
    createdAt: row.created_at,
    amountPaise: row.amount_paise ?? row.total_paise ?? 0,
    paymentStatus: row.payment_status ?? "pending_payment",
    fulfillmentStatus: row.fulfillment_status ?? "pending",
    trackingNumber: row.tracking_number,
    courierName: row.courier_name,
    qrId: row.qr_code_id,
    qrSlug: row.qr_slug,
    contactEmail: row.contact_email,
    contactPhone: row.contact_phone,
    shippingAddress: row.shipping_address_json ?? {},
    product: row.product
      ? {
          id: row.product.id,
          title: row.product.title,
          slug: row.product.slug,
          category: row.product.primary_category,
        }
      : null,
  };
}

const ORDER_SELECT = `
  id,
  order_number,
  created_at,
  amount_paise,
  total_paise,
  payment_status,
  fulfillment_status,
  tracking_number,
  courier_name,
  qr_code_id,
  qr_slug,
  contact_email,
  contact_phone,
  shipping_address_json,
  product_id,
  product:products(id, title, slug, primary_category)
`;

export async function getOrdersForUser(
  supabase: SupabaseClient,
  userId: string,
) {
  const { data, error } = await supabase
    .from("orders")
    .select(ORDER_SELECT)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return (data as unknown as OrderRow[]).map(mapOrderRow);
}

export async function getOrderForUser(
  supabase: SupabaseClient,
  userId: string,
  orderId: string,
) {
  const { data, error } = await supabase
    .from("orders")
    .select(ORDER_SELECT)
    .eq("user_id", userId)
    .eq("id", orderId)
    .single();

  if (error || !data) {
    return null;
  }

  return mapOrderRow(data as unknown as OrderRow);
}
