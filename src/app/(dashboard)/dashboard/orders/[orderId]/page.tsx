import { createClient } from "@/lib/supabase/server";
import { getOrderForUser } from "@/lib/orders/queries";
import { QrAssetDownloads } from "@/components/qr-asset-downloads";
import { buildPublicScanUrl } from "@/lib/qr/slug";
import { isQrKind } from "@/lib/qr/types";
import { getPublicSiteUrl } from "@/lib/site-url";
import { notFound } from "next/navigation";
import { MapPin, Package, QrCode, Truck } from "lucide-react";
import Link from "next/link";

type Props = {
  params: Promise<{ orderId: string }>;
};

export default async function OrderDetailPage({ params }: Props) {
  const { orderId } = await params;
  const supabase = await createClient();

  if (!supabase) {
    notFound();
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    notFound();
  }

  const order = await getOrderForUser(supabase, user.id, orderId);
  if (!order) {
    notFound();
  }

  let qrDownloadContext: {
    scanUrl: string;
    kind: string;
    title: string;
    subtitle: string | null;
  } | null = null;

  if (order.qrId) {
    const { data: qrCode } = await supabase
      .from("qr_codes")
      .select("id, slug, qr_profiles!inner(name, profile_type, data_json)")
      .eq("id", order.qrId)
      .single();

    const rawProfile = qrCode?.qr_profiles;
    const profile = Array.isArray(rawProfile) ? rawProfile[0] : rawProfile;

    if (qrCode && profile) {
      const kind = isQrKind(profile.profile_type) ? profile.profile_type : "vehicle";
      const dataJson = (profile.data_json ?? {}) as Record<string, string>;
      qrDownloadContext = {
        scanUrl: buildPublicScanUrl(getPublicSiteUrl(), qrCode.slug),
        kind,
        title: profile.name,
        subtitle: dataJson.vehicle_number ?? dataJson.school_name ?? dataJson.pet_name ?? null,
      };
    }
  }

  const address = order.shippingAddress;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-qn-accent">
            Order detail
          </p>
          <h1 className="mt-2 text-3xl font-extrabold text-white">{order.orderNumber}</h1>
          <p className="mt-2 text-sm text-qn-muted">
            Ordered on {new Date(order.createdAt).toLocaleDateString("en-IN")}
          </p>
        </div>
        <Link href="/dashboard/orders" className="qn-btn-secondary px-4 text-sm">
          Back to orders
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <div className="qn-card p-6">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-qn-accent" strokeWidth={1.75} />
              <h2 className="text-lg font-semibold text-white">Order status</h2>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/[0.08] bg-qn-card-2 p-4">
                <p className="text-xs uppercase tracking-wide text-qn-muted-2">Payment</p>
                <p className="mt-2 text-lg font-semibold capitalize text-white">
                  {order.paymentStatus.replace(/_/g, " ")}
                </p>
              </div>
              <div className="rounded-2xl border border-white/[0.08] bg-qn-card-2 p-4">
                <p className="text-xs uppercase tracking-wide text-qn-muted-2">Fulfillment</p>
                <p className="mt-2 text-lg font-semibold capitalize text-white">
                  {order.fulfillmentStatus.replace(/_/g, " ")}
                </p>
              </div>
            </div>

            {order.trackingNumber ? (
              <div className="mt-5 rounded-2xl border border-white/[0.08] bg-qn-card-2 p-4">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-qn-accent" strokeWidth={1.75} />
                  <p className="font-medium text-white">Tracking</p>
                </div>
                <p className="mt-2 text-sm text-qn-muted">
                  {order.courierName ?? "Courier"} · {order.trackingNumber}
                </p>
              </div>
            ) : null}
          </div>

          <div className="qn-card p-6">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-qn-accent" strokeWidth={1.75} />
              <h2 className="text-lg font-semibold text-white">Shipping address</h2>
            </div>
            <div className="mt-5 text-sm text-qn-muted">
              <p className="font-medium text-white">{address.fullName ?? "Recipient"}</p>
              <p>{address.mobile}</p>
              <p>{address.email}</p>
              <p className="mt-2">
                {[address.addressLine1, address.addressLine2].filter(Boolean).join(", ")}
              </p>
              <p>
                {[address.city, address.state, address.pincode].filter(Boolean).join(", ")}
              </p>
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="qn-card p-6">
            <p className="text-sm font-semibold text-white">Product</p>
            <p className="mt-3 text-lg font-semibold text-white">
              {order.product?.title ?? "QRNetra product"}
            </p>
            <p className="mt-2 text-sm text-qn-muted">
              Amount paid: ₹{(order.amountPaise / 100).toLocaleString("en-IN")}
            </p>
            {order.product ? (
              <Link
                href={`/products/${order.product.category}/${order.product.slug}`}
                className="qn-btn-secondary mt-4 px-4 text-sm"
              >
                View product page
              </Link>
            ) : null}
          </div>

          <div className="qn-card p-6">
            <div className="flex items-center gap-2">
              <QrCode className="h-4 w-4 text-qn-accent" strokeWidth={1.75} />
              <p className="text-sm font-semibold text-white">Linked QR</p>
            </div>
            {order.qrSlug ? (
              <>
                <p className="mt-3 font-mono text-xs text-qn-muted">/s/{order.qrSlug}</p>
                <div className="mt-4 flex flex-col gap-2">
                  {order.qrId ? (
                    <Link
                      href={`/dashboard/my-qrs/${order.qrId}`}
                      className="qn-btn-primary px-4 text-sm"
                    >
                      Open linked QR
                    </Link>
                  ) : null}
                  <Link
                    href={`/s/${order.qrSlug}`}
                    className="qn-btn-secondary px-4 text-sm"
                  >
                    View public profile
                  </Link>
                </div>
                {qrDownloadContext ? (
                  <div className="mt-5">
                    <QrAssetDownloads
                      scanUrl={qrDownloadContext.scanUrl}
                      slug={order.qrSlug}
                      kind={qrDownloadContext.kind}
                      productSlug={order.product?.slug ?? null}
                      title={qrDownloadContext.title}
                      subtitle={qrDownloadContext.subtitle}
                      compact
                    />
                  </div>
                ) : null}
              </>
            ) : (
              <p className="mt-3 text-sm text-qn-muted">
                QR details are not available for this order yet.
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
