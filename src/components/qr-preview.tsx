"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

type Props = {
  url: string;
  slug: string;
};

export function QrPreview({ url, slug }: Props) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [copyDone, setCopyDone] = useState(false);

  useEffect(() => {
    let active = true;
    QRCode.toDataURL(url, {
      margin: 1,
      width: 240,
      color: { dark: "#111111", light: "#ffffff" },
    })
      .then((d) => {
        if (active) setDataUrl(d);
      })
      .catch(() => {
        if (active) setDataUrl(null);
      });
    return () => {
      active = false;
    };
  }, [url]);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopyDone(true);
      setTimeout(() => setCopyDone(false), 2000);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="flex flex-col items-center rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="flex h-[220px] w-[220px] items-center justify-center rounded-xl bg-white">
        {dataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={dataUrl} alt={`QR code for ${slug}`} width={220} height={220} />
        ) : (
          <div className="h-40 w-40 animate-pulse rounded-lg bg-zinc-100" />
        )}
      </div>
      <p className="mt-4 max-w-[260px] break-all text-center text-xs text-zinc-500">
        {url}
      </p>
      <div className="mt-4 flex w-full flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={copyLink}
          className="inline-flex h-10 flex-1 items-center justify-center rounded-full border border-zinc-200 text-sm font-semibold text-[#111111] hover:bg-zinc-50"
        >
          {copyDone ? "Copied" : "Copy link"}
        </button>
        {dataUrl ? (
          <a
            href={dataUrl}
            download={`qrnetra-${slug}.png`}
            className="inline-flex h-10 flex-1 items-center justify-center rounded-full bg-[#ffd400] text-sm font-semibold text-[#111111] hover:opacity-95"
          >
            Download QR
          </a>
        ) : null}
      </div>
    </div>
  );
}
