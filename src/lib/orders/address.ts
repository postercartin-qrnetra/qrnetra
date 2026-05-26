import { z } from "zod";

const trimmedText = z.string().trim();

export const orderAddressSchema = z.object({
  fullName: trimmedText.min(1, "Full name is required."),
  mobile: trimmedText
    .min(10, "Enter a valid mobile number.")
    .regex(/^[0-9+\-\s()]{10,20}$/, "Enter a valid mobile number."),
  email: trimmedText.email("Enter a valid email address."),
  addressLine1: trimmedText.min(1, "Address line 1 is required."),
  addressLine2: trimmedText.optional().default(""),
  city: trimmedText.min(1, "City is required."),
  state: trimmedText.min(1, "State is required."),
  pincode: trimmedText.regex(/^\d{6}$/, "Enter a valid 6-digit pincode."),
});

export type OrderAddressInput = z.infer<typeof orderAddressSchema>;
