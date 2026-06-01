"use server";

import { parseCookieHeader } from "@supabase/ssr";
import { cookies, headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { sendTagActivatedEmail } from "@/lib/email/tag-lifecycle";
import { PRODUCT_TYPE_LABELS, type TagProductType } from "@/lib/inventory/types";
import { runQrGenerationPipeline } from "@/lib/qr/pipeline";
import type { ProductProfileVariant } from "@/lib/products";
import {
  validateCreateForm,
  validatedFormToProfile,
} from "@/lib/qr/validate-create-form";
export type CreateQrResult = {
  error: string | null;
  slug: string | null;
  qrId: string | null;
};

const AUTH_DEBUG =
  process.env.QR_AUTH_DEBUG === "1" ||
  process.env.QR_PIPELINE_AUDIT === "1";

function authLog(message: string, detail?: Record<string, unknown>) {
  if (!AUTH_DEBUG) return;
  console.log(message, detail ?? "");
}

export async function createQrAction(
  formData: FormData,
): Promise<CreateQrResult> {
  console.log("[CREATE QR ACTION START]");

  const validation = validateCreateForm(formData, {
    productVariant:
      typeof formData.get("product_variant") === "string"
        ? (formData.get("product_variant") as ProductProfileVariant)
        : undefined,
  });
  if (!validation.ok) {
    console.log("RETURNING VALIDATION ERROR", validation.error);
    return { error: validation.error, slug: null, qrId: null };
  }

  const supabase = await createClient();
  if (!supabase) {
    console.log("RETURNING CONFIG ERROR — Supabase env missing");
    return {
      error: "Server is missing Supabase configuration. Contact support.",
      slug: null,
      qrId: null,
    };
  }

  const cookieStore = await cookies();
  const headerStore = await headers();
  const allCookies = cookieStore.getAll();
  const headerCookieNames = parseCookieHeader(headerStore.get("cookie") ?? "")
    .map((c) => c.name)
    .filter((n) => n.includes("sb-") || n.includes("supabase"));
  const sbCookieNames = allCookies
    .map((c) => c.name)
    .filter((n) => n.includes("sb-") || n.includes("supabase"));
  console.log("[AUTH CHECK] cookies on server action", {
    totalCookies: allCookies.length,
    supabaseCookieNamesFromStore: sbCookieNames,
    supabaseCookieNamesFromHeader: headerCookieNames,
  });
  authLog("[AUTH CHECK] cookies on server action request", {
    totalCookies: allCookies.length,
    supabaseCookieNames: sbCookieNames,
  });

  const sessionResult = await supabase.auth.getSession();
  console.log("[AUTH CHECK] getSession() response", {
    hasSession: Boolean(sessionResult.data.session),
    sessionUserId: sessionResult.data.session?.user?.id ?? null,
    sessionEmail: sessionResult.data.session?.user?.email ?? null,
    sessionError: sessionResult.error?.message ?? null,
  });
  authLog("[AUTH CHECK] getSession() response", {
    hasSession: Boolean(sessionResult.data.session),
    sessionUserId: sessionResult.data.session?.user?.id ?? null,
    sessionEmail: sessionResult.data.session?.user?.email ?? null,
    sessionError: sessionResult.error?.message ?? null,
  });

  if (sessionResult.data.session?.user) {
    console.log("[AUTH CHECK] Session found");
    console.log("[AUTH CHECK] User ID", sessionResult.data.session.user.id);
    console.log(
      "[AUTH CHECK] Email",
      sessionResult.data.session.user.email ?? "(none)",
    );
  } else {
    console.log("[AUTH CHECK] No session in server action cookies");
  }

  const userResult = await supabase.auth.getUser();
  console.log("[AUTH CHECK] getUser() response", {
    userId: userResult.data.user?.id ?? null,
    email: userResult.data.user?.email ?? null,
    userError: userResult.error?.message ?? null,
    userErrorStatus: userResult.error?.status ?? null,
  });
  authLog("[AUTH CHECK] getUser() full response", {
    userId: userResult.data.user?.id ?? null,
    email: userResult.data.user?.email ?? null,
    userError: userResult.error?.message ?? null,
    userErrorStatus: userResult.error?.status ?? null,
  });

  let user = userResult.data.user;

  if (!user && sessionResult.data.session) {
    authLog("[AUTH CHECK] getUser() empty but session exists — refreshSession");
    const refreshed = await supabase.auth.refreshSession();
    authLog("[AUTH CHECK] refreshSession() response", {
      hasSession: Boolean(refreshed.data.session),
      refreshError: refreshed.error?.message ?? null,
    });
    user = refreshed.data.user ?? refreshed.data.session?.user ?? null;
  }

  if (!user) {
    console.log("RETURNING AUTH ERROR — getUser() returned no user", {
      userError: userResult.error?.message ?? null,
      hasSession: Boolean(sessionResult.data.session),
      sbCookies: sbCookieNames,
    });
    return {
      error: "Not authenticated. Please sign in and try again.",
      slug: null,
      qrId: null,
    };
  }

  console.log("[AUTH FIX VERIFIED] User ID", user.id);
  console.log("[AUTH FIX VERIFIED] Email", user.email ?? "(none)");

  const profile = validatedFormToProfile(validation.data);
  const activationCode = String(formData.get("activation_code") ?? "").trim();
  const publicTagId = String(formData.get("public_tag_id") ?? "").trim();
  authLog("[AUTH CHECK] proceeding to pipeline insert", {
    userId: user.id,
    profileType: profile.profileType,
    activationCodePresent: Boolean(activationCode),
    publicTagIdPresent: Boolean(publicTagId),
  });

  let presetSlug: string | null = null;
  if (publicTagId && activationCode) {
    const { data: verifyRaw, error: verifyError } = await supabase.rpc(
      "verify_tag_activation",
      {
        p_public_tag_id: publicTagId,
        p_activation_code: activationCode,
      },
    );
    const verifyPayload =
      verifyRaw && typeof verifyRaw === "object"
        ? (verifyRaw as { ok?: boolean; error?: string; preset_slug?: string })
        : null;
    if (verifyError || !verifyPayload?.ok) {
      return {
        error:
          verifyError?.message ??
          verifyPayload?.error ??
          "Activation verification failed.",
        slug: null,
        qrId: null,
      };
    }
    presetSlug = verifyPayload.preset_slug?.trim() || null;
  }

  const pipeline = await runQrGenerationPipeline(supabase, user.id, profile, {
    presetSlug,
  });

  if (!pipeline.ok) {
    console.log("RETURNING INSERT ERROR", pipeline.error);
    return { error: pipeline.error, slug: null, qrId: null };
  }

  console.log("[AUTH FIX VERIFIED] Profile insert success");
  console.log("[AUTH FIX VERIFIED] QR insert success");
  console.log("[AUTH FIX VERIFIED] Generated slug", pipeline.result.slug);

  if (activationCode) {
    const bindParams = publicTagId
      ? {
          p_public_tag_id: publicTagId,
          p_activation_code: activationCode,
          p_qr_slug: pipeline.result.slug,
        }
      : {
          p_activation_code: activationCode,
          p_qr_slug: pipeline.result.slug,
        };

    const bindRpc = publicTagId ? "bind_tag_unit_to_qr_code" : "bind_tag_unit_to_qr";

    const { data: activationResult, error: activationError } = await supabase.rpc(
      bindRpc,
      bindParams,
    );

    const activationPayload =
      activationResult && typeof activationResult === "object"
        ? (activationResult as { ok?: boolean; error?: string })
        : null;

    if (activationError || !activationPayload?.ok) {
      await supabase.from("qr_codes").delete().eq("id", pipeline.result.qrId);
      await supabase.from("qr_profiles").delete().eq("id", pipeline.result.profileId);
      await supabase
        .from("qrs")
        .delete()
        .eq("public_slug", pipeline.result.slug)
        .eq("owner_user_id", user.id);

      return {
        error:
          activationError?.message ??
          activationPayload?.error ??
          "Could not activate this physical tag.",
        slug: null,
        qrId: null,
      };
    }

    if (user.email && publicTagId) {
      const { data: tagRow } = await supabase
        .from("tag_units")
        .select("product_type")
        .eq("public_tag_id", publicTagId)
        .maybeSingle();

      const pt = tagRow?.product_type as TagProductType | undefined;
      const productTitle =
        pt && pt in PRODUCT_TYPE_LABELS
          ? PRODUCT_TYPE_LABELS[pt]
          : "QRNetra Tag";

      await sendTagActivatedEmail({
        to: user.email,
        publicTagId,
        productTitle,
        scanSlug: pipeline.result.slug,
      }).catch(() => undefined);
    }
  }

  console.log("RETURNING SUCCESS", { slug: pipeline.result.slug });
  return { error: null, slug: pipeline.result.slug, qrId: pipeline.result.qrId };
}

export type QrStatus = "active" | "paused" | "disabled";

export async function setQrStatusAction(
  qrId: string,
  status: QrStatus,
): Promise<{ error: string | null }> {
  const supabase = await createClient();
  if (!supabase) return { error: "Server configuration error." };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const { data: code } = await supabase
    .from("qr_codes")
    .select("id, slug, profile_id")
    .eq("id", qrId)
    .single();

  if (!code) {
    return { error: "QR not found." };
  }

  const { data: prof } = await supabase
    .from("qr_profiles")
    .select("user_id")
    .eq("id", code.profile_id)
    .single();

  if (!prof || prof.user_id !== user.id) {
    return { error: "QR not found." };
  }

  const owned = code;

  const { error: codeErr } = await supabase
    .from("qr_codes")
    .update({ status })
    .eq("id", qrId);

  if (codeErr) return { error: codeErr.message };

  await supabase
    .from("qr_profiles")
    .update({ status })
    .eq("id", owned.profile_id);

  await supabase
    .from("qrs")
    .update({ status })
    .eq("public_slug", owned.slug)
    .eq("owner_user_id", user.id);

  return { error: null };
}

/** Toggle active ↔ disabled (legacy one-click control). */
export async function toggleQrStatusAction(
  qrId: string,
  currentStatus: string,
): Promise<{ error: string | null }> {
  const next: QrStatus =
    currentStatus === "active" ? "disabled" : "active";
  return setQrStatusAction(qrId, next);
}
