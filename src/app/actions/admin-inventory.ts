"use server";

import { getCurrentAdminUser } from "@/lib/admin";
import { generateActivationCode, generatePresetSlug } from "@/lib/inventory/codes";
import { suggestNextBatchNumber } from "@/lib/inventory/batch-number";
import {
  formatPublicTagId,
  productTypeToFamily,
  type InventoryChannel,
  type TagProductType,
} from "@/lib/inventory/types";
import { getPublicSiteUrl } from "@/lib/site-url";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export type GenerateInventoryResult = {
  error: string | null;
  batchNumber?: string;
  quantity?: number;
};

export async function generateInventoryAction(formData: FormData): Promise<GenerateInventoryResult> {
  const admin = await getCurrentAdminUser();
  if (admin.error) return { error: admin.error };

  const supabase = createAdminClient();
  if (!supabase) {
    return { error: "SUPABASE_SERVICE_ROLE_KEY is required for inventory generation." };
  }

  const productType = String(formData.get("product_type") ?? "").trim() as TagProductType;
  const quantity = parseInt(String(formData.get("quantity") ?? "0"), 10);
  const channel = (String(formData.get("channel") ?? "amazon").trim() ||
    "amazon") as InventoryChannel;
  const batchNumberInput = String(formData.get("batch_number") ?? "").trim();

  const validTypes = [
    "vehicle_sticker",
    "pet_tag",
    "child_wristband",
    "child_bag_tag",
    "business_asset_tag",
  ];
  if (!validTypes.includes(productType)) {
    return { error: "Invalid product type." };
  }
  if (!Number.isFinite(quantity) || quantity < 1 || quantity > 10000) {
    return { error: "Quantity must be between 1 and 10,000." };
  }

  const { data: existingBatches } = await supabase
    .from("inventory_batches")
    .select("batch_number");

  const batchNumber =
    batchNumberInput ||
    suggestNextBatchNumber((existingBatches ?? []).map((b) => b.batch_number));

  const { data: batch, error: batchError } = await supabase
    .from("inventory_batches")
    .insert({
      batch_number: batchNumber,
      product_type: productType,
      quantity,
      channel,
      generated_by: admin.user?.email ?? admin.user?.id ?? "admin",
    })
    .select("id")
    .single();

  if (batchError || !batch) {
    return { error: batchError?.message ?? "Failed to create batch." };
  }

  const family = productTypeToFamily(productType);

  const { data: counterRow, error: counterReadError } = await supabase
    .from("tag_serial_counters")
    .select("last_serial")
    .eq("tag_family", family)
    .single();

  if (counterReadError || counterRow == null) {
    return { error: counterReadError?.message ?? "Serial counter not found." };
  }

  let lastSerial = counterRow.last_serial as number;
  const rows: Array<Record<string, unknown>> = [];
  const usedCodes = new Set<string>();

  for (let i = 0; i < quantity; i++) {
    lastSerial += 1;
    const publicTagId = formatPublicTagId(family, lastSerial);
    let activationCode = generateActivationCode(6);
    let attempts = 0;
    while (usedCodes.has(activationCode) && attempts < 20) {
      activationCode = generateActivationCode(6);
      attempts++;
    }
    usedCodes.add(activationCode);

    const presetSlug = generatePresetSlug();
    rows.push({
      public_tag_id: publicTagId,
      tag_family: family,
      product_type: productType,
      serial_number: lastSerial,
      activation_code: activationCode,
      preset_slug: presetSlug,
      status: "generated",
      batch_id: batch.id,
      channel,
      hardware_type: "qr",
    });
  }

  const chunkSize = 200;
  for (let offset = 0; offset < rows.length; offset += chunkSize) {
    const chunk = rows.slice(offset, offset + chunkSize);
    const { error: insertError } = await supabase.from("tag_units").insert(chunk);
    if (insertError) {
      return { error: insertError.message };
    }
  }

  const { error: counterUpdateError } = await supabase
    .from("tag_serial_counters")
    .update({ last_serial: lastSerial })
    .eq("tag_family", family);

  if (counterUpdateError) {
    return { error: counterUpdateError.message };
  }

  revalidatePath("/admin/inventory");
  return { error: null, batchNumber, quantity };
}

export type InventoryMetrics = {
  generated: number;
  printed: number;
  reserved: number;
  sold: number;
  activated: number;
  disabled: number;
  locked: number;
  transferred: number;
  replaced: number;
};

