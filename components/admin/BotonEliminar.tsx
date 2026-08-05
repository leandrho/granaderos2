"use client";

import { useState, useTransition } from "react";

interface BotonEliminarProps {
  id: number;
  eliminar: (id: number) => Promise<void>;
  nombre: string;
}

export function BotonEliminar({ id, eliminar, nombre }: BotonEliminarProps) {
  const [abierto, setAbierto] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendiente, iniciarTransicion] = useTransition();

  const confirmar = () => {
    setError(null);
    iniciarTransicion(async () => {
      try {
        await eliminar(id);
      } catch {
        setError("No se pudo eliminar. Intentá de nuevo.");
      }
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setAbierto(true)}
        className="border border-tertiary/50 px-3 py-1.5 font-label text-xs uppercase tracking-[0.1em] text-tertiary transition-colors hover:bg-tertiary hover:text-white"
      >
        Eliminar
      </button>

      {abierto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="titulo-modal-eliminar"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
        >
          <div className="w-full max-w-md border border-line/15 bg-primary p-8">
            <h2
              id="titulo-modal-eliminar"
              className="font-headline text-2xl uppercase leading-none tracking-wide text-on-navy"
            >
              ¿Eliminar {nombre}?
            </h2>
            <p className="mt-3 text-sm leading-6 text-on-navy/70">
              Esta acción es permanente y no se puede deshacer.
            </p>

            {error ? (
              <p role="alert" className="mt-4 font-label text-xs text-tertiary">
                {error}
              </p>
            ) : null}

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setAbierto(false)}
                disabled={pendiente}
                className="border border-line/25 px-5 py-2.5 font-headline text-sm uppercase leading-none text-on-navy transition-colors hover:bg-on-surface/10 disabled:opacity-60"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmar}
                disabled={pendiente}
                className="bg-tertiary px-5 py-2.5 font-headline text-sm uppercase leading-none text-white transition-colors hover:bg-tertiary/80 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {pendiente ? "Eliminando…" : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
