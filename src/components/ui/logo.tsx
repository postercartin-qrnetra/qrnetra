import Link from "next/link";

type QnLogoProps = {
  className?: string;
  href?: string;
  size?: "sm" | "md" | "lg";
};

const sizes = {
  sm: "text-base",
  md: "text-lg sm:text-xl",
  lg: "text-2xl",
};

export function QnLogo({ className = "", href = "/", size = "md" }: QnLogoProps) {
  const inner = (
    <span
      className={`font-extrabold tracking-tight ${sizes[size]} ${className}`}
    >
      <span className="text-white">QR</span>
      <span className="text-qn-accent">Netra</span>
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block">
        {inner}
      </Link>
    );
  }

  return inner;
}
