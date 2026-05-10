import Link from "next/link";

export default function DashboardHomePage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-zinc-900">Dashboard</h1>
      <p className="mt-2 max-w-xl text-sm text-zinc-600">
        Manage your QR profiles, orders, and notification preferences.
      </p>
      <ul className="mt-8 flex flex-col gap-3 text-sm font-medium">
        <li>
          <Link href="/dashboard/my-qrs" className="text-zinc-900 underline-offset-4 hover:underline">
            My QRs
          </Link>
        </li>
        <li>
          <Link href="/shop" className="text-zinc-900 underline-offset-4 hover:underline">
            Buy another tag
          </Link>
        </li>
      </ul>
    </div>
  );
}
