"use client";

import { useAuth } from "@/components/auth/auth-provider";
import { QnLogoStatic } from "@/components/ui/logo";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { createQrAction } from "@/app/actions/create-qr";
import { clearOnboardingDraftMarker } from "@/lib/onboarding/client-storage";
import type { QrKind } from "@/lib/qr/types";

// ─── Types ──────────────────────────────────────────────────────────────────

type Values = Record<string, string>;
type AuthPhase = "idle" | "needs-auth" | "sent-otp" | "submitting";

// ─── Constants ──────────────────────────────────────────────────────────────

const TYPES: { id: QrKind; label: string; emoji: string }[] = [
  { id: "vehicle", label: "Vehicle", emoji: "🚗" },
  { id: "child", label: "Child", emoji: "👶" },
  { id: "pet", label: "Pet", emoji: "🐾" },
  { id: "asset", label: "Asset", emoji: "🎒" },
  { id: "business", label: "Business", emoji: "🏢" },
];

function draftKey(type: QrKind) {
  return `qrnetra_form_draft_${type}`;
}

function saveDraft(type: QrKind, values: Values) {
  try {
    localStorage.setItem(draftKey(type), JSON.stringify(values));
  } catch {
    /* ignore */
  }
}

function loadDraft(type: QrKind): Values {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(draftKey(type));
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Values;
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

function clearDraft(type: QrKind) {
  try {
    localStorage.removeItem(draftKey(type));
  } catch {
    /* ignore */
  }
}

// ─── Field primitives ────────────────────────────────────────────────────────

export function InputField({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
  hint,
  autoComplete,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  hint?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-white">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {hint && <p className="mt-0.5 text-xs text-qn-muted-2">{hint}</p>}
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete ?? "off"}
        className="mt-2 w-full rounded-xl border border-white/[0.08] bg-qn-card px-4 py-3 text-base text-white shadow-sm outline-none transition placeholder:text-qn-muted-2 focus:border-qn-accent/50 focus:ring-2 focus:ring-qn-accent/30"
      />
    </div>
  );
}

export function TextAreaField({
  label,
  name,
  value,
  onChange,
  placeholder,
  hint,
  rows = 2,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
  rows?: number;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-white">{label}</label>
      {hint && <p className="mt-0.5 text-xs text-qn-muted-2">{hint}</p>}
      <textarea
        name={name}
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full resize-y rounded-xl border border-white/[0.08] bg-qn-card px-4 py-3 text-base text-white shadow-sm outline-none placeholder:text-qn-muted-2 focus:border-qn-accent/50 focus:ring-2 focus:ring-qn-accent/30"
      />
    </div>
  );
}

// ─── Type-specific field sections ────────────────────────────────────────────

export function VehicleFields({
  values,
  set,
  showOptional,
}: {
  values: Values;
  set: (k: string) => (v: string) => void;
  showOptional: boolean;
}) {
  return (
    <>
      <InputField
        label="Your full name"
        name="full_name"
        value={values.full_name ?? ""}
        onChange={set("full_name")}
        required
        placeholder="e.g. Rahul Sharma"
      />
      <InputField
        label="Vehicle number"
        name="vehicle_number"
        value={values.vehicle_number ?? ""}
        onChange={set("vehicle_number")}
        placeholder="e.g. MH 01 AB 1234"
        hint="Shown to finder — helps identify the vehicle"
      />
      <InputField
        label="Contact number"
        name="phone"
        type="tel"
        value={values.phone ?? ""}
        onChange={set("phone")}
        required
        placeholder="10-digit mobile"
        hint="Used for direct call when your QR is scanned"
        autoComplete="tel"
      />
      {showOptional && (
        <>
          <InputField
            label="WhatsApp number"
            name="whatsapp"
            type="tel"
            value={values.whatsapp ?? ""}
            onChange={set("whatsapp")}
            placeholder="Leave blank if same as contact number"
          />
          <InputField
            label="Alternate / emergency contact"
            name="alternate_contact"
            type="tel"
            value={values.alternate_contact ?? ""}
            onChange={set("alternate_contact")}
            placeholder="Backup number shown on scan"
          />
          <TextAreaField
            label="Emergency note"
            name="emergency_note"
            value={values.emergency_note ?? ""}
            onChange={set("emergency_note")}
            placeholder="e.g. Keys inside glove box, call if car blocks exit"
            hint="Shown as a message on the scan page"
          />
        </>
      )}
    </>
  );
}

