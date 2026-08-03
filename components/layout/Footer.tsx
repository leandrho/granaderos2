import Image from "next/image";
import Link from "next/link";
import { NAV_LINKS } from "@/lib/data/nav";
import { CONTACTO, SOCIALES } from "@/lib/data/footer";
import { SITE } from "@/lib/site";

export function Footer() {
  return (
    <footer className="bg-stadium-black">
      <div className="mx-auto grid max-w-[1280px] gap-12 px-6 py-16 md:grid-cols-3 md:px-12">
        <div>
          <p className="font-headline text-xl uppercase leading-none tracking-wide text-on-surface">
            {SITE.nombre}
            <span className="text-secondary"> de Koslay</span>
          </p>
          <p className="mt-4 max-w-xs text-sm leading-6 text-on-surface/70">
            {SITE.club}, San Luis. {SITE.eslogan}
          </p>
        </div>

        <nav aria-label="Navegación del pie" className="flex flex-col gap-3">
          <p className="font-label text-sm uppercase tracking-[0.1em] text-gold-glimmer">
            Navegación
          </p>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-label text-sm uppercase tracking-[0.1em] text-on-surface/70 transition-colors hover:text-gold-glimmer"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-3">
          <p className="font-label text-sm uppercase tracking-[0.1em] text-gold-glimmer">
            Contacto
          </p>
          <p className="text-sm leading-6 text-on-surface/70">
            {CONTACTO.direccion}
          </p>
          <a
            href={`tel:${CONTACTO.telefono.replace(/\s/g, "")}`}
            className="text-sm text-on-surface/70 transition-colors hover:text-gold-glimmer"
          >
            {CONTACTO.telefono}
          </a>
          <a
            href={`mailto:${CONTACTO.email}`}
            className="text-sm text-on-surface/70 transition-colors hover:text-gold-glimmer"
          >
            {CONTACTO.email}
          </a>
          <div className="mt-2 flex gap-4">
            {SOCIALES.map((red) => (
              <a
                key={red.nombre}
                href={red.href}
                aria-label={red.nombre}
                className="flex h-10 w-10 items-center justify-center border border-white/10 text-on-surface/70 transition-colors hover:border-secondary hover:text-gold-glimmer"
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
        </div>
      </div>

      <div className="border-t border-white/10">
        <p className="mx-auto max-w-[1280px] px-6 py-6 text-center font-label text-xs uppercase tracking-[0.1em] text-on-surface/50 md:px-12">
          © {new Date().getFullYear()} {SITE.nombreCompleto}
        </p>
      </div>
    </footer>
  );
}
