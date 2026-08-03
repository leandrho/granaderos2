import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/ui/PageHeader";
import { NoticiaCard } from "@/components/sections/Noticias";
import { ObtenerNoticiasUseCase } from "@/application/use-cases/ObtenerNoticias";
import { PrismaNoticiaRepository } from "@/infrastructure/repositories/PrismaNoticiaRepository";

export const metadata: Metadata = {
  title: "Noticias",
  description:
    "Todas las noticias del Club Deportivo Granaderos de Koslay.",
};

export default async function NoticiasPage() {
  const useCase = new ObtenerNoticiasUseCase(new PrismaNoticiaRepository());
  const noticias = await useCase.execute();

  return (
    <>
      <Header />
      <main className="flex-1">
        <PageHeader title="Noticias" eyebrow="Novedades del club" />

        <section className="border-t border-white/10 bg-stadium-black py-24">
          <div className="mx-auto max-w-[1280px] px-6 md:px-12">
            <div className="grid gap-4 md:grid-cols-3">
              {noticias.map((noticia) => (
                <NoticiaCard key={noticia.id} noticia={noticia} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
