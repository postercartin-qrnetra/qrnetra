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
  product_title?: string | null;
  product_type?: string | null;
  public_tag_id?: string | null;
  qr_slug?: string | null;
};

export const metadata: Metadata = {
  title: "Legacy activation · QR Netra",
  robots: { index: false },
};

function inferInitialType(productType?: string | null): QrKind {
  switch (productType) {
    case "pet_tag":
      return "pet";
    case "child_wristband":
    case "child_bag_tag":
      return "child";
    case "business_asset_tag":
      return "asset";
    default:
      return "vehicle";
  }
}

export default async function LegacyActivatePage({ searchParams }: Props) {
  const { code: rawCode } = await searchParams;
  const code = rawCode?.trim() ?? "";

  if (!code) {
    return (
      <div className="min-h-screen bg-qn-bg">
        <MobileHeader menuLinks={CREATE_MOBILE_MENU_LINKS} />
        <div className="mx-auto max-w-xl px-4 py-10">
          <div className="qn-card p-6">
            <h1 className="text-xl font-bold text-white">Legacy activation code</h1>
            <form method="GET" className="mt-4 space-y-4">
              <input
                type="text"
                name="code"
                placeholder="Activation code"
                className="qn-input w-full"
              />
              <button type="submit" className="qn-btn-primary w-full">
                Continue
              </button>
            </form>
            <Link href="/activate" className="mt-4 block text-sm text-qn-accent">
              ← Back to Tag ID activation
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const supabase = await createClient();
  if (!supabase) {
    return <p className="p-8 text-qn-warning">Server configuration missing.</p>;
  }

  if (code.match(/^[VPBC]-QRN-\d{6}$/i)) {
    redirect(`/activate/${encodeURIComponent(code.toUpperCase())}`);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(`/activate/legacy?code=${code}`)}`);
  }

  const { data: contextRaw, error: contextError } = await supabase.rpc(
    "get_tag_activation_context",
    { p_activation_code: code },
  );

  const context =
    contextRaw && typeof contextRaw === "object"
      ? (contextRaw as ActivationContext)
      : null;

  if (context?.public_tag_id) {
    redirect(`/activate/${encodeURIComponent(context.public_tag_id)}`);
  }

  if (contextError || !context?.ok) {
    return (
      <div className="min-h-screen bg-qn-bg p-8">
        <p className="text-qn-warning">
          {contextError?.message ?? context?.error ?? "Code not found."}
        </p>
        <Link href="/activate" className="mt-4 text-qn-accent">
          Try Tag ID activation
        </Link>
      </div>
    );
  }

  if (context.status === "activated") {
    return (
      <div className="min-h-screen bg-qn-bg p-8 text-center">
        <p className="text-white">Tag already activated.</p>
        <Link href="/dashboard/tags" className="qn-btn-primary mt-4 inline-flex">
          My Tags
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-qn-bg">
      <header className="border-b border-white/[0.08] px-4 py-3">
        <QnLogoStatic layout="compact" href="/" />
      </header>
      <div className="mx-auto max-w-3xl px-4 py-8">
        <CreateProfileForm
          initialType={inferInitialType(context.product_type)}
          initialEmail={user.email ?? null}
          activationCode={code}
          flow="activate"
        />
      </div>
    </div>
  );
}
