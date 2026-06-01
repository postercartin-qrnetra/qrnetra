import { QnLogoStatic } from "@/components/ui/logo";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { PublicScanClient } from "@/components/scan/public-scan-client";
import { createPublicServerClient } from "@/lib/supabase/public-server";
import type { PublicQrScanPayload } from "@/lib/qr/public-payload";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export default async function PublicScanPage({ params }: Props) {
  const { slug } = await params;

  const supabase = createPublicServerClient();
  if (!supabase) {
    notFound();
  }

  let data: PublicQrScanPayload | null = null;
  let rpcFailed = false;
  try {
    const { data: rpcData, error } = await supabase.rpc(
      "get_qr_for_public_scan",
      { p_slug: slug },
    );
    if (error) {
      console.error("public scan RPC error:", error.message);
      rpcFailed = true;
    } else {
      data = rpcData as PublicQrScanPayload | null;
    }
  } catch (e) {
    console.error("public scan RPC threw:", e);
    rpcFailed = true;
  }

  const { data: gateRaw } = await supabase.rpc("get_tag_public_gate", {
    p_slug: slug,
  });
  const gate =
    gateRaw && typeof gateRaw === "object"
      ? (gateRaw as { blocked?: boolean; message?: string })
      : null;

  if (gate?.blocked) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-qn-bg px-6 text-center">
        <QnLogoStatic layout="compact" href="/" />
        <h1 className="mt-8 text-xl font-bold text-white">
          {gate.message ?? "This tag is currently unavailable."}
        </h1>
        <p className="mt-3 max-w-sm text-sm text-qn-muted">
          If you are the owner, sign in to your dashboard or contact QRNetra support.
        </p>
        <Link
          href="/contact"
          className="qn-btn-secondary mt-8 inline-flex px-6"
        >
          Contact support
        </Link>
      </div>
    );
  }

  if (rpcFailed || !data?.id) {
    const { data: unactivatedRaw } = await supabase.rpc(
      "get_unactivated_tag_for_slug",
      { p_slug: slug },
    );
    const unactivated =
      unactivatedRaw && typeof unactivatedRaw === "object"
        ? (unactivatedRaw as { ok?: boolean; public_tag_id?: string })
        : null;
    if (unactivated?.ok && unactivated.public_tag_id) {
      redirect(`/activate/${encodeURIComponent(unactivated.public_tag_id)}`);
    }
    notFound();
  }

  const qrStatus = (data.status ?? "active").toLowerCase();

  if (qrStatus === "disabled") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-qn-surface px-6 py-16 text-center">
        <QnLogoStatic layout="compact" />
        <h1 className="mt-4 text-2xl font-bold text-white">
          This QR is inactive
        </h1>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-qn-muted">
          The owner has disabled this emergency tag. If you need help, contact
          local authorities or emergency services.
        </p>
        <p className="mt-8 font-mono text-xs text-qn-muted-2">{data.slug}</p>
      </div>
    );
  }

  if (qrStatus === "paused") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-qn-surface px-6 py-16 text-center">
        <QnLogoStatic layout="compact" />
        <h1 className="mt-4 text-2xl font-bold text-white">
          Temporarily unavailable
        </h1>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-qn-muted">
          This emergency QR is paused by the owner. Please try again later or
          use another way to reach them.
        </p>
        <p className="mt-8 font-mono text-xs text-qn-muted-2">{data.slug}</p>
      </div>
    );
  }

  return <PublicScanClient data={data} />;
}
