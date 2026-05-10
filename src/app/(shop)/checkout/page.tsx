import { StubPage } from "@/components/stub-page";

export default function CheckoutPage() {
  return (
    <StubPage
      title="Checkout"
      description="One-page checkout — India address, Razorpay (UPI-first), optional COD flag — integration pending."
      breadcrumb={[{ href: "/cart", label: "Cart" }, { href: "/checkout", label: "Checkout" }]}
    />
  );
}
