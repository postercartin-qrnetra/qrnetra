import { CreateLayoutHeader } from "@/components/create-layout-header";

export default function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-qn-bg">
      <CreateLayoutHeader />
      {children}
    </div>
  );
}
