import { QnLogoStatic } from "@/components/ui/logo";

export default function PublicScanLoading() {
  return (
    <div
      role="status"
      aria-busy="true"
      className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-zinc-50 to-white px-4 py-12"
    >
      <QnLogoStatic layout="compact" textClassName="text-qn-bg" />
      <div className="mt-6 flex h-12 w-12 items-center justify-center">
        <span className="block h-10 w-10 animate-spin rounded-full border-2 border-white/[0.08] border-t-qn-accent" />
      </div>
      <p className="mt-6 max-w-xs text-center text-sm text-qn-muted">
        Loading emergency contact options…
      </p>
      <span className="sr-only">Loading scan page, please wait.</span>
    </div>
  );
}
