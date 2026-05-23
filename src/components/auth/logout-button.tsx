"use client";

import { useAuth } from "@/components/auth/auth-provider";
import { useToast } from "@/components/ui/toast";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

type LogoutButtonProps = {
  className?: string;
  onLoggedOut?: () => void;
};

export function LogoutButton({ className, onLoggedOut }: LogoutButtonProps) {
  const router = useRouter();
  const { refresh } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    if (loading) return;
    setLoading(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      await refresh();
      router.refresh();
      onLoggedOut?.();
      router.push("/");
      showToast("Successfully logged out");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={() => void handleLogout()}
      disabled={loading}
      className={
        className ??
        "w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
      }
    >
      {loading ? "Logging out…" : "Logout"}
    </button>
  );
}
