"use client";

import { useActionState, useState } from "react";
import {
  actualizarEvento,
  crearEvento,
  type EstadoEvento,
} from "@/app/actions/admin/calendario.admin.actions";
import { aValorInputDatetimeLocal } from "@/lib/utils/date";
import { Campo, INPUT_CLASES, TEXTAREA_CLASES } from "./Campo";
import { BotonEnviar } from "./BotonEnviar";

interface EquipoSelect {
  id: number;
  nombre: string;
  direccion: string;
}

interface EventoFormProps {
  id?: number;
  equipos: EquipoSelect[];
  valoresIniciales?: {
    equipo1Id: number;
    equipo2Id: number;
    ubicacion: string;
    descripcionBreve: string | null | undefined;
    descripcionDetalle: string | null | undefined;
    imagen: string | null | undefined;
    categoria: string;
    publicado: boolean;
    fecha: Date;
  };
}

const estadoInicial: EstadoEvento = {};

function SelectEquipo({
  id,
  nombre,
  requerido,
  error,
  valorInicial,
  equipos,
  onCambio,
}: {
  id: string;
  nombre: string;
  requerido: boolean;
  error?: string;
  valorInicial?: number;
  equipos: EquipoSelect[];
  onCambio?: (valor: string) => void;
}) {
  return (
    <Campo label={`${nombre} *`} htmlFor={id} error={error}>
      <select
        id={id}
        name={id}
        required={requerido}
        defaultValue={valorInicial ?? ""}
        onChange={onCambio ? (e) => onCambio(e.target.value) : undefined}
        className={INPUT_CLASES}
      >
        <option value="" disabled>
          Seleccioná un equipo…
        </option>
        {equipos.map((equipo) => (
          <option key={equipo.id} value={equipo.id}>
            {equipo.nombre}
          </option>
        ))}
      </select>
    </Campo>
  );
}

export function EventoForm({ id, equipos, valoresIniciales }: EventoFormProps) {
  const accion = id ? actualizarEvento.bind(null, id) : crearEvento;
  const [estado, formAction] = useActionState(accion, estadoInicial);

  const [ubicacion, setUbicacion] = useState(valoresIniciales?.ubicacion ?? "");

  const errores = estado.errores ?? {};

  const precargarUbicacion = (idEquipoLocal: string) => {
    setUbicacion((anterior) => {
      if (anterior.trim() !== "") return anterior;
      const equipo = equipos.find(
        (e) => String(e.id) === idEquipoLocal
      );
      return equipo?.direccion || anterior;
    });
  };

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="grid gap-5 md:grid-cols-2">
        <SelectEquipo
          id="equipo1Id"
          nombre="Equipo local"
          requerido
          error={errores.equipo1Id?.[0]}
          valorInicial={valoresIniciales?.equipo1Id}
          equipos={equipos}
          onCambio={precargarUbicacion}
        />
        <SelectEquipo
          id="equipo2Id"
          nombre="Equipo visitante"
          requerido
          error={errores.equipo2Id?.[0]}
          valorInicial={valoresIniciales?.equipo2Id}
          equipos={equipos}
        />
      </div>

      <div className="grid gap-5 md:grid-cols-3">
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

        <Campo label="Ubicación *" htmlFor="ubicacion" error={errores.ubicacion?.[0]}>
          <input
            id="ubicacion"
            name="ubicacion"
            type="text"
            required
            value={ubicacion}
            onChange={(e) => setUbicacion(e.target.value)}
            placeholder="Estadio de Granaderos, Juana Koslay"
            className={INPUT_CLASES}
          />
        </Campo>
      </div>

      <Campo label="Descripción breve" htmlFor="descripcionBreve" error={errores.descripcionBreve?.[0]}>
        <input
          id="descripcionBreve"
          name="descripcionBreve"
          type="text"
          defaultValue={valoresIniciales?.descripcionBreve ?? ""}
          placeholder="Liga Sanluiseña de Fútbol · 16:30 hs"
          className={INPUT_CLASES}
        />
      </Campo>

      <Campo label="Descripción detallada" htmlFor="descripcionDetalle" error={errores.descripcionDetalle?.[0]}>
        <textarea
          id="descripcionDetalle"
          name="descripcionDetalle"
          defaultValue={valoresIniciales?.descripcionDetalle ?? ""}
          placeholder="Detalles del evento (opcional)"
          className={TEXTAREA_CLASES}
        />
      </Campo>

      <Campo label="Imagen" htmlFor="imagen" error={errores.imagen?.[0]}>
        <input
          id="imagen"
          name="imagen"
          type="text"
          defaultValue={valoresIniciales?.imagen ?? ""}
          placeholder="/news/imagen.jpg"
          className={INPUT_CLASES}
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
        <BotonEnviar>{id ? "Guardar cambios" : "Crear evento"}</BotonEnviar>
      </div>
    </form>
  );
}
