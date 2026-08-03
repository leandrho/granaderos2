import Link from "next/link";
import Image from "next/image";
import { getEquiposAction } from "@/app/actions/admin/equipos.admin.actions";
import { eliminarEquipo } from "@/app/actions/admin/equipos.admin.actions";
import { BotonEliminar } from "@/components/admin/BotonEliminar";

export const dynamic = "force-dynamic";

export default async function AdminEquiposPage() {
  const equipos = await getEquiposAction();

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <p className="font-label text-sm uppercase tracking-[0.1em] text-gold-glimmer">
            Gestión de contenido
          </p>
          <h1 className="mt-3 font-headline text-4xl uppercase leading-none tracking-wide text-on-surface md:text-5xl">
            Equipos
          </h1>
        </div>
        <Link
          href="/admin/equipos/crear"
          className="inline-flex items-center justify-center bg-secondary px-6 py-3 font-headline text-base uppercase leading-none text-black transition-colors hover:bg-gold-glimmer"
        >
          + Nuevo equipo
        </Link>
      </header>

      <div className="mt-8 overflow-x-auto border border-white/10">
        <table className="w-full min-w-[720px] border-collapse text-left">
          <thead>
            <tr className="border-b border-white/10 bg-primary">
              {["Logo", "Nombre", "Estadio", "Ciudad", "Dirección", "Acciones"].map(
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
            {equipos.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-on-surface/60">
                  Todavía no hay equipos. Creá el primero.
                </td>
              </tr>
            ) : (
              equipos.map((equipo) => (
                <tr
                  key={equipo.id}
                  className="border-b border-white/5 transition-colors hover:bg-white/5"
                >
                  <td className="px-4 py-3">
                    {equipo.logo ? (
                      <Image
                        src={equipo.logo}
                        alt={`Escudo de ${equipo.nombre}`}
                        width={40}
                        height={40}
                        className="h-10 w-10 object-contain"
                      />
                    ) : (
                      <div className="h-10 w-10 bg-gradient-to-br from-secondary/50 to-primary" aria-hidden />
                    )}
                  </td>
                  <td className="px-4 py-3 font-headline text-sm uppercase leading-tight tracking-wide text-on-surface">
                    {equipo.nombre}
                  </td>
                  <td className="px-4 py-3 font-label text-xs uppercase tracking-wide text-on-surface/70">
                    {equipo.estadio ?? "—"}
                  </td>
                  <td className="px-4 py-3 font-label text-xs uppercase tracking-wide text-on-surface/70">
                    {equipo.ciudad ?? "—"}
                  </td>
                  <td className="max-w-56 px-4 py-3 font-label text-xs uppercase tracking-wide text-on-surface/70">
                    {equipo.direccion}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/equipos/${equipo.id}/editar`}
                        className="border border-secondary/50 px-3 py-1.5 font-label text-xs uppercase tracking-[0.1em] text-secondary transition-colors hover:bg-secondary hover:text-black"
                      >
                        Editar
                      </Link>
                      <BotonEliminar
                        id={equipo.id}
                        eliminar={eliminarEquipo}
                        nombre="este equipo"
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
