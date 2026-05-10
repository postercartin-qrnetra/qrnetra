import Link from "next/link";
import { StubPage } from "@/components/stub-page";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-16">
      <StubPage
        title="Log in"
        description="Magic link, Google, and phone OTP via Supabase Auth — wiring next."
        breadcrumb={[{ href: "/", label: "Home" }, { href: "/login", label: "Log in" }]}
      />
      <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-zinc-500">
        After login you&apos;ll return to{" "}
        <Link href="/dashboard" className="underline">
          Dashboard
        </Link>
        .
      </p>
    </div>
  );
}
