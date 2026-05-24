import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/dashboard-shell";

export const dynamic = "force-dynamic";

function MissingEnvNotice() {
  return (
    <div className="min-h-screen bg-qn-bg px-4 py-16">
      <div className="mx-auto max-w-xl rounded-2xl border border-qn-warning/30 bg-qn-warning/15 p-6 text-sm leading-relaxed text-qn-warning">
        <p className="font-semibold">Supabase is not configured.</p>
        <p className="mt-2">
          Set <code className="rounded bg-white/60 px-1 py-0.5">NEXT_PUBLIC_SUPABASE_URL</code>{" "}
          and <code className="rounded bg-white/60 px-1 py-0.5">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>{" "}
          in your environment (locally in <code>.env.local</code>, in production
          via the Vercel project settings) and redeploy.
        </p>
      </div>
    </div>
  );
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  if (!supabase) {
    return <MissingEnvNotice />;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/dashboard");
  }

  return <DashboardShell>{children}</DashboardShell>;
}
