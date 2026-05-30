"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toggleQrStatusAction } from "@/app/actions/create-qr";
import { deactivatePhysicalTagAction } from "@/app/actions/tag-lifecycle";
import { QrAssetDownloads } from "@/components/qr-asset-downloads";
import type { QrKind } from "@/lib/qr/types";

type Props = {
  qrId: string;
  slug: string;
  scanUrl: string;
  status: string;
  kind: QrKind | string;
  title: string;
  subtitle?: string | null;
  hideEdit?: boolean;
  isPhysicalTag?: boolean;
};

export function QrDashboardActions({
  qrId,
  slug,
  scanUrl,
  status,
  kind,
  title,
  subtitle,
  hideEdit = false,
  isPhysicalTag = false,
}: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(status);
  const [copyDone, setCopyDone] = useState(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(scanUrl);
      setCopyDone(true);
      setTimeout(() => setCopyDone(false), 2000);
    } catch {
      /* ignore */
    }
  }

  async function toggleDisable() {
    setBusy(true);
    const result = isPhysicalTag
      ? await deactivatePhysicalTagAction(qrId)
      : await toggleQrStatusAction(qrId, currentStatus);
    setBusy(false);
    if (!result.error) {
      setCurrentStatus((s) => (s === "active" ? "disabled" : "active"));
      router.refresh();
    }
  }

  const isDisabled = currentStatus === "disabled";

  return (
    <div className="mt-4 space-y-4">
      <div className="flex flex-wrap gap-2">
        {!hideEdit && (
          <Link
            href={`/dashboard/my-qrs/${qrId}`}
            className="inline-flex h-8 items-center gap-1.5 rounded-full border border-white/[0.08] px-3 text-xs font-semibold text-qn-muted transition hover:bg-white/[0.05]"
          >
            Edit profile
          </Link>
        )}
        <Link
          href={`/s/${slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-8 items-center gap-1.5 rounded-full border border-white/[0.08] px-3 text-xs font-semibold text-qn-muted transition hover:bg-white/[0.05]"
        >
          Preview public page
        </Link>
        <button
          type="button"
          onClick={() => void copyLink()}
          className="inline-flex h-8 items-center gap-1.5 rounded-full border border-white/[0.08] px-3 text-xs font-semibold text-qn-muted transition hover:bg-white/[0.05]"
        >
          {copyDone ? "Copied" : "Copy link"}
        </button>
        <button
          type="button"
          onClick={() => void toggleDisable()}
          disabled={busy}
          className={`inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-xs font-semibold transition disabled:opacity-50 ${
            currentStatus === "active"
              ? "border-white/[0.08] text-qn-muted hover:border-red-200 hover:bg-qn-danger/10 hover:text-red-700"
              : "border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
          }`}
        >
          {busy ? "…" : isDisabled ? "Re-enable tag" : "Deactivate tag"}
        </button>
      </div>
      <QrAssetDownloads
        scanUrl={scanUrl}
        slug={slug}
        kind={kind}
        title={title}
        subtitle={subtitle}
        compact
      />
    </div>
  );
}
