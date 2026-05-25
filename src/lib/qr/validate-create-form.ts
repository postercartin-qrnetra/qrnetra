import { z } from "zod";
import { isPlausiblePhone, normalizeIndiaPhone } from "@/lib/qr/slug";
import { QR_KINDS, type QrKind } from "@/lib/qr/types";

const phoneField = z
  .string()
  .min(1, "Phone number is required.")
  .transform((v) => normalizeIndiaPhone(v))
  .refine((v) => isPlausiblePhone(v), "Enter a valid phone number (10+ digits).");

const optionalPhone = z
  .string()
  .optional()
  .transform((v) => (v?.trim() ? normalizeIndiaPhone(v) : ""))
  .refine((v) => !v || isPlausiblePhone(v), "Invalid phone number format.");

const optionalText = z.string().optional().transform((v) => v?.trim() ?? "");

const vehicleSchema = z.object({
  type: z.literal("vehicle"),
  full_name: z.string().min(1, "Owner name is required."),
  phone: phoneField,
  vehicle_number: optionalText,
  whatsapp: optionalPhone,
  alternate_contact: optionalPhone,
  emergency_note: optionalText,
});

const childSchema = z.object({
  type: z.literal("child"),
  child_name: z.string().min(1, "Child name is required."),
  parent_contact: phoneField,
  parent_name: optionalText,
  emergency_contact: optionalPhone,
  blood_group: optionalText,
  allergies: optionalText,
  school_name: optionalText,
  emergency_instructions: optionalText,
  emergency_note: optionalText,
});

const petSchema = z.object({
  type: z.literal("pet"),
  pet_name: z.string().min(1, "Pet name is required."),
  owner_contact: phoneField,
  breed: optionalText,
  vet_contact: optionalPhone,
  whatsapp: optionalPhone,
  medical_notes: optionalText,
  reward_note: optionalText,
  emergency_note: optionalText,
});

const assetSchema = z.object({
  type: z.literal("asset"),
  asset_name: z.string().min(1, "Asset name is required."),
  owner_contact: phoneField,
  asset_id: optionalText,
  whatsapp: optionalPhone,
  alternate_contact: optionalPhone,
  emergency_note: optionalText,
});

const businessSchema = z.object({
  type: z.literal("business"),
  company_name: z.string().min(1, "Company name is required."),
  admin_contact: phoneField,
  asset_id: optionalText,
  department: optionalText,
  escalation_contact: optionalPhone,
  fleet_size: optionalText,
  whatsapp: optionalPhone,
  emergency_note: optionalText,
});

const createFormSchema = z.discriminatedUnion("type", [
  vehicleSchema,
  childSchema,
  petSchema,
  assetSchema,
  businessSchema,
]);

export type ValidatedCreateForm = z.infer<typeof createFormSchema>;

export type ParsedProfilePayload = {
  profileType: QrKind;
  name: string;
  phone: string;
  dataJson: Record<string, string>;
  vehicleNumber: string | null;
  whatsapp: string | null;
  emergencyNote: string | null;
};

function str(fd: FormData, key: string): string {
  return String(fd.get(key) ?? "").trim();
}

