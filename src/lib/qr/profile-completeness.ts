import type { QrKind } from "@/lib/qr/types";

export type ProfileCompleteness = {
  percent: number;
  missing: string[];
};

type ChecklistItem = {
  label: string;
  keys: string[];
};

const CHECKLISTS: Record<QrKind, ChecklistItem[]> = {
  vehicle: [
    { label: "Emergency / alternate contact", keys: ["alternate_contact"] },
    { label: "WhatsApp number", keys: ["whatsapp"] },
    { label: "Vehicle type", keys: ["vehicle_type"] },
    { label: "Medical notes", keys: ["medical_notes", "blood_group"] },
    { label: "Finder instructions", keys: ["finder_instructions"] },
    { label: "Emergency note", keys: ["emergency_note"] },
  ],
  child: [
    { label: "Emergency contact", keys: ["emergency_contact"] },
    { label: "School name", keys: ["school_name"] },
    { label: "Blood group", keys: ["blood_group"] },
    { label: "Medical conditions", keys: ["allergies", "medical_notes"] },
    { label: "Emergency instructions", keys: ["emergency_instructions"] },
  ],
  pet: [
    { label: "Owner name", keys: ["owner_name"] },
    { label: "Breed", keys: ["breed"] },
    { label: "Colour", keys: ["pet_color"] },
    { label: "Vet contact", keys: ["vet_contact"] },
    { label: "Reward note", keys: ["reward_note"] },
    { label: "Medical notes", keys: ["medical_notes"] },
  ],
  asset: [
    { label: "Responsible person", keys: ["responsible_person"] },
    { label: "WhatsApp contact", keys: ["whatsapp"] },
    { label: "Alternate contact", keys: ["alternate_contact"] },
    { label: "Recovery instructions", keys: ["emergency_note"] },
  ],
  business: [
    { label: "Department", keys: ["department"] },
    { label: "Escalation contact", keys: ["escalation_contact"] },
    { label: "Responsible person", keys: ["responsible_person"] },
    { label: "WhatsApp contact", keys: ["whatsapp"] },
    { label: "Finder notes", keys: ["emergency_note"] },
  ],
};

function hasValue(data: Record<string, string>, keys: string[]): boolean {
  return keys.some((k) => Boolean(data[k]?.trim()));
}

export function computeProfileCompleteness(
  kind: QrKind,
  dataJson: Record<string, string>,
): ProfileCompleteness {
  const checklist = CHECKLISTS[kind] ?? [];
  const missing: string[] = [];

  for (const item of checklist) {
    if (!hasValue(dataJson, item.keys)) {
      missing.push(item.label);
    }
  }

  const filled = checklist.length - missing.length;
  const percent =
    checklist.length === 0
      ? 100
      : Math.round((filled / checklist.length) * 100);

  return { percent, missing };
}
