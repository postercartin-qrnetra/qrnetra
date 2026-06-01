import {
  House,
  ScanLine,
  ShoppingBag,
  Ticket,
  UserRound,
  type LucideIcon,
} from "lucide-react";

export type MobileNavItemId =
  | "home"
  | "scan"
  | "shop"
  | "my-tags"
  | "profile";

export type MobileNavItem = {
  id: MobileNavItemId;
  label: string;
  href: string;
  icon: LucideIcon;
};

export type MobileMenuLink = {
  href: string;
  label: string;
};

export const MOBILE_NAV_ITEMS: MobileNavItem[] = [
  { id: "home", label: "Home", href: "/", icon: House },
  { id: "scan", label: "Scan", href: "/scan", icon: ScanLine },
  { id: "shop", label: "Shop", href: "/products", icon: ShoppingBag },
  { id: "my-tags", label: "My Tags", href: "/dashboard/tags", icon: Ticket },
  { id: "profile", label: "Settings", href: "/dashboard/settings", icon: UserRound },
];

const HOME_PREFIXES = [
  "/",
  "/about",
  "/how-it-works",
  "/business-fleet",
  "/pricing",
  "/contact",
  "/blog",
  "/help",
  "/faq",
];

const SHOP_PREFIXES = [
  "/order",
  "/order-success",
  "/products",
  "/cart",
  "/checkout",
  "/track-order",
  "/payment-success",
  "/payment-failed",
  "/business-fleet",
];

const TAG_PREFIXES = [
  "/dashboard",
  "/dashboard/tags",
  "/dashboard/my-qrs",
  "/dashboard/scan-history",
];

const PROFILE_PREFIXES = [
  "/dashboard/settings",
  "/dashboard/orders",
  "/dashboard/billing",
];

export function isMobileNavItemActive(
  pathname: string,
  itemId: MobileNavItemId,
): boolean {
  if (itemId === "scan") {
    return pathname === "/scan";
  }

  if (itemId === "shop") {
    return SHOP_PREFIXES.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
    );
  }

  if (itemId === "my-tags") {
    if (PROFILE_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
      return false;
    }

    return TAG_PREFIXES.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
    );
  }

  if (itemId === "profile") {
    return PROFILE_PREFIXES.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
    );
  }

  return HOME_PREFIXES.some(
    (prefix) =>
      pathname === prefix ||
      (prefix !== "/" && pathname.startsWith(`${prefix}/`)),
  );
}

export function shouldShowMobileBottomNav(pathname: string): boolean {
  if (pathname === "/order" || pathname.startsWith("/order/")) {
    return false;
  }

  if (pathname === "/checkout" || pathname.startsWith("/checkout/")) {
    return false;
  }

  if (pathname === "/scan" || pathname.startsWith("/scan/")) {
    return false;
  }

  return true;
}

export function getProfileTabHref(isSignedIn: boolean) {
  return isSignedIn ? "/dashboard/settings" : "/login?next=/dashboard/settings";
}

export function getMyTagsTabHref(isSignedIn: boolean) {
  return isSignedIn ? "/dashboard/tags" : "/login?next=/dashboard/tags";
}

export const MARKETING_MOBILE_MENU_LINKS: MobileMenuLink[] = [
  { href: "/", label: "Home" },
  { href: "/scan", label: "Scan Tag" },
  { href: "/products", label: "Shop Products" },
  { href: "/products/vehicles", label: "Vehicles" },
  { href: "/products/pets", label: "Pets" },
  { href: "/products/kids", label: "Kids" },
  { href: "/products/assets", label: "Assets" },
  { href: "/create", label: "Create Free QR" },
  { href: "/activate", label: "Activate Tag" },
  { href: "/track-order", label: "Track Order" },
  { href: "/business-fleet", label: "Business & Fleet" },
  { href: "/help", label: "Help Center" },
  { href: "/about", label: "About" },
];

export const DASHBOARD_MOBILE_MENU_LINKS: MobileMenuLink[] = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/tags", label: "My Tags" },
  { href: "/dashboard/scan-activity", label: "Scan Activity" },
  { href: "/dashboard/orders", label: "Orders" },
  { href: "/dashboard/settings", label: "Settings" },
  { href: "/products", label: "Shop Products" },
];

export const SHOP_MOBILE_MENU_LINKS: MobileMenuLink[] = [
  { href: "/products", label: "Shop Products" },
  { href: "/cart", label: "Cart" },
  { href: "/track-order", label: "Track Order" },
  { href: "/dashboard/tags", label: "My Tags" },
  { href: "/dashboard/settings", label: "Settings" },
];

export const CREATE_MOBILE_MENU_LINKS: MobileMenuLink[] = [
  { href: "/", label: "Home" },
  { href: "/scan", label: "Scan Tag" },
  { href: "/products", label: "Shop Products" },
  { href: "/dashboard/tags", label: "My Tags" },
  { href: "/dashboard/settings", label: "Settings" },
];
