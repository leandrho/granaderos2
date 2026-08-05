"use client";

import { useSyncExternalStore } from "react";

type Tema = "light" | "dark" | "system";
type Variante = "surface" | "navy";

const CLAVE_TEMA = "grana-theme";
const EVENTO_TEMA = "grana-theme-change";

const CICLO: Tema[] = ["light", "dark", "system"];

const ETIQUETAS: Record<Tema, string> = {
  light: "Claro",
  dark: "Oscuro",
  system: "Sistema",
};

const VARIANTES: Record<Variante, string> = {
  surface: "text-on-surface hover:text-gold",
  navy: "text-gold-glimmer hover:text-on-navy",
};

function aplicarTema(tema: Tema) {
  const oscuro =
    tema === "dark" ||
    (tema !== "light" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  const resuelto = oscuro ? "dark" : "light";
  const raiz = document.documentElement;
  raiz.setAttribute("data-theme", resuelto);
  raiz.style.colorScheme = resuelto;
}

function leerTema(): Tema {
  try {
    const valor = localStorage.getItem(CLAVE_TEMA);
    if (valor === "light" || valor === "dark" || valor === "system") {
      return valor;
    }
  } catch {
    // localStorage no disponible
  }
  return "system";
}

function suscribirse(notificar: () => void) {
  window.addEventListener("storage", notificar);
  window.addEventListener(EVENTO_TEMA, notificar);
  return () => {
    window.removeEventListener("storage", notificar);
    window.removeEventListener(EVENTO_TEMA, notificar);
  };
}

function IconoTema({ tema }: { tema: Tema }) {
  if (tema === "light") {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
    );
  }

  if (tema === "dark") {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <rect x="2" y="3" width="20" height="14" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  );
}

export function ThemeToggle({ variante = "surface" }: { variante?: Variante }) {
  const tema = useSyncExternalStore(suscribirse, leerTema, () => "system" as Tema);

  const alClic = () => {
    const indice = CICLO.indexOf(tema);
    const siguiente = CICLO[(indice + 1) % CICLO.length];
    try {
      localStorage.setItem(CLAVE_TEMA, siguiente);
    } catch {
      // localStorage no disponible
    }
    aplicarTema(siguiente);
    window.dispatchEvent(new Event(EVENTO_TEMA));
  };

  const etiqueta = `Cambiar tema: ${ETIQUETAS[tema]}`;

  return (
    <button
      type="button"
      onClick={alClic}
      aria-label={etiqueta}
      title={etiqueta}
      className={`flex h-10 w-10 items-center justify-center transition-colors ${VARIANTES[variante]}`}
    >
      <IconoTema tema={tema} />
    </button>
  );
}
