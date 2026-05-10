import { StubPage } from "@/components/stub-page";

type Props = { params: Promise<{ slug: string }> };

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  return (
    <StubPage
      title={`Product: ${slug}`}
      description="PDP — gallery, INR price, GST note, add to cart — Razorpay integration pending."
      breadcrumb={[
        { href: "/", label: "Home" },
        { href: "/shop", label: "Shop" },
        { href: `/shop/${slug}`, label: slug },
      ]}
    />
  );
}
