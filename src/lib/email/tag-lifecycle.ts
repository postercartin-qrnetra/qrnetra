import "server-only";

import { Resend } from "resend";
import { getPublicSiteUrl } from "@/lib/site-url";

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

export async function sendTagActivatedEmail(input: {
  to: string;
  publicTagId: string;
  productTitle: string;
  scanSlug: string;
}) {
  const resend = getResendClient();
  if (!resend || !input.to) return;

  const site = getPublicSiteUrl();
  const dashboardUrl = `${site}/dashboard/tags`;
  const scanUrl = `${site}/s/${input.scanSlug}`;

  await resend.emails.send({
    from: fromAddress(),
    to: input.to,
    subject: `Tag activated · ${input.publicTagId}`,
    html: `
      <div style="font-family: Arial, sans-serif; background: #020817; color: #fff; padding: 32px;">
        <div style="max-width: 640px; margin: 0 auto; background: #0f172a; border-radius: 20px; padding: 32px;">
          <p style="color: #ff6b2c; font-size: 12px; font-weight: 700; text-transform: uppercase;">Tag activated</p>
          <h1 style="font-size: 24px;">Your ${input.productTitle} is live</h1>
          <p style="color: #cbd5e1; line-height: 1.6;">
            Tag <strong>${input.publicTagId}</strong> is now linked to your account.
            Finders can scan your product to reach your emergency profile — no app required.
          </p>
          <p style="margin-top: 24px;">
            <a href="${dashboardUrl}" style="background: #ff6b2c; color: #fff; padding: 12px 18px; border-radius: 12px; text-decoration: none; font-weight: 700;">Open My Tags</a>
            &nbsp;
            <a href="${scanUrl}" style="color: #fff; padding: 12px 18px; border: 1px solid rgba(255,255,255,0.12); border-radius: 12px; text-decoration: none;">Preview public page</a>
          </p>
        </div>
      </div>
    `,
  });
}

export async function sendTagDisabledEmail(input: {
  to: string;
  publicTagId: string;
}) {
  const resend = getResendClient();
  if (!resend || !input.to) return;

  const site = getPublicSiteUrl();

  await resend.emails.send({
    from: fromAddress(),
    to: input.to,
    subject: `Tag deactivated · ${input.publicTagId}`,
    html: `
      <p>Your QRNetra tag <strong>${input.publicTagId}</strong> has been deactivated. Public scans will not show your profile.</p>
      <p><a href="${site}/dashboard/tags">Manage tags</a></p>
    `,
  });
}
