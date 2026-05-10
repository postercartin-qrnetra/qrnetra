import { StubPage } from "@/components/stub-page";

export default function CartPage() {
  return (
    <StubPage
      title="Cart"
      description="Cart persistence and line items — checkout integration pending."
      breadcrumb={[{ href: "/shop", label: "Shop" }, { href: "/cart", label: "Cart" }]}
    />
  );
}
