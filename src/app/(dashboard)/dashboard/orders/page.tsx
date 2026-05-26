import { createClient } from "@/lib/supabase/server";
import { getOrdersForUser } from "@/lib/orders/queries";
import { Package, QrCode, Truck } from "lucide-react";
import Link from "next/link";

export default async function OrdersPage() {
  const supabase = await createClient();
  if (!supabase) {
    return (
      <div className="qn-card p-6">
        <p className="text-lg font-semibold text-white">Orders</p>
        <p className="mt-2 text-sm text-qn-muted">
          Supabase is not configured for this environment.
        </p>
      </div>
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="qn-card p-6">
        <p className="text-lg font-semibold text-white">Orders</p>
        <p className="mt-2 text-sm text-qn-muted">
          Sign in to view your QRNetra product orders.
        </p>
      </div>
    );
  }

  const orders = await getOrdersForUser(supabase, user.id);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-qn-accent">
          Orders
        </p>
        <h1 className="mt-2 text-3xl font-extrabold text-white">
          Track your QRNetra product orders
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-qn-muted">
          Every physical purchase stays linked to the QR profile you created
          before payment. Track fulfillment, open the linked QR, and jump to the
          order detail page anytime.
        </p>
      </div>

      {orders.length ? (
        <div className="grid gap-4">
          {orders.map((order) => (
            <div key={order.id} className="qn-card p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-qn-muted-2">
                    {order.orderNumber}
                  </p>
                  <h2 className="mt-1 text-lg font-semibold text-white">
                    {order.product?.title ?? "QRNetra product"}
                  </h2>
                  <p className="mt-2 text-sm text-qn-muted">
                    Ordered on {new Date(order.createdAt).toLocaleDateString("en-IN")}
                  </p>
                </div>
                <div className="text-left lg:text-right">
                  <p className="text-sm font-semibold text-white">
                    ₹{(order.amountPaise / 100).toLocaleString("en-IN")}
                  </p>
                  <p className="mt-1 text-sm capitalize text-qn-muted">
                    Payment: {order.paymentStatus.replace(/_/g, " ")}
                  </p>
                  <p className="text-sm capitalize text-qn-muted">
                    Fulfillment: {order.fulfillmentStatus.replace(/_/g, " ")}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href={`/dashboard/orders/${order.id}`}
                  className="qn-btn-primary px-4 py-2 text-sm"
                >
                  <Package className="h-4 w-4" strokeWidth={1.75} />
                  View Order
                </Link>
                {order.trackingNumber ? (
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] px-3 py-2 text-xs font-medium text-qn-muted">
                    <Truck className="h-3.5 w-3.5 text-qn-accent" strokeWidth={1.75} />
                    {order.courierName ?? "Courier"} · {order.trackingNumber}
                  </span>
                ) : null}
                {order.qrId ? (
                  <Link
                    href={`/dashboard/my-qrs/${order.qrId}`}
                    className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] px-3 py-2 text-xs font-medium text-qn-muted hover:text-white"
                  >
                    <QrCode className="h-3.5 w-3.5 text-qn-accent" strokeWidth={1.75} />
                    Open linked QR
                  </Link>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="qn-card p-8 text-center">
          <p className="text-lg font-semibold text-white">No orders yet</p>
          <p className="mt-2 text-sm text-qn-muted">
            Buy a QRNetra physical product to track shipping and linked QR assets
            here.
          </p>
          <Link href="/products" className="qn-btn-primary mt-6 px-6">
            Browse products
          </Link>
        </div>
      )}
    </div>
  );
}
