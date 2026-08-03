import Link from "next/link";
import type { MouseEventHandler, ReactNode } from "react";

type Variante = "primary" | "outline";
type Tamano = "sm" | "md" | "lg" | "xl";

interface ButtonProps {
  href?: string;
  variant?: Variante;
  size?: Tamano;
  className?: string;
  onClick?: MouseEventHandler;
  children: ReactNode;
}

const TAMANOS: Record<Tamano, string> = {
  sm: "px-5 py-2 text-sm",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
  xl: "px-10 py-4 text-base",
};

const CLIP_PRIMARIO: Record<Tamano, string> = {
  sm: "[clip-path:polygon(0_0,calc(100%-10px)_0,100%_100%,0_100%)]",
  md: "[clip-path:polygon(0_0,calc(100%-12px)_0,100%_100%,0_100%)]",
  lg: "[clip-path:polygon(0_0,calc(100%-14px)_0,100%_100%,0_100%)]",
  xl: "[clip-path:polygon(0_0,calc(100%-14px)_0,100%_100%,0_100%)]",
};

const VARIANTES: Record<Variante, string> = {
  primary:
    "bg-secondary font-headline text-black uppercase leading-none transition-colors hover:bg-gold-glimmer",
  outline:
    "border-2 border-white font-headline text-on-surface uppercase leading-none transition-colors hover:bg-white hover:text-primary",
};

export function Button({
  href,
  variant = "primary",
  size = "lg",
  className = "",
  onClick,
  children,
}: ButtonProps) {
  const clip = variant === "primary" ? CLIP_PRIMARIO[size] : "";
  const clases = `${TAMANOS[size]} ${VARIANTES[variant]} ${clip} text-center ${className}`;

  if (!href) {
    return (
      <button type="button" onClick={onClick} className={clases}>
        {children}
      </button>
    );
  }

  if (href.startsWith("/")) {
    return (
      <Link href={href} onClick={onClick} className={clases}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} onClick={onClick} className={clases}>
      {children}
    </a>
  );
}
