"use client";

import Link from "next/link";
import { persistOnboardingPath } from "@/lib/onboarding/client-storage";

type Props = {
  profilePath: string;
  className?: string;
  children: React.ReactNode;
};

export function ContinueToLoginLink({
  profilePath,
  className,
  children,
}: Props) {
  const next = encodeURIComponent(profilePath);
  const href = `/login?next=${next}`;

  return (
    <Link
      href={href}
      className={className}
      onClick={() => persistOnboardingPath(profilePath)}
    >
      {children}
    </Link>
  );
}
