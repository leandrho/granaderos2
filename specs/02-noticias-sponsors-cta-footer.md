# SPEC 02 — Landing del Club Granaderos de Koslay: noticias, sponsors, CTA y footer

> **Estado:** Implementado
> **Depende de:** SPEC 01
> **Fecha:** 2026-08-02
> **Objetivo:** Completar la landing con las secciones de últimas noticias, sponsors, "Vení a jugar con nosotros" y footer, y sumar páginas mínimas de noticias y contacto para que la navegación no rompa.

## Alcance

**Dentro de este spec:**

- Sección "Últimas noticias" en la landing: 3 noticias con imagen placeholder, cada tarjeta enlaza a la página `/noticias`.
- Sección de sponsors: tira horizontal de logos con los 5 sponsors de `public/sponsors/`, cada uno enlazando a su sitio.
- Sección "Vení a jugar con nosotros": título, párrafo de invitación y botón que lleva a la página `/contacto`.
- Footer independiente: enlaces de navegación, datos de contacto, redes sociales y crédito.
- Páginas mínimas `/noticias` y `/contacto` (esqueleto navegable, para que los enlaces no rompan).
- Actualización de `lib/nav.ts`: `#noticias` → `/noticias` y `#contacto` → `/contacto`.
- Actualización de los CTA "Asociate" (header) y "Asociate al club" (hero) para apuntar a `/contacto`.

**Fuera de este spec (para specs futuros):**

- Contenido completo de `/noticias` y `/contacto` (listado real con paginación, formulario de contacto, mapa, etc.).
- Detalle individual de noticia (`/noticias/[slug]`).
- La sección "El Club" (`#el-club` sigue sin implementar).
- Datos dinámicos o API / CMS.
- URLs reales de sponsors y datos reales de contacto (los completa el usuario a mano en el código).
- Login / socios / tienda / entradas.

## Modelo de datos

Este spec introduce tres estructuras nuevas: noticias, sponsors y datos del footer. Modifica `lib/nav.ts` pero no su tipo `NavLink`.

```ts
// lib/noticias.ts
export interface Noticia {
  id: string;
  titulo: string;
  fecha: string; // ISO, "YYYY-MM-DD"
  categoria: string;
  extracto: string;
  imagen: string | null; // null = se renderiza un placeholder
}

export const NOTICIAS: Noticia[] = [/* 3 noticias */];
```

```ts
// lib/sponsors.ts
export interface Sponsor {
  id: string;
  nombre: string;
  logo: string; // ruta en /sponsors/
  href: string; // URL del sitio, el usuario la completa a mano
}

export const SPONSORS: Sponsor[] = [
  { id: "amorfar", nombre: "Amorfar", logo: "/sponsors/amorfar.jpg", href: "#" },
  { id: "elpela", nombre: "El Pela", logo: "/sponsors/elpela.png", href: "#" },
  { id: "gran-pata", nombre: "Gran Pata", logo: "/sponsors/gran-pata.png", href: "#" },
  { id: "martilleros", nombre: "Martilleros", logo: "/sponsors/martilleros.png", href: "#" },
  { id: "oscar", nombre: "Oscar", logo: "/sponsors/oscar.png", href: "#" },
];
```

```ts
// lib/footer.ts
export const CONTACTO = {
  direccion: "Av. de la Ribera s/n, El Volcán, San Luis",
  telefono: "+54 9 2664 000-0000",
  email: "contacto@granaderosdekoslay.com.ar",
};

export const SOCIALES = [
  { nombre: "Instagram", href: "#" },
  { nombre: "Facebook", href: "#" },
];
```

Convenciones:

- Fechas en ISO (`YYYY-MM-DD`), igual que el calendario.
- La landing muestra `NOTICIAS.slice(0, 3)`; la página `/noticias` muestra todas.
- Los logos de sponsors viven en `/public/sponsors/`.
- `href: "#"` en sponsors y redes es placeholder hasta que completes las URLs reales.
- El footer reutiliza `NAV_LINKS` de `lib/nav.ts` para sus enlaces de navegación.

## Plan de implementación

1. **Datos de noticias.** Crear `lib/noticias.ts` con `Noticia` y `NOTICIAS` (3 entradas, `imagen: null`).
2. **Datos de sponsors.** Crear `lib/sponsors.ts` con `Sponsor` y `SPONSORS` (las 5 entradas con los logos reales de `/sponsors/`, `href: "#"` por completar).
3. **Datos del footer.** Crear `lib/footer.ts` con `CONTACTO` y `SOCIALES` (placeholders).
4. **Páginas mínimas.** Crear `app/noticias/page.tsx` y `app/contacto/page.tsx`: esqueleto con `Header`, título de página y `Footer` (aún sin contenido completo). Verificación: `/noticias` y `/contacto` cargan sin 404.
5. **Navegación a páginas.** En `lib/nav.ts` cambiar los `href` de Noticias y Contacto a `/noticias` y `/contacto`. En `Header.tsx` el CTA "Asociate" → `/contacto`. En `Hero.tsx` el CTA "Asociate al club" → `/contacto`. Verificación: los links apuntan a las rutas nuevas.
6. **Sección noticias.** Crear `components/Noticias.tsx`: renderiza las primeras 3 de `NOTICIAS`, cada tarjeta con placeholder de imagen, categoría, fecha, título, extracto y un enlace a `/noticias`.
7. **Sección sponsors.** Crear `components/Sponsors.tsx`: tira horizontal de los 5 logos desde `SPONSORS`, cada uno como enlace a `href`.
8. **Sección "Vení a jugar".** Crear `components/CtaSumate.tsx`: título, párrafo de invitación y botón que lleva a `/contacto`, con el corte diagonal del CTA primario.
9. **Footer.** Crear `components/Footer.tsx`: enlaces de navegación desde `NAV_LINKS`, datos de `CONTACTO`, `SOCIALES` y crédito "© 2026 Granaderos de Koslay".
10. **Integración.** En `app/page.tsx` montar `Noticias`, `Sponsors`, `CtaSumate` y `Footer` después de `Calendario`. Verificación: la landing muestra todas las secciones en orden.
11. **Calidad.** Ejecutar `npm run lint` y `npm run build` sin errores.

