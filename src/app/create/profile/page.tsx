import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CreateProfilePlaceholder } from "@/components/onboarding/create-profile-placeholder";
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
  if (!supabase) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-sm leading-relaxed text-amber-900">
        <p className="font-semibold">Supabase is not configured.</p>
        <p className="mt-2">
          The deployment is missing{" "}
          <code className="rounded bg-amber-50 px-1 py-0.5">
            NEXT_PUBLIC_SUPABASE_URL
          </code>{" "}
          or{" "}
          <code className="rounded bg-amber-50 px-1 py-0.5">
            NEXT_PUBLIC_SUPABASE_ANON_KEY
          </code>
          . Set them in your Vercel project settings and redeploy.
        </p>
      </div>
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(
      `/login?next=${encodeURIComponent(`/create/profile?type=${type}`)}`,
    );
  }

  return (
    <CreateProfilePlaceholder type={type} userEmail={user.email ?? null} />
  );
}
