import Link from "next/link";

export default function CheckoutSuccessPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <h1 className="text-2xl font-semibold text-white">Payment successful</h1>
      <p className="mt-4 text-qn-muted">
        Order confirmation and activation steps will appear here after Razorpay webhooks are wired.
      </p>
      <Link
        href="/activate"
        className="mt-8 inline-flex h-11 items-center justify-center rounded-full bg-zinc-900 px-6 text-sm font-medium text-white"
      >
        Activate tag
      </Link>
    </div>
  );
}
