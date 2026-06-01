import { z } from "zod";
import type { ProductProfileVariant } from "@/lib/products";
import { QR_KINDS, type QrKind } from "@/lib/qr/types";
import { isValidAssetId, normalizeAssetId, ASSET_ID_ERROR } from "@/lib/validation/asset-id";
import { phonesMatch, DUPLICATE_EMERGENCY_WARNING } from "@/lib/validation/duplicates";
import { isValidPersonName, normalizeUpperName, NAME_ERROR } from "@/lib/validation/names";
import {
  isValidIndianMobile,
  normalizeIndiaPhone,
  PHONE_ERROR,
} from "@/lib/validation/phones";
import { isValidRewardNote, REWARD_ERROR } from "@/lib/validation/reward";
import {
  isValidIndianVehicleNumber,
  normalizeVehicleNumber,
  VEHICLE_NUMBER_ERROR,
} from "@/lib/validation/vehicle";

export type ValidationContext = {
  productVariant?: ProductProfileVariant;
};

const nameField = z
  .string()
  .min(1, "Name is required.")
  .transform((v) => normalizeUpperName(v))
  .refine((v) => isValidPersonName(v), NAME_ERROR);

const phoneField = z
  .string()
  .min(1, "Phone number is required.")
  .transform((v) => normalizeIndiaPhone(v))
  .refine((v) => isValidIndianMobile(v), PHONE_ERROR);

const optionalPhone = z
  .string()
  .optional()
  .transform((v) => (v?.trim() ? normalizeIndiaPhone(v) : ""))
  .refine((v) => !v || isValidIndianMobile(v), PHONE_ERROR);

const optionalText = z.string().optional().transform((v) => v?.trim() ?? "");

const vehicleNumberField = z
  .string()
  .min(1, "Vehicle registration number is required.")
  .transform((v) => normalizeVehicleNumber(v))
  .refine((v) => isValidIndianVehicleNumber(v), VEHICLE_NUMBER_ERROR);

const assetIdRequired = z
  .string()
  .min(1, "Asset ID is required.")
  .transform((v) => normalizeAssetId(v))
  .refine((v) => isValidAssetId(v), ASSET_ID_ERROR);

const assetIdOptional = z
  .string()
  .optional()
  .transform((v) => (v?.trim() ? normalizeAssetId(v) : ""))
  .refine((v) => !v || isValidAssetId(v), ASSET_ID_ERROR);

const childAgeField = z
  .string()
  .min(1, "Child age is required.")
  .transform((v) => v.trim())
  .refine((v) => /^\d+$/.test(v), "Age must be a number.")
  .refine((v) => {
    const n = Number(v);
    return Number.isInteger(n) && n >= 0 && n <= 18;
  }, "Age must be between 0 and 18.");

const rewardNoteField = optionalText.refine(
  (v) => isValidRewardNote(v),
  REWARD_ERROR,
);

function collectPhoneWarnings(data: ValidatedCreateForm): FieldWarnings {
  const warnings: FieldWarnings = {};
  const add = (fields: { key: string; value: string }[], primary: string) => {
    for (const { key, value } of fields) {
      if (value && phonesMatch(primary, value)) {
        warnings[key] = DUPLICATE_EMERGENCY_WARNING;
      }
    }
  };

  if (data.type === "vehicle") {
    add(
      [
        { key: "alternate_contact", value: data.alternate_contact },
        { key: "whatsapp", value: data.whatsapp },
      ],
      data.phone,
    );
  } else if (data.type === "child") {
    add(
      [
        { key: "emergency_contact", value: data.emergency_contact },
        { key: "teacher_contact", value: data.teacher_contact },
      ],
      data.parent_contact,
    );
  } else if (data.type === "pet") {
    add(
      [
        { key: "vet_contact", value: data.vet_contact },
        { key: "whatsapp", value: data.whatsapp },
      ],
      data.owner_contact,
    );
  } else if (data.type === "asset") {
    add(
      [
        { key: "alternate_contact", value: data.alternate_contact },
        { key: "whatsapp", value: data.whatsapp },
      ],
      data.owner_contact,
    );
  } else {
    add(
      [
        { key: "escalation_contact", value: data.escalation_contact },
        { key: "whatsapp", value: data.whatsapp },
      ],
      data.admin_contact,
    );
  }
  return warnings;
}

