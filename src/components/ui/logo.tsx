import Image from "next/image";
import Link from "next/link";
import { LOGO_ANIMATED_SRC, LOGO_STATIC_SRC } from "@/lib/brand";

type LogoSize = "sm" | "md" | "lg" | "xl";

const heights: Record<LogoSize, number> = {
  sm: 32,
  md: 40,
  lg: 48,
  xl: 56,
};

type QnLogoBaseProps = {
  className?: string;
  href?: string;
  size?: LogoSize;
  priority?: boolean;
};

function logoDimensions(size: LogoSize) {
  const h = heights[size];
  return { height: h, width: Math.round(h * 2.8) };
}

export function QnLogoStatic({
  className = "",
  href = "/",
  size = "md",
  priority = false,
}: QnLogoBaseProps) {
  const { height, width } = logoDimensions(size);
  const img = (
    <Image
      src={LOGO_STATIC_SRC}
      alt="QRNetra"
      width={width}
      height={height}
      priority={priority}
      className={`h-auto w-auto object-contain ${className}`}
      style={{ maxHeight: height }}
    />
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex shrink-0 items-center">
        {img}
      </Link>
    );
  }

  return img;
}

export function QnLogoAnimated({
  className = "",
  href = "/",
  size = "md",
}: QnLogoBaseProps) {
  const { height, width } = logoDimensions(size);
  const video = (
    <video
      autoPlay
      loop
      muted
      playsInline
      preload="metadata"
      aria-label="QRNetra"
      className={`pointer-events-none object-contain ${className}`}
      style={{ maxHeight: height, width, height }}
    >
      <source src={LOGO_ANIMATED_SRC} type="video/mp4" />
    </video>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex shrink-0 items-center">
        {video}
      </Link>
    );
  }

  return video;
}

type QnLogoProps = QnLogoBaseProps & {
  variant?: "static" | "animated";
};

/** Static wordmark fallback when image assets fail */
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

export function QnLogo({
  variant = "static",
  ...props
}: QnLogoProps) {
  if (variant === "animated") {
    return <QnLogoAnimated {...props} />;
  }
  return <QnLogoStatic {...props} />;
}
