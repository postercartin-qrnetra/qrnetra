"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { updateQrProfileAction } from "@/app/actions/update-qr-profile";
import {
  BusinessFields,
  ChildFields,
  PetFields,
  VehicleFields,
} from "@/components/create-profile-form";
import type { QrKind } from "@/lib/qr/types";

type Values = Record<string, string>;

function profileToFormValues(
  kind: QrKind,
  name: string,
  phone: string,
  data: Record<string, string>,
): Values {
  if (kind === "vehicle") {
    return {
      full_name: name,
      phone,
      vehicle_number: data.vehicle_number ?? "",
      whatsapp: data.whatsapp ?? "",
      alternate_contact: data.alternate_contact ?? "",
      emergency_note: data.emergency_note ?? "",
    };
  }
  if (kind === "child") {
    return {
      child_name: name,
      parent_contact: phone,
      parent_name: data.parent_name ?? "",
      emergency_contact: data.emergency_contact ?? "",
      blood_group: data.blood_group ?? "",
      allergies: data.allergies ?? "",
      school_name: data.school_name ?? "",
      emergency_instructions: data.emergency_instructions ?? "",
      emergency_note: data.emergency_note ?? "",
    };
  }
  if (kind === "pet") {
    return {
      pet_name: name,
      owner_contact: phone,
      breed: data.breed ?? "",
      vet_contact: data.vet_contact ?? "",
      whatsapp: data.whatsapp ?? "",
      medical_notes: data.medical_notes ?? "",
      reward_note: data.reward_note ?? "",
      emergency_note: data.emergency_note ?? "",
    };
  }
  return {
    company_name: name,
    admin_contact: phone,
    asset_id: data.asset_id ?? "",
    department: data.department ?? "",
    escalation_contact: data.escalation_contact ?? "",
    fleet_size: data.fleet_size ?? "",
    whatsapp: data.whatsapp ?? "",
    emergency_note: data.emergency_note ?? "",
  };
}

export function EditQrProfileForm({
  qrId,
  kind,
  name,
  phone,
  dataJson,
}: {
  qrId: string;
  kind: QrKind;
  name: string;
  phone: string;
  dataJson: Record<string, string>;
}) {
  const router = useRouter();
  const [values, setValues] = useState<Values>(() =>
    profileToFormValues(kind, name, phone, dataJson),
  );
  const [showOptional, setShowOptional] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const set = useCallback(
    (key: string) => (val: string) => setValues((s) => ({ ...s, [key]: val })),
    [],
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSaved(false);

    const fd = new FormData();
    fd.set("type", kind);
    for (const [k, v] of Object.entries(values)) {
      if (v) fd.set(k, v);
    }

    const result = await updateQrProfileAction(qrId, fd);
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    setSaved(true);
    router.refresh();
  }

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="space-y-6">
      <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
        Editing updates your emergency profile only. Your QR code and scan link (
        <span className="font-mono font-semibold">/s/…</span>) stay the same.
      </p>

      {kind === "vehicle" && (
        <VehicleFields values={values} set={set} showOptional={showOptional} />
      )}
      {kind === "child" && (
        <ChildFields values={values} set={set} showOptional={showOptional} />
      )}
      {kind === "pet" && (
        <PetFields values={values} set={set} showOptional={showOptional} />
      )}
      {kind === "business" && (
        <BusinessFields values={values} set={set} showOptional={showOptional} />
      )}

      {!showOptional && (
        <button
          type="button"
          onClick={() => setShowOptional(true)}
          className="text-sm font-semibold text-zinc-600 underline-offset-4 hover:underline"
        >
          Show optional fields
        </button>
      )}

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}
      {saved && (
        <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-800">
          Profile saved. Scans will show your latest information.
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="flex h-12 w-full items-center justify-center rounded-2xl bg-[#ffd400] text-sm font-bold text-[#111111] disabled:opacity-60"
      >
        {loading ? "Saving…" : "Save profile"}
      </button>
    </form>
  );
}
