import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function CtaSumate() {
  return (
    <section className="relative overflow-hidden bg-primary py-24">
      <div
        className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-stadium-black"
        aria-hidden
      />
      <div className="relative z-10 mx-auto flex max-w-[1280px] flex-col items-center px-6 text-center md:px-12">
        <SectionHeading
          eyebrow="Sumate al Grana"
          title={
            <>
              Vení a jugar
              <br />
              con nosotros
            </>
          }
          align="center"
        />
        <p className="mt-6 max-w-xl text-lg leading-7 text-on-surface/80">
          Si te gusta el fútbol y querés formar parte de la familia Granadera,
          escribinos y sumate a alguna de nuestras categorías. Te esperamos.
        </p>
        <Button href="/contacto" size="xl" className="mt-10">
          Unirme
        </Button>
      </div>
    </section>
  );
}
