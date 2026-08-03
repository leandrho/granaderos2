"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/admin/dashboard", label: "Dashboard", icono: "▦" },
  { href: "/admin/noticias", label: "Noticias", icono: "◈" },
  { href: "/admin/calendario", label: "Calendario", icono: "▤" },
  { href: "/admin/equipos", label: "Equipos", icono: "◆" },
] as const;

function rutaActiva(pathname: string, href: string): boolean {
  if (href === "/admin/dashboard") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-white/10 bg-primary lg:w-64 lg:border-b-0 lg:border-r">
      <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
        <Link href="/admin/dashboard" className="block">
          <p className="font-headline text-lg uppercase leading-none tracking-wide text-on-surface">
            Granaderos
            <span className="text-secondary"> Admin</span>
          </p>
          <p className="mt-1 font-label text-xs uppercase tracking-[0.1em] text-on-surface/50">
            Panel de gestión
          </p>
        </Link>
      </div>

      <nav className="flex flex-row gap-1 overflow-x-auto px-4 py-3 lg:flex-col lg:gap-2 lg:py-6" aria-label="Navegación del panel">
        {LINKS.map((link) => {
          const activo = rutaActiva(pathname, link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={activo ? "page" : undefined}
              className={`flex shrink-0 items-center gap-3 px-4 py-3 font-headline text-sm uppercase leading-none tracking-wide transition-colors ${
                activo
                  ? "bg-secondary text-black"
                  : "text-on-surface/70 hover:bg-white/5 hover:text-on-surface"
              }`}
            >
              <span aria-hidden className="text-xs">{link.icono}</span>
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto hidden border-t border-white/10 px-6 py-5 lg:block">
        <Link
          href="/"
          className="font-label text-xs uppercase tracking-[0.1em] text-on-surface/50 transition-colors hover:text-gold-glimmer"
        >
          ← Volver al sitio
        </Link>
      </div>
    </aside>
  );
}
