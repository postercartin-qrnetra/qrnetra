import "server-only";

import { catalogSlugToProductType } from "@/lib/inventory/product-slug-map";
import { createAdminClient } from "@/lib/supabase/admin";

export type ReservedTag = {
  publicTagId: string;
  activationCode: string;
  presetSlug: string;
};

/**
 * Allocates the next available pre-printed tag to a paid website order.
 * Returns null when no inventory is available (order flow still succeeds).
 */
export async function reserveTagForOrder(
  orderId: string,
  productSlug: string,
): Promise<ReservedTag | null> {
  const productType = catalogSlugToProductType(productSlug);
  if (!productType) return null;

  const supabase = createAdminClient();
  if (!supabase) return null;

  const { data: tag, error: fetchError } = await supabase
    .from("tag_units")
    .select("id, public_tag_id, activation_code, preset_slug")
    .eq("product_type", productType)
    .in("status", ["generated", "printed"])
    .is("order_id", null)
    .order("serial_number", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (fetchError || !tag?.public_tag_id) return null;

  const { error: updateError } = await supabase
    .from("tag_units")
    .update({
      order_id: orderId,
      status: "reserved",
      channel: "website",
      updated_at: new Date().toISOString(),
    })
    .eq("id", tag.id)
    .in("status", ["generated", "printed"]);

  if (updateError) return null;

  await supabase.from("tag_unit_events").insert({
    tag_unit_id: tag.id,
    event_type: "reserved",
    metadata: { order_id: orderId, product_slug: productSlug },
  });

  return {
    publicTagId: tag.public_tag_id,
    activationCode: tag.activation_code,
    presetSlug: tag.preset_slug ?? "",
  };
}
