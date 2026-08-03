import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/ui/PageHeader";
import { EventoCalendarioCard } from "@/components/sections/Calendario";
import { ObtenerCalendarioUseCase } from "@/application/use-cases/ObtenerCalendario";
import { PrismaEventoCalendarioRepository } from "@/infrastructure/repositories/PrismaEventoCalendarioRepository";

export const metadata: Metadata = {
  title: "Calendario",
  description:
    "Calendario completo de partidos del Club Deportivo Granaderos de Koslay.",
};

export default async function CalendarioPage() {
  const useCase = new ObtenerCalendarioUseCase(
    new PrismaEventoCalendarioRepository()
  );
  const eventos = await useCase.execute();

  return (
    <>
      <Header />
      <main className="flex-1">
        <PageHeader title="Calendario" eyebrow="Próximos partidos" />

        <section className="border-t border-white/10 bg-surface py-24">
          <div className="mx-auto max-w-[1280px] px-6 md:px-12">
            <div className="flex flex-col gap-4">
              {eventos.map((evento) => (
                <EventoCalendarioCard key={evento.id} evento={evento} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
