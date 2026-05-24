import { StubPage } from "@/components/stub-page";

export default function AdminHomePage() {
  return (
    <div className="min-h-screen bg-qn-surface px-4 py-16">
      <StubPage
        title="Admin"
        description="Orders, inventory, refunds — role-gated routes + service role only. Protect before production."
      />
    </div>
  );
}
