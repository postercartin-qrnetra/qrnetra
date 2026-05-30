import { MobileHeader } from "@/components/mobile/mobile-header";
import { QnLogoStatic } from "@/components/ui/logo";
import { normalizePublicTagId } from "@/lib/inventory/types";
import { CREATE_MOBILE_MENU_LINKS } from "@/lib/navigation/mobile-nav";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

type Props = {
  searchParams: Promise<{ code?: string; tag?: string }>;
};

export const metadata: Metadata = {
  title: "Activate Tag · QR Netra",
  description:
    "Activate your QRNetra physical tag after purchase from Amazon, Flipkart, or our store.",
};

function ActivateShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-qn-bg">
      <MobileHeader menuLinks={CREATE_MOBILE_MENU_LINKS} />
      <header className="hidden border-b border-white/[0.08] bg-qn-bg-elevated md:block">
        <div className="mx-auto flex h-14 max-w-3xl items-center px-4 sm:px-6">
          <QnLogoStatic layout="compact" href="/" />
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}

export default async function ActivateLandingPage({ searchParams }: Props) {
  const { code: rawCode, tag: rawTag } = await searchParams;

  if (rawTag?.trim()) {
    const tagId = normalizePublicTagId(rawTag);
    redirect(`/activate/${encodeURIComponent(tagId)}`);
  }

  if (rawCode?.trim()) {
    redirect(`/activate/legacy?code=${encodeURIComponent(rawCode.trim())}`);
  }

  return (
    <ActivateShell>
      <div className="mx-auto max-w-xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="qn-card p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-qn-accent">
            Activate physical tag
          </p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-white">
            Already purchased a QRNetra product?
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-qn-muted">
            Scan the QR on your sticker or enter your Tag ID below. You will sign in,
            verify the activation code from your packaging, and set up your emergency
            profile.
          </p>

          <form method="GET" action="/activate" className="mt-6 space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-white">Tag ID</span>
              <input
                type="text"
                name="tag"
                placeholder="e.g. V-QRN-000001"
                className="qn-input mt-2 w-full font-mono uppercase"
                required
              />
            </label>
            <button type="submit" className="qn-btn-primary w-full">
              Continue
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-qn-muted">
            Have only an activation code from older packaging?{" "}
            <Link href="/activate/legacy" className="text-qn-accent hover:underline">
              Use legacy activation
            </Link>
          </p>

          <Link
            href="/activation-guide"
            className="mt-4 block text-center text-sm text-qn-accent hover:underline"
          >
            Read the activation guide
          </Link>
        </div>
      </div>
    </ActivateShell>
  );
}
