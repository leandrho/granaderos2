import Link from "next/link";
import Image from "next/image";
import { getNoticiasAction } from "@/app/actions/admin/noticias.admin.actions";
import { eliminarNoticia } from "@/app/actions/admin/noticias.admin.actions";
import { BotonEliminar } from "@/components/admin/BotonEliminar";
import { Badge } from "@/components/ui/Badge";
import { formatearFechaCorta } from "@/lib/utils/date";

export const dynamic = "force-dynamic";

export default async function AdminNoticiasPage() {
  const noticias = await getNoticiasAction();

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-line/10 pb-6">
        <div>
          <p className="font-label text-sm uppercase tracking-[0.1em] text-gold">
            Gestión de contenido
          </p>
          <h1 className="mt-3 font-headline text-4xl uppercase leading-none tracking-wide text-on-surface md:text-5xl">
            Noticias
          </h1>
        </div>
        <Link
          href="/admin/noticias/crear"
          className="inline-flex items-center justify-center bg-secondary px-6 py-3 font-headline text-base uppercase leading-none text-black transition-colors hover:bg-gold-glimmer"
        >
          + Nueva noticia
        </Link>
      </header>

      <div className="mt-8 overflow-x-auto border border-line/10">
        <table className="w-full min-w-[720px] border-collapse text-left">
          <thead>
            <tr className="border-b border-line/10 bg-primary">
              {["Imagen", "Título", "Categoría", "Estado", "Fecha", "Acciones"].map(
                (encabezado) => (
                  <th
                    key={encabezado}
                    scope="col"
                    className="px-4 py-3 font-label text-xs uppercase tracking-[0.1em] text-on-navy/60"
                  >
                    {encabezado}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {noticias.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-on-surface/60">
                  Todavía no hay noticias. Creá la primera.
                </td>
              </tr>
            ) : (
              noticias.map((noticia) => (
                <tr
                  key={noticia.id}
                  className="border-b border-line/5 transition-colors hover:bg-on-surface/5"
                >
                  <td className="px-4 py-3">
                    {noticia.imagen ? (
                      <Image
                        src={noticia.imagen}
                        alt={noticia.titulo}
                        width={80}
                        height={45}
                        className="h-11 w-20 object-cover"
                      />
                    ) : (
                      <div className="h-11 w-20 bg-gradient-to-br from-secondary/50 to-primary" aria-hidden />
                    )}
                  </td>
                  <td className="px-4 py-3 font-headline text-sm uppercase leading-tight tracking-wide text-on-surface">
                    {noticia.titulo}
                  </td>
                  <td className="px-4 py-3">
                    <Badge>{noticia.categoria}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 font-label text-xs uppercase tracking-wide ${
                        noticia.publicado ? "bg-secondary text-black" : "bg-on-surface/10 text-on-surface/60"
                      }`}
                    >
                      {noticia.publicado ? "Publicado" : "Borrador"}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-label text-xs uppercase tracking-wide text-on-surface/70">
                    {formatearFechaCorta(noticia.fecha)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/noticias/${noticia.id}/editar`}
                        className="border border-secondary/50 px-3 py-1.5 font-label text-xs uppercase tracking-[0.1em] text-secondary transition-colors hover:bg-secondary hover:text-black"
                      >
                        Editar
                      </Link>
                      <BotonEliminar
                        id={noticia.id}
                        eliminar={eliminarNoticia}
                        nombre="esta noticia"
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
