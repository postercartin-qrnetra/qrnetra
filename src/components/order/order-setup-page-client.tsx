"use client";

import {
  createPendingOrderAction,
  createRazorpayCheckoutAction,
  verifyRazorpayPaymentAction,
} from "@/app/actions/orders";
import { CreateProfileForm, type CreateProfileFormCreatedResult } from "@/components/create-profile-form";
import { useToast } from "@/components/ui/toast";
import type { OrderAddressInput } from "@/lib/orders/address";
import { getPriceLabel, type Product } from "@/lib/products";
import type { QrKind } from "@/lib/qr/types";
import { Check, ChevronRight, CreditCard, MapPin, Package, QrCode, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState, type Dispatch, type SetStateAction } from "react";

type RazorpayPaymentResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayPaymentResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
};

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => {
      open: () => void;
    };
  }
}

type SetupStep = "profile" | "address" | "payment";

const STEPS: { key: SetupStep; label: string }[] = [
  { key: "profile", label: "QR Profile" },
  { key: "address", label: "Address" },
  { key: "payment", label: "Payment" },
];

function StepBar({ current }: { current: SetupStep }) {
  const currentIndex = STEPS.findIndex((step) => step.key === current);

  return (
    <ol className="flex flex-wrap items-center gap-y-3">
      {STEPS.map((step, index) => {
        const done = index < currentIndex;
        const active = index === currentIndex;

        return (
          <li key={step.key} className="flex items-center">
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                done
                  ? "bg-qn-accent text-white"
                  : active
                    ? "border-2 border-qn-accent text-qn-accent"
                    : "border border-white/15 text-qn-muted-2"
              }`}
            >
              {done ? <Check className="h-4 w-4" strokeWidth={2.5} /> : index + 1}
            </span>
            <span className={`ml-2 text-sm font-medium ${active ? "text-white" : "text-qn-muted"}`}>
              {step.label}
            </span>
            {index < STEPS.length - 1 ? (
              <ChevronRight className="mx-3 h-4 w-4 text-qn-muted-2" />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

function ProductSummary({ product }: { product: Product }) {
  return (
    <div className="qn-card overflow-hidden p-4">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/[0.08] bg-qn-card-2">
        <Image
          src={product.images[0].src}
          alt={product.images[0].alt}
          fill
          sizes="(max-width: 1024px) 100vw, 360px"
          className="object-cover"
        />
      </div>
      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-qn-accent">
          Physical product
        </p>
        <h2 className="mt-1 text-lg font-semibold text-white">{product.title}</h2>
        <p className="mt-2 text-sm text-qn-muted">{product.shortDescription}</p>
        <p className="mt-4 text-xl font-extrabold text-white">{getPriceLabel(product)}</p>
      </div>

      <div className="mt-5 space-y-2 border-t border-white/[0.08] pt-4">
        {[
          "Generate QR first and see it in your dashboard immediately",
          "Pay only after the linked QR profile is ready",
          "The same QR is printed on your physical product",
        ].map((item) => (
          <div key={item} className="flex items-start gap-2 text-sm text-qn-muted">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-qn-accent" strokeWidth={1.75} />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AddressStep({
  address,
  setAddress,
  onContinue,
  loading,
}: {
  address: OrderAddressInput;
  setAddress: Dispatch<SetStateAction<OrderAddressInput>>;
  onContinue: () => void;
  loading: boolean;
}) {
  const field = (
    key: keyof OrderAddressInput,
    label: string,
    type = "text",
    placeholder = "",
  ) => (
    <label className="block">
      <span className="block text-sm font-medium text-white">{label}</span>
      <input
        type={type}
        value={address[key]}
        onChange={(event) =>
          setAddress((current) => ({ ...current, [key]: event.target.value }))
        }
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-white/[0.08] bg-qn-card px-4 py-3 text-white outline-none placeholder:text-qn-muted-2 focus:border-qn-accent/50 focus:ring-2 focus:ring-qn-accent/30"
      />
    </label>
  );

  return (
    <div className="space-y-5">
      <div className="qn-card p-6">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-qn-accent" strokeWidth={1.75} />
          <h2 className="text-lg font-semibold text-white">Shipping address</h2>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {field("fullName", "Full name", "text", "Rahul Kumar")}
          {field("mobile", "Mobile number", "tel", "98XXXXXXXX")}
        </div>
        <div className="mt-4">{field("email", "Email address", "email", "you@example.com")}</div>
        <div className="mt-4">{field("addressLine1", "Address line 1", "text", "House no., street")}</div>
        <div className="mt-4">{field("addressLine2", "Address line 2", "text", "Area, landmark")}</div>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {field("city", "City")}
          {field("state", "State")}
          {field("pincode", "Pincode", "text", "400001")}
        </div>
      </div>

      <button
        type="button"
        onClick={onContinue}
        disabled={loading}
        className="qn-btn-primary w-full sm:w-auto sm:px-8"
      >
        {loading ? "Saving order…" : "Continue to payment →"}
      </button>
    </div>
  );
}

function loadRazorpayScript() {
  return new Promise<boolean>((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function OrderSetupPageClient({
  product,
  initialEmail,
}: {
  product: Product;
  initialEmail: string | null;
}) {
  const router = useRouter();
  const { showToast } = useToast();
  const [currentStep, setCurrentStep] = useState<SetupStep>("profile");
  const [qrResult, setQrResult] = useState<CreateProfileFormCreatedResult | null>(null);
  const [orderState, setOrderState] = useState<{
    orderId: string;
    orderNumber: string;
    amountPaise: number;
  } | null>(null);
  const [submittingAddress, setSubmittingAddress] = useState(false);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [address, setAddress] = useState<OrderAddressInput>({
    fullName: "",
    mobile: "",
    email: initialEmail ?? "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
  });

  const headerCopy = useMemo(() => {
    const profileTypeLabel: Record<QrKind, string> = {
      vehicle: "vehicle",
      pet: "pet",
      child: "child",
      asset: "asset",
      business: "business",
    };

    return {
      badge: `Setup ${product.title}`,
      title: `Create the QR profile for your ${profileTypeLabel[product.profileKind]}`,
      description:
        "This QR is created before payment and appears in your dashboard immediately. After payment, QRNetra prints the same permanent QR on your physical product.",
    };
  }, [product]);

  async function handleProfileCreated(result: CreateProfileFormCreatedResult) {
    setQrResult(result);
    setCurrentStep("address");
    setError(null);
    showToast("QR profile created. Continue with shipping and payment.");
  }

  async function handleAddressContinue() {
    if (!qrResult?.qrId) {
      setError("Create the QR profile first.");
      return;
    }

    setSubmittingAddress(true);
    setError(null);

    const result = await createPendingOrderAction({
      productSlug: product.slug,
      qrId: qrResult.qrId,
      address,
    });

    setSubmittingAddress(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    if (!result.orderId || !result.orderNumber || result.amountPaise == null) {
      setError("Could not prepare your order for payment.");
      return;
    }

    setOrderState({
      orderId: result.orderId,
      orderNumber: result.orderNumber,
      amountPaise: result.amountPaise,
    });
    setCurrentStep("payment");
  }

  async function handlePayNow() {
    if (!orderState) {
      setError("Create your order first.");
      return;
    }

    setPaying(true);
    setError(null);

    const scriptReady = await loadRazorpayScript();
    if (!scriptReady || !window.Razorpay) {
      setPaying(false);
      setError("Could not load Razorpay checkout. Please try again.");
      return;
    }

    const checkout = await createRazorpayCheckoutAction(orderState.orderId);
    if (checkout.error) {
      setPaying(false);
      setError(checkout.error);
      return;
    }

    if (
      !checkout.razorpayKeyId ||
      !checkout.razorpayOrderId ||
      checkout.amountPaise == null
    ) {
      setPaying(false);
      setError("Razorpay checkout is not ready.");
      return;
    }

    const razorpay = new window.Razorpay({
      key: checkout.razorpayKeyId,
      amount: checkout.amountPaise,
      currency: "INR",
      name: "QRNetra",
      description: product.title,
      order_id: checkout.razorpayOrderId,
      prefill: {
        name: checkout.customerName ?? address.fullName,
        email: checkout.customerEmail ?? address.email,
        contact: checkout.customerPhone ?? address.mobile,
      },
      theme: { color: "#ff6b2c" },
      modal: {
        ondismiss: () => {
          setPaying(false);
        },
      },
      handler: async (response) => {
        const verified = await verifyRazorpayPaymentAction({
          orderId: checkout.orderId,
          razorpayOrderId: response.razorpay_order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature,
        });

        setPaying(false);

        if (!verified.ok) {
          setError(verified.error);
          return;
        }

        showToast("Payment successful. Your order is confirmed.");
        router.push(`/order-success?order=${encodeURIComponent(verified.orderId)}`);
      },
    });

    razorpay.open();
  }

  return (
    <div className="min-h-screen bg-qn-bg">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <StepBar current={currentStep} />

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div>
            {currentStep === "profile" ? (
              <CreateProfileForm
                initialType={product.profileKind}
                initialEmail={initialEmail}
                flow="order"
                productVariant={product.profileVariant}
                lockType
                headerBadge={headerCopy.badge}
                headerTitle={headerCopy.title}
                headerDescription={headerCopy.description}
                onCreated={handleProfileCreated}
              />
            ) : null}

            {currentStep === "address" ? (
              <div className="space-y-6">
                {qrResult ? (
                  <div className="qn-card border border-qn-accent/20 bg-qn-card-2 p-5">
                    <div className="flex items-start gap-3">
                      <QrCode className="mt-0.5 h-5 w-5 text-qn-accent" strokeWidth={1.75} />
                      <div>
                        <p className="text-sm font-semibold text-white">
                          QR created successfully
                        </p>
                        <p className="mt-1 text-sm text-qn-muted">
                          Your permanent QR is already live in the dashboard with scan
                          URL <span className="font-mono text-white">/s/{qrResult.slug}</span>.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : null}
                <AddressStep
                  address={address}
                  setAddress={setAddress}
                  onContinue={() => void handleAddressContinue()}
                  loading={submittingAddress}
                />
              </div>
            ) : null}

            {currentStep === "payment" && orderState ? (
              <div className="space-y-6">
                <div className="qn-card p-6">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-qn-accent" strokeWidth={1.75} />
                    <h2 className="text-lg font-semibold text-white">Secure payment</h2>
                  </div>
                  <p className="mt-3 text-sm text-qn-muted">
                    Order <span className="font-semibold text-white">{orderState.orderNumber}</span>
                    {" "}is ready. Pay now to move it into fulfillment and start printing.
                  </p>
                  <div className="mt-5 rounded-2xl border border-white/[0.08] bg-qn-card-2 p-5">
                    <p className="text-xs uppercase tracking-wide text-qn-muted-2">
                      Amount due
                    </p>
                    <p className="mt-2 text-3xl font-extrabold text-qn-accent">
                      ₹{(orderState.amountPaise / 100).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => void handlePayNow()}
                  disabled={paying}
                  className="qn-btn-primary w-full py-4 text-base"
                >
                  {paying
                    ? "Opening Razorpay…"
                    : `Pay ₹${(orderState.amountPaise / 100).toLocaleString("en-IN")} →`}
                </button>
              </div>
            ) : null}

            {error ? (
              <p className="mt-6 rounded-xl border border-red-200/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                {error}
              </p>
            ) : null}
          </div>

          <aside className="space-y-5">
            <ProductSummary product={product} />
            <div className="qn-card p-5">
              <p className="text-sm font-semibold text-white">Flow overview</p>
              <div className="mt-4 space-y-3 text-sm text-qn-muted">
                <div className="flex items-start gap-2">
                  <QrCode className="mt-0.5 h-4 w-4 shrink-0 text-qn-accent" strokeWidth={1.75} />
                  Generate the QR first and save it in your dashboard.
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-qn-accent" strokeWidth={1.75} />
                  Add the delivery address for this printed product.
                </div>
                <div className="flex items-start gap-2">
                  <Package className="mt-0.5 h-4 w-4 shrink-0 text-qn-accent" strokeWidth={1.75} />
                  Pay securely to move the order into processing and shipping.
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
