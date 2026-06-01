export function FormFieldError({
  error,
  warning,
}: {
  error?: string | null;
  warning?: string | null;
}) {
  if (!error && !warning) return null;
  if (error) {
    return <p className="mt-1.5 text-xs text-red-400">{error}</p>;
  }
  return <p className="mt-1.5 text-xs text-amber-400">{warning}</p>;
}
