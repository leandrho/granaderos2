import Link from "next/link";
import { getEventosAction } from "@/app/actions/admin/calendario.admin.actions";
import { eliminarEvento } from "@/app/actions/admin/calendario.admin.actions";
import { BotonEliminar } from "@/components/admin/BotonEliminar";
import { Badge } from "@/components/ui/Badge";
import { formatearFechaCorta } from "@/lib/utils/date";

export const dynamic = "force-dynamic";

export default async function AdminCalendarioPage() {
  const eventos = await getEventosAction();

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <p className="font-label text-sm uppercase tracking-[0.1em] text-gold-glimmer">
            Gestión de contenido
          </p>
          <h1 className="mt-3 font-headline text-4xl uppercase leading-none tracking-wide text-on-surface md:text-5xl">
            Calendario
          </h1>
        </div>
        <Link
          href="/admin/calendario/crear"
          className="inline-flex items-center justify-center bg-secondary px-6 py-3 font-headline text-base uppercase leading-none text-black transition-colors hover:bg-gold-glimmer"
        >
          + Nuevo evento
        </Link>
      </header>

      <div className="mt-8 overflow-x-auto border border-white/10">
        <table className="w-full min-w-[720px] border-collapse text-left">
          <thead>
            <tr className="border-b border-white/10 bg-primary">
              {["Encuentro", "Categoría", "Ubicación", "Fecha", "Publicado", "Acciones"].map(
                (encabezado) => (
                  <th
                    key={encabezado}
                    scope="col"
                    className="px-4 py-3 font-label text-xs uppercase tracking-[0.1em] text-on-surface/60"
                  >
                    {encabezado}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {eventos.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-on-surface/60">
                  Todavía no hay eventos. Creá el primero.
                </td>
              </tr>
            ) : (
              eventos.map((evento) => (
                <tr
                  key={evento.id}
                  className="border-b border-white/5 transition-colors hover:bg-white/5"
                >
                  <td className="px-4 py-3">
                    <p className="font-headline text-sm uppercase leading-tight tracking-wide text-on-surface">
                      {evento.equipo1.nombre}
                      <span className="mx-2 text-secondary">vs</span>
                      {evento.equipo2.nombre}
                    </p>
                    <p className="mt-1 font-label text-xs uppercase tracking-wide text-on-surface/50">
                      {evento.descripcionBreve}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <Badge>{evento.categoria}</Badge>
                  </td>
                  <td className="max-w-56 px-4 py-3 font-label text-xs uppercase tracking-wide text-on-surface/70">
                    {evento.ubicacion}
                  </td>
                  <td className="px-4 py-3 font-label text-xs uppercase tracking-wide text-on-surface/70">
                    {formatearFechaCorta(evento.fecha)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 font-label text-xs uppercase tracking-wide ${
                        evento.publicado ? "bg-secondary text-black" : "bg-white/10 text-on-surface/60"
                      }`}
                    >
                      {evento.publicado ? "Sí" : "No"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/calendario/${evento.id}/editar`}
                        className="border border-secondary/50 px-3 py-1.5 font-label text-xs uppercase tracking-[0.1em] text-secondary transition-colors hover:bg-secondary hover:text-black"
                      >
                        Editar
                      </Link>
                      <BotonEliminar
                        id={evento.id}
                        eliminar={eliminarEvento}
                        nombre="este evento"
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
