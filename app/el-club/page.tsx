import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  MISION,
  OBJETIVO_GENERAL,
  OBJETIVOS_ESPECIFICOS,
} from "@/lib/data/el-club";

export const metadata: Metadata = {
  title: "El Club",
  description:
    "Conocé la misión y los objetivos del Club Deportivo Granaderos de Koslay.",
};

export default function ElClubPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <PageHeader title="El Club" />

        <section className="border-t border-line/10 bg-surface pb-24 pt-10">
          <div className="mx-auto max-w-[1280px] px-6 md:px-12">
            <div className="grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-16">
              <SectionHeading eyebrow="Nuestro propósito" title="Misión" size="md" />
              <p className="max-w-xl text-lg leading-8 text-on-surface/80">
                {MISION}
              </p>
            </div>
          </div>
        </section>

        <section className="border-t border-line/10 bg-gradient-to-b from-primary to-stadium-black py-24">
          <div className="mx-auto max-w-[1280px] px-6 md:px-12">
            <SectionHeading eyebrow="Hacia dónde vamos" title="Objetivos" tono="navy" />

            <div className="mt-16 grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-16">
              <div>
                <p className="font-label text-sm uppercase tracking-[0.1em] text-secondary">
                  Objetivo general
                </p>
                <h3 className="mt-3 font-headline text-3xl uppercase leading-none tracking-wide text-on-navy">
                  General
                </h3>
              </div>
              <p className="max-w-xl text-lg leading-8 text-on-navy/80">
                {OBJETIVO_GENERAL}
              </p>
            </div>

            <div className="mt-20">
              <p className="font-label text-sm uppercase tracking-[0.1em] text-secondary">
                Objetivos específicos
              </p>
              <div className="mt-8 grid gap-6 md:grid-cols-2">
                {OBJETIVOS_ESPECIFICOS.map((objetivo) => (
                  <article
                    key={objetivo.numero}
                    className="border border-line/10 bg-gradient-to-br from-primary to-stadium-black p-8"
                  >
                    <span className="font-headline text-5xl leading-none text-secondary">
                      {objetivo.numero}
                    </span>
                    <h3 className="mt-6 font-headline text-2xl uppercase leading-none tracking-wide text-on-navy">
                      {objetivo.titulo}
                    </h3>
                    <p className="mt-4 leading-7 text-on-navy/80">
                      {objetivo.descripcion}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
