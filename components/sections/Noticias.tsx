import Image from "next/image";
import { NOTICIAS, type Noticia } from "@/lib/data/noticias";
import { formatearFechaCorta } from "@/lib/utils/date";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";

function NoticiaCard({ noticia }: { noticia: Noticia }) {
  return (
    <a
      href="/noticias"
      className="group flex flex-col border border-white/10 bg-gradient-to-br from-primary to-stadium-black transition-colors hover:border-secondary"
    >
      {noticia.imagen ? (
        <Image
          src={noticia.imagen}
          alt={noticia.titulo}
          width={640}
          height={360}
          className="aspect-video w-full object-cover"
        />
      ) : (
        <div
          className="aspect-video w-full bg-gradient-to-br from-secondary/60 via-tertiary/60 to-primary"
          aria-hidden
        />
      )}

      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex items-center gap-3">
          <Badge>{noticia.categoria}</Badge>
          <time
            dateTime={noticia.fecha}
            className="font-label text-xs uppercase tracking-[0.1em] text-on-surface/60"
          >
            {formatearFechaCorta(noticia.fecha)}
          </time>
        </div>

        <h3 className="font-headline text-2xl uppercase leading-none tracking-wide text-on-surface group-hover:text-gold-glimmer">
          {noticia.titulo}
        </h3>
        <p className="text-sm leading-6 text-on-surface/70">{noticia.extracto}</p>

        <span className="mt-auto pt-2 font-label text-xs font-bold uppercase tracking-[0.1em] text-secondary">
          Leer más →
        </span>
      </div>
    </a>
  );
}

export function Noticias() {
  return (
    <section id="noticias" className="scroll-mt-24 bg-stadium-black py-24">
      <div className="mx-auto max-w-[1280px] px-6 md:px-12">
        <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="Novedades del club" title="Últimas noticias" />
          <Button href="/noticias" variant="outline" size="md">
            Ver todas
          </Button>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {NOTICIAS.slice(0, 3).map((noticia) => (
            <NoticiaCard key={noticia.id} noticia={noticia} />
          ))}
        </div>
      </div>
    </section>
  );
}
