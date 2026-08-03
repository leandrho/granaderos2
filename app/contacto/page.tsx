import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/ui/PageHeader";

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
        <PageHeader title="Contacto" />
      </main>
      <Footer />
    </>
  );
}
