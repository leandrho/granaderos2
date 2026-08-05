import Image from "next/image";
import { ObtenerProximosEventosUseCase } from "@/application/use-cases/ObtenerProximosEventos";
import { PrismaEventoCalendarioRepository } from "@/infrastructure/repositories/PrismaEventoCalendarioRepository";
import type { EventoCalendario } from "@/domain/entities/EventoCalendario";
import {
  aISO,
  formatearFechaLarga,
  mesCorto,
  partirFecha,
} from "@/lib/utils/date";
import { Badge } from "@/components/ui/Badge";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function EventoCalendarioCard({
  evento,
}: {
  evento: EventoCalendario;
}) {
  const partes = partirFecha(evento.fecha);

  return (
    <article className="flex flex-col gap-4 border border-line/10 bg-gradient-to-br from-primary to-stadium-black p-6 sm:flex-row sm:items-center sm:gap-6">
      <div className="flex items-center gap-4 sm:w-24 sm:flex-col sm:gap-1 sm:text-center">
        <span className="font-headline text-5xl leading-none text-secondary">
          {partes?.dia}
        </span>
        <span className="font-label text-xs uppercase tracking-[0.1em] text-on-navy/70">
          {mesCorto(evento.fecha)} {partes?.anio}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2">
        <Badge>{evento.categoria}</Badge>
        <div className="flex items-center gap-3">
          {evento.equipo1.logo ? (
            <Image
              src={evento.equipo1.logo}
              alt={`Escudo de ${evento.equipo1.nombre}`}
              width={40}
              height={40}
              className="h-10 w-10 shrink-0 object-contain"
            />
          ) : null}
          <h3 className="font-headline text-2xl uppercase leading-none text-on-navy">
            {evento.equipo1.nombre}
          </h3>
          <span className="font-headline text-2xl leading-none text-secondary">
            vs
          </span>
          <h3 className="font-headline text-2xl uppercase leading-none text-on-navy">
            {evento.equipo2.nombre}
          </h3>
          {evento.equipo2.logo ? (
            <Image
              src={evento.equipo2.logo}
              alt={`Escudo de ${evento.equipo2.nombre}`}
              width={40}
              height={40}
              className="h-10 w-10 shrink-0 object-contain"
            />
          ) : null}
        </div>
        <p className="font-label text-sm uppercase tracking-[0.1em] text-on-navy/60">
          <time dateTime={aISO(evento.fecha)}>
            {formatearFechaLarga(evento.fecha)}
          </time>
        </p>
        <p className="text-sm text-on-navy/70">{evento.descripcionBreve}</p>
        <p className="font-label text-xs uppercase tracking-[0.1em] text-secondary">
          {evento.ubicacion}
        </p>
      </div>
    </article>
  );
}

export async function Calendario() {
  const useCase = new ObtenerProximosEventosUseCase(
    new PrismaEventoCalendarioRepository()
  );
  const eventos = await useCase.execute();

  return (
    <section id="calendario" className="scroll-mt-24 bg-surface py-24">
      <div className="mx-auto max-w-[1280px] px-6 md:px-12">
        <SectionHeading eyebrow="Próximos partidos" title="Calendario" />

        <div className="mt-12 flex flex-col gap-4">
          {eventos.map((evento) => (
            <EventoCalendarioCard key={evento.id} evento={evento} />
          ))}
        </div>
      </div>
    </section>
  );
}
