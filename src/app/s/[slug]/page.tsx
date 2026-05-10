import { notFound } from "next/navigation";
import { createPublicServerClient } from "@/lib/supabase/public-server";
import { ScanLogClient } from "@/components/scan-log-client";
import { ScanChannelPanel } from "@/components/scan-channel-panel";

export const dynamic = "force-dynamic";

type PublicQr = {
  id: string;
  slug: string;
  kind: string;
  title: string | null;
  message: string | null;
  vehicle_registration: string | null;
  channels: {
    call?: boolean;
    whatsapp?: boolean;
    sms?: boolean;
    email?: boolean;
  } | null;
};

type Props = { params: Promise<{ slug: string }> };

export default async function PublicScanPage({ params }: Props) {
  const { slug } = await params;

  let data: PublicQr | null = null;
  try {
    const supabase = createPublicServerClient();
    const { data: rpcData, error } = await supabase.rpc("get_qr_for_public_scan", {
      p_slug: slug,
    });
    if (error) {
      console.error(error.message);
      notFound();
    }
    data = rpcData as PublicQr | null;
  } catch {
    notFound();
  }

  if (!data?.id) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-100 px-4 py-10">
      <div className="mx-auto max-w-md">
        <p className="text-center text-xs font-medium uppercase tracking-wide text-zinc-500">
          QRNetra · Emergency contact
        </p>
        <h1 className="mt-2 text-center text-2xl font-semibold text-zinc-900">
          {data.title ?? "Safety tag"}
        </h1>
        <p className="mt-1 text-center text-sm text-zinc-500">
          {data.kind === "vehicle" ? "Vehicle" : data.kind} · Owner phone not shown
        </p>

        {data.message ? (
          <p className="mt-6 rounded-xl bg-white p-4 text-center text-base leading-relaxed text-zinc-800 shadow-sm">
            {data.message}
          </p>
        ) : null}

        {data.vehicle_registration ? (
          <p className="mt-4 text-center text-sm text-zinc-600">
            Vehicle: <span className="font-medium">{data.vehicle_registration}</span>
          </p>
        ) : null}

        <ScanChannelPanel channels={data.channels} />

        <ScanLogClient qrId={data.id} />

        <p className="mt-10 text-center text-xs text-zinc-400">
          If this is an emergency, contact local authorities when appropriate.
        </p>
      </div>
    </div>
  );
}