export function ChildFields({
  values,
  set,
  showOptional,
}: {
  values: Values;
  set: (k: string) => (v: string) => void;
  showOptional: boolean;
}) {
  return (
    <>
      <InputField
        label="Child's name"
        name="child_name"
        value={values.child_name ?? ""}
        onChange={set("child_name")}
        required
        placeholder="e.g. Arya"
      />
      <InputField
        label="Parent / guardian contact"
        name="parent_contact"
        type="tel"
        value={values.parent_contact ?? ""}
        onChange={set("parent_contact")}
        required
        placeholder="10-digit mobile"
        autoComplete="tel"
      />
      {showOptional && (
        <>
          <InputField
            label="Parent / guardian name"
            name="parent_name"
            value={values.parent_name ?? ""}
            onChange={set("parent_name")}
            placeholder="e.g. Priya Sharma"
          />
          <InputField
            label="Emergency contact (secondary)"
            name="emergency_contact"
            type="tel"
            value={values.emergency_contact ?? ""}
            onChange={set("emergency_contact")}
            placeholder="Grandparent, uncle, etc."
          />
          <InputField
            label="Blood group"
            name="blood_group"
            value={values.blood_group ?? ""}
            onChange={set("blood_group")}
            placeholder="e.g. O+"
          />
          <TextAreaField
            label="Allergies"
            name="allergies"
            value={values.allergies ?? ""}
            onChange={set("allergies")}
            placeholder="e.g. Peanuts, penicillin"
          />
          <InputField
            label="School name"
            name="school_name"
            value={values.school_name ?? ""}
            onChange={set("school_name")}
            placeholder="e.g. Delhi Public School, Noida"
          />
          <TextAreaField
            label="Emergency instructions"
            name="emergency_instructions"
            value={values.emergency_instructions ?? ""}
            onChange={set("emergency_instructions")}
            placeholder="e.g. Keep calm, avoid loud noises — has anxiety disorder"
          />
          <TextAreaField
            label="Message for finder"
            name="emergency_note"
            value={values.emergency_note ?? ""}
            onChange={set("emergency_note")}
            placeholder="e.g. Please call parent immediately"
          />
        </>
      )}
    </>
  );
}

export function PetFields({
  values,
  set,
  showOptional,
}: {
  values: Values;
  set: (k: string) => (v: string) => void;
  showOptional: boolean;
}) {
  return (
    <>
      <InputField
        label="Pet's name"
        name="pet_name"
        value={values.pet_name ?? ""}
        onChange={set("pet_name")}
        required
        placeholder="e.g. Bruno"
      />
      <InputField
        label="Owner contact"
        name="owner_contact"
        type="tel"
        value={values.owner_contact ?? ""}
        onChange={set("owner_contact")}
        required
        placeholder="10-digit mobile"
        autoComplete="tel"
      />
      {showOptional && (
        <>
          <InputField
            label="Breed"
            name="breed"
            value={values.breed ?? ""}
            onChange={set("breed")}
            placeholder="e.g. Labrador / Indie"
          />
          <InputField
            label="Vet / clinic contact"
            name="vet_contact"
            type="tel"
            value={values.vet_contact ?? ""}
            onChange={set("vet_contact")}
            placeholder="Vet phone number"
          />
          <InputField
            label="WhatsApp (owner)"
            name="whatsapp"
            type="tel"
            value={values.whatsapp ?? ""}
            onChange={set("whatsapp")}
            placeholder="Leave blank if same as owner contact"
          />
          <TextAreaField
            label="Medical notes"
            name="medical_notes"
            value={values.medical_notes ?? ""}
            onChange={set("medical_notes")}
            placeholder="Medications, conditions — keep concise"
          />
          <TextAreaField
            label="Reward / message for finder"
            name="reward_note"
            value={values.reward_note ?? ""}
            onChange={set("reward_note")}
            placeholder="e.g. Reward on safe return. Friendly, doesn't bite."
          />
        </>
      )}
    </>
  );
}

