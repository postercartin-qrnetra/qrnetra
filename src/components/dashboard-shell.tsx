import { UserMenu } from "@/components/auth/user-menu";
import { DashboardNav } from "@/components/dashboard-nav";
import { MobileBottomNav } from "@/components/mobile/mobile-bottom-nav";
import { MobileHeader } from "@/components/mobile/mobile-header";
import { QnLogo } from "@/components/ui/logo";
import { DASHBOARD_MOBILE_MENU_LINKS } from "@/lib/navigation/mobile-nav";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="qn-mobile-bottom-nav-padding flex min-h-screen bg-qn-bg">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-white/[0.08] bg-qn-sidebar px-4 py-6 md:flex">
        <QnLogo variant="static" layout="compact" />
        <DashboardNav />
        <div className="mt-auto border-t border-white/[0.08] pt-6">
          <UserMenu variant="sidebar" />
        </div>
      </aside>
      <div className="flex min-h-screen flex-1 flex-col">
        <MobileHeader menuLinks={DASHBOARD_MOBILE_MENU_LINKS} />
        <main className="flex-1 bg-gradient-to-b from-qn-bg to-qn-bg-elevated p-4 md:p-8 lg:p-10">
          {children}
        </main>
        <MobileBottomNav />
      </div>
    </div>
  );
}
