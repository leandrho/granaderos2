import Link from "next/link";
import { getEquiposAction } from "@/app/actions/admin/equipos.admin.actions";
import { EventoForm } from "@/components/admin/form/EventoForm";

export default async function AdminEventoCrearPage() {
  const equipos = await getEquiposAction();

  return (
    <div className="max-w-3xl">
      <header className="flex items-center justify-between border-b border-white/10 pb-6">
        <div>
          <p className="font-label text-sm uppercase tracking-[0.1em] text-gold-glimmer">
            Calendario
          </p>
          <h1 className="mt-3 font-headline text-4xl uppercase leading-none tracking-wide text-on-surface">
            Nuevo evento
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
        <EventoForm equipos={equipos} />
      </div>
    </div>
  );
}
