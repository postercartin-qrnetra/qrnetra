import { CreateProfileForm } from "@/components/create-profile-form";
import { MobileHeader } from "@/components/mobile/mobile-header";
import { QnLogoStatic } from "@/components/ui/logo";
import { CREATE_MOBILE_MENU_LINKS } from "@/lib/navigation/mobile-nav";
import type { QrKind } from "@/lib/qr/types";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

type Props = {
  searchParams: Promise<{ code?: string }>;
};

type ActivationContext = {
  ok?: boolean;
  error?: string;
  activation_code?: string;
  status?: string;
  sku_label?: string | null;
  product_title?: string | null;
  product_slug?: string | null;
  qr_slug?: string | null;
};

export const metadata: Metadata = {
  title: "Activate Tag · QR Netra",
  description:
    "Activate a purchased QRNetra sticker or tag by completing your QR profile after scanning the activation code.",
};

function inferInitialType(
  productSlug?: string | null,
  productTitle?: string | null,
  skuLabel?: string | null,
): QrKind {
  const source = `${productSlug ?? ""} ${productTitle ?? ""} ${skuLabel ?? ""}`.toLowerCase();

  if (
    source.includes("vehicle") ||
    source.includes("car") ||
    source.includes("bike") ||
    source.includes("helmet") ||
    source.includes("parking")
  ) {
    return "vehicle";
  }

  if (source.includes("pet") || source.includes("dog") || source.includes("cat")) {
    return "pet";
  }

  if (
    source.includes("kid") ||
    source.includes("child") ||
    source.includes("school") ||
    source.includes("wristband")
  ) {
    return "child";
  }

  if (
    source.includes("asset") ||
    source.includes("keys") ||
    source.includes("wallet") ||
    source.includes("laptop") ||
    source.includes("luggage")
  ) {
    return "asset";
  }

  return "vehicle";
}

function ActivatePageShell({ children }: { children: React.ReactNode }) {
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

function ActivationCodeEntry({
  initialCode = "",
  error,
}: {
  initialCode?: string;
  error?: string | null;
}) {
  return (
    <div className="mx-auto max-w-xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="qn-card p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-qn-accent">
          Activate Physical Tag
        </p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-white">
          Enter your activation code
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-qn-muted">
          Scan the activation QR from your purchased sticker, or enter the code
          manually to continue.
        </p>

        <form method="GET" action="/activate" className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-white">Activation code</span>
            <input
              type="text"
              name="code"
              defaultValue={initialCode}
              placeholder="Paste or type the code printed with your tag"
              className="qn-input mt-2 w-full"
            />
          </label>
          {error ? <p className="text-sm text-qn-warning">{error}</p> : null}
          <button type="submit" className="qn-btn-primary w-full">
            Continue to activation
          </button>
        </form>
      </div>
    </div>
  );
}

export default async function ActivatePage({ searchParams }: Props) {
  const { code: rawCode } = await searchParams;
  const code = rawCode?.trim() ?? "";

  if (!code) {
    return (
      <ActivatePageShell>
        <ActivationCodeEntry />
      </ActivatePageShell>
    );
  }

  const supabase = await createClient();
  if (!supabase) {
    return (
      <ActivatePageShell>
        <ActivationCodeEntry
          initialCode={code}
          error="Server configuration is missing. Please try again later."
        />
      </ActivatePageShell>
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(`/activate?code=${code}`)}`);
  }

  const { data: contextRaw, error: contextError } = await supabase.rpc(
    "get_tag_activation_context",
    {
      p_activation_code: code,
    },
  );

  const context =
    contextRaw && typeof contextRaw === "object"
      ? (contextRaw as ActivationContext)
      : null;

  if (contextError || !context?.ok) {
    return (
      <ActivatePageShell>
        <ActivationCodeEntry
          initialCode={code}
          error={contextError?.message ?? context?.error ?? "Activation code not found."}
        />
      </ActivatePageShell>
    );
  }

  if (context.status === "activated") {
    return (
      <ActivatePageShell>
        <div className="mx-auto max-w-xl px-4 py-10 sm:px-6 sm:py-14">
          <div className="qn-card p-6 text-center sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-qn-accent">
              Tag Already Active
            </p>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-white">
              This physical tag has already been activated
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-qn-muted">
              If this is your tag, jump to your dashboard or open the public scan
              page linked to it.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <Link href="/dashboard/tags" className="qn-btn-primary w-full">
                Go to My Tags
              </Link>
              {context.qr_slug ? (
                <Link href={`/s/${context.qr_slug}`} className="qn-btn-secondary w-full">
                  Open public scan page
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </ActivatePageShell>
    );
  }

  const initialType = inferInitialType(
    context.product_slug,
    context.product_title,
    context.sku_label,
  );

  return (
    <ActivatePageShell>
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="qn-card mb-6 p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-qn-accent">
            Physical Tag Ready
          </p>
          <h2 className="mt-2 text-xl font-bold text-white">
            {context.product_title ?? context.sku_label ?? "QRNetra Tag"}
          </h2>
          <p className="mt-2 text-sm text-qn-muted">
            Complete your owner profile to connect this physical tag to your QR
            dashboard and public scan page.
          </p>
        </div>

        <CreateProfileForm
          initialType={initialType}
          initialEmail={user.email ?? null}
          activationCode={code}
          flow="activate"
        />
      </div>
    </ActivatePageShell>
  );
}
