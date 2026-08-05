import type { ReactNode } from "react";

type Alineacion = "left" | "center";
type Tamano = "sm" | "md" | "lg";
type Tono = "surface" | "navy";

interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  align?: Alineacion;
  size?: Tamano;
  tono?: Tono;
  className?: string;
}

const TITULO_TAMANOS: Record<Tamano, string> = {
  sm: "mt-3 text-3xl md:text-4xl",
  md: "mt-4 text-4xl md:text-5xl",
  lg: "mt-4 text-4xl md:text-6xl",
};

const EYEBROW_TONOS: Record<Tono, string> = {
  surface: "text-gold",
  navy: "text-gold-glimmer",
};

const TITULO_TONOS: Record<Tono, string> = {
  surface: "text-on-surface",
  navy: "text-on-navy",
};

export function SectionHeading({
  eyebrow,
  title,
  align = "left",
  size = "lg",
  tono = "surface",
  className = "",
}: SectionHeadingProps) {
  const alineacion = align === "center" ? "text-center" : "";

  return (
    <div className={`${alineacion} ${className}`}>
      <p
        className={`font-label text-sm uppercase tracking-[0.1em] ${EYEBROW_TONOS[tono]}`}
      >
        {eyebrow}
      </p>
      <h2
        className={`${TITULO_TAMANOS[size]} font-headline uppercase leading-none tracking-wide ${TITULO_TONOS[tono]}`}
      >
        {title}
      </h2>
    </div>
  );
}
