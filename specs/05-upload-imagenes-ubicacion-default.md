# SPEC 05 — Subida de imágenes (BLOB) y ubicación por defecto en Calendario

> **Estado:** Implementado
> **Depende de:** SPEC 04
> **Fecha:** 2026-08-03
> **Objetivo:** Permitir subir imágenes desde el panel para Noticias y Equipos guardándolas como BLOB en SQLite (con el campo `imagen`/`logo` reutilizado como referencia de URL) y precargar la ubicación de un evento de calendario con la dirección del equipo local.

---

## Scope

**In:**

- Subida de imágenes de **Noticias** desde `/admin/noticias/{crear|editar}`: máximo 2 MB, formatos JPG, PNG, WebP y AVIF.
- Subida de **logos de Equipos** desde `/admin/equipos/{crear|editar}`: máximo 2 MB, formatos solo PNG y WebP.
- Persistencia de los bytes como **BLOB en SQLite**, en la misma tabla del registro (nueva columna BLOB).
- El campo `imagen` (Noticia) y `logo` (Equipo) se reutilizan como referencia de URL: al subir un archivo se guarda la ruta `/api/imagenes/...` en ese campo; las rutas existentes (`/logo1.png`, `/news/*.jpeg`) siguen funcionando.
- Route handler `/api/imagenes/...` que sirve el BLOB con su `Content-Type`.
- Al **crear o editar** un evento en `/admin/calendario`, la **ubicación** se precarga con la dirección del equipo local y queda editable.
- Completar con direcciones ficticias los equipos del seed que hoy tienen `direccion` vacía (para que el default funcione).

**Out of scope (para futuras specs):**

- Eliminar el campo `imagen` de `EventoCalendario` (se decidió dejarlo fuera; probablemente se quite en otra spec).
- Subida de imágenes para otros tipos de contenido (sponsors, etc.).
- Servicio externo de almacenamiento (S3, Vercel Blob, etc.).
- Redimensionado/optimización de imágenes servidas.

---

## Data model

Se modifica `prisma/schema.prisma` agregando una columna BLOB y una de tipo MIME por entidad. Los campos `imagen`/`logo` (String) se mantienen y siguen guardando la referencia de URL:

```prisma
model Noticia {
  // ... campos existentes
  imagen        String   // ruta existente (/news/...) o /api/imagenes/noticia/{id}
  imagenBin     Bytes?   // BLOB con los bytes de la imagen
  imagenTipo    String?  // MIME type (image/jpeg, image/png, image/webp, image/avif)

  @@map("noticias")
}

model Equipo {
  // ... campos existentes
  logo      String?  // ruta existente (/logo1.png) o /api/imagenes/equipo/{id}
  logoBin   Bytes?   // BLOB con los bytes del logo
  logoTipo  String?  // MIME type (image/png, image/webp)

  @@map("equipos")
}
```

Reglas:

- Cuando se sube un archivo: se guardan los bytes en `*Bin`, el MIME en `*Tipo` y se escribe `imagen`/`logo` = `/api/imagenes/{entidad}/{id}`.
- Cuando no se sube archivo: `*Bin` y `*Tipo` quedan `NULL` y `imagen`/`logo` conservan el valor previo (ruta estática o vacío).
- Si se sube un archivo nuevo sobre un registro con imagen previa, se reemplaza el BLOB.
- El seed de equipos recibe direcciones ficticias donde hoy hay `direccion: ""`.
- No se agrega tabla nueva; se reutiliza la misma tabla.

Convención: `{entidad}` ∈ {`noticia`, `equipo`}.

---

## Implementation plan