function formDataToRaw(fd: FormData): Record<string, string> {
  const type = str(fd, "type");
  const base: Record<string, string> = { type };

  if (type === "vehicle") {
    return {
      ...base,
      full_name: str(fd, "full_name"),
      phone: str(fd, "phone"),
      vehicle_number: str(fd, "vehicle_number"),
      whatsapp: str(fd, "whatsapp"),
      alternate_contact: str(fd, "alternate_contact"),
      emergency_note: str(fd, "emergency_note"),
    };
  }
  if (type === "child") {
    return {
      ...base,
      child_name: str(fd, "child_name"),
      parent_contact: str(fd, "parent_contact"),
      parent_name: str(fd, "parent_name"),
      emergency_contact: str(fd, "emergency_contact"),
      blood_group: str(fd, "blood_group"),
      allergies: str(fd, "allergies"),
      school_name: str(fd, "school_name"),
      emergency_instructions: str(fd, "emergency_instructions"),
      emergency_note: str(fd, "emergency_note"),
    };
  }
  if (type === "pet") {
    return {
      ...base,
      pet_name: str(fd, "pet_name"),
      owner_contact: str(fd, "owner_contact"),
      breed: str(fd, "breed"),
      vet_contact: str(fd, "vet_contact"),
      whatsapp: str(fd, "whatsapp"),
      medical_notes: str(fd, "medical_notes"),
      reward_note: str(fd, "reward_note"),
      emergency_note: str(fd, "emergency_note"),
    };
  }
  if (type === "asset") {
    return {
      ...base,
      asset_name: str(fd, "asset_name"),
      owner_contact: str(fd, "owner_contact"),
      asset_id: str(fd, "asset_id"),
      whatsapp: str(fd, "whatsapp"),
      alternate_contact: str(fd, "alternate_contact"),
      emergency_note: str(fd, "emergency_note"),
    };
  }
  if (type === "business") {
    return {
      ...base,
      company_name: str(fd, "company_name"),
      admin_contact: str(fd, "admin_contact"),
      asset_id: str(fd, "asset_id"),
      department: str(fd, "department"),
      escalation_contact: str(fd, "escalation_contact"),
      fleet_size: str(fd, "fleet_size"),
      whatsapp: str(fd, "whatsapp"),
      emergency_note: str(fd, "emergency_note"),
    };
  }

  return base;
}

function pickDataJson(
  data: ValidatedCreateForm,
): Record<string, string> {
  const out: Record<string, string> = {};
  const entries = Object.entries(data) as [string, string][];
  for (const [key, value] of entries) {
    if (key === "type") continue;
    if (typeof value === "string" && value.trim()) {
      out[key] = value.trim();
    }
  }
  return out;
}

export function validatedFormToProfile(
  data: ValidatedCreateForm,
): ParsedProfilePayload {
  const dataJson = pickDataJson(data);

  if (data.type === "vehicle") {
    if (data.vehicle_number) dataJson.vehicle_number = data.vehicle_number;
    return {
      profileType: "vehicle",
      name: data.full_name,
      phone: data.phone,
      dataJson,
      vehicleNumber: data.vehicle_number || null,
      whatsapp: data.whatsapp || null,
      emergencyNote: data.emergency_note || null,
    };
  }

  if (data.type === "child") {
    return {
      profileType: "child",
      name: data.child_name,
      phone: data.parent_contact,
      dataJson,
      vehicleNumber: null,
      whatsapp: null,
      emergencyNote: data.emergency_note || null,
    };
  }

  if (data.type === "pet") {
    return {
      profileType: "pet",
      name: data.pet_name,
      phone: data.owner_contact,
      dataJson,
      vehicleNumber: null,
      whatsapp: data.whatsapp || null,
      emergencyNote: data.emergency_note || null,
    };
  }

  if (data.type === "asset") {
    if (data.asset_id) dataJson.asset_id = data.asset_id;
    return {
      profileType: "asset",
      name: data.asset_name,
      phone: data.owner_contact,
      dataJson,
      vehicleNumber: data.asset_id || null,
      whatsapp: data.whatsapp || null,
      emergencyNote: data.emergency_note || null,
    };
  }

  return {
    profileType: "business",
    name: data.company_name,
    phone: data.admin_contact,
    dataJson,
    vehicleNumber: data.asset_id || null,
    whatsapp: data.whatsapp || null,
    emergencyNote: data.emergency_note || null,
  };
}

export function validateCreateForm(formData: FormData): {
  ok: true;
  data: ValidatedCreateForm;
} | {
  ok: false;
  error: string;
} {
  const raw = formDataToRaw(formData);
  const type = raw.type;

  if (!type || !QR_KINDS.includes(type as QrKind)) {
    return { ok: false, error: "Select a valid profile type." };
  }

  const parsed = createFormSchema.safeParse(raw);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return {
      ok: false,
      error: first?.message ?? "Please check the form and try again.",
    };
  }

  return { ok: true, data: parsed.data };
}
