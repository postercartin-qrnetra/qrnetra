"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  DEFAULT_NOTIFICATION_PREFS,
  parseNotificationPrefs,
  type NotificationPrefs,
} from "@/lib/account/notification-prefs";

async function requireUser() {
  const supabase = await createClient();
  if (!supabase) return { error: "Supabase is not configured.", supabase: null, user: null };
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in.", supabase, user: null };
  return { error: null, supabase, user };
}

export async function updateAccountProfileAction(input: {
  displayName: string;
  phone: string;
}) {
  const { error, supabase, user } = await requireUser();
  if (error || !supabase || !user) return { ok: false as const, error: error ?? "Unauthorized" };

  const display_name = input.displayName.trim();
  const phone = input.phone.trim();

  if (!display_name) {
    return { ok: false as const, error: "Name is required." };
  }

  const { error: upsertError } = await supabase.from("profiles").upsert({
    id: user.id,
    display_name,
    phone: phone || null,
    updated_at: new Date().toISOString(),
  });

  if (upsertError) {
    return { ok: false as const, error: upsertError.message };
  }

  revalidatePath("/dashboard/settings");
  return { ok: true as const };
}

export async function updateNotificationPrefsAction(prefs: NotificationPrefs) {
  const { error, supabase, user } = await requireUser();
  if (error || !supabase || !user) return { ok: false as const, error: error ?? "Unauthorized" };

  const merged = { ...DEFAULT_NOTIFICATION_PREFS, ...prefs };

  const { error: upsertError } = await supabase.from("profiles").upsert({
    id: user.id,
    notification_prefs: merged,
    updated_at: new Date().toISOString(),
  });

  if (upsertError) {
    return { ok: false as const, error: upsertError.message };
  }

  revalidatePath("/dashboard/settings");
  return { ok: true as const };
}

export async function signOutOtherSessionsAction() {
  const { error, supabase } = await requireUser();
  if (error || !supabase) return { ok: false as const, error: error ?? "Unauthorized" };

  const { error: signOutError } = await supabase.auth.signOut({ scope: "others" });
  if (signOutError) {
    return { ok: false as const, error: signOutError.message };
  }

  return { ok: true as const };
}

export async function scheduleAccountDeletionAction() {
  const { error, supabase, user } = await requireUser();
  if (error || !supabase || !user) return { ok: false as const, error: error ?? "Unauthorized" };

  const { data, error: rpcError } = await supabase.rpc("schedule_account_deletion", {
    p_user_id: user.id,
  });

  const result = data as { ok?: boolean; error?: string } | null;
  if (rpcError || !result?.ok) {
    return { ok: false as const, error: result?.error ?? rpcError?.message ?? "Failed" };
  }

  revalidatePath("/dashboard/settings");
  return { ok: true as const };
}

export async function cancelAccountDeletionAction() {
  const { error, supabase, user } = await requireUser();
  if (error || !supabase || !user) return { ok: false as const, error: error ?? "Unauthorized" };

  await supabase.rpc("cancel_account_deletion", { p_user_id: user.id });
  revalidatePath("/dashboard/settings");
  return { ok: true as const };
}

export async function deactivateAccountAction() {
  const { error, supabase, user } = await requireUser();
  if (error || !supabase || !user) return { ok: false as const, error: error ?? "Unauthorized" };

  await supabase.rpc("deactivate_account", { p_user_id: user.id });
  revalidatePath("/dashboard/settings");
  return { ok: true as const };
}

export async function reactivateAccountAction() {
  const { error, supabase, user } = await requireUser();
  if (error || !supabase || !user) return { ok: false as const, error: error ?? "Unauthorized" };

  await supabase.rpc("reactivate_account", { p_user_id: user.id });
  revalidatePath("/dashboard/settings");
  return { ok: true as const };
}

export type AccountSettingsData = {
  email: string;
  displayName: string | null;
  phone: string | null;
  notificationPrefs: NotificationPrefs;
  accountStatus: string;
  deletionScheduledAt: string | null;
  lastSignInAt: string | null;
};

export async function getAccountSettingsData(): Promise<AccountSettingsData | null> {
  const { supabase, user } = await requireUser();
  if (!supabase || !user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "display_name, phone, notification_prefs, account_status, deletion_scheduled_at",
    )
    .eq("id", user.id)
    .maybeSingle();

  return {
    email: user.email ?? "",
    displayName: profile?.display_name ?? null,
    phone: profile?.phone ?? null,
    notificationPrefs: parseNotificationPrefs(profile?.notification_prefs),
    accountStatus: profile?.account_status ?? "active",
    deletionScheduledAt: profile?.deletion_scheduled_at ?? null,
    lastSignInAt: user.last_sign_in_at ?? null,
  };
}
