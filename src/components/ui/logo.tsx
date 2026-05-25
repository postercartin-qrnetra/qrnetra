import Image from "next/image";
import Link from "next/link";
import {
  LOGO_HEIGHT_DESKTOP,
  LOGO_HEIGHT_MOBILE,
  LOGO_HEIGHT_TABLET,
  LOGO_INTRINSIC_HEIGHT,
  LOGO_INTRINSIC_WIDTH,
  LOGO_NAV_AREA_MIN_WIDTH,
  LOGO_STATIC_SRC,
} from "@/lib/brand";

type LogoSize = "small" | "medium" | "large" | "sm" | "md" | "lg" | "xl";

type LogoLayout = "navbar" | "compact" | "footer" | "auth";

type QnLogoBaseProps = {
  className?: string;
  href?: string;
  size?: LogoSize;
  layout?: LogoLayout;
  priority?: boolean;
  showText?: boolean;
  textClassName?: string;
};

function normalizeSize(size: LogoSize) {
  switch (size) {
    case "small":
      return "sm";
    case "medium":
      return "md";
    case "large":
      return "lg";
    default:
      return size;
  }
}

const NAVBAR_AREA_CLASS =
  "flex shrink-0 items-center pl-2 pr-2 min-w-[176px] md:pl-4 md:pr-4 md:min-w-[210px] lg:min-w-[240px] lg:pl-6 lg:pr-8";

function resolveLayout(layout: LogoLayout | undefined, size: LogoSize): LogoLayout {
  if (layout) return layout;

  const normalized = normalizeSize(size);
  if (normalized === "lg" || normalized === "xl") return "footer";
  return "compact";
}

function getLayoutSizing(layout: LogoLayout, size: LogoSize) {
  const normalized = normalizeSize(size);

  if (layout === "navbar") {
    return {
      imageWidth: LOGO_HEIGHT_DESKTOP,
      imageHeight: LOGO_HEIGHT_DESKTOP,
      imageClassName:
        "block h-10 w-10 object-contain object-left md:h-12 md:w-12 lg:h-[52px] lg:w-[52px]",
      textClassName:
        "text-base sm:text-[1.05rem] md:text-[1.1rem] lg:text-[1.15rem]",
      gapClassName: "gap-2.5 md:gap-3",
    };
  }

  if (layout === "footer" || layout === "auth") {
    return {
      imageWidth: 56,
      imageHeight: 56,
      imageClassName: "block h-12 w-12 object-contain object-left lg:h-14 lg:w-14",
      textClassName:
        layout === "footer"
          ? "text-lg sm:text-xl lg:text-[1.45rem]"
          : "text-lg sm:text-xl",
      gapClassName: "gap-3",
    };
  }

  if (normalized === "sm") {
    return {
      imageWidth: 32,
      imageHeight: 32,
      imageClassName: "block h-8 w-8 object-contain object-left",
      textClassName: "text-sm sm:text-[0.95rem]",
      gapClassName: "gap-2.5",
    };
  }

  if (normalized === "lg" || normalized === "xl") {
    return {
      imageWidth: 56,
      imageHeight: 56,
      imageClassName: "block h-12 w-12 object-contain object-left",
      textClassName: "text-lg sm:text-xl",
      gapClassName: "gap-3",
    };
  }

  return {
    imageWidth: 40,
    imageHeight: 40,
    imageClassName: "block h-9 w-9 object-contain object-left sm:h-10 sm:w-10",
    textClassName: "text-sm sm:text-base",
    gapClassName: "gap-2.5",
  };
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
  showText = true,
  textClassName = "",
}: QnLogoBaseProps) {
  const resolved = resolveLayout(layout, size);
  const sizing = getLayoutSizing(resolved, size);

  return (
    <LogoWrapper href={href} layout={resolved} className={className}>
      <span className={`inline-flex items-center ${sizing.gapClassName}`}>
        <Image
          src={LOGO_STATIC_SRC}
          alt="QRNetra logo"
          width={LOGO_INTRINSIC_WIDTH}
          height={LOGO_INTRINSIC_HEIGHT}
          priority={priority}
          sizes={
            resolved === "navbar"
              ? `(max-width: 767px) ${LOGO_HEIGHT_MOBILE}px, (max-width: 1023px) ${LOGO_HEIGHT_TABLET}px, ${LOGO_HEIGHT_DESKTOP}px`
              : `${sizing.imageWidth}px`
          }
          className={sizing.imageClassName}
        />
        {showText ? (
          <span
            className={`whitespace-nowrap font-bold leading-none tracking-tight ${
              textClassName || "text-white"
            } ${sizing.textClassName}`}
          >
            QR Netra
          </span>
        ) : null}
      </span>
    </LogoWrapper>
  );
}

export function QnLogoAnimated({
  ...props
}: QnLogoBaseProps) {
  return <QnLogoStatic {...props} />;
}

type QnLogoProps = QnLogoBaseProps & {
  variant?: "static" | "animated";
};

export function QnLogoText({ size = "md" }: { size?: LogoSize }) {
  const normalized = normalizeSize(size);
  const textSizes: Record<"sm" | "md" | "lg" | "xl", string> = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-2xl",
    xl: "text-3xl",
  };

  return (
    <span className={`font-bold tracking-tight text-white ${textSizes[normalized]}`}>
      QR Netra
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