1. **Migración de esquema.** Agregar `imagenBin Byte[]?` + `imagenTipo String?` a `Noticia`, y `logoBin Byte[]?` + `logoTipo String?` a `Equipo` en `prisma/schema.prisma`. Ejecutar `npx prisma migrate dev --name upload_imagenes_blob`.
2. **Route handler.** Crear `app/api/imagenes/[entidad]/[id]/route.ts` que lee el BLOB + MIME del registro, devuelve la imagen con su `Content-Type` y `Cache-Control`, o 404 si no hay BLOB. `{entidad}` ∈ {noticia, equipo}.
3. **Subida en la capa de datos.** Extender las entidades/repositorios (o los DTOs de admin) para recibir un `File`, validar tamaño (≤ 2 MB) y formato según entidad (noticia: jpeg/png/webp/avif; equipo: png/webp), y persistir bytes + MIME + URL.
4. **Config bodySizeLimit.** En `next.config.ts`, subir `experimental.serverActions.bodySizeLimit` a `3mb` (por defecto es 1 MB y el límite de archivo es 2 MB).
5. **Server actions.** Actualizar `app/actions/admin/noticias.admin.actions.ts` y `equipos.admin.actions.ts` para leer el archivo del `FormData`, validarlo, guardar el BLOB y setear la URL `/api/imagenes/{entidad}/{id}`; conservar imagen previa si no se sube archivo.
6. **Formularios.** Agregar `<input type="file">` (con `encType="multipart/form-data"`) a `NoticiaForm` y `EquipoForm`, con preview de la imagen actual y manejo de "reemplazar / mantener / vaciar".
7. **Seed de equipos.** Completar con direcciones ficticias los equipos de `prisma/seed.ts` que tienen `direccion: ""`; reseed.
8. **Ubicación por defecto en Calendario.** Pasar `direccion` del equipo local a `EventoForm`; al seleccionar equipo local (crear y editar), precargar `ubicacion` con esa dirección cuando el campo esté vacío, dejándolo siempre editable.

---

## Acceptance criteria

- [x] Se puede subir una imagen (≤ 2 MB, jpg/png/webp/avif) desde el formulario de Noticias y aparece en la lista y en la ficha pública `/noticias/{id}`.
- [x] Se puede subir un logo (≤ 2 MB, solo png/webp) desde el formulario de Equipos y se muestra donde se renderiza (ej. `/calendario`).
- [x] Un archivo de formato o tamaño no permitido devuelve un error visible en el formulario y no guarda el registro.
- [x] Al guardar sin subir archivo, la imagen/logo previo se conserva (edición).
- [x] El BLOB se sirve correctamente por `/api/imagenes/noticia/{id}` y `/api/imagenes/equipo/{id}` con el `Content-Type` adecuado.
- [x] Las rutas estáticas previas (`/logo1.png`, `/news/*.jpeg`) siguen funcionando sin cambios.
- [x] Al crear o editar un evento, `ubicacion` se precarga con la dirección del equipo local cuando el campo está vacío y queda editable.
- [x] Todos los equipos del seed tienen `direccion` no vacía.
- [x] `npm run build` y `npm run lint` pasan sin errores.

---

## Decisions

- **Sí:** BLOB en SQLite (misma tabla) en vez de filesystem/`public/uploads/`. Elegido por el usuario; evita problemas en deploy con filesystem efímero y permite servir por route handler.
- **Sí:** Reutilizar el campo `imagen`/`logo` como referencia de URL. Mantiene compatibilidad con rutas estáticas existentes y con los componentes que ya renderizan `noticia.imagen`/`equipo.logo`.
- **Sí:** Una columna BLOB + una columna de MIME por entidad. Guardar el `Content-Type` evita adivinarlo al servir el archivo.
- **No:** Tabla `Imagen` separada. Un solo archivo por registro, igual que el modelo actual; tabla extra sería sobre-ingeniería.
- **No:** Redimensionado/optimización de imágenes. Fuera de alcance; se sirve el archivo tal cual.
- **No:** Servicio externo de almacenamiento (S3, Vercel Blob). No aporta para el volumen actual y agrega dependencias.
- **Sí:** `bodySizeLimit` a 3 mb. El límite por defecto de server actions (1 MB) es menor al tamaño máximo de archivo (2 MB).
- **No:** Eliminar `imagen` de `EventoCalendario`. Probablemente se quite, pero se deja para una spec futura y no se toca acá.

---

## Risks

| Risk | Mitigation |
| ---- | ---------- |
| Archivo más grande que el límite de server actions | `bodySizeLimit` a 3 mb (2 mb máx. de archivo + margen de formdata). |
| Tipo MIME no confiable desde el cliente | Validar por extensión permitida y tamaño en el servidor, además de guardar el MIME declarado. |
| BLOB ocupa espacio en la DB | Límite de 2 MB por archivo; se reemplaza el BLOB al subir uno nuevo. |
| Caché de navegador con imagen reemplazada | `Cache-Control` con `max-age` corto en el route handler. |

---

## What is **not** in this spec

- Eliminar el campo `imagen` de `EventoCalendario`.
- Subida de imágenes para otros contenidos (sponsors, etc.).
- Servicio externo de almacenamiento (S3, Vercel Blob).
- Redimensionado/optimización de imágenes servidas.