export async function getInventoryMetricsAction(): Promise<{
  error: string | null;
  metrics: InventoryMetrics | null;
}> {
  const admin = await getCurrentAdminUser();
  if (admin.error) return { error: admin.error, metrics: null };

  const supabase = createAdminClient();
  if (!supabase) return { error: "Admin client not configured.", metrics: null };

  const statuses = [
    "generated",
    "printed",
    "reserved",
    "sold",
    "activated",
    "disabled",
    "locked",
    "transferred",
    "replaced",
  ] as const;

  const metrics = {} as InventoryMetrics;
  for (const status of statuses) {
    const { count, error } = await supabase
      .from("tag_units")
      .select("id", { count: "exact", head: true })
      .eq("status", status);
    if (error) return { error: error.message, metrics: null };
    metrics[status] = count ?? 0;
  }

  return { error: null, metrics };
}

export async function exportInventoryCsvAction(batchId: string): Promise<{
  error: string | null;
  csv: string | null;
}> {
  const admin = await getCurrentAdminUser();
  if (admin.error) return { error: admin.error, csv: null };

  const supabase = createAdminClient();
  if (!supabase) return { error: "Admin client not configured.", csv: null };

  const { data: units, error } = await supabase
    .from("tag_units")
    .select("public_tag_id, activation_code, preset_slug, product_type, status")
    .eq("batch_id", batchId)
    .order("serial_number", { ascending: true });

  if (error) return { error: error.message, csv: null };

  const site = getPublicSiteUrl();
  const header =
    "Tag ID,Activation Code,Activation URL,Public Scan URL,Product Type,Status";
  const lines = (units ?? []).map((u) => {
    const tagId = u.public_tag_id ?? "";
    const activationUrl = `${site}/activate/${encodeURIComponent(tagId)}`;
    const scanUrl = u.preset_slug ? `${site}/s/${u.preset_slug}` : "";
    return [
      tagId,
      u.activation_code,
      activationUrl,
      scanUrl,
      u.product_type ?? "",
      u.status,
    ]
      .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
      .join(",");
  });

  return { error: null, csv: [header, ...lines].join("\n") };
}

async function fetchBatchUnits(supabase: NonNullable<ReturnType<typeof createAdminClient>>, batchId: string) {
  return supabase
    .from("tag_units")
    .select("public_tag_id, activation_code, preset_slug, product_type")
    .eq("batch_id", batchId)
    .order("serial_number", { ascending: true });
}

export async function exportInventoryPdfAction(batchId: string): Promise<{
  error: string | null;
  base64: string | null;
  filename: string | null;
}> {
  const admin = await getCurrentAdminUser();
  if (admin.error) return { error: admin.error, base64: null, filename: null };

  const supabase = createAdminClient();
  if (!supabase) return { error: "Admin client not configured.", base64: null, filename: null };

  const { data: batch } = await supabase
    .from("inventory_batches")
    .select("batch_number")
    .eq("id", batchId)
    .single();

  const { data: units, error } = await fetchBatchUnits(supabase, batchId);
  if (error || !units?.length) {
    return { error: error?.message ?? "No units in batch.", base64: null, filename: null };
  }

  const { buildBatchPrintPdf } = await import("@/lib/inventory/print-batch");
  const pdf = await buildBatchPrintPdf(
    units.map((u) => ({
      public_tag_id: u.public_tag_id!,
      activation_code: u.activation_code,
      preset_slug: u.preset_slug,
      product_type: u.product_type,
    })),
  );

  return {
    error: null,
    base64: Buffer.from(pdf).toString("base64"),
    filename: `qrnetra-batch-${batch?.batch_number ?? batchId}.pdf`,
  };
}

export async function exportInventoryZipAction(batchId: string): Promise<{
  error: string | null;
  base64: string | null;
  filename: string | null;
}> {
  const admin = await getCurrentAdminUser();
  if (admin.error) return { error: admin.error, base64: null, filename: null };

  const supabase = createAdminClient();
  if (!supabase) return { error: "Admin client not configured.", base64: null, filename: null };

  const { data: batch } = await supabase
    .from("inventory_batches")
    .select("batch_number")
    .eq("id", batchId)
    .single();

  const { data: units, error } = await fetchBatchUnits(supabase, batchId);
  if (error || !units?.length) {
    return { error: error?.message ?? "No units in batch.", base64: null, filename: null };
  }

  const { buildBatchPrintZip } = await import("@/lib/inventory/print-batch");
  const zip = await buildBatchPrintZip(
    units.map((u) => ({
      public_tag_id: u.public_tag_id!,
      activation_code: u.activation_code,
      preset_slug: u.preset_slug,
      product_type: u.product_type,
    })),
  );

  return {
    error: null,
    base64: Buffer.from(zip).toString("base64"),
    filename: `qrnetra-batch-${batch?.batch_number ?? batchId}.zip`,
  };
}

