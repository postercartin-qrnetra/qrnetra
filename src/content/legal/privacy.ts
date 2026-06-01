import type { LegalPageContent } from "@/content/types";

export const privacyPolicyContent: LegalPageContent = {
  title: "Privacy Policy",
  description:
    "This policy explains how QRNetra collects, uses, and protects information when you create an account, set up a QR profile, purchase a physical tag, or when someone scans your public tag.",
  lastUpdated: "1 June 2026",
  sections: [
    {
      id: "who",
      title: "Who we are",
      body: "QRNetra provides privacy-first dynamic QR tags and digital profiles for vehicles, children, pets, belongings, and business assets. We are based in India and serve customers through our website, dashboard, and partner channels including Amazon.",
    },
    {
      id: "collect",
      title: "Information we collect",
      paragraphs: [
        "Account data: email address, password (stored securely by our auth provider), display name, and optional account phone number.",
        "Profile data: names, contact numbers, emergency details, vehicle registration, school or medical notes you choose to add to a QR profile. This is shown to finders only through your public scan page according to your settings.",
        "Order data: shipping address, contact phone, email, payment status, and fulfillment details for physical products.",
        "Scan events: when someone opens your public tag or taps call, WhatsApp, or emergency actions, we log event type, approximate location from IP (city/country), optional GPS coordinates if the finder shares them, device/browser type, and timestamp.",
        "Support messages: information you send through contact or support forms.",
      ],
    },
    {
      id: "location",
      title: "Location data",
      body: "Finders may optionally share precise GPS location when contacting you. City and region may also be inferred from IP address when an event is recorded. You can see scan activity in your dashboard. We do not sell location data.",
    },
    {
      id: "cookies",
      title: "Cookies and similar technologies",
      body: "We use cookies and local storage for authentication sessions, security, and remembering preferences. See our Cookie Policy for details.",
    },
    {
      id: "why",
      title: "How we use information",
      list: [
        "Operate your account and QR profiles",
        "Print and deliver physical products you order",
        "Send scan and emergency email alerts you have not turned off",
        "Send order and activation updates",
        "Improve reliability and prevent abuse",
        "Respond to support requests",
      ],
    },
    {
      id: "sharing",
      title: "Third-party services",
      paragraphs: [
        "We use trusted providers to run QRNetra: Supabase (database and authentication), Vercel (hosting), Razorpay (payments), Resend (transactional email), and optional Google sign-in if you choose it.",
        "These providers process data only to deliver the service. Public scan pages show the contact information you configure—they are visible to anyone who scans your QR.",
      ],
    },
    {
      id: "security",
      title: "Security and retention",
      body: "We use industry-standard practices including encrypted connections, access controls, and row-level security in our database. We retain account and scan data while your account is active. If you request deletion, we follow our account deletion process described in settings.",
    },
    {
      id: "rights",
      title: "Your rights",
      list: [
        "Access and update profile information in your dashboard",
        "Export profile, order, and scan data from account settings",
        "Control email notification preferences",
        "Request account deactivation or scheduled deletion",
        "Contact us with privacy questions at qrnetra@gmail.com",
      ],
    },
    {
      id: "contact",
      title: "Contact",
      body: "Questions about this policy: qrnetra@gmail.com or +91 70214 54183.",
    },
  ],
};
