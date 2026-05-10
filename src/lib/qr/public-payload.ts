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
  emergency_phone: string | null;
  vet_phone: string | null;
  alternate_contact: string | null;
  blood_group: string | null;
  allergies: string | null;
  breed: string | null;
  medical_notes: string | null;
  fleet_size: string | null;
  business_emergency: string | null;
};

export function digitsForWhatsApp(e164: string | null | undefined): string | null {
  if (!e164) return null;
  const d = e164.replace(/\D/g, "");
  return d.length ? d : null;
}
