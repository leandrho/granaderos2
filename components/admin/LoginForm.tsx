"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  loginAction,
  type EstadoLogin,
} from "@/app/actions/admin/auth.admin.actions";
import { Campo, INPUT_CLASES } from "./form/Campo";

const estadoInicial: EstadoLogin = {};

function BotonIngresar() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-secondary px-8 py-3 font-headline text-base uppercase leading-none text-black transition-colors hover:bg-gold-glimmer disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Ingresando…" : "Ingresar"}
    </button>
  );
}

export function LoginForm() {
  const [estado, formAction] = useActionState(loginAction, estadoInicial);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {estado.error ? (
        <p
          role="alert"
          className="border border-tertiary/40 bg-tertiary/10 px-4 py-3 font-label text-sm text-on-navy"
        >
          {estado.error}
        </p>
      ) : null}

      <Campo label="Usuario" htmlFor="usuario">
        <input
          id="usuario"
          name="usuario"
          type="text"
          required
          autoComplete="username"
          placeholder="usuario"
          className={INPUT_CLASES}
        />
      </Campo>

      <Campo label="Contraseña" htmlFor="password">
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="••••••••"
          className={INPUT_CLASES}
        />
      </Campo>

      <BotonIngresar />
    </form>
  );
}
