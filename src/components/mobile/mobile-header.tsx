"use client";

import { LogoutButton } from "@/components/auth/logout-button";
import { useAuth } from "@/components/auth/auth-provider";
import { QnLogoStatic } from "@/components/ui/logo";
import type { MobileMenuLink } from "@/lib/navigation/mobile-nav";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type Props = {
  menuLinks: MobileMenuLink[];
  className?: string;
};

const ACCOUNT_LINKS: MobileMenuLink[] = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/tags", label: "My Tags" },
  { href: "/dashboard/orders", label: "Orders" },
  { href: "/dashboard/settings", label: "Settings" },
  { href: "/dashboard/settings", label: "Settings" },
];

function isLinkActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MobileHeader({ menuLinks, className = "" }: Props) {
  const pathname = usePathname();
  const { user, isLoading } = useAuth();
  const [openPathname, setOpenPathname] = useState<string | null>(null);
  const open = openPathname === pathname;

  return (
    <header
      className={`sticky top-0 z-50 border-b border-white/[0.08] bg-qn-bg-elevated/95 backdrop-blur md:hidden ${className}`}
    >
      <div className="mx-auto flex h-14 items-center gap-3 px-4">
        <button
          type="button"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white"
          aria-expanded={open}
          aria-controls="mobile-drawer"
          onClick={() =>
            setOpenPathname((current) => (current === pathname ? null : pathname))
          }
        >
          <span className="sr-only">Toggle navigation menu</span>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        <QnLogoStatic layout="compact" href="/" />
      </div>

      {open ? (
        <div id="mobile-drawer" className="border-t border-white/[0.08] bg-qn-bg-elevated">
          <nav className="mx-auto flex max-w-xl flex-col px-4 py-4">
            {menuLinks.map((item) => (
              <Link
                key={`${item.href}-${item.label}`}
                href={item.href}
                className={`rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                  isLinkActive(pathname, item.href)
                    ? "bg-white/[0.04] text-white"
                    : "text-qn-muted hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}

            <div className="mt-4 border-t border-white/[0.08] pt-4">
              {!isLoading && user ? (
                <>
                  <p className="px-4 text-xs font-semibold uppercase tracking-[0.18em] text-qn-muted-2">
                    Account
                  </p>
                  <div className="mt-2 flex flex-col">
                    {ACCOUNT_LINKS.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                          isLinkActive(pathname, item.href)
                            ? "bg-white/[0.04] text-white"
                            : "text-qn-muted hover:bg-white/[0.04] hover:text-white"
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                    <LogoutButton className="mt-2 rounded-xl px-4 py-3 text-left text-sm font-medium text-qn-danger hover:bg-qn-danger/10" />
                  </div>
                </>
              ) : !isLoading ? (
                <div className="flex flex-col gap-2">
                  <Link href="/login" className="qn-btn-secondary w-full">
                    Login
                  </Link>
                  <Link href="/create" className="qn-btn-primary w-full">
                    Create Free QR
                  </Link>
                </div>
              ) : null}
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
