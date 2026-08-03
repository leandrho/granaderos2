import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Noticias",
  description:
    "Todas las noticias del Club Deportivo Granaderos de Koslay.",
};

export default function NoticiasPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <PageHeader title="Noticias" />
      </main>
      <Footer />
    </>
  );
}
