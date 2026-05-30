import { PhysicalTagActivation } from "@/components/activate/physical-tag-activation";
import { MobileHeader } from "@/components/mobile/mobile-header";
import { QnLogoStatic } from "@/components/ui/logo";
import {
  PRODUCT_TYPE_LABELS,
  normalizePublicTagId,
  type TagProductType,
} from "@/lib/inventory/types";
import { CREATE_MOBILE_MENU_LINKS } from "@/lib/navigation/mobile-nav";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ tagId: string }> };

export const metadata: Metadata = {
  title: "Activate Tag · QR Netra",
  description: "Activate your QRNetra physical tag after purchase.",
};

function ActivateShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-qn-bg">
      <MobileHeader menuLinks={CREATE_MOBILE_MENU_LINKS} />
      <header className="hidden border-b border-white/[0.08] bg-qn-bg-elevated md:block">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4 sm:px-6">
          <QnLogoStatic layout="compact" href="/" />
          <Link href="/activate" className="text-sm text-qn-muted hover:text-white">
            Enter tag manually
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-xl px-4 py-8 sm:px-6 sm:py-12">{children}</main>
    </div>
  );
}

type TagRpcPayload = {
  ok?: boolean;
  error?: string;
  public_tag_id?: string;
  product_type?: TagProductType;
  status?: string;
  qr_slug?: string | null;
  is_activatable?: boolean;
};

export default async function ActivateTagByIdPage({ params }: Props) {
  const { tagId: rawTagId } = await params;
  const publicTagId = normalizePublicTagId(decodeURIComponent(rawTagId));

  if (!publicTagId || !/^[VPBC]-QRN-\d{6}$/.test(publicTagId)) {
    notFound();
  }

  const supabase = await createClient();
  if (!supabase) {
    return (
      <ActivateShell>
        <p className="text-sm text-qn-warning">Server configuration is missing.</p>
      </ActivateShell>
    );
  }

  const { data: contextRaw, error: contextError } = await supabase.rpc(
    "get_tag_by_public_id",
    { p_public_tag_id: publicTagId },
  );

  const context =
    contextRaw && typeof contextRaw === "object"
      ? (contextRaw as TagRpcPayload)
      : null;

  if (contextError || !context?.ok) {
    notFound();
  }

  const productType = context.product_type ?? null;
  const productLabel =
    productType && productType in PRODUCT_TYPE_LABELS
      ? PRODUCT_TYPE_LABELS[productType as TagProductType]
      : "QRNetra Tag";

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const loginNext = `/activate/${encodeURIComponent(publicTagId)}`;

  return (
    <ActivateShell>
      <PhysicalTagActivation
        tag={{
          publicTagId: context.public_tag_id ?? publicTagId,
          productLabel,
          productType,
          status: context.status ?? "generated",
          isActivatable: Boolean(context.is_activatable),
          qrSlug: context.qr_slug ?? null,
        }}
        isLoggedIn={Boolean(user)}
        userEmail={user?.email ?? null}
        loginNext={loginNext}
      />
    </ActivateShell>
  );
}
