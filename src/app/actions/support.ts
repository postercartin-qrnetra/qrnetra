"use server";

import { createClient } from "@/lib/supabase/server";
import { sendSupportNotificationEmail } from "@/lib/email/support-notification";
import { isSupportCategory, type SupportCategory } from "@/lib/support/types";
import { isValidEmail, EMAIL_ERROR } from "@/lib/validation/email";

export async function submitSupportRequestAction(input: {
  category: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
  orderNumber?: string;
}) {
  const name = input.name.trim();
  const email = input.email.trim();
  const subject = input.subject.trim();
  const message = input.message.trim();

  if (!name || name.length < 2) {
    return { ok: false as const, error: "Please enter your name." };
  }
  if (!isValidEmail(email)) {
    return { ok: false as const, error: EMAIL_ERROR };
  }
  if (!subject || subject.length < 3) {
    return { ok: false as const, error: "Please enter a subject." };
  }
  if (!message || message.length < 10) {
    return { ok: false as const, error: "Please enter a message (at least 10 characters)." };
  }

  const category: SupportCategory = isSupportCategory(input.category)
    ? input.category
    : "general";

  const supabase = await createClient();
  if (!supabase) {
    return { ok: false as const, error: "Service unavailable. Please email us directly." };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: row, error } = await supabase
    .from("support_requests")
    .insert({
      user_id: user?.id ?? null,
      category,
      name,
      email,
      phone: input.phone?.trim() || null,
      subject,
      message,
      order_number: input.orderNumber?.trim() || null,
    })
    .select("id")
    .single();

  if (error) {
    return { ok: false as const, error: "Could not submit your request. Please try again." };
  }

  await sendSupportNotificationEmail({
    category,
    name,
    email,
    subject,
    message,
    phone: input.phone,
    orderNumber: input.orderNumber,
    requestId: row?.id,
  }).catch(() => {});

  return { ok: true as const };
}

export async function submitContactFormAction(input: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  return submitSupportRequestAction({
    ...input,
    category: "general",
  });
}
