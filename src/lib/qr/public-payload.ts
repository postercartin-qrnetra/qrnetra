export type QrPublicStatus = "active" | "paused" | "disabled" | "expired";

export type PublicQrScanPayload = {
  id: string;
  slug: string;
  status?: QrPublicStatus | string | null;
  kind: string;
  title: string | null;
  message: string | null;
  vehicle_registration: string | null;
  channels: {
    call?: boolean;
    whatsapp?: boolean;
    sms?: boolean;
    email?: boolean;
  } | null;
  owner_phone: string | null;
  whatsapp_phone: string | null;
  // vehicle / shared
  alternate_contact: string | null;
  // child
  emergency_phone: string | null;
  blood_group: string | null;
  allergies: string | null;
  medical_notes: string | null;
  parent_name: string | null;
  school_name: string | null;
  class_name: string | null;
  teacher_contact: string | null;
  emergency_instructions: string | null;
  // pet
  owner_name: string | null;
  breed: string | null;
  vet_phone: string | null;
  reward_note: string | null;
  // business / fleet
  fleet_size: string | null;
  business_emergency: string | null;
  asset_id: string | null;
  department: string | null;
  escalation_contact: string | null;
};

export function digitsForWhatsApp(e164: string | null | undefined): string | null {
  if (!e164) return null;
  const d = e164.replace(/\D/g, "");
  return d.length ? d : null;
}
