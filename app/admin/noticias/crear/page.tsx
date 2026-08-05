import Link from "next/link";
import { NoticiaForm } from "@/components/admin/form/NoticiaForm";

export default function AdminNoticiaCrearPage() {
  return (
    <div className="max-w-3xl">
      <header className="flex items-center justify-between border-b border-line/10 pb-6">
        <div>
          <p className="font-label text-sm uppercase tracking-[0.1em] text-gold">
            Noticias
          </p>
          <h1 className="mt-3 font-headline text-4xl uppercase leading-none tracking-wide text-on-surface">
            Nueva noticia
          </h1>
        </div>
        <Link
          href="/admin/noticias"
          className="font-label text-xs uppercase tracking-[0.1em] text-on-surface/60 transition-colors hover:text-gold"
        >
          ← Volver
        </Link>
      </header>

      <div className="mt-8 border border-line/10 bg-primary p-6 md:p-8">
        <NoticiaForm />
      </div>
    </div>
  );
}
