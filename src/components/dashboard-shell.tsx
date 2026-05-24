import { UserMenu } from "@/components/auth/user-menu";
import {
  DashboardMobileNav,
  DashboardNav,
} from "@/components/dashboard-nav";
import { QnLogo } from "@/components/ui/logo";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-qn-bg">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-white/[0.08] bg-qn-sidebar px-4 py-6 md:flex">
        <QnLogo variant="static" size="md" />
        <DashboardNav />
        <div className="mt-auto border-t border-white/[0.08] pt-6">
          <UserMenu variant="sidebar" />
        </div>
      </aside>
      <div className="flex min-h-screen flex-1 flex-col">
        <header className="border-b border-white/[0.08] bg-qn-bg-elevated px-4 py-3 md:hidden">
          <div className="mb-3 flex items-center justify-between">
            <QnLogo variant="static" size="sm" />
            <UserMenu variant="header" />
          </div>
          <DashboardMobileNav />
        </header>
        <main className="flex-1 bg-gradient-to-b from-qn-bg to-qn-bg-elevated p-4 md:p-8 lg:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
