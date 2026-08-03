import { PROXIMOS_PARTIDOS, type Partido } from "@/lib/data/calendario";
import { formatearFechaLarga, mesCorto, partirFecha } from "@/lib/utils/date";
import { Badge } from "@/components/ui/Badge";
import { SectionHeading } from "@/components/ui/SectionHeading";

function PartidoCard({ partido }: { partido: Partido }) {
  const partes = partirFecha(partido.fecha);

  return (
    <article className="flex flex-col gap-4 border border-white/10 bg-gradient-to-br from-primary to-stadium-black p-6 sm:flex-row sm:items-center sm:gap-6">
      <div className="flex items-center gap-4 sm:w-24 sm:flex-col sm:gap-1 sm:text-center">
        <span className="font-headline text-5xl leading-none text-secondary">
          {partes?.dia}
        </span>
        <span className="font-label text-xs uppercase tracking-[0.1em] text-on-surface/70">
          {mesCorto(partido.fecha)} {partes?.anio}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2">
        <Badge>{partido.categoria}</Badge>
        <h3 className="font-headline text-2xl uppercase leading-none text-on-surface">
          {partido.local ? "vs " : "@ "}
          {partido.rival}
        </h3>
        <p className="font-label text-sm uppercase tracking-[0.1em] text-on-surface/60">
          <time dateTime={partido.fecha}>
            {formatearFechaLarga(partido.fecha)}
          </time>
          {" · "}
          {partido.hora} hs
        </p>
        <p className="text-sm text-on-surface/70">{partido.competencia}</p>
      </div>

      <span
        className={`inline-flex w-fit px-2 py-0.5 font-label text-xs font-bold uppercase tracking-[0.1em] ${
          partido.local
            ? "bg-white text-primary"
            : "border border-white/40 text-on-surface/80"
        }`}
      >
        {partido.local ? "Local" : "Visitante"}
      </span>
    </article>
  );
}

export function Calendario() {
  return (
    <section id="calendario" className="scroll-mt-24 bg-surface py-24">
      <div className="mx-auto max-w-[1280px] px-6 md:px-12">
        <SectionHeading eyebrow="Próximos partidos" title="Calendario" />

        <div className="mt-12 flex flex-col gap-4">
          {PROXIMOS_PARTIDOS.map((partido) => (
            <PartidoCard key={partido.id} partido={partido} />
          ))}
        </div>
      </div>
    </section>
  );
}
