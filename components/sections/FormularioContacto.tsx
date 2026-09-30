"use client";

import { useState } from "react";
import { ContactoSchema } from "@/application/dtos/contacto";
import { Toast } from "@/components/ui/Toast";

const ERRORES_INICIALES = {
  nombre: "",
  email: "",
  telefono: "",
  mensaje: "",
};

type Errores = typeof ERRORES_INICIALES;

const INPUT_CLASES =
  "w-full border border-line/15 bg-surface px-4 py-3 text-sm text-on-surface placeholder:text-on-surface/40 outline-none transition-colors focus:border-secondary";

export function FormularioContacto() {
  const [valores, setValores] = useState({
    nombre: "",
    email: "",
    telefono: "",
    mensaje: "",
  });
  const [errores, setErrores] = useState<Errores>(ERRORES_INICIALES);
  const [toastVisible, setToastVisible] = useState(false);

  function actualizar(campo: keyof Errores, valor: string) {
    setValores((prev) => ({ ...prev, [campo]: valor }));
    if (errores[campo]) {
      setErrores((prev) => ({ ...prev, [campo]: "" }));
    }
  }

  function alEnviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const resultado = ContactoSchema.safeParse(valores);
    if (!resultado.success) {
      const nuevos: Errores = { ...ERRORES_INICIALES };
      for (const problema of resultado.error.issues) {
        const campo = problema.path[0];
        if (campo === "nombre" || campo === "email" || campo === "telefono" || campo === "mensaje") {
          if (!nuevos[campo]) nuevos[campo] = problema.message;
        }
      }
      setErrores(nuevos);
      return;
    }

    setToastVisible(true);
    setValores({ nombre: "", email: "", telefono: "", mensaje: "" });
    setErrores(ERRORES_INICIALES);
  }

  return (
    <form onSubmit={alEnviar} noValidate className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="contacto-nombre"
          className="font-label text-xs uppercase tracking-[0.1em] text-on-surface/70"
        >
          Nombre
        </label>
        <input
          id="contacto-nombre"
          type="text"
          value={valores.nombre}
          onChange={(e) => actualizar("nombre", e.target.value)}
          placeholder="Tu nombre"
          aria-invalid={Boolean(errores.nombre)}
          className={INPUT_CLASES}
        />
        {errores.nombre ? (
          <p role="alert" className="font-label text-xs text-tertiary">
            {errores.nombre}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="contacto-email"
          className="font-label text-xs uppercase tracking-[0.1em] text-on-surface/70"
        >
          Email
        </label>
        <input
          id="contacto-email"
          type="email"
          value={valores.email}
          onChange={(e) => actualizar("email", e.target.value)}
          placeholder="tu@email.com"
          aria-invalid={Boolean(errores.email)}
          className={INPUT_CLASES}
        />
        {errores.email ? (
          <p role="alert" className="font-label text-xs text-tertiary">
            {errores.email}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="contacto-telefono"
          className="font-label text-xs uppercase tracking-[0.1em] text-on-surface/70"
        >
          Teléfono (opcional)
        </label>
        <input
          id="contacto-telefono"
          type="tel"
          value={valores.telefono}
          onChange={(e) => actualizar("telefono", e.target.value)}
          placeholder="+54 2664 000000"
          aria-invalid={Boolean(errores.telefono)}
          className={INPUT_CLASES}
        />
        {errores.telefono ? (
          <p role="alert" className="font-label text-xs text-tertiary">
            {errores.telefono}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="contacto-mensaje"
          className="font-label text-xs uppercase tracking-[0.1em] text-on-surface/70"
        >
          Mensaje
        </label>
        <textarea
          id="contacto-mensaje"
          value={valores.mensaje}
          onChange={(e) => actualizar("mensaje", e.target.value)}
          placeholder="Escribinos tu mensaje"
          aria-invalid={Boolean(errores.mensaje)}
          className={`${INPUT_CLASES} min-h-28 resize-y`}
        />
        {errores.mensaje ? (
          <p role="alert" className="font-label text-xs text-tertiary">
            {errores.mensaje}
          </p>
        ) : null}
      </div>

      <button
        type="submit"
        className="bg-secondary px-8 py-4 font-headline text-base uppercase leading-none text-black transition-colors hover:bg-gold-glimmer [clip-path:polygon(0_0,calc(100%-14px)_0,100%_100%,0_100%)]"
      >
        Enviar mensaje
      </button>

      <Toast
        mensaje="¡Mensaje enviado!"
        visible={toastVisible}
        onDescartar={() => setToastVisible(false)}
      />
    </form>
  );
}
