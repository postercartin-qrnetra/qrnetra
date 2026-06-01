import type { LegalPageContent } from "@/content/types";

export const cookiePolicyContent: LegalPageContent = {
  title: "Cookie Policy",
  description: "How QRNetra uses cookies and similar technologies on our website.",
  lastUpdated: "1 June 2026",
  sections: [
    {
      id: "what",
      title: "What are cookies?",
      body: "Cookies are small text files stored on your device when you visit a website. They help the site remember your login, keep you secure, and understand how the service is used.",
    },
    {
      id: "essential",
      title: "Essential cookies",
      body: "We use cookies required for authentication, session management, and security. Without these, you cannot sign in or use the dashboard.",
    },
    {
      id: "preferences",
      title: "Preferences",
      body: "We may store preferences such as draft form data locally in your browser to improve your experience when creating a profile.",
    },
    {
      id: "analytics",
      title: "Analytics",
      body: "We may use privacy-conscious analytics to understand traffic and fix errors. We do not sell cookie data to advertisers.",
    },
    {
      id: "control",
      title: "Your choices",
      body: "You can clear cookies in your browser settings. Note that signing out or blocking essential cookies will prevent account access.",
    },
  ],
};
