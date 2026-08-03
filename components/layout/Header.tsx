"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { NAV_LINKS } from "@/lib/data/nav";
import { SITE } from "@/lib/site";
import { Button } from "@/components/ui/Button";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="flex items-center justify-between border-b border-white/10 bg-surface/80 px-6 py-4 backdrop-blur-md md:px-12">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt={`Escudo del ${SITE.club}`}
            width={40}
            height={40}
            priority
          />
          <span className="font-headline text-xl uppercase leading-none tracking-wide text-on-surface">
            {SITE.nombre}
            <span className="text-secondary"> de Koslay</span>
          </span>
        </Link>

        <nav
          className="hidden items-center gap-8 md:flex"
          aria-label="Navegación principal"
        >
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

        <div className="flex items-center gap-4">
          <Button href="/contacto" size="sm" className="hidden md:inline-flex">
            Sumate al club
          </Button>

          <button
            type="button"
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 text-on-surface md:hidden"
          >
            {menuOpen ? (
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white/20 backdrop-blur-md md:hidden">
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
            <span className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt={`Escudo del ${SITE.club}`}
                width={40}
                height={40}
                priority
              />
              <span className="font-headline text-xl uppercase leading-none tracking-wide text-on-surface">
                {SITE.nombre}
                <span className="text-secondary"> de Koslay</span>
              </span>
            </span>
            <button
              type="button"
              aria-label="Cerrar menú"
              onClick={closeMenu}
              className="flex h-10 w-10 items-center justify-center text-on-surface"
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <nav
            className="flex flex-1 flex-col items-center justify-center gap-8"
            aria-label="Navegación móvil"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="font-headline text-2xl uppercase tracking-wide text-on-surface transition-colors hover:text-gold-glimmer"
              >
                {link.label}
              </Link>
            ))}
            <Button href="/contacto" onClick={closeMenu} size="md" className="mt-4">
              Sumate
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
