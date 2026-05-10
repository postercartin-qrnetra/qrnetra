import { notFound } from "next/navigation";
import { createPublicServerClient } from "@/lib/supabase/public-server";
import { ScanLogClient } from "@/components/scan-log-client";
import type { PublicQrScanPayload } from "@/lib/qr/public-payload";
import { digitsForWhatsApp } from "@/lib/qr/public-payload";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

function ActionLink({
  href,
  label,
  primary,
}: {
  href: string;
  label: string;
  primary?: boolean;
}) {
  return (
    <a
      href={href}
      className={`flex min-h-[52px] w-full items-center justify-center rounded-2xl text-base font-semibold transition-transform active:scale-[0.99] ${
        primary
          ? "bg-[#ffd400] text-[#111111] shadow-lg shadow-[#ffd400]/20"
          : "border-2 border-zinc-200 bg-white text-[#111111] hover:border-zinc-300"
      }`}
    >
      {label}
    </a>
  );
}

export default async function PublicScanPage({ params }: Props) {
  const { slug } = await params;

  let data: PublicQrScanPayload | null = null;
  try {
    const supabase = createPublicServerClient();
    const { data: rpcData, error } = await supabase.rpc(
      "get_qr_for_public_scan",
      { p_slug: slug },
    );
    if (error) {
      console.error(error.message);
      notFound();
    }
    data = rpcData as PublicQrScanPayload | null;
  } catch {
    notFound();
  }

  if (!data?.id) {
    notFound();
  }

  const ch = data.channels ?? {};
  const waDigits = digitsForWhatsApp(data.whatsapp_phone);
  const waHref =
    ch.whatsapp && waDigits ? `https://wa.me/${waDigits}` : null;

  const kind = data.kind;

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white px-4 pb-12 pt-8">
      <ScanLogClient qrId={data.id} />

      <div className="mx-auto max-w-md">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
          QRNetra
        </p>
        <h1 className="mt-2 text-center text-2xl font-bold tracking-tight text-[#111111]">
          {kind === "vehicle" && data.vehicle_registration
            ? `Vehicle ${data.vehicle_registration}`
            : kind === "child"
              ? data.title
                ? `Child · ${data.title}`
                : "Child safety"
              : kind === "pet"
                ? data.title
                  ? `${data.title}`
                  : "Pet tag"
                : kind === "business"
                  ? data.title ?? "Fleet contact"
                  : data.title ?? "Safety tag"}
        </h1>
        <p className="mt-2 text-center text-sm text-zinc-500">
          Emergency contact · your number stays private until you connect
        </p>

        {data.message ? (
          <p className="mt-6 rounded-2xl border border-zinc-100 bg-white px-4 py-3 text-center text-sm leading-relaxed text-zinc-700 shadow-sm">
            {data.message}
          </p>
        ) : null}

        <div className="mt-8 flex flex-col gap-3">
          {kind === "vehicle" ? (
            <>
              {ch.call && data.owner_phone ? (
                <ActionLink
                  href={`tel:${data.owner_phone.replace(/\s/g, "")}`}
                  label="Call owner"
                  primary
                />
              ) : null}
              {waHref ? (
                <ActionLink href={waHref} label="WhatsApp owner" />
              ) : null}
              {data.alternate_contact ? (
                <ActionLink
                  href={`tel:${data.alternate_contact.replace(/\s/g, "")}`}
                  label="Alternate / emergency contact"
                />
              ) : null}
            </>
          ) : null}

          {kind === "child" ? (
            <>
              {ch.call && data.owner_phone ? (
                <ActionLink
                  href={`tel:${data.owner_phone.replace(/\s/g, "")}`}
                  label="Call parent / guardian"
                  primary
                />
              ) : null}
              {data.emergency_phone ? (
                <ActionLink
                  href={`tel:${data.emergency_phone.replace(/\s/g, "")}`}
                  label="Emergency contact"
                />
              ) : null}
              {(data.blood_group || data.allergies) && (
                <details className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm open:shadow-md">
                  <summary className="cursor-pointer text-sm font-semibold text-[#111111]">
                    Medical info
                  </summary>
                  <div className="mt-3 space-y-2 text-sm text-zinc-700">
                    {data.blood_group ? (
                      <p>
                        <span className="font-medium text-zinc-900">
                          Blood group:{" "}
                        </span>
                        {data.blood_group}
                      </p>
                    ) : null}
                    {data.allergies ? (
                      <p>
                        <span className="font-medium text-zinc-900">
                          Allergies:{" "}
                        </span>
                        {data.allergies}
                      </p>
                    ) : null}
                  </div>
                </details>
              )}
            </>
          ) : null}

          {kind === "pet" ? (
            <>
              {ch.call && data.owner_phone ? (
                <ActionLink
                  href={`tel:${data.owner_phone.replace(/\s/g, "")}`}
                  label="Contact owner"
                  primary
                />
              ) : null}
              {waHref ? <ActionLink href={waHref} label="WhatsApp owner" /> : null}
              {data.vet_phone ? (
                <ActionLink
                  href={`tel:${data.vet_phone.replace(/\s/g, "")}`}
                  label="Vet / clinic"
                />
              ) : null}
              {data.breed || data.medical_notes ? (
                <details className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
                  <summary className="cursor-pointer text-sm font-semibold text-[#111111]">
                    Pet details
                  </summary>
                  <div className="mt-3 space-y-2 text-sm text-zinc-700">
                    {data.breed ? (
                      <p>
                        <span className="font-medium">Breed: </span>
                        {data.breed}
                      </p>
                    ) : null}
                    {data.medical_notes ? (
                      <p>
                        <span className="font-medium">Notes: </span>
                        {data.medical_notes}
                      </p>
                    ) : null}
                  </div>
                </details>
              ) : null}
            </>
          ) : null}

          {kind === "business" ? (
            <>
              {ch.call && data.owner_phone ? (
                <ActionLink
                  href={`tel:${data.owner_phone.replace(/\s/g, "")}`}
                  label="Admin contact"
                  primary
                />
              ) : null}
              {data.business_emergency ? (
                <ActionLink
                  href={`tel:${data.business_emergency.replace(/\s/g, "")}`}
                  label="Emergency line"
                />
              ) : null}
              {waHref ? (
                <ActionLink href={waHref} label="WhatsApp" />
              ) : null}
              {data.fleet_size ? (
                <p className="text-center text-xs text-zinc-500">
                  Fleet: {data.fleet_size}
                </p>
              ) : null}
            </>
          ) : null}

          {kind === "other" ? (
            <>
              {ch.call && data.owner_phone ? (
                <ActionLink
                  href={`tel:${data.owner_phone.replace(/\s/g, "")}`}
                  label="Call"
                  primary
                />
              ) : null}
              {waHref ? <ActionLink href={waHref} label="WhatsApp" /> : null}
            </>
          ) : null}
        </div>

        <p className="mt-10 text-center text-xs leading-relaxed text-zinc-400">
          If this is a life-threatening emergency, contact local emergency
          services. QRNetra helps you reach the owner — it is not a substitute
          for emergency services.
        </p>
      </div>
    </div>
  );
}
