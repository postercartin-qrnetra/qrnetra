"use client";

import { HeaderAuthActions } from "@/components/auth/header-auth-actions";
import { useAuth } from "@/components/auth/auth-provider";
import { UserMenu } from "@/components/auth/user-menu";
import { MobileHeader } from "@/components/mobile/mobile-header";
import { ProductsNav } from "@/components/marketing/products-nav";
import { QnLogo } from "@/components/ui/logo";
import { MARKETING_MOBILE_MENU_LINKS } from "@/lib/navigation/mobile-nav";
import { Menu, ShoppingCart, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_LINKS_AFTER_PRODUCTS = [
  { href: "/activate", label: "Activate Tag" },
  { href: "/track-order", label: "Track Order" },
  { href: "/about", label: "About" },
];

export function MainHeader() {
  const [open, setOpen] = useState(false);
  const { user, isLoading } = useAuth();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const closeMobile = () => setOpen(false);

  return (
    <header className="qn-header sticky top-0 z-50">
      <MobileHeader menuLinks={MARKETING_MOBILE_MENU_LINKS} />

      <div className="mx-auto hidden h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 md:flex md:gap-4 lg:h-20 lg:max-w-[1440px] lg:gap-6 lg:px-10 xl:max-w-[1600px] xl:px-12">
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3 lg:flex-none">
          <button
            type="button"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white lg:hidden"
            aria-expanded={open}
            aria-controls="tablet-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Menu</span>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <QnLogo
            variant={isHome ? "animated" : "static"}
            layout="navbar"
            priority={isHome}
          />
        </div>

        <nav
          className="hidden items-center gap-0.5 lg:flex lg:flex-1 lg:justify-center"
          aria-label="Primary"
        >
          <Link href="/" className="qn-btn-ghost rounded-lg px-3 py-2.5">
            Home
          </Link>
          <ProductsNav mode="desktop" />
          {NAV_LINKS_AFTER_PRODUCTS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="qn-btn-ghost rounded-lg px-3 py-2.5"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <HeaderAuthActions />
          <Link
            href="/cart"
            className="hidden h-11 w-11 items-center justify-center rounded-xl text-qn-muted transition-colors hover:bg-white/[0.05] hover:text-white sm:flex"
            aria-label="Cart"
          >
            <ShoppingCart className="h-5 w-5" strokeWidth={1.75} />
          </Link>
          <Link
            href="/products"
            className="qn-btn-primary hidden h-11 px-5 lg:inline-flex"
          >
            Shop QR Products
          </Link>
          <Link
            href="/create"
            className="qn-btn-secondary hidden h-11 px-4 text-sm lg:inline-flex"
          >
            Create Free QR
          </Link>
        </div>
      </div>

      {open ? (
        <div
          id="tablet-nav"
          className="hidden border-t border-white/[0.08] bg-qn-bg-elevated md:block lg:hidden"
        >
          <nav className="mx-auto flex max-w-7xl flex-col px-4 py-4 sm:px-6">
            <Link
              href="/"
              className="rounded-xl px-4 py-3 text-sm font-medium text-qn-muted transition-colors hover:bg-white/[0.04] hover:text-white"
              onClick={closeMobile}
            >
              Home
            </Link>
            <ProductsNav mode="mobile" onNavigate={closeMobile} />
            {NAV_LINKS_AFTER_PRODUCTS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl px-4 py-3 text-sm font-medium text-qn-muted transition-colors hover:bg-white/[0.04] hover:text-white"
                onClick={closeMobile}
              >
                {item.label}
              </Link>
            ))}
            {!isLoading && user ? (
              <div className="px-2 py-2">
                <UserMenu variant="header" />
              </div>
            ) : !isLoading ? (
              <Link
                href="/login"
                className="rounded-xl px-4 py-3 text-sm font-medium text-qn-muted hover:bg-white/[0.04] hover:text-white"
                onClick={closeMobile}
              >
                Login
              </Link>
            ) : null}
            {!isLoading && user ? (
              <Link
                href="/dashboard"
                className="rounded-xl px-4 py-3 text-sm font-medium text-qn-muted hover:bg-white/[0.04] hover:text-white"
                onClick={closeMobile}
              >
                Dashboard
              </Link>
            ) : null}
            <div className="mt-3 flex flex-col gap-2">
              <Link
                href="/products"
                className="qn-btn-primary"
                onClick={closeMobile}
              >
                Shop QR Products
              </Link>
              <Link href="/create" className="qn-btn-secondary" onClick={closeMobile}>
                Create Free QR
              </Link>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
