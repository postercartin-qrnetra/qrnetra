"use client";

import { HeaderAuthActions } from "@/components/auth/header-auth-actions";
import { UserMenu } from "@/components/auth/user-menu";
import { useAuth } from "@/components/auth/auth-provider";
import { QnLogoStatic } from "@/components/ui/logo";

export function CreateLayoutHeader() {
  const { user, isLoading } = useAuth();

  return (
    <header className="qn-header sticky top-0 z-20">
      <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-4">
        <QnLogoStatic layout="compact" />
        {!isLoading && user ? (
          <UserMenu variant="header" />
        ) : !isLoading ? (
          <HeaderAuthActions layout="compact" />
        ) : null}
      </div>
    </header>
  );
}
