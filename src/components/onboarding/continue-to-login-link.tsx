"use client";

import { isQrKind } from "@/lib/qr/types";
import { ProfileTypeContinueButton } from "./profile-type-continue-button";

type Props = {
  profilePath: string;
  className?: string;
  children: React.ReactNode;
};

/**
 * @deprecated Prefer ProfileTypeContinueButton with an explicit QrKind.
 * Kept for any legacy links that pass `/create/profile?type=…`.
 */
export function ContinueToLoginLink({
  profilePath,
  className,
  children,
}: Props) {
  const match = profilePath.match(/[?&]type=([^&]+)/);
  const rawType = match?.[1] ?? "";

  if (!isQrKind(rawType)) {
    return (
      <a href="/create/type" className={className}>
        {children}
      </a>
    );
  }

  return (
    <ProfileTypeContinueButton type={rawType} className={className}>
      {children}
    </ProfileTypeContinueButton>
  );
}
