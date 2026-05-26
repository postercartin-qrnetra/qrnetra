"use client";

import { useAuth } from "@/components/auth/auth-provider";
import {
  MOBILE_NAV_ITEMS,
  getMyTagsTabHref,
  getProfileTabHref,
  isMobileNavItemActive,
  shouldShowMobileBottomNav,
} from "@/lib/navigation/mobile-nav";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function MobileBottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  if (!shouldShowMobileBottomNav(pathname)) {
    return null;
  }

  return (
    <nav
      aria-label="Mobile primary"
      className="fixed inset-x-0 bottom-0 z-[70] border-t border-white/[0.08] bg-qn-bg-elevated/95 backdrop-blur md:hidden"
    >
      <div className="mx-auto grid max-w-xl grid-cols-5 px-2 pb-[calc(env(safe-area-inset-bottom)+0.35rem)] pt-2">
        {MOBILE_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const href =
            item.id === "profile"
              ? getProfileTabHref(Boolean(user))
              : item.id === "my-tags"
                ? getMyTagsTabHref(Boolean(user))
                : item.href;
          const active = isMobileNavItemActive(pathname, item.id);

          return (
            <Link
              key={item.id}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`flex min-h-[68px] flex-col items-center justify-center gap-1 rounded-2xl px-1 text-[11px] font-semibold transition-colors ${
                active
                  ? "bg-qn-accent/12 text-qn-accent"
                  : "text-qn-muted hover:bg-white/[0.04] hover:text-white"
              }`}
            >
              <Icon className="h-5 w-5" strokeWidth={1.9} />
              <span className="whitespace-nowrap">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
