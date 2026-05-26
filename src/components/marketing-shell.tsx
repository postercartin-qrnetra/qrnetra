import { MobileBottomNav } from "@/components/mobile/mobile-bottom-nav";
import { AnnouncementBar } from "@/components/marketing/announcement-bar";
import { MainFooter } from "@/components/marketing/main-footer";
import { MainHeader } from "@/components/marketing/main-header";

export function MarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="qn-mobile-bottom-nav-padding flex min-h-screen flex-col bg-qn-bg">
      <AnnouncementBar />
      <MainHeader />
      <main className="flex-1">{children}</main>
      <MainFooter />
      <MobileBottomNav />
    </div>
  );
}
