"use client";

import {
  createQrProfileAction,
  type CreateQrState,
} from "@/app/actions/create-qr";
import { clearOnboardingDraftMarker } from "@/lib/onboarding/client-storage";
import type { QrKind } from "@/lib/qr/types";
import Link from "next/link";
import { useActionState, useCallback, useEffect, useMemo, useState } from "react";

const initialState: CreateQrState = { error: null };

function draftKey(type: QrKind) {
  return `qrnetra_profile_draft_v1_${type}`;
}

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
  hint,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-[#111111]">{label}</span>
      {hint ? (
        <span className="mt-0.5 block text-xs text-zinc-500">{hint}</span>
      ) : null}
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="off"
        className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3.5 text-base text-[#111111] shadow-sm outline-none transition-shadow placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-2 focus:ring-[#ffd400]/30"
      />
    </label>
  );
}

function TextArea({
  label,
  name,
  value,
  onChange,
  placeholder,
  hint,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-[#111111]">{label}</span>
      {hint ? (
        <span className="mt-0.5 block text-xs text-zinc-500">{hint}</span>
      ) : null}
      <textarea
        name={name}
        rows={3}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full resize-y rounded-xl border border-zinc-200 bg-white px-4 py-3.5 text-base text-[#111111] shadow-sm outline-none placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-2 focus:ring-[#ffd400]/30"
      />
    </label>
  );
}

function Hidden({ name, value }: { name: string; value: string }) {
  return <input type="hidden" name={name} value={value} />;
}

export function CreateProfileForm({ type }: { type: QrKind }) {
  const [step, setStep] = useState<1 | 2>(1);
  const [values, setValues] = useState<Record<string, string>>({});
  const [state, formAction, pending] = useActionState(
    createQrProfileAction,
    initialState,
  );

  useEffect(() => {
    clearOnboardingDraftMarker();
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(draftKey(type));
      if (raw) {
        const parsed = JSON.parse(raw) as Record<string, string>;
        setValues((v) => ({ ...parsed, ...v }));
      }
    } catch {
      /* ignore */
    }
  }, [type]);

  useEffect(() => {
    const t = window.setTimeout(() => {
      try {
        localStorage.setItem(draftKey(type), JSON.stringify(values));
      } catch {
        /* ignore */
      }
    }, 450);
    return () => window.clearTimeout(t);
  }, [values, type]);

  const set = useCallback((key: string) => {
    return (val: string) => setValues((s) => ({ ...s, [key]: val }));
  }, []);

  const labels = useMemo(() => {
    switch (type) {
      case "vehicle":
        return "Vehicle emergency profile";
      case "child":
        return "Child safety profile";
      case "pet":
        return "Pet safety profile";
      case "business":
        return "Business / fleet profile";
      default:
        return "Emergency profile";
    }
  }, [type]);

  function clearDraft() {
    try {
      localStorage.removeItem(draftKey(type));
      setValues({});
      setStep(1);
    } catch {
      /* ignore */
    }
  }

  function validateStep1(): boolean {
    if (type === "vehicle") {
      return Boolean(
        values.full_name?.trim() && values.phone?.trim(),
      );
    }
    if (type === "child") {
      return Boolean(values.child_name?.trim() && values.parent_contact?.trim());
    }
    if (type === "pet") {
      return Boolean(values.pet_name?.trim() && values.owner_contact?.trim());
    }
    if (type === "business") {
      return Boolean(
        values.company_name?.trim() && values.admin_contact?.trim(),
      );
    }
    return false;
  }

  const progressPct = step === 1 ? 42 : 100;

  return (
    <div className="mx-auto max-w-lg px-4 py-12 sm:py-16">
      <div className="mb-6">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-200">
          <div
            className="h-full rounded-full bg-[#ffd400] transition-[width] duration-500 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <p className="mt-2 text-xs font-medium text-zinc-500">
          Step {step} of 2 · {labels}
        </p>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-2 text-xs font-medium text-zinc-500">
        <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-zinc-700">
          1
        </span>
        <span>Type</span>
        <span className="text-zinc-300">→</span>
        <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-zinc-700">
          2
        </span>
        <span>Account</span>
        <span className="text-zinc-300">→</span>
        <span className="rounded-full bg-[#ffd400] px-2 py-0.5 font-semibold text-[#111111]">
          3
        </span>
        <span className="text-[#111111]">Profile</span>
      </div>

      <h1 className="text-3xl font-bold tracking-tight text-[#111111]">
        {labels}
      </h1>
      <p className="mt-2 text-sm text-zinc-600">
        Details autosave on this device. You can edit anytime in the dashboard.
      </p>

      <form action={formAction} className="mt-8 space-y-5">
        <input type="hidden" name="type" value={type} />

        {type === "vehicle" ? (
          <>
            {step === 2 ? (
              <>
                <Hidden name="full_name" value={values.full_name ?? ""} />
                <Hidden name="phone" value={values.phone ?? ""} />
                <Hidden name="whatsapp" value={values.whatsapp ?? ""} />
              </>
            ) : null}
            {step === 1 ? (
              <>
                <Field
                  label="Full name"
                  name="full_name"
                  value={values.full_name ?? ""}
                  onChange={set("full_name")}
                  required
                  placeholder="e.g. Rahul Sharma"
                />
                <Field
                  label="Phone number"
                  name="phone"
                  type="tel"
                  value={values.phone ?? ""}
                  onChange={set("phone")}
                  required
                  placeholder="10-digit mobile"
                  hint="Primary — used for secure calls"
                />
                <Field
                  label="WhatsApp number"
                  name="whatsapp"
                  type="tel"
                  value={values.whatsapp ?? ""}
                  onChange={set("whatsapp")}
                  placeholder="Optional if same as phone"
                />
              </>
            ) : (
              <>
                <Field
                  label="Vehicle number"
                  name="vehicle_number"
                  value={values.vehicle_number ?? ""}
                  onChange={set("vehicle_number")}
                  placeholder="e.g. MH 01 AB 1234"
                />
                <Field
                  label="Alternate contact"
                  name="alternate_contact"
                  type="tel"
                  value={values.alternate_contact ?? ""}
                  onChange={set("alternate_contact")}
                  placeholder="Optional backup number"
                />
              </>
            )}
          </>
        ) : null}

        {type === "child" ? (
          <>
            {step === 2 ? (
              <>
                <Hidden name="child_name" value={values.child_name ?? ""} />
                <Hidden name="parent_contact" value={values.parent_contact ?? ""} />
              </>
            ) : null}
            {step === 1 ? (
              <>
                <Field
                  label="Child name"
                  name="child_name"
                  value={values.child_name ?? ""}
                  onChange={set("child_name")}
                  required
                />
                <Field
                  label="Parent contact"
                  name="parent_contact"
                  type="tel"
                  value={values.parent_contact ?? ""}
                  onChange={set("parent_contact")}
                  required
                  placeholder="Primary guardian"
                />
              </>
            ) : (
              <>
                <Field
                  label="Emergency contact"
                  name="emergency_contact"
                  type="tel"
                  value={values.emergency_contact ?? ""}
                  onChange={set("emergency_contact")}
                  placeholder="Secondary number"
                />
                <Field
                  label="Blood group"
                  name="blood_group"
                  value={values.blood_group ?? ""}
                  onChange={set("blood_group")}
                  placeholder="e.g. O+"
                />
                <TextArea
                  label="Allergies"
                  name="allergies"
                  value={values.allergies ?? ""}
                  onChange={set("allergies")}
                  placeholder="Shown on scan page when relevant"
                />
              </>
            )}
          </>
        ) : null}

        {type === "pet" ? (
          <>
            {step === 2 ? (
              <>
                <Hidden name="pet_name" value={values.pet_name ?? ""} />
                <Hidden name="breed" value={values.breed ?? ""} />
                <Hidden name="owner_contact" value={values.owner_contact ?? ""} />
              </>
            ) : null}
            {step === 1 ? (
              <>
                <Field
                  label="Pet name"
                  name="pet_name"
                  value={values.pet_name ?? ""}
                  onChange={set("pet_name")}
                  required
                />
                <Field
                  label="Breed"
                  name="breed"
                  value={values.breed ?? ""}
                  onChange={set("breed")}
                  placeholder="e.g. Indie"
                />
                <Field
                  label="Owner contact"
                  name="owner_contact"
                  type="tel"
                  value={values.owner_contact ?? ""}
                  onChange={set("owner_contact")}
                  required
                />
              </>
            ) : (
              <>
                <Field
                  label="Vet contact"
                  name="vet_contact"
                  type="tel"
                  value={values.vet_contact ?? ""}
                  onChange={set("vet_contact")}
                  placeholder="Clinic phone"
                />
                <TextArea
                  label="Medical notes"
                  name="medical_notes"
                  value={values.medical_notes ?? ""}
                  onChange={set("medical_notes")}
                  placeholder="Medications, conditions — keep concise"
                />
              </>
            )}
          </>
        ) : null}

        {type === "business" ? (
          <>
            {step === 2 ? (
              <>
                <Hidden name="company_name" value={values.company_name ?? ""} />
                <Hidden name="admin_contact" value={values.admin_contact ?? ""} />
              </>
            ) : null}
            {step === 1 ? (
              <>
                <Field
                  label="Company name"
                  name="company_name"
                  value={values.company_name ?? ""}
                  onChange={set("company_name")}
                  required
                />
                <Field
                  label="Admin contact"
                  name="admin_contact"
                  type="tel"
                  value={values.admin_contact ?? ""}
                  onChange={set("admin_contact")}
                  required
                />
              </>
            ) : (
              <>
                <Field
                  label="Fleet size"
                  name="fleet_size"
                  value={values.fleet_size ?? ""}
                  onChange={set("fleet_size")}
                  placeholder="e.g. 25 vehicles"
                />
                <Field
                  label="Emergency number"
                  name="emergency_number"
                  type="tel"
                  value={values.emergency_number ?? ""}
                  onChange={set("emergency_number")}
                  placeholder="Ops / security hotline"
                />
              </>
            )}
          </>
        ) : null}

        {state.error ? (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {state.error}
          </p>
        ) : null}

        <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {step === 2 ? (
              <button
                type="submit"
                disabled={pending}
                className="inline-flex h-12 min-w-[200px] items-center justify-center rounded-full bg-[#111111] text-sm font-semibold text-white shadow-lg shadow-zinc-900/10 transition-transform disabled:opacity-60 hover:enabled:scale-[1.02]"
              >
                {pending ? "Saving…" : "Save & generate QR"}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (validateStep1()) setStep(2);
                }}
                className="inline-flex h-12 min-w-[200px] items-center justify-center rounded-full bg-[#111111] text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
              >
                Continue
              </button>
            )}
            {step === 2 ? (
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex h-12 items-center justify-center rounded-full border border-zinc-200 px-6 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
              >
                Back
              </button>
            ) : null}
          </div>
          <button
            type="button"
            onClick={clearDraft}
            className="text-xs font-medium text-zinc-500 underline-offset-4 hover:text-[#111111] hover:underline"
          >
            Clear saved draft
          </button>
        </div>

        <Link
          href="/create/type"
          className="inline-flex text-sm font-medium text-zinc-600 hover:text-[#111111]"
        >
          ← Change tag type
        </Link>
      </form>
    </div>
  );
}
