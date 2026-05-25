import { Suspense } from "react";
import { CreateProfileForm } from "@/components/create-profile-form";
import { createClient } from "@/lib/supabase/server";
import { isQrKind } from "@/lib/qr/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Free QR · QRNetra",
  description:
    "Create a free privacy-first QR profile for your vehicle, child, pet, personal asset, or business in under 2 minutes.",
};

type Props = {
  searchParams: Promise<{ type?: string }>;
};

export default async function CreatePage({ searchParams }: Props) {
  const { type } = await searchParams;

  const supabase = await createClient();
  let userEmail: string | null = null;
  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    userEmail = user?.email ?? null;
  }

  const initialType = type && isQrKind(type) ? type : undefined;

  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-300 border-t-qn-accent" />
        </div>
      }
    >
      <CreateProfileForm initialType={initialType} initialEmail={userEmail} />
    </Suspense>
  );
}
