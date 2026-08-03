# SPEC 01 — Landing del Club Granaderos de Koslay: header, hero y calendario

> **Estado:** Implementado
> **Depende de:** — (primer spec del proyecto)
> **Fecha:** 2026-08-01
> **Objetivo:** Construir las secciones header, hero y calendario de próximos partidos de la landing del Club Deportivo Granaderos de Koslay aplicando el design system Pitch Imperial de Stitch.

## Alcance

**Dentro de este spec:**

- Header fijo con navegación: Inicio, El Club, Calendario, Noticias, Contacto + CTA "Asociate". En mobile, menú hamburguesa con overlay glassmorphism (blur + tinte blanco), al estilo de Stitch.
- Hero con titular en Anton, subtítulo, doble CTA ("Ver calendario" y "Asociate al club") y fondo/imagen placeholder de cancha.
- Calendario de próximos partidos: hasta 5 partidos, con campo de categoría (Primera, Reserva, Juveniles, etc.), datos estáticos.
- Aplicación del design system Pitch Imperial: colores navy/red/gold, tipografías Anton + Hanken Grotesk + Space Grotesk (vía `next/font`), esquinas rectas, cortes diagonales a 45° en CTA.
- Maquetado responsive: desktop 12 columnas, mobile 4 columnas.

**Fuera de este spec (para specs futuros):**

- Footer.
- Páginas/secciones completas de El Club, Noticias y Contacto.
- Resultados pasados, tabla de posiciones y estadísticas.
- Datos dinámicos o API (el calendario es estático por ahora).
- Login / socios / tienda / entradas.
- Reemplazo de placeholders por logo y fotos reales del club.

## Modelo de datos

Este spec introduce dos estructuras: la navegación y la lista de partidos.

```ts
// lib/nav.ts
export interface NavLink {
  label: string;
  href: string;
}

export const NAV_LINKS: NavLink[] = [
  { label: "Inicio", href: "#inicio" },
  { label: "El Club", href: "#el-club" },
  { label: "Calendario", href: "#calendario" },
  { label: "Noticias", href: "#noticias" },
  { label: "Contacto", href: "#contacto" },
];
```

```ts
// lib/calendario.ts
export type Categoria =
  | "Primera"
  | "Reserva"
  | "Sub-15"
  | "Sub-17"
  | "Femenino";

export interface Partido {
  id: string;
  fecha: string; // ISO, "YYYY-MM-DD"
  hora: string; // "HH:MM", formato 24 h
  categoria: Categoria;
  rival: string;
  local: boolean; // true = juega en Koslay
  competencia: string;
}

export const PROXIMOS_PARTIDOS: Partido[] = [/* hasta 5 partidos */];
```

Convenciones:

- Fechas en ISO (`YYYY-MM-DD`), horas en 24 h.
- Anclas con `#id` apuntan a secciones futuras (`#el-club`, `#noticias`, `#contacto`) aunque esas secciones aún no existan.
- `PROXIMOS_PARTIDOS` contiene como máximo 5 entradas, de distintas categorías.

## Plan de implementación

