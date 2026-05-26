"use server";

import { createClient } from "@/lib/supabase/server";
import { sendOrderConfirmationEmail } from "@/lib/email/order-confirmation";
import { getProduct } from "@/lib/products";
import { orderAddressSchema, type OrderAddressInput } from "@/lib/orders/address";
import {
  getRazorpayInstance,
  getRazorpayKeyId,
  verifyRazorpaySignature,
} from "@/lib/payments/razorpay";

type ActionError = {
  error: string;
};

export type PendingOrderResult =
  | (ActionError & {
      orderId: null;
      orderNumber: null;
      amountPaise: null;
    })
  | {
      error: null;
      orderId: string;
      orderNumber: string;
      amountPaise: number;
    };

export type RazorpayCheckoutResult =
  | (ActionError & {
      orderId: null;
      orderNumber: null;
      razorpayOrderId: null;
      amountPaise: null;
      razorpayKeyId: null;
      customerEmail: null;
      customerName: null;
      customerPhone: null;
    })
  | {
      error: null;
      orderId: string;
      orderNumber: string;
      razorpayOrderId: string;
      amountPaise: number;
      razorpayKeyId: string;
      customerEmail: string | null;
      customerName: string | null;
      customerPhone: string | null;
    };

export type VerifyPaymentResult =
  | (ActionError & { ok: false })
  | {
      ok: true;
      error: null;
      orderId: string;
      orderNumber: string;
    };

async function requireUser() {
  const supabase = await createClient();
  if (!supabase) {
    return { supabase: null, user: null, error: "Server configuration error." as const };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { supabase, user: null, error: "Not authenticated." as const };
  }

  return { supabase, user, error: null };
}

