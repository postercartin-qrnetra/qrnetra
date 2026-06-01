import "server-only";

import { Resend } from "resend";
import type { SupportCategory } from "@/lib/support/types";
import { SUPPORT_CONTACT } from "@/lib/support/types";

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

function fromAddress() {
  return (
    process.env.RESEND_FROM_EMAIL?.trim() ||
    process.env.ORDER_FROM_EMAIL?.trim() ||
    "QRNetra <hello@qrnetra.com>"
  );
}

export async function sendSupportNotificationEmail(input: {
  category: SupportCategory | "contact";
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string | null;
  orderNumber?: string | null;
  requestId?: string;
}) {
  const resend = getResendClient();
  if (!resend) return;

  const to = process.env.SUPPORT_INBOX_EMAIL?.trim() || SUPPORT_CONTACT.email;

  await resend.emails.send({
    from: fromAddress(),
    to,
    replyTo: input.email,
    subject: `[QRNetra ${input.category}] ${input.subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
        <h2 style="margin: 0 0 12px;">New ${input.category === "contact" ? "contact" : "support"} message</h2>
        <p><strong>From:</strong> ${input.name} &lt;${input.email}&gt;</p>
        ${input.phone ? `<p><strong>Phone:</strong> ${input.phone}</p>` : ""}
        ${input.orderNumber ? `<p><strong>Order:</strong> ${input.orderNumber}</p>` : ""}
        ${input.requestId ? `<p><strong>Request ID:</strong> ${input.requestId}</p>` : ""}
        <p><strong>Category:</strong> ${input.category}</p>
        <p><strong>Subject:</strong> ${input.subject}</p>
        <hr style="margin: 16px 0; border: none; border-top: 1px solid #ddd;" />
        <p style="white-space: pre-wrap;">${input.message}</p>
      </div>
    `,
  });
}
