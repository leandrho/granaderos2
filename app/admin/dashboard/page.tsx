import Link from "next/link";
import { PrismaNoticiaRepository } from "@/infrastructure/repositories/PrismaNoticiaRepository";
import { PrismaEventoCalendarioRepository } from "@/infrastructure/repositories/PrismaEventoCalendarioRepository";
import { PrismaEquipoRepository } from "@/infrastructure/repositories/PrismaEquipoRepository";
import { formatearFechaCorta } from "@/lib/utils/date";

const TITULOS: Record<string, string> = {
  noticias: "Noticias",
  calendario: "Calendario",
  equipos: "Equipos",
};

const RUTAS: Record<string, string> = {
  noticias: "/admin/noticias",
  calendario: "/admin/calendario",
  equipos: "/admin/equipos",
};

function obtenerProximoEvento<T extends { publicado: boolean; fecha: Date }>(
  eventos: T[]
): T | undefined {
  const ahora = Date.now();
  return eventos
    .filter((e) => e.publicado && e.fecha.getTime() >= ahora)
    .sort((a, b) => a.fecha.getTime() - b.fecha.getTime())[0];
}

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [noticias, eventos, equipos] = await Promise.all([
    new PrismaNoticiaRepository().obtenerTodas(false),
    new PrismaEventoCalendarioRepository().obtenerTodos(false),
    new PrismaEquipoRepository().obtenerTodos(),
  ]);

  const totales = [
    { clave: "noticias", cantidad: noticias.length, detalle: `${noticias.filter((n) => n.publicado).length} publicadas` },
    { clave: "calendario", cantidad: eventos.length, detalle: `${eventos.filter((e) => e.publicado).length} publicados` },
    { clave: "equipos", cantidad: equipos.length, detalle: `${equipos.length} registrados` },
  ];

  const proximoEvento = obtenerProximoEvento(eventos);

  return (
    <div>
      <header className="border-b border-line/10 pb-6">
        <p className="font-label text-sm uppercase tracking-[0.1em] text-gold">
          Panel de administración
        </p>
        <h1 className="mt-3 font-headline text-4xl uppercase leading-none tracking-wide text-on-surface md:text-5xl">
          Dashboard
        </h1>
      </header>

      <section className="mt-8 grid gap-4 md:grid-cols-3" aria-label="Totales">
        {totales.map(({ clave, cantidad, detalle }) => (
          <Link
            key={clave}
            href={RUTAS[clave]}
            className="group border border-line/10 bg-primary p-6 transition-colors hover:border-secondary"
          >
            <p className="font-label text-xs uppercase tracking-[0.1em] text-on-navy/50">
              {TITULOS[clave]}
            </p>
            <p className="mt-4 font-headline text-5xl uppercase leading-none text-secondary">
              {cantidad}
            </p>
            <p className="mt-3 font-label text-xs uppercase tracking-[0.1em] text-on-navy/60">
              {detalle}
            </p>
            <p className="mt-4 font-label text-xs uppercase tracking-[0.1em] text-gold-glimmer opacity-0 transition-opacity group-hover:opacity-100">
              Gestionar →
            </p>
          </Link>
        ))}
      </section>

      <section className="mt-10 border border-line/10 bg-primary p-6">
        <h2 className="font-headline text-2xl uppercase leading-none tracking-wide text-on-navy">
          Próximo partido
        </h2>
        {proximoEvento ? (
          <div className="mt-4 flex flex-col gap-1">
            <p className="font-headline text-xl uppercase leading-none tracking-wide text-secondary">
              {proximoEvento.equipo1.nombre}
              <span className="mx-3 text-on-navy/40">vs</span>
              {proximoEvento.equipo2.nombre}
            </p>
            <p className="mt-2 font-label text-sm uppercase tracking-[0.1em] text-on-navy/70">
              {formatearFechaCorta(proximoEvento.fecha)} · {proximoEvento.ubicacion}
            </p>
            <Link
              href="/admin/calendario"
              className="mt-4 w-fit font-label text-xs uppercase tracking-[0.1em] text-gold-glimmer transition-colors hover:text-on-navy"
            >
              Ver calendario →
            </Link>
          </div>
        ) : (
          <p className="mt-3 text-on-navy/60">
            No hay partidos próximos. Cargá uno desde el calendario.
          </p>
        )}
      </section>
    </div>
  );
}
