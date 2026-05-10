import type { ReactNode } from "react";

export function Section({
  id,
  children,
  className = "",
  innerClassName = "",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  innerClassName?: string;
}) {
  return (
    <section id={id} className={`scroll-mt-28 ${className}`}>
      <div
        className={`mx-auto max-w-6xl px-4 py-16 sm:py-20 lg:px-6 lg:py-24 ${innerClassName}`}
      >
        {children}
      </div>
    </section>
  );
}
