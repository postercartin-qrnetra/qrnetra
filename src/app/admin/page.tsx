import { QrAssetDownloads } from "@/components/qr-asset-downloads";
import { AdminOrderControls } from "@/components/admin/admin-order-controls";
import { buildPublicScanUrl } from "@/lib/qr/slug";
import { isQrKind } from "@/lib/qr/types";
import { getPublicSiteUrl } from "@/lib/site-url";
import { getCurrentAdminUser } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { Package, QrCode, Truck } from "lucide-react";
import Link from "next/link";

export default async function AdminHomePage() {
  const admin = await getCurrentAdminUser();
  if (admin.error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="qn-card p-8 text-center">
          <p className="text-lg font-semibold text-white">Admin access required</p>
          <p className="mt-2 text-sm text-qn-muted">{admin.error}</p>
        </div>
      </div>
    );
  }

  const supabase = createAdminClient();
  if (!supabase) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="qn-card p-8 text-center">
          <p className="text-lg font-semibold text-white">Admin client not configured</p>
          <p className="mt-2 text-sm text-qn-muted">
            Add `SUPABASE_SERVICE_ROLE_KEY` to enable fulfillment management.
          </p>
        </div>
      </div>
    );
  }

  const { data: orders } = await supabase
    .from("orders")
    .select(
      "id, order_number, created_at, amount_paise, payment_status, fulfillment_status, tracking_number, courier_name, qr_slug, contact_email, product:products(title, slug, primary_category), qr_code_id, qr:qr_codes(id, slug, qr_profiles(name, profile_type, data_json))",
    )
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-qn-accent">
          Admin
        </p>
        <h1 className="mt-2 text-3xl font-extrabold text-white">
          Fulfillment workspace
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-qn-muted">
          Review paid orders, move products through fulfillment, attach courier
          details, and open the linked QR from one place.
        </p>
        <Link href="/admin/inventory" className="qn-btn-secondary mt-4 inline-flex text-sm">
          Tag inventory
        </Link>
      </div>

      <div className="mt-8 grid gap-4">
        {(orders ?? []).map((order) => (
          <div key={order.id} className="qn-card p-5">
            {(() => {
              const productRelation = (
                order as {
                  product?:
                    | {
                        title?: string;
                        slug?: string;
                        primary_category?: string;
                      }
                    | Array<{
                        title?: string;
                        slug?: string;
                        primary_category?: string;
                      }>;
                }
              ).product;
              const productObject = Array.isArray(productRelation)
                ? productRelation[0]
                : productRelation;
              const qrRelation = (
                order as {
                  qr?:
                    | {
                        id?: string;
                        slug?: string;
                        qr_profiles?:
                          | {
                              name?: string;
                              profile_type?: string;
                              data_json?: Record<string, string>;
                            }
                          | Array<{
                              name?: string;
                              profile_type?: string;
                              data_json?: Record<string, string>;
                            }>;
                      }
                    | Array<{
                        id?: string;
                        slug?: string;
                        qr_profiles?:
                          | {
                              name?: string;
                              profile_type?: string;
                              data_json?: Record<string, string>;
                            }
                          | Array<{
                              name?: string;
                              profile_type?: string;
                              data_json?: Record<string, string>;
                            }>;
                      }>;
                }
              ).qr;
              const qrObject = Array.isArray(qrRelation) ? qrRelation[0] : qrRelation;
              const rawQrProfile = Array.isArray(qrObject?.qr_profiles)
                ? qrObject?.qr_profiles[0]
                : qrObject?.qr_profiles;
              const qrKind = rawQrProfile?.profile_type;
              const kind = isQrKind(qrKind ?? "") ? (qrKind ?? "vehicle") : "vehicle";
              const dataJson = (rawQrProfile?.data_json ?? {}) as Record<string, string>;
              const subtitle =
                dataJson.vehicle_number ??
                dataJson.school_name ??
                dataJson.asset_id ??
                null;
              const scanUrl = qrObject?.slug
                ? buildPublicScanUrl(getPublicSiteUrl(), qrObject.slug)
                : null;

              return (
                <>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-qn-muted-2">
                  {order.order_number ?? order.id}
                </p>
                <h2 className="mt-1 text-lg font-semibold text-white">
                  {productObject?.title ?? "QRNetra product"}
                </h2>
                <p className="mt-2 text-sm text-qn-muted">
                  {order.contact_email ?? "No contact email"} · ₹
                  {((order.amount_paise ?? 0) / 100).toLocaleString("en-IN")}
                </p>
              </div>
              <div className="text-left lg:text-right">
                <p className="text-sm capitalize text-qn-muted">
                  Payment: {order.payment_status?.replace(/_/g, " ") ?? "pending"}
                </p>
                <p className="text-sm capitalize text-qn-muted">
                  Fulfillment: {order.fulfillment_status?.replace(/_/g, " ") ?? "pending"}
                </p>
                <p className="mt-2 text-xs text-qn-muted-2">
                  {new Date(order.created_at).toLocaleDateString("en-IN")}
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-qn-muted">
              {order.qr_slug ? (
                <Link
                  href={`/s/${order.qr_slug}`}
                  className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] px-3 py-2 hover:text-white"
                >
                  <QrCode className="h-3.5 w-3.5 text-qn-accent" strokeWidth={1.75} />
                  View QR
                </Link>
              ) : null}
              {order.tracking_number ? (
                <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] px-3 py-2">
                  <Truck className="h-3.5 w-3.5 text-qn-accent" strokeWidth={1.75} />
                  {order.courier_name ?? "Courier"} · {order.tracking_number}
                </span>
              ) : null}
              {productObject ? (
                <Link
                  href={`/products/${productObject.primary_category}/${productObject.slug}`}
                  className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] px-3 py-2 hover:text-white"
                >
                  <Package className="h-3.5 w-3.5 text-qn-accent" strokeWidth={1.75} />
                  Product page
                </Link>
              ) : null}
            </div>

            <AdminOrderControls
              orderId={order.id}
              initialStatus={order.fulfillment_status ?? "pending"}
              initialTrackingNumber={order.tracking_number}
              initialCourierName={order.courier_name}
            />
            {scanUrl && rawQrProfile ? (
              <div className="mt-4">
                <QrAssetDownloads
                  scanUrl={scanUrl}
                      slug={qrObject?.slug ?? order.qr_slug ?? "qr"}
                  kind={kind}
                      productSlug={productObject?.slug ?? null}
                      title={rawQrProfile.name ?? "QRNetra profile"}
                  subtitle={subtitle}
                  compact
                />
              </div>
            ) : null}
                </>
              );
            })()}
          </div>
        ))}
      </div>
    </div>
  );
}
