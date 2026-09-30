"use client";

import { useEffect } from "react";

interface ToastProps {
  mensaje: string;
  visible: boolean;
  onDescartar: () => void;
  duracion?: number;
}

export function Toast({ mensaje, visible, onDescartar, duracion = 4000 }: ToastProps) {
  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(onDescartar, duracion);
    return () => clearTimeout(timer);
  }, [visible, duracion, onDescartar]);

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed right-6 top-6 z-50 flex items-center gap-3 border border-line/15 border-l-4 border-l-success bg-surface px-6 py-4 shadow-lg"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        fill="none"
        className="h-5 w-5 shrink-0 text-success"
      >
        <path
          d="M4 10.5l4 4 8-9"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="square"
        />
      </svg>
      <p className="font-label text-sm uppercase tracking-[0.1em] text-on-surface">
        {mensaje}
      </p>
    </div>
  );
}
