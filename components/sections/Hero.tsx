import Image from "next/image";
import { Button } from "@/components/ui/Button";

export function Hero() {
  return (
    <section
      id="inicio"
      className="relative flex min-h-svh items-center overflow-hidden bg-stadium-black"
    >
      <Image
        src="/home-hero.png"
        alt=""
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div
        className="absolute inset-0 bg-linear-to-r from-primary/80 via-primary/60 to-transparent"
        aria-hidden
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pt-28 pb-16 md:px-12">
        <p className="font-label text-sm uppercase tracking-[0.1em] text-gold-glimmer">
          Club Deportivo
        </p>
        <h1 className="mt-4 font-headline text-6xl uppercase leading-none tracking-wide text-on-navy md:text-8xl">
          Granaderos
          <br />
          <span className="text-tertiary">de Koslay</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-7 text-on-navy/80">
          El orgullo de Koslay en cada partido. Seguí el calendario de nuestras
          categorías y acompañanos en la cancha.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Button href="#calendario" size="lg">
            Ver calendario
          </Button>
          <Button href="/contacto" variant="outline" size="lg">
            Sumate
          </Button>
        </div>
      </div>
    </section>
  );
}
