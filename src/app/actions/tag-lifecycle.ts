"use server";

import { sendTagDisabledEmail } from "@/lib/email/tag-lifecycle";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentAdminUser } from "@/lib/admin";
import { revalidatePath } from "next/cache";

export async function deactivatePhysicalTagAction(
  qrCodeId: string,
): Promise<{ error: string | null }> {
  const supabase = await createClient();
  if (!supabase) return { error: "Server configuration error." };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const { data: tag } = await supabase
    .from("tag_units")
    .select("id, public_tag_id, owner_user_id, status")
    .eq("qr_code_id", qrCodeId)
    .maybeSingle();

  if (!tag || tag.owner_user_id !== user.id) {
    return { error: "Physical tag not found." };
  }

  if (tag.status === "disabled") {
    return { error: null };
  }

  const { error } = await supabase
    .from("tag_units")
    .update({ status: "disabled", updated_at: new Date().toISOString() })
    .eq("id", tag.id);

  if (error) return { error: error.message };

  await supabase.from("qr_codes").update({ status: "disabled" }).eq("id", qrCodeId);

  if (user.email && tag.public_tag_id) {
    await sendTagDisabledEmail({
      to: user.email,
      publicTagId: tag.public_tag_id,
    }).catch(() => undefined);
  }

  revalidatePath("/dashboard/tags");
  return { error: null };
}

export async function adminReplaceTagAction(input: {
  oldPublicTagId: string;
  newPublicTagId: string;
  reason: "lost" | "damaged" | "defective" | "upgrade";
}): Promise<{ error: string | null }> {
  const admin = await getCurrentAdminUser();
  if (admin.error) return { error: admin.error };

  const supabase = createAdminClient();
  if (!supabase) return { error: "Admin client not configured." };

  const { data: oldTag } = await supabase
    .from("tag_units")
    .select("id, qr_code_id, owner_user_id, status")
    .eq("public_tag_id", input.oldPublicTagId)
    .single();

  const { data: newTag } = await supabase
    .from("tag_units")
    .select("id, status")
    .eq("public_tag_id", input.newPublicTagId)
    .single();

  if (!oldTag?.qr_code_id || !newTag) {
    return { error: "Invalid old or new tag." };
  }

  if (!["generated", "printed", "sold"].includes(newTag.status)) {
    return { error: "New tag is not available for assignment." };
  }

  await supabase
    .from("tag_units")
    .update({
      status: "replaced",
      qr_code_id: null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", oldTag.id);

  await supabase
    .from("tag_units")
    .update({
      status: "activated",
      qr_code_id: oldTag.qr_code_id,
      owner_user_id: oldTag.owner_user_id,
      activated_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", newTag.id);

  await supabase.from("tag_replacements").insert({
    old_tag_unit_id: oldTag.id,
    new_tag_unit_id: newTag.id,
    qr_code_id: oldTag.qr_code_id,
    replacement_reason: input.reason,
  });

  revalidatePath("/admin/inventory");
  return { error: null };
}
