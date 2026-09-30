import type { Metadata } from "next";
import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FormularioContacto } from "@/components/sections/FormularioContacto";
import { CONTACTO, SOCIALES } from "@/lib/data/footer";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Contactate con el Club Deportivo Granaderos de Koslay.",
};

export default function ContactoPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* <PageHeader title="Contacto" eyebrow=""/> */}

        <section
          id="formulario"
          className="mx-auto max-w-[1280px] scroll-mt-24 px-6 py-16 mt-6 md:px-12 lg:py-24 lg:mt-16"
        >
          <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
            <div>
              <SectionHeading eyebrow="Escribinos" title="Dejanos tu mensaje" />
              <div className="mt-8 max-w-xl">
                <FormularioContacto />
              </div>
            </div>

            <aside className="flex flex-col gap-6 border border-line/15 bg-surface p-8">
              <p className="font-label text-sm uppercase tracking-[0.1em] text-gold-glimmer">
                Datos del club
              </p>
              <div className="flex flex-col gap-5">
                <div>
                  <p className="font-label text-xs uppercase tracking-[0.1em] text-on-surface/70">
                    Dirección
                  </p>
                  <p className="mt-1 text-sm leading-6 text-on-surface/70">
                    {CONTACTO.direccion}
                  </p>
                </div>
                <div>
                  <p className="font-label text-xs uppercase tracking-[0.1em] text-on-surface/70">
                    Teléfono
                  </p>
                  <a
                    href={`tel:${CONTACTO.telefono.replace(/\s/g, "")}`}
                    className="mt-1 block text-sm leading-6 text-on-surface/70 transition-colors hover:text-secondary"
                  >
                    {CONTACTO.telefono}
                  </a>
                </div>
                <div>
                  <p className="font-label text-xs uppercase tracking-[0.1em] text-on-surface/70">
                    Email
                  </p>
                  <a
                    href={`mailto:${CONTACTO.email}`}
                    className="mt-1 block break-all text-sm leading-6 text-on-surface/70 transition-colors hover:text-secondary"
                  >
                    {CONTACTO.email}
                  </a>
                </div>
              </div>

              <div className="flex gap-4">
                {SOCIALES.map((red) => (
                  <a
                    key={red.nombre}
                    href={red.href}
                    aria-label={red.nombre}
                    className="flex h-10 w-10 items-center justify-center border border-line/10 transition-colors hover:border-secondary"
                  >
                    <Image
                      src={red.icono}
                      alt={red.nombre}
                      width={30}
                      height={30}
                      className="h-10 w-10 object-contain"
                    />
                  </a>
                ))}
              </div>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
