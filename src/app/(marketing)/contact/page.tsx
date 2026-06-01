import { ContactForm } from "@/components/contact/contact-form";
import { MarketingPageLayout } from "@/components/content/marketing-page-layout";
import { SUPPORT_CONTACT } from "@/lib/support/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | QRNetra",
  description: "Get in touch with the QRNetra team for orders, activation, and support.",
};

const contactContent = {
  title: "Contact us",
  description:
    "We read every message. For urgent order or activation issues, include your order number or Tag ID.",
  hero: undefined,
  sections: [
    {
      id: "reach",
      title: "Reach us directly",
      body: `Email: ${SUPPORT_CONTACT.email} · Phone: ${SUPPORT_CONTACT.phoneDisplay}`,
      list: [
        `Email: ${SUPPORT_CONTACT.email}`,
        `Phone / WhatsApp: ${SUPPORT_CONTACT.phoneDisplay}`,
        "We typically respond within 1–2 business days.",
      ],
    },
  ],
};

export default function ContactPage() {
  return (
    <MarketingPageLayout
      content={contactContent}
      breadcrumb={[{ href: "/", label: "Home" }, { href: "/contact", label: "Contact" }]}
    >
      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <a
          href={`mailto:${SUPPORT_CONTACT.email}`}
          className="qn-card block p-5 text-sm text-qn-muted hover:border-qn-accent/40"
        >
          <p className="font-semibold text-white">Email</p>
          <p className="mt-2">{SUPPORT_CONTACT.email}</p>
        </a>
        <a
          href={SUPPORT_CONTACT.whatsappUrl}
          className="qn-card block p-5 text-sm text-qn-muted hover:border-qn-accent/40"
        >
          <p className="font-semibold text-white">Phone / WhatsApp</p>
          <p className="mt-2">{SUPPORT_CONTACT.phoneDisplay}</p>
        </a>
      </div>
      <div className="mt-10">
        <h2 className="text-lg font-semibold text-white">Send a message</h2>
        <div className="mt-4">
          <ContactForm />
        </div>
      </div>
    </MarketingPageLayout>
  );
}
