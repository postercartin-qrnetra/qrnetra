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
  variant,
}: {
  href: string;
  label: string;
  primary?: boolean;
  variant?: "green";
}) {
  return (
    <a
      href={href}
      className={`flex min-h-[52px] w-full items-center justify-center rounded-2xl text-base font-semibold transition-transform active:scale-[0.99] ${
        primary
          ? "bg-[#ffd400] text-[#111111] shadow-lg shadow-[#ffd400]/20"
          : variant === "green"
            ? "border-2 border-[#25D366] bg-white text-[#111111] hover:bg-green-50"
            : "border-2 border-zinc-200 bg-white text-[#111111] hover:border-zinc-300"
      }`}
    >
      {label}
    </a>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <span className="min-w-[110px] text-xs font-semibold text-zinc-500">
        {label}
      </span>
      <span className="text-sm text-zinc-800">{value}</span>
    </div>
  );
}

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

  if (rpcFailed || !data?.id) {
    notFound();
  }

  const qrStatus = (data.status ?? "active").toLowerCase();

  if (qrStatus === "disabled") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-6 py-16 text-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-zinc-400">
          QRNetra
        </p>
        <h1 className="mt-4 text-2xl font-bold text-[#111111]">
          This QR is inactive
        </h1>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-zinc-600">
          The owner has disabled this emergency tag. If you need help, contact
          local authorities or emergency services.
        </p>
        <p className="mt-8 font-mono text-xs text-zinc-400">{data.slug}</p>
      </div>
    );
  }

  if (qrStatus === "paused") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-6 py-16 text-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-zinc-400">
          QRNetra
        </p>
        <h1 className="mt-4 text-2xl font-bold text-[#111111]">
          Temporarily unavailable
        </h1>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-zinc-600">
          This emergency QR is paused by the owner. Please try again later or
          use another way to reach them.
        </p>
        <p className="mt-8 font-mono text-xs text-zinc-400">{data.slug}</p>
      </div>
    );
  }

  const ch = data.channels ?? {};
  const waDigits = digitsForWhatsApp(data.whatsapp_phone ?? data.owner_phone);
  const waHref =
    ch.whatsapp && waDigits
      ? `https://wa.me/${waDigits}`
      : null;

  const kind = data.kind;

  const kindBadge =
    kind === "vehicle"
      ? "Vehicle QR"
      : kind === "child"
        ? "Child Safety"
        : kind === "pet"
          ? "Pet Tag"
          : kind === "business"
            ? "Business / Fleet"
            : "Safety Tag";

  const pageTitle =
    kind === "vehicle" && data.vehicle_registration
      ? `Vehicle · ${data.vehicle_registration}`
      : kind === "child"
        ? data.title
          ? `${data.title}`
          : "Child safety"
        : kind === "pet"
          ? data.title ?? "Pet tag"
          : kind === "business"
            ? data.title ?? "Fleet contact"
            : data.title ?? "Safety tag";

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white px-4 pb-16 pt-8">
      <ScanLogClient qrId={data.id} />

      <div className="mx-auto max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-zinc-400">
            QRNetra
          </p>
          <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-semibold text-zinc-600 shadow-sm">
            {kind === "vehicle" && "🚗"}
            {kind === "child" && "👶"}
            {kind === "pet" && "🐾"}
            {kind === "business" && "🏢"}
            {kindBadge}
          </div>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-[#111111]">
            {pageTitle}
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Emergency contact · scanned by you
          </p>
        </div>

        {/* Finder message */}
        {data.message && (
          <div className="mb-6 rounded-2xl border border-amber-100 bg-amber-50 px-4 py-4 text-sm leading-relaxed text-amber-900 shadow-sm">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-amber-600">
              Message from owner
            </p>
            {data.message}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col gap-3">
          {/* ── Vehicle ── */}
          {kind === "vehicle" && (
            <>
              {ch.call && data.owner_phone && (
                <ActionLink
                  href={`tel:${data.owner_phone.replace(/\s/g, "")}`}
                  label="📞  Call owner"
                  primary
                />
              )}
              {waHref && (
                <ActionLink href={waHref} label="💬  WhatsApp owner" variant="green" />
              )}
              {data.alternate_contact && (
                <ActionLink
                  href={`tel:${data.alternate_contact.replace(/\s/g, "")}`}
                  label="📞  Alternate / emergency contact"
                />
              )}
            </>
          )}

          {/* ── Child ── */}
          {kind === "child" && (
            <>
              {ch.call && data.owner_phone && (
                <ActionLink
                  href={`tel:${data.owner_phone.replace(/\s/g, "")}`}
                  label={`📞  Call${data.parent_name ? ` ${data.parent_name}` : " parent / guardian"}`}
                  primary
                />
              )}
              {waHref && (
                <ActionLink href={waHref} label="💬  WhatsApp parent" variant="green" />
              )}
              {data.emergency_phone && (
                <ActionLink
                  href={`tel:${data.emergency_phone.replace(/\s/g, "")}`}
                  label="📞  Emergency contact"
                />
              )}
              {(data.blood_group || data.allergies || data.school_name || data.emergency_instructions) && (
                <details className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm open:shadow-md">
                  <summary className="cursor-pointer text-sm font-semibold text-[#111111]">
                    Medical &amp; safety info
                  </summary>
                  <div className="mt-4 space-y-2.5">
                    {data.blood_group && (
                      <InfoRow label="Blood group" value={data.blood_group} />
                    )}
                    {data.allergies && (
                      <InfoRow label="Allergies" value={data.allergies} />
                    )}
                    {data.school_name && (
                      <InfoRow label="School" value={data.school_name} />
                    )}
                    {data.emergency_instructions && (
                      <div className="mt-2 rounded-xl border border-zinc-100 bg-zinc-50 px-3 py-2.5 text-sm leading-relaxed text-zinc-700">
                        <p className="mb-1 text-xs font-semibold text-zinc-500">
                          Emergency instructions
                        </p>
                        {data.emergency_instructions}
                      </div>
                    )}
                  </div>
                </details>
              )}
            </>
          )}

          {/* ── Pet ── */}
          {kind === "pet" && (
            <>
              {ch.call && data.owner_phone && (
                <ActionLink
                  href={`tel:${data.owner_phone.replace(/\s/g, "")}`}
                  label="📞  Contact owner"
                  primary
                />
              )}
              {waHref && (
                <ActionLink href={waHref} label="💬  WhatsApp owner" variant="green" />
              )}
              {data.vet_phone && (
                <ActionLink
                  href={`tel:${data.vet_phone.replace(/\s/g, "")}`}
                  label="🏥  Call vet / clinic"
                />
              )}
              {data.reward_note && (
                <div className="rounded-2xl border border-green-100 bg-green-50 px-4 py-3 text-sm leading-relaxed text-green-900 shadow-sm">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-green-600">
                    Note from owner
                  </p>
                  {data.reward_note}
                </div>
              )}
              {(data.breed || data.medical_notes) && (
                <details className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
                  <summary className="cursor-pointer text-sm font-semibold text-[#111111]">
                    Pet details
                  </summary>
                  <div className="mt-4 space-y-2.5">
                    {data.breed && <InfoRow label="Breed" value={data.breed} />}
                    {data.medical_notes && (
                      <div className="rounded-xl border border-zinc-100 bg-zinc-50 px-3 py-2.5 text-sm leading-relaxed text-zinc-700">
                        <p className="mb-1 text-xs font-semibold text-zinc-500">
                          Medical notes
                        </p>
                        {data.medical_notes}
                      </div>
                    )}
                  </div>
                </details>
              )}
            </>
          )}

          {/* ── Business / Fleet ── */}
          {kind === "business" && (
            <>
              {ch.call && data.owner_phone && (
                <ActionLink
                  href={`tel:${data.owner_phone.replace(/\s/g, "")}`}
                  label="📞  Admin contact"
                  primary
                />
              )}
              {waHref && (
                <ActionLink href={waHref} label="💬  WhatsApp admin" variant="green" />
              )}
              {data.escalation_contact && (
                <ActionLink
                  href={`tel:${data.escalation_contact.replace(/\s/g, "")}`}
                  label="📞  Escalation contact"
                />
              )}
              {data.business_emergency && (
                <ActionLink
                  href={`tel:${data.business_emergency.replace(/\s/g, "")}`}
                  label="🚨  Emergency line"
                />
              )}
              {(data.asset_id || data.department || data.fleet_size) && (
                <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Asset info
                  </p>
                  <div className="space-y-2">
                    {data.asset_id && <InfoRow label="Asset / ID" value={data.asset_id} />}
                    {data.department && (
                      <InfoRow label="Department" value={data.department} />
                    )}
                    {data.fleet_size && (
                      <InfoRow label="Fleet size" value={data.fleet_size} />
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {/* ── Other / fallback ── */}
          {kind === "other" && (
            <>
              {ch.call && data.owner_phone && (
                <ActionLink
                  href={`tel:${data.owner_phone.replace(/\s/g, "")}`}
                  label="📞  Call"
                  primary
                />
              )}
              {waHref && <ActionLink href={waHref} label="💬  WhatsApp" variant="green" />}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="mt-10 space-y-3 border-t border-zinc-100 pt-6 text-center">
          <p className="text-xs leading-relaxed text-zinc-400">
            If this is a life-threatening emergency, contact local emergency
            services immediately. QRNetra helps reach the owner — it is not a
            substitute for emergency services.
          </p>
          <a
            href="/"
            className="inline-flex text-xs font-semibold text-zinc-500 underline-offset-4 hover:text-[#111111] hover:underline"
          >
            Powered by QRNetra — create your own safety QR →
          </a>
        </div>
      </div>
    </div>
  );
}
