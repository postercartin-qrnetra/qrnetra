import Link from "next/link";
import { StubPage } from "@/components/stub-page";

export default function ShopPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <StubPage
        title="Shop"
        description="Vehicle stickers, kid wristbands, and pet tags — catalog wiring + Razorpay checkout next."
        breadcrumb={[{ href: "/", label: "Home" }, { href: "/shop", label: "Shop" }]}
      />
      <ul className="mx-auto mt-8 max-w-2xl space-y-3">
        <li>
          <Link href="/shop/vehicle-qr-sticker" className="text-zinc-900 underline-offset-4 hover:underline">
            Vehicle QR sticker (stub PDP)
          </Link>
        </li>
      </ul>
    </div>
  );
}
