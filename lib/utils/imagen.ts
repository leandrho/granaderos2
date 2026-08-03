export const MAX_IMAGEN_BYTES = 2 * 1024 * 1024;

export const FORMATOS_NOTICIA = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
] as const;

export const FORMATOS_EQUIPO = ["image/png", "image/webp"] as const;

const EXTENSIONES_POR_TIPO: Record<string, string[]> = {
  "image/jpeg": ["jpg", "jpeg"],
  "image/png": ["png"],
  "image/webp": ["webp"],
  "image/avif": ["avif"],
};

interface ResultadoExito {
  ok: true;
  bytes: Uint8Array<ArrayBuffer>;
  tipo: string;
}

interface ResultadoError {
  ok: false;
  error: string;
}

export type ResultadoImagen = ResultadoExito | ResultadoError | null;

function tipoPorExtension(nombre: string): string {
  const extension = nombre.split(".").pop()?.toLowerCase() ?? "";
  return (
    Object.keys(EXTENSIONES_POR_TIPO).find((tipo) =>
      EXTENSIONES_POR_TIPO[tipo].includes(extension)
    ) ?? ""
  );
}

function listarPermitidos(formatos: readonly string[]): string {
  return formatos.map((f) => f.replace("image/", "")).join(", ");
}

export async function procesarArchivoImagen(
  archivo: File | null | undefined,
  formatos: readonly string[],
  maxBytes: number = MAX_IMAGEN_BYTES
): Promise<ResultadoImagen> {
  if (!archivo || archivo.size === 0) return null;

  if (archivo.size > maxBytes) {
    const mb = maxBytes / (1024 * 1024);
    return {
      ok: false,
      error: `El archivo supera el tamaño máximo de ${mb} MB.`,
    };
  }

  const tipo = archivo.type || tipoPorExtension(archivo.name);
  if (!formatos.includes(tipo as (typeof formatos)[number])) {
    return {
      ok: false,
      error: `Formato no permitido. Usá: ${listarPermitidos(formatos)}.`,
    };
  }

  return {
    ok: true,
    bytes: new Uint8Array(await archivo.arrayBuffer()),
    tipo,
  };
}
