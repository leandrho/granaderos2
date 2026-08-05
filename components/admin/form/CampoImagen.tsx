"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { INPUT_CLASES } from "./Campo";

interface CampoImagenProps {
  nombre: string;
  etiqueta: string;
  htmlFor: string;
  valorActual: string;
  aceptar: string;
  permitidos: string;
  error?: string;
  errorImagen?: string;
}

export function CampoImagen({
  nombre,
  etiqueta,
  htmlFor,
  valorActual,
  aceptar,
  permitidos,
  error,
  errorImagen,
}: CampoImagenProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const archivoNombre = `${nombre}File`;
  const quitarNombre = `quitar${nombre[0].toUpperCase()}${nombre.slice(1)}`;

  const mensajeError = error ?? errorImagen;

  return (
    <div className="flex flex-col gap-2">
      <span className="font-label text-xs uppercase tracking-[0.1em] text-on-navy/70">
        {etiqueta}
      </span>

      {valorActual ? (
        <div className="flex items-center gap-3">
          <Image
            src={valorActual}
            alt="Imagen actual"
            width={80}
            height={80}
            className="h-20 w-20 border border-line/15 bg-surface object-contain p-1"
          />
          <input
            id={htmlFor}
            name={nombre}
            type="text"
            defaultValue={valorActual}
            placeholder="/news/imagen.jpg"
            className={INPUT_CLASES}
          />
        </div>
      ) : null}

      <input
        type="file"
        name={archivoNombre}
        accept={aceptar}
        onChange={(e) => {
          const archivo = e.target.files?.[0];
          setPreviewUrl(archivo ? URL.createObjectURL(archivo) : null);
        }}
        className="block w-full border border-line/15 bg-surface px-4 py-3 text-sm text-on-surface/70 file:mr-4 file:border-0 file:bg-secondary/20 file:px-4 file:py-2 file:font-label file:text-xs file:uppercase file:tracking-[0.1em] file:text-secondary"
      />

      {previewUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={previewUrl}
          alt="Vista previa del nuevo archivo"
          className="h-24 w-24 border border-secondary/50 bg-surface object-contain p-1"
        />
      ) : null}

      <p className="font-label text-xs text-on-navy/40">
        Formato: {permitidos} · Máx. 2 MB
      </p>

      {valorActual ? (
        <label className="flex w-fit cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            name={quitarNombre}
            className="h-5 w-5 accent-[#c5a059]"
          />
          <span className="font-label text-xs uppercase tracking-[0.1em] text-on-navy/70">
            Quitar imagen
          </span>
        </label>
      ) : null}

      {mensajeError ? (
        <p role="alert" className="font-label text-xs text-tertiary">
          {mensajeError}
        </p>
      ) : null}
    </div>
  );
}