const vehicleSchema = z.object({
  type: z.literal("vehicle"),
  full_name: nameField,
  phone: phoneField,
  vehicle_number: vehicleNumberField,
  vehicle_type: optionalText,
  whatsapp: optionalPhone,
  alternate_contact: optionalPhone,
  blood_group: optionalText,
  medical_notes: optionalText,
  finder_instructions: optionalText,
  emergency_note: optionalText,
});

const childSchema = z.object({
  type: z.literal("child"),
  child_name: nameField,
  parent_contact: phoneField,
  parent_name: nameField,
  child_age: childAgeField,
  emergency_contact: optionalPhone,
  blood_group: optionalText,
  allergies: optionalText,
  medical_notes: optionalText,
  school_name: optionalText,
  class_name: optionalText,
  teacher_contact: optionalPhone,
  emergency_instructions: optionalText,
  emergency_note: optionalText,
});

const petSchema = z
  .object({
    type: z.literal("pet"),
    pet_name: nameField,
    owner_contact: phoneField,
    owner_name: optionalText.transform((v) => (v ? normalizeUpperName(v) : "")),
    breed: optionalText,
    pet_color: optionalText,
    vet_contact: optionalPhone,
    whatsapp: optionalPhone,
    medical_notes: optionalText,
    reward_note: rewardNoteField,
    emergency_note: optionalText,
  })
  .superRefine((data, ctx) => {
    if (data.owner_name && !isValidPersonName(data.owner_name)) {
      ctx.addIssue({
        code: "custom",
        path: ["owner_name"],
        message: NAME_ERROR,
      });
    }
  });

const assetSchema = z.object({
  type: z.literal("asset"),
  asset_name: nameField,
  owner_contact: phoneField,
  asset_id: assetIdRequired,
  responsible_person: optionalText,
  whatsapp: optionalPhone,
  alternate_contact: optionalPhone,
  emergency_note: optionalText,
});

const businessSchema = z.object({
  type: z.literal("business"),
  company_name: nameField,
  admin_contact: phoneField,
  asset_id: assetIdRequired,
  department: optionalText,
  responsible_person: optionalText,
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

export type FieldErrors = Record<string, string>;
export type FieldWarnings = Record<string, string>;

function str(fd: FormData, key: string): string {
  return String(fd.get(key) ?? "").trim();
}

export function valuesToFormData(
  type: QrKind,
  values: Record<string, string>,
  extra?: Record<string, string>,
): FormData {
  const fd = new FormData();
  fd.set("type", type);
  for (const [k, v] of Object.entries(values)) {
    if (v) fd.set(k, v);
  }
  if (extra) {
    for (const [k, v] of Object.entries(extra)) {
      if (v) fd.set(k, v);
    }
  }
  return fd;
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
      vehicle_type: str(fd, "vehicle_type"),
      whatsapp: str(fd, "whatsapp"),
      alternate_contact: str(fd, "alternate_contact"),
      blood_group: str(fd, "blood_group"),
      medical_notes: str(fd, "medical_notes"),
      finder_instructions: str(fd, "finder_instructions"),
      emergency_note: str(fd, "emergency_note"),
    };
  }
  if (type === "child") {
    return {
      ...base,
      child_name: str(fd, "child_name"),
      parent_contact: str(fd, "parent_contact"),
      parent_name: str(fd, "parent_name"),
      child_age: str(fd, "child_age"),
      emergency_contact: str(fd, "emergency_contact"),
      blood_group: str(fd, "blood_group"),
      allergies: str(fd, "allergies"),
      medical_notes: str(fd, "medical_notes"),
      school_name: str(fd, "school_name"),
      class_name: str(fd, "class_name"),
      teacher_contact: str(fd, "teacher_contact"),
      emergency_instructions: str(fd, "emergency_instructions"),
      emergency_note: str(fd, "emergency_note"),
    };
  }
  if (type === "pet") {
    return {
      ...base,
      pet_name: str(fd, "pet_name"),
      owner_contact: str(fd, "owner_contact"),
      owner_name: str(fd, "owner_name"),
      breed: str(fd, "breed"),
      pet_color: str(fd, "pet_color"),
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
      responsible_person: str(fd, "responsible_person"),
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
      responsible_person: str(fd, "responsible_person"),
      escalation_contact: str(fd, "escalation_contact"),
      fleet_size: str(fd, "fleet_size"),
      whatsapp: str(fd, "whatsapp"),
      emergency_note: str(fd, "emergency_note"),
    };
  }

  return base;
}

