export type PublicQrScanPayload = {
  id: string;
  slug: string;
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
  parent_name: string | null;
  school_name: string | null;
  emergency_instructions: string | null;
  // pet
  breed: string | null;
  vet_phone: string | null;
  medical_notes: string | null;
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
