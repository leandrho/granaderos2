import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { ObtenerNoticiaPorIdUseCase } from "@/application/use-cases/ObtenerNoticiaPorId";
import { ObtenerNoticiasUseCase } from "@/application/use-cases/ObtenerNoticias";
import { PrismaNoticiaRepository } from "@/infrastructure/repositories/PrismaNoticiaRepository";
import { aISO, formatearFechaLarga } from "@/lib/utils/date";

interface NoticiaDetalleProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const useCase = new ObtenerNoticiasUseCase(new PrismaNoticiaRepository());
  const noticias = await useCase.execute();

  return noticias.map((noticia) => ({ id: String(noticia.id) }));
}

export async function generateMetadata({
  params,
}: NoticiaDetalleProps): Promise<Metadata> {
  const { id } = await params;
  const noticia = await new ObtenerNoticiaPorIdUseCase(
    new PrismaNoticiaRepository()
  ).execute(Number(id));

  return {
    title: noticia ? noticia.titulo : "Noticia no encontrada",
    description: noticia?.descripcionBreve,
  };
}

export default async function NoticiaDetallePage({
  params,
}: NoticiaDetalleProps) {
  const { id } = await params;
  const noticia = await new ObtenerNoticiaPorIdUseCase(
    new PrismaNoticiaRepository()
  ).execute(Number(id));

  if (!noticia) notFound();

  const parrafos = noticia.descripcionDetalle
    .split(/\n\n+/)
    .filter((parrafo) => parrafo.trim().length > 0);

  return (
    <>
      <Header />
      <main className="flex-1">
        <PageHeader title={noticia.titulo} eyebrow={noticia.categoria} />

        <article className="border-t border-white/10 bg-stadium-black py-24">
          <div className="mx-auto max-w-4xl px-6 md:px-12">
            <div className="flex flex-wrap items-center gap-4">
              <Badge>{noticia.categoria}</Badge>
              <time
                dateTime={aISO(noticia.fecha)}
                className="font-label text-xs uppercase tracking-[0.1em] text-on-surface/60"
              >
                {formatearFechaLarga(noticia.fecha)}
              </time>
            </div>

            <p className="mt-6 text-lg leading-8 text-on-surface/80">
              {noticia.descripcionBreve}
            </p>

            {noticia.imagen ? (
              <Image
                src={noticia.imagen}
                alt={noticia.titulo}
                width={1280}
                height={720}
                className="mt-10 w-full object-contain"
              />
            ) : (
              <div
                className="mt-10 aspect-video w-full bg-gradient-to-br from-secondary/60 via-tertiary/60 to-primary"
                aria-hidden
              />
            )}

            <div className="mt-10 flex flex-col gap-5">
              {parrafos.map((parrafo, indice) => (
                <p key={indice} className="text-base leading-7 text-on-surface/75">
                  {parrafo}
                </p>
              ))}
            </div>

            <div className="mt-12">
              <Button href="/noticias" variant="outline" size="md">
                ← Volver a noticias
              </Button>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
