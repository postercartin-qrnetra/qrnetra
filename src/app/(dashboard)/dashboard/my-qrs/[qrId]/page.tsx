import { StubPage } from "@/components/stub-page";

type Props = { params: Promise<{ qrId: string }> };

export default async function QrDetailPage({ params }: Props) {
  const { qrId } = await params;
  return (
    <StubPage
      title={`QR ${qrId}`}
      description="Edit emergency fields, channel toggles, and privacy — owner-only RLS enforced server-side."
    />
  );
}
