"use client";

import { HeaderAuthActions } from "@/components/auth/header-auth-actions";
import { UserMenu } from "@/components/auth/user-menu";
import { useAuth } from "@/components/auth/auth-provider";
import Link from "next/link";

export function CreateLayoutHeader() {
  const { user, isLoading } = useAuth();

  return (
    <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-4">
        <Link
          href="/"
          className="text-sm font-bold tracking-tight text-[#111111]"
        >
          QRNetra
        </Link>
        {!isLoading && user ? (
          <UserMenu variant="header" />
        ) : !isLoading ? (
          <HeaderAuthActions layout="compact" />
        ) : null}
      </div>
    </header>
  );
}
