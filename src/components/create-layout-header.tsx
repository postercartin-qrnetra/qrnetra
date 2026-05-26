"use client";

import { HeaderAuthActions } from "@/components/auth/header-auth-actions";
import { UserMenu } from "@/components/auth/user-menu";
import { useAuth } from "@/components/auth/auth-provider";
import { MobileHeader } from "@/components/mobile/mobile-header";
import { QnLogoStatic } from "@/components/ui/logo";
import { CREATE_MOBILE_MENU_LINKS } from "@/lib/navigation/mobile-nav";

export function CreateLayoutHeader() {
  const { user, isLoading } = useAuth();

  return (
    <>
      <MobileHeader menuLinks={CREATE_MOBILE_MENU_LINKS} />
      <header className="qn-header sticky top-0 z-20 hidden md:block">
      <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-4">
        <QnLogoStatic layout="compact" />
        {!isLoading && user ? (
          <UserMenu variant="header" />
        ) : !isLoading ? (
          <HeaderAuthActions layout="compact" />
        ) : null}
      </div>
      </header>
    </>
  );
}
