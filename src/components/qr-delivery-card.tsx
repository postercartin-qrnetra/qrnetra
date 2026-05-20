"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";

type Props = {
  slug: string;
  scanUrl: string;
  title: string;
  kind: string;
  qrId?: string;
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
  vehicleReg,
  whatsappNumber,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pngDataUrl, setPngDataUrl] = useState<string | null>(null);
  const [copyDone, setCopyDone] = useState(false);

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

  function downloadPdf() {
    if (!pngDataUrl) return;

    const kindLabel =
      kind === "vehicle"
        ? "Vehicle QR"
        : kind === "child"
          ? "Child Safety QR"
          : kind === "pet"
            ? "Pet QR"
            : kind === "business"
              ? "Business QR"
              : "Emergency QR";

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>QRNetra Emergency Kit · ${slug}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: Inter, -apple-system, sans-serif;
    background: #fff;
    color: #111;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .page {
    width: 148mm;
    min-height: 210mm;
    margin: 0 auto;
    padding: 14mm 12mm;
    display: flex;
    flex-direction: column;
    gap: 0;
  }
  .brand {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #555;
    margin-bottom: 6mm;
  }
  .qr-box {
    background: #111;
    border-radius: 12px;
    padding: 8mm;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5mm;
  }
  .qr-box img {
    width: 80mm;
    height: 80mm;
    border-radius: 6px;
    background: #fff;
    padding: 3mm;
    display: block;
  }
  .qr-label {
    color: #ffd400;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    text-align: center;
  }
  .qr-title {
    color: #fff;
    font-size: 16px;
    font-weight: 800;
    text-align: center;
    margin-top: 1mm;
  }
  .qr-reg {
    color: #aaa;
    font-size: 12px;
    font-weight: 600;
    text-align: center;
    margin-top: 1mm;
  }
  .url-chip {
    background: #fff;
    color: #111;
    border-radius: 6px;
    padding: 2mm 4mm;
    font-size: 9px;
    font-weight: 600;
    letter-spacing: 0.02em;
    word-break: break-all;
    text-align: center;
    max-width: 80mm;
  }
  .instructions {
    margin-top: 8mm;
  }
  .instructions h2 {
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #555;
    margin-bottom: 4mm;
  }
  .step {
    display: flex;
    gap: 3mm;
    align-items: flex-start;
    margin-bottom: 3mm;
  }
  .step-num {
    min-width: 6mm;
    height: 6mm;
    background: #ffd400;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    font-weight: 800;
    color: #111;
    flex-shrink: 0;
  }
  .step-text {
    font-size: 11px;
    line-height: 1.5;
    color: #333;
    padding-top: 0.5mm;
  }
  .footer {
    margin-top: auto;
    padding-top: 8mm;
    border-top: 1px solid #eee;
    font-size: 9px;
    color: #aaa;
    text-align: center;
    line-height: 1.6;
  }
  @media print {
    @page { size: A5 portrait; margin: 0; }
    body { margin: 0; }
    .page { width: 148mm; }
    button, .no-print { display: none !important; }
  }
</style>
</head>
<body>
<div class="page">
  <p class="brand">QRNetra · Emergency QR Kit</p>
  <div class="qr-box">
    <img src="${pngDataUrl}" alt="QR code" />
    <p class="qr-label">${kindLabel}</p>
    <p class="qr-title">${escHtml(title)}</p>
    ${vehicleReg ? `<p class="qr-reg">${escHtml(vehicleReg)}</p>` : ""}
    <p class="url-chip">${escHtml(scanUrl)}</p>
  </div>

  <div class="instructions">
    <h2>How to use</h2>
    <div class="step"><div class="step-num">1</div><p class="step-text">Print this page and cut out the QR card below.</p></div>
    <div class="step"><div class="step-num">2</div><p class="step-text">Place inside windshield, on a collar, in a bag, or on equipment.</p></div>
    <div class="step"><div class="step-num">3</div><p class="step-text">Anyone who finds it can scan to reach your emergency contacts — no app needed.</p></div>
    <div class="step"><div class="step-num">4</div><p class="step-text">Update your details anytime from the QRNetra dashboard. The QR stays the same.</p></div>
  </div>

  <div class="footer">
    <p>QRNetra · Privacy-first emergency identity platform</p>
    <p>Scan ID: ${escHtml(slug)} · qrnetra.in</p>
    <p>Not a substitute for emergency services. Call 112 in life-threatening situations.</p>
  </div>
