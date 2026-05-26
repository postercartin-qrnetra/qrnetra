import { MobileBottomNav } from "@/components/mobile/mobile-bottom-nav";
import { CreateLayoutHeader } from "@/components/create-layout-header";

export default function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="qn-mobile-bottom-nav-padding min-h-screen bg-qn-bg">
      <CreateLayoutHeader />
      {children}
      <MobileBottomNav />
    </div>
  );
}
