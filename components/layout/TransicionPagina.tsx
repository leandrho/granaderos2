/// <reference types="react/canary" />

"use client";

import { usePathname } from "next/navigation";
import { ViewTransition, type ReactNode } from "react";

export function TransicionPagina({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <ViewTransition
      key={pathname}
      name="contenido-pagina"
      share="page-transition"
      enter="page-transition"
      default="none"
    >
      {children}
    </ViewTransition>
  );
}