</div>
<script>window.onload = function(){ window.print(); }<\/script>
</body>
</html>`;

    const win = window.open("", "_blank");
    if (!win) {
      alert("Allow pop-ups to download the PDF kit.");
      return;
    }
    win.document.write(html);
    win.document.close();
  }

  const waDigits = digitsOnly(whatsappNumber);
  const waMessage = encodeURIComponent(
    `Hi! I found your QRNetra emergency tag. Here's the link: ${scanUrl}`,
  );
  const waHref = waDigits
    ? `https://wa.me/${waDigits}?text=${waMessage}`
    : null;

  return (
    <div className="mx-auto max-w-lg px-4 py-10 sm:py-14">
      {/* Success header */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#ffd400]">
          <svg
            className="h-8 w-8 text-[#111111]"
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
        <h1 className="text-2xl font-bold tracking-tight text-[#111111]">
          Your emergency QR is ready
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          Scan, download, or share — your data is live.
        </p>
        <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-zinc-100 px-4 py-1.5 font-mono text-xs font-semibold text-zinc-700">
          QR ID · {slug}
        </p>
      </div>

      {/* QR preview card */}
      <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-[0_20px_60px_-12px_rgba(0,0,0,0.1)]">
        <div className="flex flex-col items-center bg-[#111111] px-6 py-8">
          <div className="rounded-2xl bg-white p-4 shadow-xl">
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
              <div className="h-[200px] w-[200px] animate-pulse rounded-lg bg-zinc-100" />
            )}
          </div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#ffd400]">
            QRNetra ·{" "}
            {kind === "vehicle"
              ? "Vehicle"
              : kind === "child"
                ? "Child Safety"
                : kind === "pet"
                  ? "Pet"
                  : "Business"}
          </p>
          <p className="mt-1 text-lg font-bold text-white">{title}</p>
          {vehicleReg && (
            <p className="mt-0.5 text-sm text-zinc-400">{vehicleReg}</p>
          )}
          <p className="mt-3 max-w-[280px] break-all text-center font-mono text-xs text-zinc-500">
            {scanUrl}
          </p>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-3 p-5">
          {pngDataUrl && (
            <a
              href={pngDataUrl}
              download={`qrnetra-${slug}.png`}
              className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#ffd400] text-sm font-bold text-[#111111] transition hover:opacity-90"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download PNG
            </a>
          )}

          <button
            type="button"
            onClick={downloadPdf}
            disabled={!pngDataUrl}
            className="flex h-12 items-center justify-center gap-2 rounded-xl border-2 border-[#111111] bg-white text-sm font-bold text-[#111111] transition hover:bg-zinc-50 disabled:opacity-40"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            PDF Kit
          </button>

          <button
            type="button"
            onClick={() => void copyLink()}
            className="flex h-12 items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white text-sm font-semibold text-[#111111] transition hover:bg-zinc-50"
          >
            {copyDone ? (
              <>✓ Copied</>
            ) : (
              <>
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                Copy link
              </>
            )}
          </button>

          {waHref ? (
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white text-sm font-semibold text-[#111111] transition hover:bg-zinc-50"
            >
              <svg
                className="h-4 w-4 text-[#25D366]"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp
            </a>
          ) : (
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`${title} · Emergency QR: ${scanUrl}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white text-sm font-semibold text-[#111111] transition hover:bg-zinc-50"
            >
              <svg
                className="h-4 w-4 text-[#25D366]"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Share on WhatsApp
            </a>
          )}
        </div>

        {/* Scan link preview */}
        <div className="mx-5 mb-5 flex items-center gap-3 rounded-xl bg-zinc-50 px-4 py-3">
          <span className="text-xs text-zinc-500">Public scan page:</span>
          <a
            href={`/s/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 truncate font-mono text-xs font-semibold text-[#111111] underline-offset-4 hover:underline"
          >
            /s/{slug}
          </a>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="mt-8 space-y-3">
        <a
          href="/dashboard/tags"
          className="flex h-12 w-full items-center justify-center rounded-2xl bg-[#111111] text-sm font-semibold text-white shadow-lg transition hover:bg-zinc-800"
        >
          View all my QR tags →
        </a>
        <a
          href="/create"
          className="flex h-12 w-full items-center justify-center rounded-2xl border border-zinc-200 bg-white text-sm font-semibold text-[#111111] transition hover:bg-zinc-50"
        >
          Create another QR
        </a>
      </div>

      <p className="mt-6 text-center text-xs leading-relaxed text-zinc-400">
        Keep this link or bookmark the dashboard. You can update your emergency
        details anytime — the QR code remains the same.
      </p>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}

function escHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
