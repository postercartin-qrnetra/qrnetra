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
        className={`mx-auto max-w-7xl px-4 qn-section-padding sm:px-6 lg:px-8 ${innerClassName}`}
      >
        {children}
      </div>
    </section>
  );
}
