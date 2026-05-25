"use client";

import { QnLogoStatic } from "@/components/ui/logo";
import Link from "next/link";
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { QrAssetDownloads } from "@/components/qr-asset-downloads";
import { QrDashboardActions } from "@/components/qr-dashboard-actions";
import { getStickerAssetMeta } from "@/lib/qr/sticker-assets";
import type { QrKind } from "@/lib/qr/types";

type Props = {
  slug: string;
  scanUrl: string;
  title: string;
  kind: string;
  qrId?: string;
  status?: string;
  vehicleReg?: string | null;
  whatsappNumber?: string | null;
};

function digitsOnly(e164: string | null | undefined): string | null {
  if (!e164) return null;
  const d = e164.replace(/\D/g, "");
  return d.length ? d : null;
}

export function QrDeliveryCard({
  slug,
  scanUrl,
  title,
  kind,
  qrId,
  status = "active",
  vehicleReg,
  whatsappNumber,
}: Props) {
  const [pngDataUrl, setPngDataUrl] = useState<string | null>(null);
  const [copyDone, setCopyDone] = useState(false);
  const meta = getStickerAssetMeta(kind);

  useEffect(() => {
    let active = true;
    QRCode.toDataURL(scanUrl, {
      margin: 2,
      width: 400,
      color: { dark: "#111111", light: "#ffffff" },
    })
      .then((url) => {
        if (active) setPngDataUrl(url);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [scanUrl]);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(scanUrl);
      setCopyDone(true);
      setTimeout(() => setCopyDone(false), 2000);
    } catch {
      /* ignore */
    }
  }

  const waDigits = digitsOnly(whatsappNumber);
  const waMessage = encodeURIComponent(
    `Hi! I found your QRNetra emergency tag. Here's the link: ${scanUrl}`,
  );
  const waHref = waDigits
    ? `https://wa.me/${waDigits}?text=${waMessage}`
    : null;

  const kindLabel =
    kind === "vehicle"
      ? "Vehicle"
      : kind === "child"
        ? "Child Safety"
        : kind === "pet"
          ? "Pet"
          : kind === "asset"
            ? "Personal Asset"
          : "Business";

  return (
    <div className="mx-auto max-w-lg px-4 py-10 sm:py-14">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-qn-accent">
          <svg
            className="h-8 w-8 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Your emergency QR is ready
        </h1>
        <p className="mt-2 text-sm text-qn-muted">
          Download your {meta.title.toLowerCase()}, print the PDF, or share the
          link.
        </p>
        <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-qn-surface px-4 py-1.5 font-mono text-xs font-semibold text-qn-muted">
          QR ID · {slug}
        </p>
      </div>

      <div className="overflow-hidden rounded-3xl border border-white/[0.08] bg-qn-card shadow-[0_20px_60px_-12px_rgba(0,0,0,0.1)]">
        <div className="flex flex-col items-center bg-qn-card-2 px-6 py-8">
          <div className="rounded-2xl bg-qn-card p-4 shadow-xl">
            {pngDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={pngDataUrl}
                alt={`QR code for ${slug}`}
                width={200}
                height={200}
                className="block"
              />
            ) : (
              <div className="h-[200px] w-[200px] animate-pulse rounded-lg bg-qn-surface" />
            )}
          </div>
          <div className="mt-4 flex justify-center">
            <QnLogoStatic layout="compact" size="small" />
          </div>
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-qn-accent">
            {kindLabel}
          </p>
          <p className="mt-1 text-lg font-bold text-white">{title}</p>
          {vehicleReg && (
            <p className="mt-0.5 text-sm text-qn-muted-2">{vehicleReg}</p>
          )}
          <p className="mt-3 max-w-[280px] break-all text-center font-mono text-xs text-qn-muted-2">
            {scanUrl}
          </p>
        </div>

        <div className="space-y-4 p-5">
          <QrAssetDownloads
            scanUrl={scanUrl}
            slug={slug}
            kind={kind as QrKind}
            title={title}
            subtitle={vehicleReg}
          />

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => void copyLink()}
              className="flex h-12 items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-qn-card text-sm font-semibold text-white transition hover:bg-white/[0.05]"
            >
              {copyDone ? "✓ Copied" : "Copy link"}
            </button>

            {waHref ? (
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-12 items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-qn-card text-sm font-semibold text-white transition hover:bg-white/[0.05]"
              >
                WhatsApp
              </a>
            ) : (
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`${title} · Emergency QR: ${scanUrl}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-12 items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-qn-card text-sm font-semibold text-white transition hover:bg-white/[0.05]"
              >
                Share on WhatsApp
              </a>
            )}
          </div>
        </div>

        <div className="mx-5 mb-5 flex items-center gap-3 rounded-xl bg-qn-surface px-4 py-3">
          <span className="text-xs text-qn-muted-2">Public scan page:</span>
          <a
            href={`/s/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 truncate font-mono text-xs font-semibold text-white underline-offset-4 hover:underline"
          >
            /s/{slug}
          </a>
        </div>
      </div>

      {qrId && (
        <div className="mt-6 rounded-2xl border border-white/[0.08] bg-qn-card p-5">
          <QrDashboardActions
            qrId={qrId}
            slug={slug}
            scanUrl={scanUrl}
            status={status}
            kind={kind}
            title={title}
            subtitle={vehicleReg}
          />
        </div>
      )}

      <div className="mt-8 space-y-3">
        <Link
          href="/dashboard/tags"
          className="flex h-12 w-full items-center justify-center rounded-2xl bg-qn-card-2 text-sm font-semibold text-white shadow-lg transition hover:bg-zinc-800"
        >
          View all my QR tags →
        </Link>
        <Link
          href="/create"
          className="flex h-12 w-full items-center justify-center rounded-2xl border border-white/[0.08] bg-qn-card text-sm font-semibold text-white transition hover:bg-white/[0.05]"
        >
          Create another QR
        </Link>
      </div>

      <p className="mt-6 text-center text-xs leading-relaxed text-qn-muted-2">
        Your QR always points to this link. Edit your profile anytime — scans
        show the latest information.
      </p>
    </div>
  );
}
