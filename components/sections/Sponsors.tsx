import Image from "next/image";
import { SPONSORS } from "@/lib/data/sponsors";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Sponsors() {
  return (
    <section id="sponsors" className="scroll-mt-24 border-y border-white/10 bg-surface py-16">
      <div className="mx-auto max-w-[1280px] px-6 md:px-12">
        <SectionHeading
          eyebrow="Nos acompañan"
          title="Sponsors"
          align="center"
          size="sm"
        />

        <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
          {SPONSORS.map((sponsor) => (
            <li key={sponsor.id}>
              <a
                href={sponsor.href}
                title={sponsor.nombre}
                className="block transition-opacity hover:opacity-80"
              >
                <span className="relative block h-14 w-36">
                  <Image
                    src={sponsor.logo}
                    alt={sponsor.nombre}
                    fill
                    className="object-contain"
                    sizes="144px"
                  />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
