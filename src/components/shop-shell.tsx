import { MobileBottomNav } from "@/components/mobile/mobile-bottom-nav";
import { MobileHeader } from "@/components/mobile/mobile-header";
import { QnLogoStatic } from "@/components/ui/logo";
import { SHOP_MOBILE_MENU_LINKS } from "@/lib/navigation/mobile-nav";
import Link from "next/link";

export function ShopShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="qn-mobile-bottom-nav-padding flex min-h-screen flex-col bg-qn-bg">
      <MobileHeader menuLinks={SHOP_MOBILE_MENU_LINKS} />
      <header className="hidden border-b border-white/[0.08] bg-qn-bg-elevated md:block">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <QnLogoStatic layout="compact" />
          <div className="flex items-center gap-4 text-sm font-medium">
            <Link href="/products" className="text-white">
              Products
            </Link>
            <Link href="/cart" className="text-qn-muted hover:text-white">
              Cart
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <MobileBottomNav />
    </div>
  );
}