export function BusinessFields({
  values,
  set,
  showOptional,
}: {
  values: Values;
  set: (k: string) => (v: string) => void;
  showOptional: boolean;
}) {
  return (
    <>
      <InputField
        label="Company / organisation name"
        name="company_name"
        value={values.company_name ?? ""}
        onChange={set("company_name")}
        required
        placeholder="e.g. Sharma Logistics Pvt Ltd"
      />
      <InputField
        label="Admin contact"
        name="admin_contact"
        type="tel"
        value={values.admin_contact ?? ""}
        onChange={set("admin_contact")}
        required
        placeholder="Primary admin phone"
        autoComplete="tel"
      />
      {showOptional && (
        <>
          <InputField
            label="Asset / vehicle ID"
            name="asset_id"
            value={values.asset_id ?? ""}
            onChange={set("asset_id")}
            placeholder="e.g. TRK-007 or MH 12 AB 9999"
            hint="Shown on scan page to help identify asset"
          />
          <InputField
            label="Department"
            name="department"
            value={values.department ?? ""}
            onChange={set("department")}
            placeholder="e.g. Ops, Security, Logistics"
          />
          <InputField
            label="Escalation / emergency contact"
            name="escalation_contact"
            type="tel"
            value={values.escalation_contact ?? ""}
            onChange={set("escalation_contact")}
            placeholder="Secondary escalation number"
          />
          <InputField
            label="Fleet size"
            name="fleet_size"
            value={values.fleet_size ?? ""}
            onChange={set("fleet_size")}
            placeholder="e.g. 25 vehicles"
          />
          <InputField
            label="WhatsApp contact"
            name="whatsapp"
            type="tel"
            value={values.whatsapp ?? ""}
            onChange={set("whatsapp")}
            placeholder="Optional"
          />
          <TextAreaField
            label="Notes / message for finder"
            name="emergency_note"
            value={values.emergency_note ?? ""}
            onChange={set("emergency_note")}
            placeholder="e.g. Report damage or suspicious activity to admin"
          />
        </>
      )}
    </>
  );
}

