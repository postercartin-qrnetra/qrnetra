import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CreateProfileForm } from "@/components/create-profile-form";
import { isQrKind } from "@/lib/qr/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Emergency profile",
};

type Props = { searchParams: Promise<{ type?: string }> };

export default async function CreateProfilePage({ searchParams }: Props) {
  const { type } = await searchParams;
  if (!type || !isQrKind(type)) {
    redirect("/create/type");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(
      `/login?next=${encodeURIComponent(`/create/profile?type=${type}`)}`,
    );
  }

  return <CreateProfileForm type={type} />;
}
