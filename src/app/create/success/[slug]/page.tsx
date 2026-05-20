import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getPublicSiteUrl } from "@/lib/site-url";
import { QrDeliveryCard } from "@/components/qr-delivery-card";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `QR Ready · ${slug} · QRNetra`,
  };
}

export default async function CreateSuccessPage({ params }: Props) {
  const { slug } = await params;

  const supabase = await createClient();
  if (!supabase) {
    redirect("/create");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=/create/success/${encodeURIComponent(slug)}`);
  }

  const { data: qr, error } = await supabase
    .from("qrs")
    .select(
      "id, public_slug, kind, title, vehicle_registration, whatsapp_e164, status",
    )
    .eq("public_slug", slug)
    .eq("owner_user_id", user.id)
    .single();

  if (error || !qr) {
    notFound();
  }

  const site = getPublicSiteUrl();
  const scanUrl = `${site}/s/${qr.public_slug}`;

  return (
    <QrDeliveryCard
      slug={qr.public_slug}
      scanUrl={scanUrl}
      title={qr.title ?? qr.vehicle_registration ?? "Emergency QR"}
      kind={qr.kind}
      vehicleReg={qr.vehicle_registration}
      whatsappNumber={qr.whatsapp_e164}
    />
  );
}