function getProductVariantErrors(
  data: ValidatedCreateForm,
  productVariant?: ProductProfileVariant,
): { path: string; message: string }[] {
  const errors: { path: string; message: string }[] = [];
  if (!productVariant) return errors;

  if (productVariant === "child_school_bag" && data.type === "child") {
    if (!data.school_name) {
      errors.push({
        path: "school_name",
        message: "School name is required for this product.",
      });
    }
    if (!data.class_name) {
      errors.push({
        path: "class_name",
        message: "Class / section is required for this product.",
      });
    }
  }

  if (productVariant === "pet" && data.type === "pet") {
    if (!data.owner_name) {
      errors.push({
        path: "owner_name",
        message: "Owner name is required for this product.",
      });
    } else if (!isValidPersonName(data.owner_name)) {
      errors.push({ path: "owner_name", message: NAME_ERROR });
    }
  }

  return errors;
}

function issuesToFieldErrors(issues: z.ZodIssue[]): FieldErrors {
  const errors: FieldErrors = {};
  for (const issue of issues) {
    const path = issue.path[0];
    if (typeof path !== "string") continue;
    if (!errors[path]) errors[path] = issue.message;
  }
  return errors;
}

function pickDataJson(data: ValidatedCreateForm): Record<string, string> {
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

function contextFromFormData(
  formData: FormData,
  context?: ValidationContext,
): ValidationContext {
  const fromForm = str(formData, "product_variant");
  return {
    productVariant:
      context?.productVariant ??
      (fromForm ? (fromForm as ValidationContext["productVariant"]) : undefined),
  };
}

export function validateCreateForm(
  formData: FormData,
  context?: ValidationContext,
): {
  ok: true;
  data: ValidatedCreateForm;
  warnings: FieldWarnings;
} | {
  ok: false;
  error: string;
  fieldErrors: FieldErrors;
  fieldWarnings: FieldWarnings;
} {
  const raw = formDataToRaw(formData);
  const type = raw.type;

  if (!type || !QR_KINDS.includes(type as QrKind)) {
    return {
      ok: false,
      error: "Select a valid profile type.",
      fieldErrors: {},
      fieldWarnings: {},
    };
  }

  const parsed = createFormSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors = issuesToFieldErrors(parsed.error.issues);
    const first = parsed.error.issues[0];
    return {
      ok: false,
      error: first?.message ?? "Please check the form and try again.",
      fieldErrors,
      fieldWarnings: {},
    };
  }

  const ctx = contextFromFormData(formData, context);
  const variantErrors = getProductVariantErrors(parsed.data, ctx.productVariant);
  if (variantErrors.length > 0) {
    const fieldErrors: FieldErrors = {};
    for (const e of variantErrors) {
      fieldErrors[e.path] = e.message;
    }
    return {
      ok: false,
      error: variantErrors[0]?.message ?? "Please check the form and try again.",
      fieldErrors,
      fieldWarnings: {},
    };
  }

  return {
    ok: true,
    data: parsed.data,
    warnings: collectPhoneWarnings(parsed.data),
  };
}

export function validateCreateFormFromValues(
  type: QrKind,
  values: Record<string, string>,
  context?: ValidationContext,
): ReturnType<typeof validateCreateForm> {
  return validateCreateForm(valuesToFormData(type, values), context);
}
