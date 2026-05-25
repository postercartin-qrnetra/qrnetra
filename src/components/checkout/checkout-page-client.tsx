"use client";

import { QnLogoStatic } from "@/components/ui/logo";
import type { Product } from "@/lib/products";
import { PRODUCTS } from "@/lib/products";
import {
  Check,
  ChevronRight,
  CreditCard,
  IndianRupee,
  Lock,
  Package,
  Smartphone,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

/* ── Order summary data derived from query params ── */
type LineItem = {
  product: Product;
  qty: number;
};

function useOrderItems(): LineItem[] {
  const params = useSearchParams();
  const productSlug = params.get("product");
  const qty = Math.max(1, parseInt(params.get("qty") ?? "1", 10));

  const product = PRODUCTS.find((p) => p.slug === productSlug);
  if (!product) {
    return [{ product: PRODUCTS[0], qty: 1 }];
  }
  return [{ product, qty }];
}

/* ── Shipping ── */
const SHIPPING_THRESHOLD = 499;
const SHIPPING_COST = 49;

/* ── Steps ── */
type Step = "address" | "review" | "payment";

const STEPS: { key: Step; label: string }[] = [
  { key: "address", label: "Address" },
  { key: "review", label: "Review" },
  { key: "payment", label: "Payment" },
];

/* ── Address form state ── */
type Address = {
  name: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
};

const BLANK: Address = {
  name: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  pincode: "",
};

/* ── Progress bar ── */
function StepBar({ current }: { current: Step }) {
  const idx = STEPS.findIndex((s) => s.key === current);
  return (
    <ol className="flex items-center gap-0">
      {STEPS.map((s, i) => {
        const done = i < idx;
        const active = i === idx;
        return (
          <li key={s.key} className="flex items-center">
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                done
                  ? "bg-qn-accent text-white"
                  : active
                    ? "border-2 border-qn-accent text-qn-accent"
                    : "border border-white/20 text-qn-muted-2"
              }`}
            >
              {done ? <Check className="h-4 w-4" strokeWidth={2.5} /> : i + 1}
            </span>
            <span
              className={`ml-2 text-sm font-medium ${active ? "text-white" : "text-qn-muted-2"}`}
            >
              {s.label}
            </span>
            {i < STEPS.length - 1 ? (
              <ChevronRight className="mx-3 h-4 w-4 text-qn-muted-2" />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

/* ── Order summary sidebar ── */
function OrderSummary({ items, step }: { items: LineItem[]; step: Step }) {
  const subtotal = items.reduce(
    (sum, li) => sum + li.product.price * li.qty,
    0,
  );
  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;

  return (
    <div className="qn-card sticky top-24 p-6">
      <p className="text-sm font-semibold text-white">Order summary</p>
      <ul className="mt-4 space-y-3">
        {items.map((li) => (
          <li key={li.product.slug} className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-qn-surface text-2xl">
              {li.product.emoji}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white">{li.product.name}</p>
              <p className="text-xs text-qn-muted">Qty: {li.qty}</p>
            </div>
            <p className="text-sm font-semibold text-white">
              ₹{(li.product.price * li.qty).toLocaleString("en-IN")}
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-4 space-y-2 border-t border-white/[0.08] pt-4 text-sm">
        <div className="flex justify-between text-qn-muted">
          <span>Subtotal</span>
          <span>₹{subtotal.toLocaleString("en-IN")}</span>
        </div>
        <div className="flex justify-between text-qn-muted">
          <span>Shipping</span>
          <span>
            {shipping === 0 ? (
              <span className="text-qn-success">Free</span>
            ) : (
              `₹${shipping}`
            )}
          </span>
        </div>
        <div className="flex justify-between border-t border-white/[0.08] pt-3 font-bold text-white">
          <span>Total</span>
          <span className="text-qn-accent">
            ₹{total.toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      {step === "payment" ? null : (
        <p className="mt-4 flex items-center gap-1.5 text-xs text-qn-muted">
          <Lock className="h-3.5 w-3.5 shrink-0 text-qn-success" />
          Secured with 256-bit SSL
        </p>
      )}
    </div>
  );
}

/* ── Address form ── */
function AddressForm({
  value,
  onChange,
  onNext,
}: {
  value: Address;
  onChange: (a: Address) => void;
  onNext: () => void;
}) {
  const field = (
    key: keyof Address,
    label: string,
    type = "text",
    placeholder = "",
  ) => (
    <label className="block">
      <span className="qn-label">{label}</span>
      <input
        type={type}
        value={value[key]}
        onChange={(e) => onChange({ ...value, [key]: e.target.value })}
        required
        placeholder={placeholder}
        className="qn-input mt-1"
      />
    </label>
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onNext();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {field("name", "Full name", "text", "Rahul Kumar")}
        {field("phone", "Phone number", "tel", "98XXXXXXXX")}
      </div>
      {field("line1", "Address line 1", "text", "Flat / House No., Street")}
      {field("line2", "Address line 2 (optional)", "text", "Area, Landmark")}
      <div className="grid gap-4 sm:grid-cols-3">
        {field("city", "City")}
        {field("state", "State")}
        {field("pincode", "Pincode", "text", "400001")}
      </div>
      <button type="submit" className="qn-btn-primary mt-2 w-full sm:w-auto sm:px-12">
        Continue to Review →
      </button>
    </form>
  );
}

/* ── Review step ── */
function ReviewStep({
  address,
  onEdit,
  onNext,
}: {
  address: Address;
  onEdit: () => void;
  onNext: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="qn-card p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-white">Delivery address</p>
          <button
            type="button"
            onClick={onEdit}
            className="text-xs font-medium text-qn-accent hover:underline"
          >
            Edit
          </button>
        </div>
        <div className="mt-3 text-sm text-qn-muted">
          <p className="font-medium text-white">{address.name}</p>
          <p>{address.phone}</p>
          <p className="mt-1">
            {[address.line1, address.line2].filter(Boolean).join(", ")}
          </p>
          <p>
            {address.city}, {address.state} — {address.pincode}
          </p>
        </div>
      </div>

      <div className="qn-card flex items-start gap-3 p-5">
        <Package className="h-5 w-5 shrink-0 text-qn-accent" strokeWidth={1.75} />
        <div>
          <p className="text-sm font-semibold text-white">
            Estimated delivery
          </p>
          <p className="mt-1 text-sm text-qn-muted">
            3–5 business days via standard shipping.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onNext}
        className="qn-btn-primary w-full sm:w-auto sm:px-12"
      >
        Proceed to Payment →
      </button>
    </div>
  );
}

/* ── Payment step ── */
function PaymentStep({
  items,
  onPay,
  paying,
}: {
  items: LineItem[];
  onPay: () => void;
  paying: boolean;
}) {
  const total =
    items.reduce((sum, li) => sum + li.product.price * li.qty, 0) +
    (items.reduce((sum, li) => sum + li.product.price * li.qty, 0) >=
    SHIPPING_THRESHOLD
      ? 0
      : SHIPPING_COST);

  return (
    <div className="space-y-5">
      <div className="qn-card p-5">
        <p className="text-sm font-semibold text-white">Payment method</p>
        <div className="mt-4 space-y-2">
          {[
            { icon: Smartphone, label: "UPI / PhonePe / GPay" },
            { icon: CreditCard, label: "Credit / Debit Card" },
            { icon: IndianRupee, label: "Cash on Delivery" },
          ].map((m) => {
            const Icon = m.icon;
            return (
              <label
                key={m.label}
                className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/[0.08] p-3 transition-colors hover:border-qn-accent/30 hover:bg-qn-accent/5"
              >
                <input
                  type="radio"
                  name="payment_method"
                  defaultChecked={m.label.includes("UPI")}
                  className="accent-qn-accent"
                />
                <Icon className="h-5 w-5 text-qn-muted" strokeWidth={1.75} />
                <span className="text-sm text-white">{m.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="qn-card border-qn-accent/20 bg-qn-card-2 p-4 text-center">
        <p className="text-xs text-qn-muted">Amount due</p>
        <p className="mt-1 text-3xl font-extrabold text-qn-accent">
          ₹{total.toLocaleString("en-IN")}
        </p>
      </div>

      <button
        type="button"
        disabled={paying}
        onClick={onPay}
        className="qn-btn-primary w-full py-4 text-base"
      >
        {paying ? "Processing…" : `Pay ₹${total.toLocaleString("en-IN")} →`}
      </button>

      <p className="flex items-center justify-center gap-1.5 text-xs text-qn-muted">
        <Lock className="h-3.5 w-3.5 text-qn-success" />
        Payments secured by Razorpay · PCI-DSS compliant
      </p>
    </div>
  );
}

/* ── Main component ── */
export function CheckoutPageClient() {
  const items = useOrderItems();
  const [step, setStep] = useState<Step>("address");
  const [address, setAddress] = useState<Address>(BLANK);
  const [paying, setPaying] = useState(false);

  function handlePay() {
    setPaying(true);
    /*
     * Razorpay integration point:
     *
     * 1. POST /api/orders → create Razorpay order, receive `order_id`
     * 2. Open Razorpay checkout with order_id, amount, key_id
     * 3. On success callback → POST /api/payment-verify → redirect to /order-success
     *
     * Placeholder: navigate directly for now.
     */
    window.setTimeout(() => {
      window.location.href = "/order-success";
    }, 1500);
  }

  return (
    <div className="min-h-screen bg-qn-bg">
      {/* Header */}
      <header className="border-b border-white/[0.08] bg-qn-bg-elevated">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
          <QnLogoStatic layout="compact" href="/" />
          <p className="text-sm font-medium text-qn-muted">Secure checkout</p>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:py-12">
        {/* Step indicator */}
        <div className="mb-8">
          <StepBar current={step} />
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* Main form area */}
          <div>
            {step === "address" && (
              <section>
                <h1 className="qn-page-title mb-6 text-white">
                  Delivery address
                </h1>
                <AddressForm
                  value={address}
                  onChange={setAddress}
                  onNext={() => setStep("review")}
                />
              </section>
            )}

            {step === "review" && (
              <section>
                <h1 className="qn-page-title mb-6 text-white">
                  Review your order
                </h1>
                <ReviewStep
                  address={address}
                  onEdit={() => setStep("address")}
                  onNext={() => setStep("payment")}
                />
              </section>
            )}

            {step === "payment" && (
              <section>
                <h1 className="qn-page-title mb-6 text-white">Payment</h1>
                <PaymentStep items={items} onPay={handlePay} paying={paying} />
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside>
            <OrderSummary items={items} step={step} />
          </aside>
        </div>
      </div>
    </div>
  );
}