## Criterios de aceptación

- [ ] `npm run build` y `npm run lint` terminan sin errores.
- [ ] La landing muestra las secciones en orden: Hero, Calendario, Noticias, Sponsors, "Vení a jugar" y Footer.
- [ ] La sección de noticias muestra exactamente las 3 primeras entradas de `NOTICIAS`, cada una con categoría, fecha, título, extracto y placeholder de imagen.
- [ ] Hacer clic en cualquier noticia lleva a la página `/noticias`.
- [ ] La sección de sponsors muestra los 5 logos de `public/sponsors/` en una tira horizontal, cada uno enlazando a su `href`.
- [ ] Cada logo de sponsor tiene `alt` con su nombre.
- [ ] El botón de "Vení a jugar con nosotros" lleva a `/contacto`.
- [ ] El footer muestra enlaces de navegación (desde `NAV_LINKS`), dirección, teléfono, email, redes sociales y el crédito "© 2026 Granaderos de Koslay".
- [ ] En `lib/nav.ts`, Noticias apunta a `/noticias` y Contacto a `/contacto`.
- [ ] Los CTA "Asociate" (header) y "Asociate al club" (hero) llevan a `/contacto`.
- [ ] `/noticias` y `/contacto` cargan sin 404 (esqueleto con Header y Footer).

## Decisiones

- **Sí:** Noticias y Contacto como páginas propias (`/noticias`, `/contacto`) en vez de secciones con ancla. La landing pasa a ser multi-página y deja lugar para crecer (detalle de noticia, formulario).
- **Sí:** Páginas mínimas (esqueleto con Header y Footer) dentro de este spec. Evita enlaces a 404 mientras el contenido completo se define en specs futuros.
- **Sí:** Modificar `lib/nav.ts` (Noticias → `/noticias`, Contacto → `/contacto`) y los CTA "Asociate" / "Asociate al club" → `/contacto`. Coherente con la nueva navegación, aunque toque lo del SPEC 01.
- **Sí:** Datos en archivos `lib/` (noticias, sponsors, footer), mismo patrón que `lib/calendario.ts` del SPEC 01.
- **Sí:** 3 noticias con imagen placeholder (`null` → bloque degradé). Sin detalle individual todavía.
- **Sí:** Tira horizontal de sponsors enlazando a sus sitios. El `href` queda en `"#"` hasta que el usuario complete las URLs.
- **Sí:** CTA "Vení a jugar" sin formulario: título, párrafo y botón → `/contacto`. El formulario pertenece al spec de la página contacto.
- **Sí:** Footer independiente con datos de contacto y redes en placeholder.
- **No:** Formulario de contacto, mapa o listado completo de noticias. Van en los specs de las páginas.
- **No:** Detalle individual de noticia (`/noticias/[slug]`).
- **No:** La sección "El Club" (`#el-club` sigue sin implementar).

## Riesgos

| Riesgo | Mitigación |
| ------ | ---------- |
| Los logos de sponsors mezclan `.jpg` (fondo propio) y `.png` (transparente), con proporciones distintas. | Renderizar con `object-contain` y altura fija en la tira horizontal; nunca `cover`, que recorta. |
| Las páginas nuevas quedan ocultas bajo el header fijo al arrancar el scroll. | Reservar padding superior equivalente a la altura del header en `app/noticias/page.tsx` y `app/contacto/page.tsx`. |
| Next.js 16 tiene breaking changes respecto a versiones conocidas (advertido en `AGENTS.md`). | Leer `node_modules/next/dist/docs/` antes de escribir las páginas y metadatos. |
| Enlaces a `/noticias` y `/contacto` quedan muertos si se cambia la navegación antes de crear las páginas. | El paso 4 (páginas mínimas) va antes del paso 5 (navegación) en el plan. |

## Lo que **no** está en este spec

- Contenido completo de las páginas `/noticias` y `/contacto` (listado real, formulario, mapa).
- Detalle individual de noticia (`/noticias/[slug]`).
- La sección "El Club".
- Datos dinámicos o API / CMS.
- URLs reales de sponsors y datos reales de contacto (los completa el usuario a mano).
- Login, socios, tienda y entradas.

Cada uno de esos, si llega, va en su propio spec.
