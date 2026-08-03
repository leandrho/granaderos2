import type { ReactNode } from "react";

type Alineacion = "left" | "center";
type Tamano = "sm" | "md" | "lg";

interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  align?: Alineacion;
  size?: Tamano;
  className?: string;
}

const TITULO_TAMANOS: Record<Tamano, string> = {
  sm: "mt-3 text-3xl md:text-4xl",
  md: "mt-4 text-4xl md:text-5xl",
  lg: "mt-4 text-4xl md:text-6xl",
};

export function SectionHeading({
  eyebrow,
  title,
  align = "left",
  size = "lg",
  className = "",
}: SectionHeadingProps) {
  const alineacion = align === "center" ? "text-center" : "";

  return (
    <div className={`${alineacion} ${className}`}>
      <p className="font-label text-sm uppercase tracking-[0.1em] text-gold-glimmer">
        {eyebrow}
      </p>
      <h2
        className={`${TITULO_TAMANOS[size]} font-headline uppercase leading-none tracking-wide text-on-surface`}
      >
        {title}
      </h2>
    </div>
  );
}
