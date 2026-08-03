import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Calendario } from "@/components/sections/Calendario";
import { Noticias } from "@/components/sections/Noticias";
import { Sponsors } from "@/components/sections/Sponsors";
import { CtaSumate } from "@/components/sections/CtaSumate";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <Calendario />
        <Noticias />
        <Sponsors />
        <CtaSumate />
      </main>
      <Footer />
    </>
  );
}
