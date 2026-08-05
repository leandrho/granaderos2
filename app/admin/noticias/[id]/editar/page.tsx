import Link from "next/link";
import { notFound } from "next/navigation";
import { getNoticiaByIdAction } from "@/app/actions/admin/noticias.admin.actions";
import { NoticiaForm } from "@/components/admin/form/NoticiaForm";

interface AdminNoticiaEditarProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function AdminNoticiaEditarPage({
  params,
}: AdminNoticiaEditarProps) {
  const { id } = await params;
  const noticia = await getNoticiaByIdAction(Number(id));

  if (!noticia) notFound();

  return (
    <div className="max-w-3xl">
      <header className="flex items-center justify-between border-b border-line/10 pb-6">
        <div>
          <p className="font-label text-sm uppercase tracking-[0.1em] text-gold">
            Noticias
          </p>
          <h1 className="mt-3 font-headline text-4xl uppercase leading-none tracking-wide text-on-surface">
            Editar noticia
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
        <NoticiaForm id={noticia.id} valoresIniciales={noticia} />
      </div>
    </div>
  );
}
