"use client";

import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    if (password.length < 6) {
      setMessage("Use at least 6 characters.");
      setLoading(false);
      return;
    }
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      setMessage("Could not update password. Try requesting a new reset link.");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#fafafa] px-4">
      <div className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-8 shadow-xl">
        <h1 className="text-xl font-bold text-[#111111]">Set new password</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Choose a strong password for your QRNetra account.
        </p>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-sm font-medium text-[#111111]">
              New password
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="mt-1.5 w-full rounded-2xl border border-zinc-200 px-4 py-3 text-base outline-none focus:ring-2 focus:ring-[#ffd400]/35"
            />
          </label>
          {message ? (
            <p className="text-sm text-red-700">{message}</p>
          ) : null}
          <button
            type="submit"
            disabled={loading}
            className="flex h-12 w-full items-center justify-center rounded-2xl bg-[#ffd400] text-sm font-bold text-[#111111] disabled:opacity-60"
          >
            {loading ? "Saving…" : "Update password"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-zinc-500">
          <Link href="/login" className="font-medium text-[#111111] hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
