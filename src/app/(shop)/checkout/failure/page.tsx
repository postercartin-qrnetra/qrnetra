import Link from "next/link";

export default function CheckoutFailurePage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <h1 className="text-2xl font-semibold text-white">Payment failed</h1>
      <p className="mt-4 text-qn-muted">Retry checkout or contact support — messaging hooks pending.</p>
      <Link href="/checkout" className="mt-8 inline-block text-sm font-medium text-white underline">
        Back to checkout
      </Link>
    </div>
  );
}
