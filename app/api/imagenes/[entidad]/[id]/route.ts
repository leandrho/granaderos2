import { prisma } from "@/infrastructure/db/prisma";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  ctx: RouteContext<"/api/imagenes/[entidad]/[id]">
) {
  const { entidad, id } = await ctx.params;

  if (entidad !== "noticia" && entidad !== "equipo") {
    return new Response("Entidad inválida", { status: 400 });
  }

  const idNumerico = Number(id);
  if (!Number.isInteger(idNumerico) || idNumerico <= 0) {
    return new Response("Id inválido", { status: 400 });
  }

  let bin: Uint8Array | null = null;
  let tipo: string | null = null;

  if (entidad === "noticia") {
    const noticia = await prisma.noticia.findUnique({
      where: { id: idNumerico },
      select: { imagenBin: true, imagenTipo: true },
    });
    bin = noticia?.imagenBin ?? null;
    tipo = noticia?.imagenTipo ?? null;
  } else {
    const equipo = await prisma.equipo.findUnique({
      where: { id: idNumerico },
      select: { logoBin: true, logoTipo: true },
    });
    bin = equipo?.logoBin ?? null;
    tipo = equipo?.logoTipo ?? null;
  }

  if (!bin || !tipo) {
    return new Response("Imagen no encontrada", { status: 404 });
  }

  return new Response(Buffer.from(bin), {
    headers: {
      "Content-Type": tipo,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
