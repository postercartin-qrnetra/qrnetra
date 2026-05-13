export default function PublicScanLoading() {
  return (
    <div
      role="status"
      aria-busy="true"
      className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-zinc-50 to-white px-4 py-12"
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
        QRNetra
      </p>
      <div className="mt-6 flex h-12 w-12 items-center justify-center">
        <span className="block h-10 w-10 animate-spin rounded-full border-2 border-zinc-200 border-t-[#111111]" />
      </div>
      <p className="mt-6 max-w-xs text-center text-sm text-zinc-600">
        Loading emergency contact options…
      </p>
      <span className="sr-only">Loading scan page, please wait.</span>
    </div>
  );
}
