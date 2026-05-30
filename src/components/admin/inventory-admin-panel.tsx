"use client";

import {
  exportInventoryCsvAction,
  exportInventoryPdfAction,
  exportInventoryZipAction,
  exportPackagingInsertPdfAction,
  generateInventoryAction,
  markBatchPrintedAction,
  searchInventoryAction,
  type BatchAnalyticsRow,
} from "@/app/actions/admin-inventory";
import { adminReplaceTagAction } from "@/app/actions/tag-lifecycle";
import {
  INVENTORY_CHANNELS,
  PRODUCT_TYPE_LABELS,
  TAG_PRODUCT_TYPES,
  type TagProductType,
} from "@/lib/inventory/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

type BatchRow = {
  id: string;
  batch_number: string;
  product_type: string;
  quantity: number;
  channel: string;
  generated_at: string;
};

type Props = {
  metrics: Record<string, number>;
  batches: BatchRow[];
  batchAnalytics: BatchAnalyticsRow[];
  channelStats: Array<{ channel: string; generated: number; activated: number }>;
};

const QUICK_QUANTITIES = [100, 500, 1000];

function downloadBase64(base64: string, filename: string, mime: string) {
  const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  const blob = new Blob([bytes], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function InventoryAdminPanel({
  metrics,
  batches,
  batchAnalytics,
  channelStats,
}: Props) {
  const router = useRouter();
  const [productType, setProductType] = useState<TagProductType>("vehicle_sticker");
  const [quantity, setQuantity] = useState(100);
  const [channel, setChannel] = useState("amazon");
  const [batchNumber, setBatchNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Array<Record<string, unknown>>>([]);
  const [searching, setSearching] = useState(false);
  const [oldTagId, setOldTagId] = useState("");
  const [newTagId, setNewTagId] = useState("");
  const [replaceReason, setReplaceReason] = useState<
    "lost" | "damaged" | "defective" | "upgrade"
  >("damaged");

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    const fd = new FormData();
    fd.set("product_type", productType);
    fd.set("quantity", String(quantity));
    fd.set("channel", channel);
    if (batchNumber.trim()) fd.set("batch_number", batchNumber.trim());
    const result = await generateInventoryAction(fd);
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setMessage(`Generated ${result.quantity} tags in batch ${result.batchNumber}.`);
    router.refresh();
  }

  async function handleExportCsv(batchId: string, batchLabel: string) {
    setError(null);
    const result = await exportInventoryCsvAction(batchId);
    if (result.error || !result.csv) {
      setError(result.error ?? "Export failed.");
      return;
    }
    const blob = new Blob([result.csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `qrnetra-inventory-${batchLabel}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleExportPdf(batchId: string) {
    setError(null);
    const result = await exportInventoryPdfAction(batchId);
    if (result.error || !result.base64 || !result.filename) {
      setError(result.error ?? "PDF export failed.");
      return;
    }
    downloadBase64(result.base64, result.filename, "application/pdf");
  }

  async function handleExportZip(batchId: string) {
    setError(null);
    const result = await exportInventoryZipAction(batchId);
    if (result.error || !result.base64 || !result.filename) {
      setError(result.error ?? "ZIP export failed.");
      return;
    }
    downloadBase64(result.base64, result.filename, "application/zip");
  }

  async function handleMarkPrinted(batchId: string) {
    const result = await markBatchPrintedAction(batchId);
    if (result.error) setError(result.error);
    else {
      setMessage("Batch marked as printed.");
      router.refresh();
    }
  }

  async function handlePackagingInsert() {
    const result = await exportPackagingInsertPdfAction();
    if (result.error || !result.base64) {
      setError(result.error ?? "Insert PDF failed.");
      return;
    }
    downloadBase64(result.base64, "qrnetra-packaging-insert.pdf", "application/pdf");
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearching(true);
    setError(null);
    const result = await searchInventoryAction(searchQuery);
    setSearching(false);
    if (result.error) setError(result.error);
    else setSearchResults(result.rows);
  }

  const totalGenerated =
    (metrics.generated ?? 0) +
    (metrics.printed ?? 0) +
    (metrics.reserved ?? 0) +
    (metrics.sold ?? 0);
  const activated = metrics.activated ?? 0;
  const activationRate =
    totalGenerated + activated > 0
      ? Math.round((activated / (totalGenerated + activated)) * 100)
      : 0;

  return (
    <div className="mt-10 space-y-10">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Generated pool", totalGenerated],
          ["Activated", activated],
          ["Activation rate", `${activationRate}%`],
          ["Locked", metrics.locked ?? 0],
        ].map(([label, value]) => (
          <div key={String(label)} className="qn-card p-4">
            <p className="text-xs uppercase tracking-wide text-qn-muted">{label}</p>
            <p className="mt-1 text-2xl font-bold text-white">{value}</p>
          </div>
        ))}
      </div>

      {channelStats.length > 0 && (
        <div className="qn-card p-6">
          <h2 className="text-lg font-semibold text-white">Channel performance</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {channelStats.map((c) => (
              <li key={c.channel} className="flex justify-between text-qn-muted">
                <span className="capitalize">{c.channel}</span>
                <span className="text-white">
                  {c.activated} / {c.generated} activated (
                  {c.generated > 0 ? Math.round((c.activated / c.generated) * 100) : 0}%)
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {batchAnalytics.length > 0 && (
        <div className="qn-card overflow-hidden">
          <div className="border-b border-white/[0.08] px-6 py-4">
            <h2 className="text-lg font-semibold text-white">Batch activation metrics</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-white/[0.03] text-qn-muted">
                <tr>
                  <th className="px-4 py-3">Batch</th>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Channel</th>
                  <th className="px-4 py-3">Qty</th>
                  <th className="px-4 py-3">Activated</th>
                  <th className="px-4 py-3">Rate</th>
                  <th className="px-4 py-3">Avg hrs to activate</th>
                </tr>
              </thead>
              <tbody>
                {batchAnalytics.map((b) => (
                  <tr key={b.batch_number} className="border-t border-white/[0.06]">
                    <td className="px-4 py-3 font-mono text-white">{b.batch_number}</td>
                    <td className="px-4 py-3 text-qn-muted">
                      {PRODUCT_TYPE_LABELS[b.product_type as TagProductType] ??
                        b.product_type}
                    </td>
                    <td className="px-4 py-3 capitalize text-qn-muted">{b.channel}</td>
                    <td className="px-4 py-3 text-white">{b.quantity}</td>
                    <td className="px-4 py-3 text-white">{b.activated}</td>
                    <td className="px-4 py-3 text-qn-accent">{b.activation_rate}%</td>
                    <td className="px-4 py-3 text-qn-muted">
                      {b.avg_hours_to_activate ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="qn-card p-6">
        <h2 className="text-lg font-semibold text-white">Search tags</h2>
        <form onSubmit={handleSearch} className="mt-4 flex gap-2">
          <input
            type="search"
            className="qn-input flex-1"
            placeholder="Tag ID, activation code, vehicle #, pet name, email, phone, order ID"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="qn-btn-primary shrink-0" disabled={searching}>
            {searching ? "…" : "Search"}
          </button>
        </form>
        {searchResults.length > 0 && (
          <ul className="mt-4 max-h-64 space-y-2 overflow-y-auto text-sm">
            {searchResults.map((row, i) => (
              <li
                key={i}
                className="rounded-lg border border-white/[0.06] px-3 py-2 text-qn-muted"
              >
                <span className="font-mono text-white">
                  {String(row.public_tag_id ?? "—")}
                </span>
                {" · "}
                {String(row.status ?? "")}
                {row.profile_name ? ` · ${String(row.profile_name)}` : ""}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <form onSubmit={handleGenerate} className="qn-card space-y-4 p-6">
          <h2 className="text-lg font-semibold text-white">Generate inventory</h2>

          <label className="block">
            <span className="text-sm text-qn-muted">Product type</span>
            <select
              className="qn-input mt-1 w-full"
              value={productType}
              onChange={(e) => setProductType(e.target.value as TagProductType)}
            >
              {TAG_PRODUCT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {PRODUCT_TYPE_LABELS[t]}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm text-qn-muted">Channel</span>
            <select
              className="qn-input mt-1 w-full"
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
            >
              {INVENTORY_CHANNELS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          <div>
            <span className="text-sm text-qn-muted">Quantity</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {QUICK_QUANTITIES.map((q) => (
                <button
                  key={q}
                  type="button"
                  className={`rounded-lg px-3 py-1.5 text-sm ${
                    quantity === q
                      ? "bg-qn-accent text-white"
                      : "bg-white/[0.06] text-qn-muted"
                  }`}
                  onClick={() => setQuantity(q)}
                >
                  {q}
                </button>
              ))}
            </div>
            <input
              type="number"
              min={1}
              max={10000}
              className="qn-input mt-2 w-full"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
            />
          </div>

          <label className="block">
            <span className="text-sm text-qn-muted">Batch number (optional)</span>
            <input
              type="text"
              className="qn-input mt-1 w-full"
              placeholder="Auto e.g. 2026-001"
              value={batchNumber}
              onChange={(e) => setBatchNumber(e.target.value)}
            />
          </label>

          {error ? <p className="text-sm text-qn-warning">{error}</p> : null}
          {message ? <p className="text-sm text-green-400">{message}</p> : null}

          <button type="submit" className="qn-btn-primary w-full" disabled={loading}>
            {loading ? "Generating…" : `Generate ${quantity} tags`}
          </button>

          <button
            type="button"
            className="qn-btn-secondary w-full text-sm"
            onClick={() => void handlePackagingInsert()}
          >
            Download packaging insert PDF
          </button>
        </form>

        <div className="qn-card p-6">
          <h2 className="text-lg font-semibold text-white">Status breakdown</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {Object.entries(metrics).map(([status, count]) => (
              <li key={status} className="flex justify-between text-qn-muted">
                <span className="capitalize">{status}</span>
                <span className="font-medium text-white">{count}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <form
        className="qn-card space-y-4 p-6"
        onSubmit={async (e) => {
          e.preventDefault();
          setError(null);
          const result = await adminReplaceTagAction({
            oldPublicTagId: oldTagId.trim(),
            newPublicTagId: newTagId.trim(),
            reason: replaceReason,
          });
          if (result.error) setError(result.error);
          else {
            setMessage("Replacement completed.");
            setOldTagId("");
            setNewTagId("");
            router.refresh();
          }
        }}
      >
        <h2 className="text-lg font-semibold text-white">Replace tag (support)</h2>
        <p className="text-xs text-qn-muted">
          Migrates profile to a new unit; old tag marked replaced.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            className="qn-input font-mono text-sm"
            placeholder="Old Tag ID"
            value={oldTagId}
            onChange={(e) => setOldTagId(e.target.value.toUpperCase())}
            required
          />
          <input
            className="qn-input font-mono text-sm"
            placeholder="New Tag ID"
            value={newTagId}
            onChange={(e) => setNewTagId(e.target.value.toUpperCase())}
            required
          />
        </div>
        <select
          className="qn-input w-full max-w-xs"
          value={replaceReason}
          onChange={(e) =>
            setReplaceReason(e.target.value as typeof replaceReason)
          }
        >
          <option value="lost">Lost</option>
          <option value="damaged">Damaged</option>
          <option value="defective">Defective</option>
          <option value="upgrade">Upgrade</option>
        </select>
        <button type="submit" className="qn-btn-secondary text-sm">
          Run replacement
        </button>
      </form>

      <div className="qn-card overflow-hidden">
        <div className="border-b border-white/[0.08] px-6 py-4">
          <h2 className="text-lg font-semibold text-white">Recent batches</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="bg-white/[0.03] text-qn-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Batch</th>
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium">Qty</th>
                <th className="px-4 py-3 font-medium">Channel</th>
                <th className="px-4 py-3 font-medium">Created</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {batches.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-qn-muted">
                    No batches yet. Generate inventory above.
                  </td>
                </tr>
              ) : (
                batches.map((b) => (
                  <tr key={b.id} className="border-t border-white/[0.06]">
                    <td className="px-4 py-3 font-mono text-white">{b.batch_number}</td>
                    <td className="px-4 py-3 text-qn-muted">
                      {PRODUCT_TYPE_LABELS[b.product_type as TagProductType] ??
                        b.product_type}
                    </td>
                    <td className="px-4 py-3 text-white">{b.quantity}</td>
                    <td className="px-4 py-3 capitalize text-qn-muted">{b.channel}</td>
                    <td className="px-4 py-3 text-qn-muted">
                      {new Date(b.generated_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          className="text-xs text-qn-accent hover:underline"
                          onClick={() => handleExportCsv(b.id, b.batch_number)}
                        >
                          CSV
                        </button>
                        <button
                          type="button"
                          className="text-xs text-qn-accent hover:underline"
                          onClick={() => void handleExportPdf(b.id)}
                        >
                          PDF
                        </button>
                        <button
                          type="button"
                          className="text-xs text-qn-accent hover:underline"
                          onClick={() => void handleExportZip(b.id)}
                        >
                          ZIP
                        </button>
                        <button
                          type="button"
                          className="text-xs text-qn-muted hover:underline"
                          onClick={() => void handleMarkPrinted(b.id)}
                        >
                          Mark printed
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
