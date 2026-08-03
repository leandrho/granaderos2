"use client";

import { useActionState } from "react";
import {
  actualizarEquipo,
  crearEquipo,
  type EstadoEquipo,
} from "@/app/actions/admin/equipos.admin.actions";
import { Campo, INPUT_CLASES } from "./Campo";
import { CampoImagen } from "./CampoImagen";
import { BotonEnviar } from "./BotonEnviar";

interface EquipoFormProps {
  id?: number;
  valoresIniciales?: {
    nombre: string;
    direccion: string;
    logo: string | null;
    ciudad: string | null;
    estadio: string | null;
  };
}

const estadoInicial: EstadoEquipo = {};

export function EquipoForm({ id, valoresIniciales }: EquipoFormProps) {
  const accion = id ? actualizarEquipo.bind(null, id) : crearEquipo;
  const [estado, formAction] = useActionState(accion, estadoInicial);

  const errores = estado.errores ?? {};

  return (
    <form action={formAction} encType="multipart/form-data" className="flex flex-col gap-5">
      <div className="grid gap-5 md:grid-cols-2">
        <Campo label="Nombre *" htmlFor="nombre" error={errores.nombre?.[0]}>
          <input
            id="nombre"
            name="nombre"
            type="text"
            required
            defaultValue={valoresIniciales?.nombre}
            placeholder="Nombre del equipo"
            className={INPUT_CLASES}
          />
        </Campo>

        <Campo label="Ciudad" htmlFor="ciudad" error={errores.ciudad?.[0]}>
          <input
            id="ciudad"
            name="ciudad"
            type="text"
            defaultValue={valoresIniciales?.ciudad ?? ""}
            placeholder="San Luis"
            className={INPUT_CLASES}
          />
        </Campo>
      </div>

      <Campo label="Dirección *" htmlFor="direccion" error={errores.direccion?.[0]}>
        <input
          id="direccion"
          name="direccion"
          type="text"
          required
          defaultValue={valoresIniciales?.direccion}
          placeholder="Av. de la Ribera s/n, El Volcán"
          className={INPUT_CLASES}
        />
      </Campo>

      <div className="grid gap-5 md:grid-cols-2">
        <Campo label="Estadio" htmlFor="estadio" error={errores.estadio?.[0]}>
          <input
            id="estadio"
            name="estadio"
            type="text"
            defaultValue={valoresIniciales?.estadio ?? ""}
            placeholder="Estadio de Granaderos de Koslay"
            className={INPUT_CLASES}
          />
        </Campo>

        <CampoImagen
          nombre="logo"
          etiqueta="Logo"
          htmlFor="logo"
          valorActual={valoresIniciales?.logo ?? ""}
          aceptar="image/png,image/webp"
          permitidos="png, webp"
          error={errores.logo?.[0]}
          errorImagen={estado.errorImagen}
        />
      </div>

      {estado.error ? (
        <p role="alert" className="border border-tertiary/50 bg-tertiary/10 px-4 py-3 font-label text-sm text-tertiary">
          {estado.error}
        </p>
      ) : null}

      <div className="mt-2">
        <BotonEnviar>{id ? "Guardar cambios" : "Crear equipo"}</BotonEnviar>
      </div>
    </form>
  );
}
