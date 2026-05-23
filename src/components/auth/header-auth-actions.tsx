"use client";

import { useAuth } from "@/components/auth/auth-provider";
import { UserMenu } from "@/components/auth/user-menu";
import Link from "next/link";

type HeaderAuthActionsProps = {
  layout?: "marketing" | "compact";
  onNavigate?: () => void;
};

export function HeaderAuthActions({
  layout = "marketing",
  onNavigate,
}: HeaderAuthActionsProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <span className="hidden h-10 w-16 sm:inline" aria-hidden />;
  }

  if (user) {
    return <UserMenu variant="header" />;
  }

  if (layout === "compact") {
    return (
      <Link
        href="/login"
        className="text-xs font-medium text-zinc-500 transition-colors hover:text-[#111111]"
        onClick={onNavigate}
      >
        Login
      </Link>
    );
  }

  return (
    <Link
      href="/login"
      className="hidden text-sm font-medium text-zinc-600 transition-colors hover:text-[#111111] sm:inline"
      onClick={onNavigate}
    >
      Login
    </Link>
  );
}
