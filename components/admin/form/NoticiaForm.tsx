"use client";

import { useActionState, useState } from "react";
import {
  actualizarNoticia,
  crearNoticia,
  type EstadoNoticia,
} from "@/app/actions/admin/noticias.admin.actions";
import { slugificar } from "@/lib/utils/slug";
import { aValorInputDatetimeLocal } from "@/lib/utils/date";
import { Campo, INPUT_CLASES, TEXTAREA_CLASES } from "./Campo";
import { CampoImagen } from "./CampoImagen";
import { BotonEnviar } from "./BotonEnviar";

interface NoticiaFormProps {
  id?: number;
  valoresIniciales?: {
    titulo: string;
    slug: string;
    descripcionBreve: string;
    descripcionDetalle: string;
    imagen: string;
    categoria: string;
    publicado: boolean;
    fecha: Date;
  };
}

const estadoInicial: EstadoNoticia = {};

export function NoticiaForm({ id, valoresIniciales }: NoticiaFormProps) {
  const accion = id ? actualizarNoticia.bind(null, id) : crearNoticia;
  const [estado, formAction] = useActionState(accion, estadoInicial);

  const [titulo, setTitulo] = useState(valoresIniciales?.titulo ?? "");
  const [slug, setSlug] = useState(valoresIniciales?.slug ?? "");
  const [slugManual, setSlugManual] = useState(Boolean(valoresIniciales));

  const slugVisible = slugManual ? slug : slugificar(titulo);

  const errores = estado.errores ?? {};

  return (
    <form action={formAction} encType="multipart/form-data" className="flex flex-col gap-5">
      <div className="grid gap-5 md:grid-cols-2">
        <Campo label="Título *" htmlFor="titulo" error={errores.titulo?.[0]}>
          <input
            id="titulo"
            name="titulo"
            type="text"
            required
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Título de la noticia"
            className={INPUT_CLASES}
          />
        </Campo>

        <Campo label="Slug *" htmlFor="slug" error={errores.slug?.[0]}>
          <input
            id="slug"
            name="slug"
            type="text"
            required
            value={slugVisible}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugManual(true);
            }}
            placeholder="nueva-noticia"
            className={INPUT_CLASES}
          />
        </Campo>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Campo label="Categoría *" htmlFor="categoria" error={errores.categoria?.[0]}>
          <input
            id="categoria"
            name="categoria"
            type="text"
            required
            defaultValue={valoresIniciales?.categoria}
            placeholder="Primera"
            className={INPUT_CLASES}
          />
        </Campo>

        <Campo label="Fecha *" htmlFor="fecha" error={errores.fecha?.[0]}>
          <input
            id="fecha"
            name="fecha"
            type="datetime-local"
            required
            defaultValue={valoresIniciales ? aValorInputDatetimeLocal(valoresIniciales.fecha) : undefined}
            className={INPUT_CLASES}
          />
        </Campo>
      </div>

      <CampoImagen
        nombre="imagen"
        etiqueta="Imagen"
        htmlFor="imagen"
        valorActual={valoresIniciales?.imagen ?? ""}
        aceptar="image/jpeg,image/png,image/webp,image/avif"
        permitidos="jpg, png, webp, avif"
        error={errores.imagen?.[0]}
        errorImagen={estado.errorImagen}
      />

      <Campo
        label="Descripción breve *"
        htmlFor="descripcionBreve"
        error={errores.descripcionBreve?.[0]}
      >
        <textarea
          id="descripcionBreve"
          name="descripcionBreve"
          required
          maxLength={250}
          defaultValue={valoresIniciales?.descripcionBreve}
          placeholder="Resumen corto para la lista de noticias (máx. 250 caracteres)"
          className={TEXTAREA_CLASES}
        />
      </Campo>

      <Campo
        label="Descripción detallada *"
        htmlFor="descripcionDetalle"
        error={errores.descripcionDetalle?.[0]}
      >
        <textarea
          id="descripcionDetalle"
          name="descripcionDetalle"
          required
          minLength={10}
          defaultValue={valoresIniciales?.descripcionDetalle}
          placeholder="Texto completo de la noticia (mín. 10 caracteres)"
          className={`${TEXTAREA_CLASES} min-h-40`}
        />
      </Campo>

      <label className="flex w-fit cursor-pointer items-center gap-3">
        <input
          type="checkbox"
          name="publicado"
          defaultChecked={valoresIniciales?.publicado ?? true}
          className="h-5 w-5 accent-[#c5a059]"
        />
        <span className="font-label text-xs uppercase tracking-[0.1em] text-on-navy/70">
          Publicado
        </span>
      </label>

      {estado.error ? (
        <p role="alert" className="border border-tertiary/50 bg-tertiary/10 px-4 py-3 font-label text-sm text-tertiary">
          {estado.error}
        </p>
      ) : null}

      <div className="mt-2">
        <BotonEnviar>{id ? "Guardar cambios" : "Crear noticia"}</BotonEnviar>
      </div>
    </form>
  );
}
