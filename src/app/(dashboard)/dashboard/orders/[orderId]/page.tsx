import { StubPage } from "@/components/stub-page";

type Props = { params: Promise<{ orderId: string }> };

export default async function OrderDetailPage({ params }: Props) {
  const { orderId } = await params;
  return (
    <StubPage
      title={`Order ${orderId}`}
      description="Line items, GST invoice link, tracking ID — fulfillment hooks next."
    />
  );
}
