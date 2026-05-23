"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import {
  downloadRawQrPng,
  downloadStickerPdf,
  downloadStickerPng,
} from "@/lib/qr/client/download-assets";
import { getStickerAssetMeta } from "@/lib/qr/sticker-assets";
import type { QrKind } from "@/lib/qr/types";

type Props = {
  scanUrl: string;
  slug: string;
  kind: QrKind | string;
  title: string;
  subtitle?: string | null;
  compact?: boolean;
};

export function QrAssetDownloads({
  scanUrl,
  slug,
  kind,
  title,
  subtitle,
  compact = false,
}: Props) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const meta = getStickerAssetMeta(kind);

  useEffect(() => {
    let active = true;
    QRCode.toDataURL(scanUrl, {
      margin: 2,
      width: 512,
      color: { dark: "#111111", light: "#ffffff" },
      errorCorrectionLevel: "M",
    })
      .then((url) => {
        if (active) setQrDataUrl(url);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [scanUrl]);

  const input = {
    qrDataUrl: qrDataUrl ?? "",
    scanUrl,
    slug,
    kind,
    title,
    subtitle,
  };

  async function run(
    key: string,
    fn: () => Promise<void>,
  ) {
    if (!qrDataUrl) return;
    setBusy(key);
    try {
      await fn();
    } finally {
      setBusy(null);
    }
  }

  const disabled = !qrDataUrl || Boolean(busy);

  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={disabled}
          onClick={() => void run("png", () => downloadRawQrPng(qrDataUrl!, slug))}
          className="inline-flex h-8 items-center rounded-full border border-zinc-200 px-3 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 disabled:opacity-40"
        >
          {busy === "png" ? "…" : "PNG"}
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => void run("sticker", () => downloadStickerPng(input))}
          className="inline-flex h-8 items-center rounded-full bg-[#ffd400] px-3 text-xs font-bold text-[#111111] hover:opacity-90 disabled:opacity-40"
        >
          {busy === "sticker" ? "…" : meta.title}
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => void run("pdf", () => downloadStickerPdf(input))}
          className="inline-flex h-8 items-center rounded-full border border-zinc-200 px-3 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 disabled:opacity-40"
        >
          {busy === "pdf" ? "…" : "PDF"}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
        Download assets
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          disabled={disabled}
          onClick={() => void run("png", () => downloadRawQrPng(qrDataUrl!, slug))}
          className="flex h-11 items-center justify-center rounded-xl border border-zinc-200 text-sm font-semibold text-[#111111] hover:bg-zinc-50 disabled:opacity-40"
        >
          {busy === "png" ? "Preparing…" : "Download QR PNG"}
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => void run("sticker", () => downloadStickerPng(input))}
          className="flex h-11 items-center justify-center rounded-xl bg-[#ffd400] text-sm font-bold text-[#111111] hover:opacity-90 disabled:opacity-40"
        >
          {busy === "sticker" ? "Preparing…" : meta.title}
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => void run("pdf", () => downloadStickerPdf(input))}
          className="col-span-full flex h-11 items-center justify-center gap-2 rounded-xl border-2 border-[#111111] text-sm font-bold text-[#111111] hover:bg-zinc-50 disabled:opacity-40 sm:col-span-2"
        >
          {busy === "pdf" ? "Generating PDF…" : "Download print-friendly PDF"}
        </button>
      </div>
    </div>
  );
}