export async function createPendingOrderAction(input: {
  productSlug: string;
  qrId: string;
  address: OrderAddressInput;
}): Promise<PendingOrderResult> {
  const auth = await requireUser();
  if (auth.error || !auth.supabase || !auth.user) {
    return { error: auth.error ?? "Not authenticated.", orderId: null, orderNumber: null, amountPaise: null };
  }

  const parsedAddress = orderAddressSchema.safeParse(input.address);
  if (!parsedAddress.success) {
    return {
      error: parsedAddress.error.issues[0]?.message ?? "Please check the shipping address.",
      orderId: null,
      orderNumber: null,
      amountPaise: null,
    };
  }

  const productConfig = getProduct(input.productSlug);
  if (!productConfig) {
    return { error: "Product not found.", orderId: null, orderNumber: null, amountPaise: null };
  }

  const { data: qrCode, error: qrError } = await auth.supabase
    .from("qr_codes")
    .select("id, slug, profile_id")
    .eq("id", input.qrId)
    .single();

  if (qrError || !qrCode) {
    return { error: "QR not found.", orderId: null, orderNumber: null, amountPaise: null };
  }

  const { data: qrProfile, error: profileError } = await auth.supabase
    .from("qr_profiles")
    .select("id, user_id")
    .eq("id", qrCode.profile_id)
    .single();

  if (profileError || !qrProfile || qrProfile.user_id !== auth.user.id) {
    return { error: "QR not found.", orderId: null, orderNumber: null, amountPaise: null };
  }

  const { data: productRow, error: productError } = await auth.supabase
    .from("products")
    .select("id, price_paise, sale_price_paise")
    .eq("slug", productConfig.slug)
    .single();

  if (productError || !productRow) {
    return {
      error: "Product catalog is not ready yet. Run the latest migration and try again.",
      orderId: null,
      orderNumber: null,
      amountPaise: null,
    };
  }

  const { data: skuRow, error: skuError } = await auth.supabase
    .from("skus")
    .select("id")
    .eq("sku_code", productConfig.skuCode)
    .single();

  if (skuError || !skuRow) {
    return {
      error: "Product SKU is not configured yet. Run the latest migration and try again.",
      orderId: null,
      orderNumber: null,
      amountPaise: null,
    };
  }

  const amountPaise =
    productRow.sale_price_paise ?? productRow.price_paise ?? productConfig.price * 100;

  const { data: existingOrder } = await auth.supabase
    .from("orders")
    .select("id, order_number")
    .eq("user_id", auth.user.id)
    .eq("product_id", productRow.id)
    .eq("qr_code_id", qrCode.id)
    .in("payment_status", ["pending_payment", "failed"])
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  let orderId: string | null = null;
  let orderNumber: string | null = null;

  if (existingOrder) {
    const { data: updatedOrder, error: updateError } = await auth.supabase
      .from("orders")
      .update({
        status: "pending",
        total_paise: amountPaise,
        amount_paise: amountPaise,
        currency: "INR",
        product_id: productRow.id,
        sku_id: skuRow.id,
        qr_code_id: qrCode.id,
        qr_slug: qrCode.slug,
        payment_status: "pending_payment",
        fulfillment_status: "pending",
        contact_email: parsedAddress.data.email,
        contact_phone: parsedAddress.data.mobile,
        shipping_address_json: parsedAddress.data,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existingOrder.id)
      .select("id, order_number")
      .single();

    if (updateError || !updatedOrder) {
      return { error: updateError?.message ?? "Could not update your order.", orderId: null, orderNumber: null, amountPaise: null };
    }

    orderId = updatedOrder.id;
    orderNumber = updatedOrder.order_number;
  } else {
    const { data: insertedOrder, error: insertError } = await auth.supabase
      .from("orders")
      .insert({
        user_id: auth.user.id,
        status: "pending",
        total_paise: amountPaise,
        amount_paise: amountPaise,
        currency: "INR",
        product_id: productRow.id,
        sku_id: skuRow.id,
        qr_code_id: qrCode.id,
        qr_slug: qrCode.slug,
        payment_status: "pending_payment",
        fulfillment_status: "pending",
        contact_email: parsedAddress.data.email,
        contact_phone: parsedAddress.data.mobile,
        shipping_address_json: parsedAddress.data,
      })
      .select("id, order_number")
      .single();

    if (insertError || !insertedOrder) {
      return { error: insertError?.message ?? "Could not create your order.", orderId: null, orderNumber: null, amountPaise: null };
    }

    orderId = insertedOrder.id;
    orderNumber = insertedOrder.order_number;
  }

  const { data: existingOrderItem } = await auth.supabase
    .from("order_items")
    .select("id")
    .eq("order_id", orderId)
    .maybeSingle();

  if (existingOrderItem?.id) {
    await auth.supabase
      .from("order_items")
      .update({
        sku_id: skuRow.id,
        quantity: 1,
        unit_price_paise: amountPaise,
      })
      .eq("id", existingOrderItem.id);
  } else {
    await auth.supabase.from("order_items").insert({
      order_id: orderId,
      sku_id: skuRow.id,
      quantity: 1,
      unit_price_paise: amountPaise,
    });
  }

  if (!orderId) {
    return {
      error: "Could not create your order.",
      orderId: null,
      orderNumber: null,
      amountPaise: null,
    };
  }

  return {
    error: null,
    orderId,
    orderNumber: orderNumber ?? "Pending",
    amountPaise,
  };
}

export async function createRazorpayCheckoutAction(
  orderId: string,
): Promise<RazorpayCheckoutResult> {
  const auth = await requireUser();
  if (auth.error || !auth.supabase || !auth.user) {
    return {
      error: auth.error ?? "Not authenticated.",
      orderId: null,
      orderNumber: null,
      razorpayOrderId: null,
      amountPaise: null,
      razorpayKeyId: null,
      customerEmail: null,
      customerName: null,
      customerPhone: null,
    };
  }

  const razorpay = getRazorpayInstance();
  const razorpayKeyId = getRazorpayKeyId();
  if (!razorpay || !razorpayKeyId) {
    return {
      error: "Razorpay is not configured.",
      orderId: null,
      orderNumber: null,
      razorpayOrderId: null,
      amountPaise: null,
      razorpayKeyId: null,
      customerEmail: null,
      customerName: null,
      customerPhone: null,
    };
  }

  const { data: order, error: orderError } = await auth.supabase
    .from("orders")
    .select("id, order_number, amount_paise, contact_email, contact_phone, payment_status, razorpay_order_id")
    .eq("id", orderId)
    .eq("user_id", auth.user.id)
    .single();

  if (orderError || !order) {
    return {
      error: "Order not found.",
      orderId: null,
      orderNumber: null,
      razorpayOrderId: null,
      amountPaise: null,
      razorpayKeyId: null,
      customerEmail: null,
      customerName: null,
      customerPhone: null,
    };
  }

  if (order.payment_status === "paid") {
    return {
      error: "This order is already paid.",
      orderId: null,
      orderNumber: null,
      razorpayOrderId: null,
      amountPaise: null,
      razorpayKeyId: null,
      customerEmail: null,
      customerName: null,
      customerPhone: null,
    };
  }

  let razorpayOrderId = order.razorpay_order_id;
  if (!razorpayOrderId) {
    const razorpayOrder = await razorpay.orders.create({
      amount: order.amount_paise,
      currency: "INR",
      receipt: order.order_number ?? order.id,
      notes: {
        order_id: order.id,
        order_number: order.order_number ?? "",
        user_id: auth.user.id,
      },
    });

    razorpayOrderId = razorpayOrder.id;

    await auth.supabase
      .from("orders")
      .update({
        razorpay_order_id: razorpayOrderId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", order.id);
  }

  const { data: profile } = await auth.supabase
    .from("profiles")
    .select("display_name")
    .eq("id", auth.user.id)
    .maybeSingle();

  return {
    error: null,
    orderId: order.id,
    orderNumber: order.order_number ?? order.id,
    razorpayOrderId,
    amountPaise: order.amount_paise,
    razorpayKeyId,
    customerEmail: order.contact_email ?? auth.user.email ?? null,
    customerName: profile?.display_name ?? null,
    customerPhone: order.contact_phone ?? null,
  };
}

export async function verifyRazorpayPaymentAction(input: {
  orderId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}): Promise<VerifyPaymentResult> {
  const auth = await requireUser();
  if (auth.error || !auth.supabase || !auth.user) {
    return { ok: false, error: auth.error ?? "Not authenticated." };
  }

  const { data: order, error: orderError } = await auth.supabase
    .from("orders")
    .select("id, order_number, user_id, razorpay_order_id, payment_status")
    .eq("id", input.orderId)
    .eq("user_id", auth.user.id)
    .single();

  if (orderError || !order) {
    return { ok: false, error: "Order not found." };
  }

  const valid = verifyRazorpaySignature({
    orderId: input.razorpayOrderId,
    paymentId: input.razorpayPaymentId,
    signature: input.razorpaySignature,
  });

  if (!valid) {
    await auth.supabase
      .from("orders")
      .update({
        status: "failed",
        payment_status: "failed",
        updated_at: new Date().toISOString(),
      })
      .eq("id", order.id);

    return { ok: false, error: "Payment signature verification failed." };
  }

  const { error: updateError } = await auth.supabase
    .from("orders")
    .update({
      status: "paid",
      payment_status: "paid",
      fulfillment_status: "processing",
      payment_id: input.razorpayPaymentId,
      payment_signature: input.razorpaySignature,
      razorpay_order_id: input.razorpayOrderId,
      paid_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", order.id);

  if (updateError) {
    return { ok: false, error: updateError.message };
  }

  const { data: paidOrder } = await auth.supabase
    .from("orders")
    .select("id, order_number, qr_slug, contact_email, product:products(title)")
    .eq("id", order.id)
    .single();

  if (paidOrder?.contact_email) {
    const productRelation = (
      paidOrder as {
        product?: { title?: string } | Array<{ title?: string }>;
      }
    ).product;
    const productTitle = Array.isArray(productRelation)
      ? productRelation[0]?.title
      : productRelation?.title;

    await sendOrderConfirmationEmail({
      to: paidOrder.contact_email,
      orderNumber: paidOrder.order_number ?? order.id,
      productTitle: productTitle ?? "QRNetra product",
      qrSlug: paidOrder.qr_slug ?? null,
      orderId: paidOrder.id,
    }).catch(() => undefined);
  }

  return {
    ok: true,
    error: null,
    orderId: order.id,
    orderNumber: order.order_number ?? order.id,
  };
}
