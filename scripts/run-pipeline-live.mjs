import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

process.env.QR_PIPELINE_AUDIT = "1";

const env = readFileSync(".env.local", "utf8");
for (const line of env.split("\n")) {
  const m = line.match(/^([^#=]+)=(.*)$/);
  if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "");
}

const { runQrGenerationPipeline } = await import("../src/lib/qr/pipeline.ts");
const { validatedFormToProfile } = await import(
  "../src/lib/qr/validate-create-form.ts"
);

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL");
  process.exit(1);
}

const key = serviceKey || anon;
const supabase = createClient(url, key);

const profile = validatedFormToProfile({
  type: "vehicle",
  full_name: "Pipeline Live Audit",
  phone: "+919876543210",
  vehicle_number: "TEST-001",
  whatsapp: "",
  alternate_contact: "",
  emergency_note: "",
});

const userId = "7aa84826-744e-4816-a668-1bafd1584191";
const result = await runQrGenerationPipeline(supabase, userId, profile);
console.log("RESULT:", JSON.stringify(result, null, 2));

if (result.ok) {
  const { data: row } = await supabase
    .from("qr_codes")
    .select("slug")
    .eq("slug", result.result.slug)
    .maybeSingle();
  console.log("DB verify qr_codes:", row);
  await supabase.from("qr_codes").delete().eq("slug", result.result.slug);
  await supabase.from("qr_profiles").delete().eq("slug", result.result.slug);
  await supabase.from("qrs").delete().eq("public_slug", result.result.slug);
}
