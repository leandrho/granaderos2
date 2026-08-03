import Link from "next/link";
import { notFound } from "next/navigation";
import { getEventoByIdAction } from "@/app/actions/admin/calendario.admin.actions";
import { getEquiposAction } from "@/app/actions/admin/equipos.admin.actions";
import { EventoForm } from "@/components/admin/form/EventoForm";

interface AdminEventoEditarProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function AdminEventoEditarPage({
  params,
}: AdminEventoEditarProps) {
  const { id } = await params;
  const [evento, equipos] = await Promise.all([
    getEventoByIdAction(Number(id)),
    getEquiposAction(),
  ]);

  if (!evento) notFound();

  return (
    <div className="max-w-3xl">
      <header className="flex items-center justify-between border-b border-white/10 pb-6">
        <div>
          <p className="font-label text-sm uppercase tracking-[0.1em] text-gold-glimmer">
            Calendario
          </p>
          <h1 className="mt-3 font-headline text-4xl uppercase leading-none tracking-wide text-on-surface">
            Editar evento
          </h1>
        </div>
        <Link
          href="/admin/calendario"
          className="font-label text-xs uppercase tracking-[0.1em] text-on-surface/60 transition-colors hover:text-gold-glimmer"
        >
          ← Volver
        </Link>
      </header>

      <div className="mt-8 border border-white/10 bg-primary p-6 md:p-8">
        <EventoForm
          id={evento.id}
          equipos={equipos}
          valoresIniciales={{
            equipo1Id: evento.equipo1.id,
            equipo2Id: evento.equipo2.id,
            ubicacion: evento.ubicacion,
            descripcionBreve: evento.descripcionBreve,
            descripcionDetalle: evento.descripcionDetalle,
            imagen: evento.imagen,
            categoria: evento.categoria,
            publicado: evento.publicado,
            fecha: evento.fecha,
          }}
        />
      </div>
    </div>
  );
}