1. **Fuentes y tokens.** En `app/layout.tsx` agregar las fuentes `Anton`, `Hanken_Grotesk` y `Space_Grotesk` vía `next/font/google`, expuestas como variables CSS. En `app/globals.css` definir los tokens de color de Pitch Imperial en `@theme` (surface, on-surface, primary #0A1D37, secondary #C5A059, tertiary #D31124, gold-glimmer, stadium-black). Verificación: `npm run dev`, la página carga con las fuentes nuevas.

2. **Datos de navegación.** Crear `lib/nav.ts` con `NAV_LINKS` (5 enlaces + CTA "Asociate").

3. **Datos del calendario.** Crear `lib/calendario.ts` con el tipo `Partido`, `Categoria` y `PROXIMOS_PARTIDOS` con 5 partidos de ejemplo de distintas categorías.

4. **Header.** Crear `components/Header.tsx`: barra fija al tope, marca del club en texto, enlaces de navegación, CTA "Asociate". En mobile, botón hamburguesa que abre un overlay con blur de 12 px y tinte blanco al 20 % (glassmorphism).

5. **Hero.** Crear `components/Hero.tsx`: titular en Anton, subtítulo, doble CTA — "Ver calendario" (ancla a `#calendario`, primario gold con corte diagonal) y "Asociate al club" (secundario con borde blanco) — más imagen placeholder de cancha de fondo.

6. **Calendario.** Crear `components/Calendario.tsx`: renderiza `PROXIMOS_PARTIDOS`, cada partido con badge de categoría, fecha, hora, rival, indicador local/visitante y competencia. Con las 5 entradas como máximo.

7. **Integración.** En `app/page.tsx` montar `Header`, `Hero` y `Calendario` en orden. Verificación: scroll de ancla desde el hero hasta `#calendario`.

8. **Calidad.** Ejecutar `npm run lint` y `npm run build` sin errores.

## Criterios de aceptación

- [ ] `npm run build` y `npm run lint` terminan sin errores.
- [ ] El header es fijo al tope y muestra los 5 enlaces (`#inicio`, `#el-club`, `#calendario`, `#noticias`, `#contacto`) y el CTA "Asociate".
- [ ] Por debajo de 768 px el header muestra el botón hamburguesa; al abrirlo se despliega el overlay glassmorphism (blur 12 px + tinte blanco 20 %) con los mismos enlaces.
- [ ] El hero muestra titular en Anton, subtítulo y dos CTA: "Ver calendario" y "Asociate al club".
- [ ] El CTA primario "Ver calendario" usa gold #C5A059 con corte diagonal a 45° en su esquina.
- [ ] Al hacer clic en "Ver calendario" la página desplaza suavemente hasta la sección `#calendario`.
- [ ] El calendario muestra exactamente las entradas de `PROXIMOS_PARTIDOS`, con un máximo de 5.
- [ ] Cada partido muestra categoría, fecha, hora, rival, local/visitante y competencia.
- [ ] Las tipografías cargan vía `next/font`: Anton en titulares, Hanken Grotesk en cuerpo, Space Grotesk en etiquetas técnicas (fecha/hora).
- [ ] No se usan imágenes reales del club: solo placeholders.

## Decisiones

- **Sí:** Design system Pitch Imperial (dark) del proyecto Stitch "Modern Football Club Hub". Es el más reciente y se ajusta al tono deportivo del club.
- **No:** Design system Apex Athletic (light). Queda descartado por coherencia con la dirección visual ya elegida.
- **Sí:** Colores de Pitch Imperial tal cual (navy/red/gold). Aunque el club pueda tener colores propios, no hay material confirmado; los tokens del design system son la fuente de verdad por ahora.
- **No:** Datos dinámicos o API para el calendario. Los partidos son estáticos en `lib/calendario.ts`; se migra a API cuando exista una fuente de datos.
- **Sí:** Solo próximos partidos (máx. 5), no resultados ni tabla de posiciones. Acota el alcance y encaja con "ver calendario" como CTA del hero.
- **Sí:** Placeholders en imágenes. No hay logo/fotos reales del club todavía.
- **No:** Footer, secciones completas de El Club/Noticias/Contacto, login, tienda. Van en specs futuros.
- **Sí:** Estados de spec en español (Borrador/Aprobado). Coherente con el idioma del proyecto.

## Riesgos

| Riesgo                                        | Mitigación                                                                    |
| --------------------------------------------- | ----------------------------------------------------------------------------- |
| Next.js 16 tiene breaking changes respecto a versiones conocidas (advertido en `AGENTS.md`). | Leer `node_modules/next/dist/docs/` antes de escribir código de fuentes y metadatos. |
| El ancla `#calendario` queda oculta debajo del header fijo al hacer scroll. | Reservar scroll-margin en la sección o padding superior equivalente a la altura del header. |
| Las fuentes Anton/Space Grotesk pueden no renderizar en entornos sin acceso a Google Fonts. | Cargar vía `next/font/google` (se sirven self-hosted, sin requests externas). |

## Lo que **no** está en este spec

- Footer.
- Páginas/secciones completas de El Club, Noticias y Contacto.
- Resultados pasados, tabla de posiciones y estadísticas.
- Datos dinámicos o API.
- Login, socios, tienda y entradas.
- Logo y fotos reales del club.

Cada uno de esos, si llega, va en su propio spec.
