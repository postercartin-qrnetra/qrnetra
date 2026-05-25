import Image from "next/image";
import Link from "next/link";
import {
  LOGO_ANIMATED_SRC,
  LOGO_HEIGHT_DESKTOP,
  LOGO_HEIGHT_MOBILE,
  LOGO_HEIGHT_TABLET,
  LOGO_INTRINSIC_HEIGHT,
  LOGO_INTRINSIC_WIDTH,
  LOGO_NAV_AREA_MIN_WIDTH,
  LOGO_STATIC_SRC,
} from "@/lib/brand";

/** Legacy size tokens for non-navbar surfaces */
type LogoSize = "sm" | "md" | "lg" | "xl";

type LogoLayout = "navbar" | "compact" | "footer" | "auth";

const LEGACY_HEIGHTS: Record<LogoSize, number> = {
  sm: LOGO_HEIGHT_MOBILE,
  md: LOGO_HEIGHT_TABLET,
  lg: LOGO_HEIGHT_DESKTOP,
  xl: 64,
};

type QnLogoBaseProps = {
  className?: string;
  href?: string;
  /** @deprecated Prefer `layout` for responsive navbar sizing */
  size?: LogoSize;
  layout?: LogoLayout;
  priority?: boolean;
};

function legacyDimensions(size: LogoSize) {
  const h = LEGACY_HEIGHTS[size];
  return { height: h, width: h };
}

/** Responsive navbar mark: 40px mobile · 48px tablet · 52px desktop */
const NAVBAR_MARK_CLASS =
  "block object-contain object-left h-10 w-10 md:h-12 md:w-12 lg:h-[52px] lg:w-[52px]";

const NAVBAR_AREA_CLASS =
  "flex shrink-0 items-center pl-2 pr-2 min-w-[140px] md:pl-4 md:pr-4 md:min-w-[180px] lg:min-w-[220px] lg:pl-6 lg:pr-8";

const LAYOUT_MARK_CLASS: Record<Exclude<LogoLayout, "navbar">, string> = {
  compact: "block object-contain object-left h-10 w-10",
  footer: "block object-contain object-left h-12 w-12 lg:h-14 lg:w-14",
  auth: "block object-contain object-left h-12 w-12 lg:h-14 lg:w-14",
};

function markDimensions(layout: LogoLayout) {
  switch (layout) {
    case "navbar":
      return {
        width: LOGO_HEIGHT_DESKTOP,
        height: LOGO_HEIGHT_DESKTOP,
      };
    case "footer":
    case "auth":
      return { width: 56, height: 56 };
    case "compact":
    default:
      return {
        width: LOGO_HEIGHT_MOBILE,
        height: LOGO_HEIGHT_MOBILE,
      };
  }
}

function resolveLayout(
  layout: LogoLayout | undefined,
  size: LogoSize,
): LogoLayout {
  if (layout) return layout;
  if (size === "sm") return "compact";
  if (size === "lg" || size === "xl") return "footer";
  return "compact";
}

function LogoWrapper({
  href,
  layout,
  className,
  children,
}: {
  href?: string;
  layout: LogoLayout;
  className?: string;
  children: React.ReactNode;
}) {
  const areaClass =
    layout === "navbar"
      ? `${NAVBAR_AREA_CLASS} ${className ?? ""}`
      : `inline-flex shrink-0 items-center ${className ?? ""}`;

  if (href) {
    return (
      <Link href={href} className={areaClass} aria-label="QRNetra home">
        {children}
      </Link>
    );
  }

  return <span className={areaClass}>{children}</span>;
}

export function QnLogoStatic({
  className = "",
  href = "/",
  size = "md",
  layout,
  priority = false,
}: QnLogoBaseProps) {
  const resolved = resolveLayout(layout, size);
  const dims =
    resolved === "navbar"
      ? { width: LOGO_HEIGHT_DESKTOP, height: LOGO_HEIGHT_DESKTOP }
      : layout
        ? markDimensions(resolved)
        : legacyDimensions(size);

  const markClass =
    resolved === "navbar"
      ? NAVBAR_MARK_CLASS
      : LAYOUT_MARK_CLASS[resolved as keyof typeof LAYOUT_MARK_CLASS];

  const img = (
    <Image
      src={LOGO_STATIC_SRC}
      alt="QRNetra"
      width={dims.width}
      height={dims.height}
      priority={priority}
      quality={95}
      sizes={
        resolved === "navbar"
          ? `(max-width: 767px) ${LOGO_HEIGHT_MOBILE}px, (max-width: 1023px) ${LOGO_HEIGHT_TABLET}px, ${LOGO_HEIGHT_DESKTOP}px`
          : `${dims.width}px`
      }
      className={markClass}
    />
  );

  return (
    <LogoWrapper href={href} layout={resolved}>
      {img}
    </LogoWrapper>
  );
}

export function QnLogoAnimated({
  className = "",
  href = "/",
  size = "md",
  layout,
}: QnLogoBaseProps) {
  const resolved = resolveLayout(layout, size);
  const dims =
    resolved === "navbar"
      ? { width: LOGO_HEIGHT_DESKTOP, height: LOGO_HEIGHT_DESKTOP }
      : layout
        ? markDimensions(resolved)
        : legacyDimensions(size);

  const markClass =
    resolved === "navbar"
      ? NAVBAR_MARK_CLASS
      : LAYOUT_MARK_CLASS[resolved as keyof typeof LAYOUT_MARK_CLASS];

  const video = (
    <video
      autoPlay
      loop
      muted
      playsInline
      preload="metadata"
      aria-label="QRNetra"
      width={dims.width}
      height={dims.height}
      className={`pointer-events-none ${markClass} ${className}`}
    >
      <source src={LOGO_ANIMATED_SRC} type="video/mp4" />
    </video>
  );

  return (
    <LogoWrapper href={href} layout={resolved}>
      {video}
    </LogoWrapper>
  );
}

type QnLogoProps = QnLogoBaseProps & {
  variant?: "static" | "animated";
};

export function QnLogoText({ size = "md" }: { size?: LogoSize }) {
  const textSizes: Record<LogoSize, string> = {
    sm: "text-base",
    md: "text-lg sm:text-xl",
    lg: "text-2xl",
    xl: "text-3xl",
  };
  return (
    <span className={`font-extrabold tracking-tight ${textSizes[size]}`}>
      <span className="text-white">QR</span>
      <span className="text-qn-accent">Netra</span>
    </span>
  );
}

export function QnLogo({ variant = "static", ...props }: QnLogoProps) {
  if (variant === "animated") {
    return <QnLogoAnimated {...props} />;
  }
  return <QnLogoStatic {...props} />;
}

export {
  LOGO_HEIGHT_DESKTOP,
  LOGO_HEIGHT_MOBILE,
  LOGO_HEIGHT_TABLET,
  LOGO_INTRINSIC_HEIGHT,
  LOGO_INTRINSIC_WIDTH,
  LOGO_NAV_AREA_MIN_WIDTH,
};
