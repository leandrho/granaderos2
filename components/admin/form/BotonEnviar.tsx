"use client";

import { useFormStatus } from "react-dom";

interface BotonEnviarProps {
  children: React.ReactNode;
  pendienteLabel?: string;
}

export function BotonEnviar({
  children,
  pendienteLabel = "Guardando…",
}: BotonEnviarProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex w-fit items-center justify-center bg-secondary px-8 py-3 font-headline text-base uppercase leading-none text-black transition-colors hover:bg-gold-glimmer disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? pendienteLabel : children}
    </button>
  );
}