export async function exportPackagingInsertPdfAction(): Promise<{
  error: string | null;
  base64: string | null;
}> {
  const admin = await getCurrentAdminUser();
  if (admin.error) return { error: admin.error, base64: null };

  const { buildPackagingInsertPdf } = await import("@/lib/inventory/print-batch");
  const pdf = await buildPackagingInsertPdf();
  return { error: null, base64: Buffer.from(pdf).toString("base64") };
}

export async function markBatchPrintedAction(batchId: string): Promise<{ error: string | null }> {
  const admin = await getCurrentAdminUser();
  if (admin.error) return { error: admin.error };

  const supabase = createAdminClient();
  if (!supabase) return { error: "Admin client not configured." };

  const { error } = await supabase
    .from("tag_units")
    .update({ status: "printed", updated_at: new Date().toISOString() })
    .eq("batch_id", batchId)
    .eq("status", "generated");

  if (error) return { error: error.message };
  revalidatePath("/admin/inventory");
  return { error: null };
}

export async function searchInventoryAction(query: string): Promise<{
  error: string | null;
  rows: Array<Record<string, unknown>>;
}> {
  const admin = await getCurrentAdminUser();
  if (admin.error) return { error: admin.error, rows: [] };

  const supabase = createAdminClient();
  if (!supabase) return { error: "Admin client not configured.", rows: [] };

  const { data, error } = await supabase.rpc("search_tag_inventory", {
    p_query: query,
    p_limit: 50,
  });

  if (error) return { error: error.message, rows: [] };

  const payload =
    data && typeof data === "object"
      ? (data as { ok?: boolean; rows?: Array<Record<string, unknown>> })
      : null;

  return { error: null, rows: payload?.rows ?? [] };
}

export type BatchAnalyticsRow = {
  batch_number: string;
  product_type: string;
  channel: string;
  quantity: number;
  activated: number;
  activation_rate: number;
  avg_hours_to_activate: number | null;
};

export async function getInventoryAnalyticsAction(): Promise<{
  error: string | null;
  batches: BatchAnalyticsRow[];
  channelStats: Array<{ channel: string; generated: number; activated: number }>;
}> {
  const admin = await getCurrentAdminUser();
  if (admin.error) return { error: admin.error, batches: [], channelStats: [] };

  const supabase = createAdminClient();
  if (!supabase) return { error: "Admin client not configured.", batches: [], channelStats: [] };

  const { data: batchList } = await supabase
    .from("inventory_batches")
    .select("id, batch_number, product_type, channel, quantity, generated_at")
    .order("generated_at", { ascending: false })
    .limit(30);

  const batches: BatchAnalyticsRow[] = [];

  for (const b of batchList ?? []) {
    const { count: activated } = await supabase
      .from("tag_units")
      .select("id", { count: "exact", head: true })
      .eq("batch_id", b.id)
      .eq("status", "activated");

    const { data: activatedUnits } = await supabase
      .from("tag_units")
      .select("created_at, activated_at")
      .eq("batch_id", b.id)
      .eq("status", "activated")
      .not("activated_at", "is", null);

    let avgHours: number | null = null;
    if (activatedUnits?.length) {
      const totalMs = activatedUnits.reduce((sum, u) => {
        const start = new Date(u.created_at).getTime();
        const end = new Date(u.activated_at!).getTime();
        return sum + Math.max(0, end - start);
      }, 0);
      avgHours = Math.round(totalMs / activatedUnits.length / 3600000);
    }

    const act = activated ?? 0;
    batches.push({
      batch_number: b.batch_number,
      product_type: b.product_type,
      channel: b.channel,
      quantity: b.quantity,
      activated: act,
      activation_rate: b.quantity > 0 ? Math.round((act / b.quantity) * 100) : 0,
      avg_hours_to_activate: avgHours,
    });
  }

  const channels = ["amazon", "flipkart", "website", "retail", "distributor"] as const;
  const channelStats: Array<{ channel: string; generated: number; activated: number }> = [];

  for (const ch of channels) {
    const { count: pool } = await supabase
      .from("tag_units")
      .select("id", { count: "exact", head: true })
      .eq("channel", ch)
      .neq("status", "activated");

    const { count: act } = await supabase
      .from("tag_units")
      .select("id", { count: "exact", head: true })
      .eq("channel", ch)
      .eq("status", "activated");

    if ((pool ?? 0) + (act ?? 0) > 0) {
      channelStats.push({
        channel: ch,
        generated: (pool ?? 0) + (act ?? 0),
        activated: act ?? 0,
      });
    }
  }

  return { error: null, batches, channelStats };
}