export function AssetFields({
  values,
  set,
  showOptional,
}: {
  values: Values;
  set: (k: string) => (v: string) => void;
  showOptional: boolean;
}) {
  return (
    <>
      <InputField
        label="Asset name"
        name="asset_name"
        value={values.asset_name ?? ""}
        onChange={set("asset_name")}
        required
        placeholder="e.g. Office laptop, Keychain, School bag"
      />
      <InputField
        label="Owner contact"
        name="owner_contact"
        type="tel"
        value={values.owner_contact ?? ""}
        onChange={set("owner_contact")}
        required
        placeholder="10-digit mobile"
        autoComplete="tel"
      />
      {showOptional && (
        <>
          <InputField
            label="Asset ID / label"
            name="asset_id"
            value={values.asset_id ?? ""}
            onChange={set("asset_id")}
            placeholder="e.g. LAP-114, Blue backpack, Key set #2"
            hint="Helps the finder confirm they found the right belonging."
          />
          <InputField
            label="WhatsApp contact"
            name="whatsapp"
            type="tel"
            value={values.whatsapp ?? ""}
            onChange={set("whatsapp")}
            placeholder="Optional"
          />
          <InputField
            label="Alternate contact"
            name="alternate_contact"
            type="tel"
            value={values.alternate_contact ?? ""}
            onChange={set("alternate_contact")}
            placeholder="Backup number"
          />
          <TextAreaField
            label="Recovery instructions"
            name="emergency_note"
            value={values.emergency_note ?? ""}
            onChange={set("emergency_note")}
            placeholder="e.g. Please call before handing over. Reward on safe return."
          />
        </>
      )}
    </>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export function CreateProfileForm({
  initialType,
  initialEmail,
}: {
  initialType?: QrKind;
  initialEmail?: string | null;
}) {
  const router = useRouter();
  const { user } = useAuth();
  const isLoggedIn = Boolean(user);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [type, setType] = useState<QrKind>(initialType ?? "vehicle");
  const [values, setValues] = useState<Values>(() =>
    typeof window !== "undefined"
      ? loadDraft(initialType ?? "vehicle")
      : {},
  );
  const [showOptional, setShowOptional] = useState(false);

  const [email, setEmail] = useState(initialEmail ?? "");
  const [password, setPassword] = useState("");
  const [authPhase, setAuthPhase] = useState<AuthPhase>("idle");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const accountEmail = user?.email ?? email;

  useEffect(() => {
    clearOnboardingDraftMarker();
  }, []);

  // Save draft debounced
  useEffect(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => saveDraft(type, values), 400);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [type, values]);

  // Switch type — load the draft for the new type
  function handleTypeChange(newType: QrKind) {
    if (newType === type) return;
    setType(newType);
    setShowOptional(false);
    setError(null);
    setValues(loadDraft(newType));
  }

  const set = useCallback(
    (key: string) =>
      (val: string) =>
        setValues((s) => ({ ...s, [key]: val })),
    [],
  );

  function validateRequired(): string | null {
    if (type === "vehicle") {
      if (!values.full_name?.trim()) return "Full name is required.";
      if (!values.phone?.trim()) return "Contact number is required.";
    } else if (type === "child") {
      if (!values.child_name?.trim()) return "Child's name is required.";
      if (!values.parent_contact?.trim()) return "Parent contact is required.";
    } else if (type === "pet") {
      if (!values.pet_name?.trim()) return "Pet's name is required.";
      if (!values.owner_contact?.trim()) return "Owner contact is required.";
    } else if (type === "asset") {
      if (!values.asset_name?.trim()) return "Asset name is required.";
      if (!values.owner_contact?.trim()) return "Owner contact is required.";
    } else if (type === "business") {
      if (!values.company_name?.trim()) return "Company name is required.";
      if (!values.admin_contact?.trim()) return "Admin contact is required.";
    }
    return null;
  }

  function buildFormData(): FormData {
    const fd = new FormData();
    fd.set("type", type);
    for (const [k, v] of Object.entries(values)) {
      if (v) fd.set(k, v);
    }
    return fd;
  }

  /**
   * Ensure Supabase session cookies are written and the App Router cache is
   * refreshed before a server action runs (fixes sign-in → immediate action race).
   */
  async function ensureSessionReady(): Promise<boolean> {
    const supabase = createClient();
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    if (error || !session?.user) {
      return false;
    }
    router.refresh();
    return true;
  }

  async function submitQrCreation() {
    setLoading(true);
    setError(null);
    setAuthPhase("submitting");
    try {
      const sessionOk = await ensureSessionReady();
      if (!sessionOk) {
        setError("Not authenticated. Please sign in and try again.");
        setAuthPhase("idle");
        return;
      }

      const fd = buildFormData();
      const result = await createQrAction(fd);
      if (result.error) {
        setError(result.error);
        setAuthPhase("idle");
        return;
      }
      if (result.slug) {
        clearDraft(type);
        const redirectTarget = `/create/success/${result.slug}`;
        console.log("[QR CLIENT] redirect target", redirectTarget);
        router.push(redirectTarget);
        return;
      }
      setError("QR creation did not complete. Please try again.");
      setAuthPhase("idle");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setAuthPhase("idle");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit() {
    const fieldErr = validateRequired();
    if (fieldErr) {
      setError(fieldErr);
      return;
    }
    setError(null);

    if (isLoggedIn) {
      await submitQrCreation();
      return;
    }

    if (!email.trim()) {
      setError("Enter your email address to continue.");
      setAuthPhase("needs-auth");
      return;
    }
    if (!password) {
      setError("Enter a password (min 6 characters).");
      setAuthPhase("needs-auth");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setError(null);
    const supabase = createClient();

    // Try sign-in first, then sign-up
    const { error: signInErr } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (!signInErr) {
      await supabase.auth.getSession();
      router.refresh();
      await submitQrCreation();
      return;
    }

    if (
      signInErr.message.toLowerCase().includes("invalid login credentials") ||
      signInErr.message.toLowerCase().includes("email not confirmed")
    ) {
      // New user — sign up
      const { data, error: signUpErr } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });

      if (signUpErr) {
        setError(signUpErr.message);
        setLoading(false);
        return;
      }

      if (data.session) {
        await supabase.auth.getSession();
        router.refresh();
        await submitQrCreation();
        return;
      }

      // Email confirmation required
      setError(
        "Check your inbox to confirm your email, then come back and click Generate again.",
      );
      setLoading(false);
      return;
    }

    setError(signInErr.message);
    setLoading(false);
  }

  const submitLabel = (() => {
    if (authPhase === "submitting") return "Generating…";
    if (loading) return "Please wait…";
    return isLoggedIn ? "Generate Emergency QR →" : "Create Account & Generate QR →";
  })();

  return (
    <div className="mx-auto max-w-lg px-4 py-10 sm:py-14">
      {/* Header */}
      <div className="mb-8">
        <QnLogoStatic layout="compact" />
        <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-qn-muted-2">
          Free QR profile
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">
          Create your free QR profile
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-qn-muted">
          Generate a privacy-first QR for your vehicle, child, pet, asset, or
          business in under 2 minutes. No purchase required.
        </p>
      </div>

      {/* Type selector */}
      <div className="mb-8">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-qn-muted-2">
          What are you protecting?
        </p>
        <div className="flex gap-2 flex-wrap">
          {TYPES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => handleTypeChange(t.id)}
              className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
                type === t.id
                  ? "border-qn-accent bg-qn-card-2 text-white"
                  : "border-white/[0.08] bg-qn-card text-qn-muted hover:border-zinc-400"
              }`}
            >
              <span className="text-base leading-none">{t.emoji}</span>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Form card */}
      <div className="rounded-3xl border border-white/[0.08] bg-qn-card shadow-[0_20px_60px_-12px_rgba(0,0,0,0.1)]">
        {/* Required fields */}
        <div className="px-6 pt-6 pb-5 space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-qn-muted-2">
            {type === "vehicle" && "Vehicle details"}
            {type === "child" && "Child details"}
            {type === "pet" && "Pet details"}
            {type === "asset" && "Asset details"}
            {type === "business" && "Business details"}
          </p>

          {type === "vehicle" && (
            <VehicleFields values={values} set={set} showOptional={showOptional} />
          )}
          {type === "child" && (
            <ChildFields values={values} set={set} showOptional={showOptional} />
          )}
          {type === "pet" && (
            <PetFields values={values} set={set} showOptional={showOptional} />
          )}
          {type === "asset" && (
            <AssetFields values={values} set={set} showOptional={showOptional} />
          )}
          {type === "business" && (
            <BusinessFields values={values} set={set} showOptional={showOptional} />
          )}

          {/* Optional toggle */}
          <button
            type="button"
            onClick={() => setShowOptional((v) => !v)}
            className="flex w-full items-center gap-2 rounded-xl border border-dashed border-white/[0.08] px-4 py-3 text-sm font-medium text-qn-muted transition hover:border-white/[0.15] hover:bg-white/[0.05]"
          >
            <span
              className={`inline-block transition-transform duration-200 ${
                showOptional ? "rotate-90" : ""
              }`}
            >
              ▶
            </span>
            {showOptional ? "Hide optional fields" : "Add more details (optional)"}
          </button>
        </div>

        {/* Divider */}
        <div className="mx-6 h-px bg-qn-surface" />

        {/* Auth section */}
        <div className="px-6 pt-5 pb-6 space-y-4">
          {isLoggedIn ? (
            <p className="text-xs text-qn-muted-2">
              Generating QR as{" "}
              <span className="font-semibold text-white">{accountEmail}</span>
            </p>
          ) : (
            <>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-qn-muted-2">
                Your account
              </p>
              <InputField
                label="Email address"
                name="email"
                type="email"
                value={email}
                onChange={(v) => {
                  setEmail(v);
                  if (authPhase === "idle") setAuthPhase("needs-auth");
                }}
                required
                placeholder="you@example.com"
                autoComplete="email"
              />
              <InputField
                label="Password"
                name="password"
                type="password"
                value={password}
                onChange={setPassword}
                required
                placeholder="Min 6 characters"
                hint="New to QRNetra? We'll create your account."
                autoComplete="new-password"
              />
            </>
          )}

          {error && (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={loading || authPhase === "submitting"}
            className="flex h-14 w-full items-center justify-center rounded-2xl bg-qn-accent text-base font-bold text-white shadow-lg shadow-qn-accent/25 transition-all hover:scale-[1.01] disabled:opacity-60 disabled:scale-100"
          >
            {submitLabel}
          </button>

          <p className="text-center text-xs leading-relaxed text-qn-muted-2">
            Your QR scan URL never contains personal data — only a random slug.
            Update details anytime from the dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}
