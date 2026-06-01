"use client";

import { useState } from "react";
import Link from "next/link";
import {
  updateAccountProfileAction,
  updateNotificationPrefsAction,
  signOutOtherSessionsAction,
  scheduleAccountDeletionAction,
  cancelAccountDeletionAction,
  deactivateAccountAction,
  reactivateAccountAction,
  type AccountSettingsData,
} from "@/app/actions/settings";
import {
  exportOrdersJsonAction,
  exportProfilesJsonAction,
  exportScanHistoryJsonAction,
} from "@/app/actions/export-data";
import { submitSupportRequestAction } from "@/app/actions/support";
import type { NotificationPrefs } from "@/lib/account/notification-prefs";
import { SUPPORT_CATEGORIES } from "@/lib/support/types";
import { SettingsSection } from "@/components/settings/settings-section";

type SupportRow = {
  id: string;
  category: string;
  subject: string;
  status: string;
  created_at: string;
};

type ConnectedSummary = {
  tagCount: number;
  totalScans: number;
  orderCount: number;
};

export function SettingsPageClient({
  initial,
  supportHistory,
  connected,
}: {
  initial: AccountSettingsData;
  supportHistory: SupportRow[];
  connected: ConnectedSummary;
}) {
  const [displayName, setDisplayName] = useState(initial.displayName ?? "");
  const [phone, setPhone] = useState(initial.phone ?? "");
  const [prefs, setPrefs] = useState<NotificationPrefs>(initial.notificationPrefs);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [supportCategory, setSupportCategory] = useState("general");
  const [supportSubject, setSupportSubject] = useState("");
  const [supportBody, setSupportBody] = useState("");

  async function saveProfile() {
    setLoading(true);
    setError(null);
    const r = await updateAccountProfileAction({ displayName, phone });
    setLoading(false);
    if (!r.ok) setError(r.error);
    else setMessage("Profile saved.");
  }

  async function savePrefs(next: NotificationPrefs) {
    setPrefs(next);
    const r = await updateNotificationPrefsAction(next);
    if (!r.ok) setError(r.error);
    else setMessage("Notification preferences saved.");
  }

  function downloadJson(filename: string, json: string) {
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleExport(type: "profiles" | "orders" | "scans") {
    setLoading(true);
    const fn =
      type === "profiles"
        ? exportProfilesJsonAction
        : type === "orders"
          ? exportOrdersJsonAction
          : exportScanHistoryJsonAction;
    const r = await fn();
    setLoading(false);
    if (!r.ok) {
      setError(r.error);
      return;
    }
    downloadJson(`qrnetra-${type}-${Date.now()}.json`, r.json);
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {initial.accountStatus === "pending_deletion" ? (
        <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-100">
          Account deletion scheduled
          {initial.deletionScheduledAt
            ? ` for ${new Date(initial.deletionScheduledAt).toLocaleDateString("en-IN")}`
            : ""}
          .{" "}
          <button
            type="button"
            className="font-semibold underline"
            onClick={() => void cancelAccountDeletionAction().then(() => window.location.reload())}
          >
            Cancel deletion
          </button>
        </div>
      ) : null}

      {message ? <p className="text-sm text-green-400">{message}</p> : null}
      {error ? <p className="text-sm text-red-400">{error}</p> : null}

      <SettingsSection title="Profile" description="Your account identity (not per-tag emergency contacts).">
        <div className="space-y-4">
          <div>
            <label className="text-sm text-qn-muted-2">Email</label>
            <p className="mt-1 text-white">{initial.email}</p>
          </div>
          <div>
            <label className="block text-sm text-white">Display name</label>
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="mt-2 w-full rounded-xl border border-white/[0.08] bg-qn-bg px-4 py-3 text-white"
            />
          </div>
          <div>
            <label className="block text-sm text-white">Mobile number</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-2 w-full rounded-xl border border-white/[0.08] bg-qn-bg px-4 py-3 text-white"
            />
          </div>
          <p className="text-xs text-qn-muted-2">Profile photo upload coming soon.</p>
          <button type="button" onClick={() => void saveProfile()} disabled={loading} className="qn-btn-primary">
            Save profile
          </button>
        </div>
      </SettingsSection>

      <SettingsSection title="Email notifications">
        <ul className="space-y-3 text-sm">
          {(
            [
              ["scan_alerts", "Scan alerts"],
              ["emergency_alerts", "Emergency alerts"],
              ["order_updates", "Order updates"],
              ["product_updates", "Product updates"],
              ["blog_updates", "Blog updates"],
            ] as const
          ).map(([key, label]) => (
            <li key={key} className="flex items-center justify-between gap-4">
              <span className="text-qn-muted">{label}</span>
              <input
                type="checkbox"
                checked={prefs[key]}
                onChange={(e) => void savePrefs({ ...prefs, [key]: e.target.checked })}
                className="h-5 w-5 accent-qn-accent"
              />
            </li>
          ))}
        </ul>
      </SettingsSection>

      <SettingsSection title="Active session" description="You are signed in on this device.">
        <p className="text-sm text-qn-muted">Current session · this browser</p>
        <button
          type="button"
          className="qn-btn-secondary mt-4"
          onClick={() =>
            void signOutOtherSessionsAction().then((r) => {
              if (r.ok) setMessage("Other sessions signed out.");
              else setError(r.error ?? "Failed");
            })
          }
        >
          Log out other sessions
        </button>
      </SettingsSection>

      <SettingsSection title="Security">
        <p className="text-sm text-qn-muted">
          Last sign-in:{" "}
          {initial.lastSignInAt
            ? new Date(initial.lastSignInAt).toLocaleString("en-IN")
            : "—"}
        </p>
        <Link href="/auth/update-password" className="qn-btn-secondary mt-4 inline-flex">
          Change password
        </Link>
      </SettingsSection>

      <SettingsSection title="Privacy & data export">
        <div className="flex flex-wrap gap-2">
          <button type="button" className="qn-btn-secondary text-sm" onClick={() => void handleExport("profiles")}>
            Export profiles
          </button>
          <button type="button" className="qn-btn-secondary text-sm" onClick={() => void handleExport("scans")}>
            Export scan history
          </button>
          <button type="button" className="qn-btn-secondary text-sm" onClick={() => void handleExport("orders")}>
            Export orders
          </button>
        </div>
      </SettingsSection>

      <SettingsSection title="Connected products">
        <ul className="text-sm text-qn-muted space-y-1">
          <li>Activated tags: {connected.tagCount}</li>
          <li>Total scans: {connected.totalScans}</li>
          <li>Orders: {connected.orderCount}</li>
        </ul>
        <Link href="/dashboard/scan-activity" className="mt-3 inline-block text-sm font-semibold text-qn-accent">
          View scan activity →
        </Link>
      </SettingsSection>

      <SettingsSection title="Support history">
        {supportHistory.length === 0 ? (
          <p className="text-sm text-qn-muted">No support requests yet.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {supportHistory.map((r) => (
              <li key={r.id} className="rounded-lg bg-white/[0.04] px-3 py-2">
                <p className="font-medium text-white">{r.subject}</p>
                <p className="text-xs text-qn-muted-2">
                  {r.category} · {r.status} · {new Date(r.created_at).toLocaleDateString("en-IN")}
                </p>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-6 space-y-3 border-t border-white/[0.06] pt-6">
          <p className="text-sm font-medium text-white">New support request</p>
          <select
            value={supportCategory}
            onChange={(e) => setSupportCategory(e.target.value)}
            className="w-full rounded-xl border border-white/[0.08] bg-qn-bg px-3 py-2 text-sm text-white"
          >
            {SUPPORT_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
          <input
            placeholder="Subject"
            value={supportSubject}
            onChange={(e) => setSupportSubject(e.target.value)}
            className="w-full rounded-xl border border-white/[0.08] bg-qn-bg px-3 py-2 text-sm text-white"
          />
          <textarea
            rows={3}
            placeholder="Describe your issue"
            value={supportBody}
            onChange={(e) => setSupportBody(e.target.value)}
            className="w-full rounded-xl border border-white/[0.08] bg-qn-bg px-3 py-2 text-sm text-white"
          />
          <button
            type="button"
            className="qn-btn-secondary text-sm"
            onClick={() =>
              void submitSupportRequestAction({
                category: supportCategory,
                name: displayName || "Account user",
                email: initial.email,
                subject: supportSubject,
                message: supportBody,
              }).then((r) => {
                if (r.ok) {
                  setMessage("Support request submitted.");
                  setSupportSubject("");
                  setSupportBody("");
                } else setError(r.error);
              })
            }
          >
            Submit request
          </button>
        </div>
      </SettingsSection>

      <SettingsSection title="Account management">
        <p className="text-sm text-qn-muted">
          Deleting your account permanently removes access to all QR profiles, scans, orders, and
          inventory linked to this account after the grace period. QR codes may be disabled
          immediately.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {initial.accountStatus === "deactivated" ? (
            <button
              type="button"
              className="qn-btn-secondary"
              onClick={() => void reactivateAccountAction().then(() => window.location.reload())}
            >
              Reactivate account
            </button>
          ) : (
            <button
              type="button"
              className="qn-btn-secondary"
              onClick={() => void deactivateAccountAction().then(() => window.location.reload())}
            >
              Deactivate account
            </button>
          )}
          <button
            type="button"
            className="rounded-xl border border-red-500/50 px-4 py-2 text-sm font-semibold text-red-400"
            onClick={() => {
              if (
                confirm(
                  "Schedule account deletion in 30 days? This disables your QR tags and removes dashboard access after deletion completes.",
                )
              ) {
                void scheduleAccountDeletionAction().then(() => window.location.reload());
              }
            }}
          >
            Delete account
          </button>
        </div>
      </SettingsSection>
    </div>
  );
}
