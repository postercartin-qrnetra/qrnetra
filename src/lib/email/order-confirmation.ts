import "server-only";

import { Resend } from "resend";
import { getPublicSiteUrl } from "@/lib/site-url";

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return null;
  }

  return new Resend(apiKey);
}

export async function sendOrderConfirmationEmail(input: {
  to: string;
  orderNumber: string;
  productTitle: string;
  qrSlug: string | null;
  orderId: string;
}) {
  const resend = getResendClient();
  const from =
    process.env.RESEND_FROM_EMAIL?.trim() ||
    process.env.ORDER_FROM_EMAIL?.trim() ||
    "QRNetra <orders@qrnetra.com>";

  if (!resend || !input.to) {
    return;
  }

  const site = getPublicSiteUrl();
  const orderUrl = `${site}/dashboard/orders/${input.orderId}`;
  const qrUrl = input.qrSlug ? `${site}/s/${input.qrSlug}` : null;

  await resend.emails.send({
    from,
    to: input.to,
    subject: `QRNetra order confirmed · ${input.orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; background: #020817; color: #fff; padding: 32px;">
        <div style="max-width: 640px; margin: 0 auto; background: #0f172a; border-radius: 20px; padding: 32px;">
          <p style="margin: 0 0 8px; color: #ff6b2c; font-size: 12px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase;">QRNetra Order Confirmation</p>
          <h1 style="margin: 0 0 16px; font-size: 28px;">Your order is confirmed</h1>
          <p style="margin: 0 0 20px; color: #cbd5e1; line-height: 1.6;">
            Order <strong>${input.orderNumber}</strong> for <strong>${input.productTitle}</strong> has been paid successfully.
            Your linked QR profile is already live in the dashboard and the physical product has moved into fulfillment.
          </p>
          <div style="background: #111827; border-radius: 16px; padding: 20px; margin-bottom: 20px;">
            <p style="margin: 0 0 8px; color: #94a3b8; font-size: 12px; text-transform: uppercase;">What happens next</p>
            <p style="margin: 0 0 8px; color: #fff;">1. We print the same permanent QR linked to your dashboard.</p>
            <p style="margin: 0 0 8px; color: #fff;">2. The order moves through processing and shipping.</p>
            <p style="margin: 0; color: #fff;">3. Tracking becomes visible in your dashboard after dispatch.</p>
          </div>
          <div style="display: flex; gap: 12px; flex-wrap: wrap;">
            <a href="${orderUrl}" style="display: inline-block; background: #ff6b2c; color: #fff; text-decoration: none; padding: 12px 18px; border-radius: 12px; font-weight: 700;">View order</a>
            ${
              qrUrl
                ? `<a href="${qrUrl}" style="display: inline-block; background: transparent; color: #fff; text-decoration: none; padding: 12px 18px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.12); font-weight: 700;">Open linked QR</a>`
                : ""
            }
          </div>
        </div>
      </div>
    `,
  });
}
