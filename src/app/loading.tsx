export default function RootLoading() {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-live="polite"
      className="flex min-h-[60vh] flex-col items-center justify-center bg-[#fafafa] px-4 py-16"
    >
      <div className="flex h-10 w-10 items-center justify-center">
        <span className="block h-8 w-8 animate-spin rounded-full border-2 border-zinc-200 border-t-[#111111]" />
      </div>
      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
        Loading…
      </p>
      <span className="sr-only">Loading content, please wait.</span>
    </div>
  );
}
