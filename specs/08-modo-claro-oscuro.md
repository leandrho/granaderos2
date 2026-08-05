# SPEC 08 — Modo claro/oscuro en todo el sitio (web pública + panel admin)

> **Estado:** Implementado
> **Depende de:** SPEC 01–07 (identidad "Pitch Imperial"), design system "Pitch Imperial" en Stitch
> **Fecha:** 2026-08-04
> **Objetivo:** Agregar selector de tema de 3 estados (claro / oscuro / sistema) a todas las páginas públicas y al panel admin, invirtiendo la superficie mediante tokens semánticos en CSS y manteniendo las bandas de marca navy inalteradas en ambos modos.

---

## Scope

**In:**

- Selector de tema de **3 estados** (claro / oscuro / sistema) en el `Header` público (desktop y mobile), en el `Sidebar` del panel admin y en la pantalla de login (`/admin`).
- Persistencia en `localStorage` con clave `grana-theme` (valores `light | dark | system`); sin valor guardado → se sigue la preferencia del sistema (`prefers-color-scheme`). El valor manual sobreescribe al sistema hasta que el usuario vuelva a "sistema".
- `<script>` inline en `app/layout.tsx` (anti-FOUC): lee `localStorage` + sistema y setea `data-theme` en `<html>` antes del primer paint.
- Migración de **tokens semánticos** en `app/globals.css`: los valores de color viven en variables que se invierten vía `html[data-theme="light"]`; reemplazo de los usos hardcodeados actuales (`border-white`, `text-black`, `bg-white`, `text-gold-glimmer`, `text-on-surface/70`, `bg-surface/80`, etc.) por tokens semánticos en los 34 archivos que hoy usan clases de color.
- Design system **LIGHT** definido en Stitch (asset de modo claro basado en "Pitch Imperial", proyecto `Portal Club de Fútbol`) y capturas de referencia en claro (home, noticias, admin); los valores hex finales del modo claro se traducen de ahí al repo.
- `color-scheme` sincronizado por tema en `<html>` (se evita que el scrollbar y los inputs de la plataforma desentonen).
- Las **bandas de marca navy** (hero, CTA "Sumate", footer, card de login, sidebar admin) se mantienen oscuras en ambos modos; solo se invierte la superficie general (fondo claro + texto navy en modo claro).

**Out of scope (para futuras specs):**

- Sincronización del tema entre dispositivos (solo `localStorage`, sin BD ni cuenta).
- Cuarto estado "reducir contraste" ni ajuste manual de acento de color por usuario.
- Rediseñar la paleta oscura actual (el modo oscuro vigente es la línea base, no se modifica).
- Adaptar el logo ni las imágenes (`logo.png`, fotos de noticias, SVGs de sponsors): se mantienen igual en ambos modos.
- Certificación completa de contraste AA de toda la paleta (solo se verifica manualmente las combinaciones principales: texto sobre fondo y sobre bandas navy).

---

## Data model

La feature introduce tres estructuras nuevas: el estado de tema en el navegador, el bloque de tokens en CSS y el asset de design system LIGHT en Stitch.

### 1. Estado de tema (localStorage)

```ts
// Clave: "grana-theme"
// Valores: "light" | "dark" | "system"  (sin valor guardado → "system")
```

- El atributo `data-theme` en `<html>` solo admite `"dark"` (por defecto) o `"light"`: el estado `"system"` resuelve a uno de ellos según `prefers-color-scheme`, tanto en el script inline como en el toggle.
- El render del servidor siempre emite `data-theme="dark"` (la web actual es oscura); el script inline lo corrige antes del paint. Por eso `<html>` lleva `suppressHydrationWarning`.

### 2. Tokens semánticos (app/globals.css)

Se separan los valores de runtime de los utilitarios. Los utilitarios referencian variables que se invierten por tema:

```css
@theme inline {
  --color-surface: var(--surface);
  --color-surface-soft: var(--surface-soft);
  --color-on-surface: var(--on-surface);
  --color-on-surface-muted: var(--on-surface-muted);
  --color-line: var(--line);
  --color-gold: var(--gold);            /* acento dorado sobre superficies (flipa) */
  --color-gold-glimmer: var(--gold-glimmer); /* dorado sobre bandas navy (fijo) */
  --color-primary: var(--navy);         /* bandas navy: fijo en ambos modos */
  --color-secondary: var(--gold-banda); /* dorado de marca #c5a059: fijo */
  --color-tertiary: var(--red);         /* #d31124: fijo */
  --color-stadium-black: var(--stadium);/* #050b14: fijo */
}

:root, html[data-theme="dark"] { --surface: #131315; --on-surface: #e4e2e4; /* … */ }
html[data-theme="light"] { --surface: #f6f4ee; --on-surface: #0a1d37; /* … */ }
```

Convenciones de la migración:

- `border-white/*`, `text-black`, `bg-white`, `text-on-surface/70` → token semántico equivalente (`line`, `on-surface-muted`, `surface-soft`, …).
- `gold-glimmer` sobre bandas navy (hero, CTA, footer, login, sidebar) conserva `#e8cf96`; sobre superficies generales pasa a `--gold` (en claro, dorado oscuro con contraste AA sobre fondo claro).
- `primary`, `secondary`, `tertiary`, `stadium-black` mantienen su valor en ambos modos (bandas de marca inalteradas).
- Los valores hex exactos del modo claro se toman del asset LIGHT de Stitch (paso de implementación 1), no se inventan en el repo.

### 3. Design system LIGHT en Stitch

- Asset nuevo (o actualización del existente) con `colorMode: LIGHT` sobre la base "Pitch Imperial" (`customColor`/override navy `#0a1d37`, gold `#c5a059`, red `#d31124`, Anton + Hanken Grotesk + Space Grotesk), `roundness` agudo 0.
- Capturas de referencia en modo claro: home, noticias, admin dashboard y login.
- El design system DARK existente ("Pitch Imperial") no se modifica.

---

## Implementation plan

1. **Design system LIGHT en Stitch** (no toca el repo). En el proyecto `Portal Club de Fútbol`, crear el asset de design system en modo claro sobre la base "Pitch Imperial" (colores de marca fijos, superficie clara, `roundness` 0, fuentes Anton + Hanken Grotesk + Space Grotesk) y generar capturas de referencia en claro (home, noticias, dashboard, login). Salida: los hex exactos de la superficie clara para el paso 2.
2. **Tokens en `app/globals.css`.** Reescribir `@theme inline` para que los utilitarios referencien variables de runtime (`var(--surface)`, `var(--on-surface)`, etc.); agregar el bloque `:root, html[data-theme="dark"]` con los valores oscuros actuales (visual idéntico al de hoy) y `html[data-theme="light"]` con los hex del paso 1. Verificación: `npm run build` y la web en oscuro se ve igual que antes.
3. **Script anti-FOUC en `app/layout.tsx`.** `<script>` inline en `<head>` que resuelve `grana-theme` (o `prefers-color-scheme` si no hay valor) y setea `data-theme` + `color-scheme` en `<html>` antes del paint; `suppressHydrationWarning` en `<html>`. El CSP de SPEC 07 ya permite `'unsafe-inline'` en `script-src`, no hay que tocarlo. Verificación: recargar con `grana-theme=light` sin parpadeo oscuro.
4. **Componente `ThemeToggle`.** Crear `components/ui/ThemeToggle.tsx` (`"use client"`): botón que cicla claro → oscuro → sistema, persiste `grana-theme`, actualiza `data-theme`/`color-scheme`, `aria-label` y `title` en español; sin dependencias nuevas.
5. **Header público.** Integrar `ThemeToggle` en `components/layout/Header.tsx` (barra superior y menú mobile) y migrar sus usos hardcodeados (`border-white/10`, `bg-surface/80`, `text-on-surface/70`, `hover:text-gold-glimmer`) a tokens.
6. **Migración de la web pública.** Reemplazar clases hardcodeadas por tokens semánticos en `components/sections/*` (`Hero`, `Calendario`, `Noticias`, `Sponsors`, `CtaSumate`), `components/ui/*` (`Button`, `Badge`, `PageHeader`, `SectionHeading`), `components/layout/Footer.tsx` y páginas (`app/page.tsx`, `app/calendario`, `app/noticias`, `app/el-club`, `app/contacto`). Las bandas navy (hero, CTA, footer) usan los tokens fijos. Cada archivo queda funcional al terminar.
7. **Panel admin.** Integrar `ThemeToggle` en `components/admin/Sidebar.tsx` y en `app/admin/page.tsx` (login); migrar `app/admin/*` y `components/admin/*` a tokens manteniendo la estética navy del sidebar y la card de login.
8. **Verificación global.** `npm run build` y `npm run lint` pasan; checklist manual completo de los 3 estados en todas las páginas (públicas + admin) en ambos modos.

---

## Acceptance criteria

- [ ] En modo oscuro la web se ve **idéntica** a antes de la spec (los valores de los tokens oscuros no cambian).
- [ ] Sin valor en `grana-theme`, el sitio arranca siguiendo `prefers-color-scheme` del sistema.
- [ ] Con `grana-theme=light` (o `dark`) en localStorage, el sitio arranca en ese modo **sin parpadeo** de tema (anti-FOUC).
- [ ] El `ThemeToggle` está presente en el `Header` público (desktop y mobile), en el `Sidebar` admin y en la pantalla de login `/admin`.
- [ ] El toggle cicla exactamente 3 estados (claro → oscuro → sistema) y persiste la elección en `grana-theme`.
- [ ] Elegir "claro" o "oscuro" manualmente sobreescribe a la preferencia del sistema; elegir "sistema" vuelve a seguirla.
- [ ] Las páginas públicas (home, calendario, noticias, el-club, contacto) y del panel (dashboard, noticias, calendario, equipos, login) se ven correctas en ambos modos, sin texto ilegible ni elementos invisibles.
- [ ] Las bandas navy (hero, CTA "Sumate", footer, sidebar admin, card de login) mantienen fondo navy y texto claro en ambos modos.
- [ ] `color-scheme` del `<html>` coincide con el tema activo (scrollbar e inputs del navegador acordes).
- [ ] `grep` de `border-white|text-black|bg-white|text-gold-glimmer` sobre componentes: solo quedan ocurrencias justificadas (texto negro sobre botones gold, bandas navy), ninguna sobre superficies generales.
- [ ] Las combinaciones principales de texto cumplen contraste AA: navy sobre fondo claro, claro sobre bandas navy, dorado oscuro sobre fondo claro.
- [ ] `npm run build` y `npm run lint` pasan sin errores.

---

## Decisions

- **Sí: 3 estados (claro / oscuro / sistema) con `prefers-color-scheme` como valor por defecto.** Definido por el usuario; quien nunca tocó el toggle sigue al sistema.
- **Sí: persistencia en `localStorage` con clave `grana-theme`.** Sin backend; el estado de tema vive en el navegador.
- **Sí: el valor manual sobreescribe al sistema** hasta que el usuario elija "sistema". Comportamiento estándar y predecible.
- **Sí: `<script>` inline anti-FOUC en `app/layout.tsx`.** Evita el flash de tema en cada navegación; el CSP de SPEC 07 ya incluye `'unsafe-inline'` en `script-src`, no requiere cambios.
- **Sí: el render del servidor siempre emite `data-theme="dark"`** (con `suppressHydrationWarning`). Coherente con la identidad actual; el script corrige antes del paint.
- **Sí: tokens semánticos con flip vía `html[data-theme]`** en vez de variantes `dark:` por componente. Un solo bloque CSS controla el tema; no se duplican clases en los 34 archivos.
- **Sí: dos tokens dorados** — `--gold` (flipa a dorado oscuro sobre superficies claras) y `--gold-glimmer` (fijo `#e8cf96`, reservado a bandas navy). El dorado claro sobre bandas navy es parte de la identidad; sobre fondo claro exigiría mal contraste.
- **Sí: bandas navy fijas en ambos modos** (hero, CTA, footer, sidebar admin, card de login). Decisión del usuario; conserva la identidad y garantiza contraste sin ambigüedad.
- **Sí: Stitch define el design system LIGHT y las capturas de referencia.** Los hex de la superficie clara salen del asset LIGHT de Stitch, no se inventan en el repo.
- **Sí: implementación manual del toggle** (script + `ThemeToggle`) en vez de `next-themes`. Feature acotada a 3 estados; cero dependencias nuevas; ya existen `"use client"` en el repo (Header).
- **No: sincronización del tema entre dispositivos.** Requiere backend o cuenta; posible spec futura.
- **No: cuarto estado "reducir contraste" ni acento de color configurable por usuario.**
- **No: rediseñar la paleta oscura actual.** El modo oscuro vigente es la línea base y no se modifica.
- **No: `next-themes`.** Dependencia innecesaria para un toggle de 3 estados con script manual.
- **No: adaptar logo ni imágenes a cada modo.** `logo.png`, fotos y SVGs de sponsors se mantienen iguales.

---

## Risks

| Risk | Mitigation |
| ---- | ---------- |
| Flash de tema si el script falla o se ejecuta tarde | Script inline síncrono en `<head>`, sin `async`/`defer`; además el fallback renderiza oscuro (la identidad actual), así que nunca se ve un modo roto. |
| Los utilitarios con opacidad (`text-on-surface/70`, `bg-surface/80`) dependen de `color-mix()` con `var()` | Sintaxis estándar en navegadores modernos; se valida en la revisión por página de ambos modos. |
| Los hex de la superficie clara salidos de Stitch desentonan con la identidad | Solo la superficie clara proviene de Stitch; navy `#0a1d37`, gold `#c5a059` y red `#d31124` están fijados y no varían; validación visual contra las capturas. |
| El dorado oscuro sobre fondo claro no alcanza contraste AA | El tono se elige y verifica en el paso de Stitch (captura en claro) y en el checklist de contraste. |
| Queda un color hardcodeado olvidado que rompe el modo claro | El criterio de aceptación con `grep` (`border-white\|text-black\|bg-white\|text-gold-glimmer`) + revisión página por página en ambos modos. |
| `border-white/10` reemplazado por `border-line/10` altera levemente el modo oscuro | En el bloque oscuro `--line` se define equivalente a `#fff` para que el visual no cambie; se verifica contra el estado actual. |
| Un componente admin nuevo se agregue sin usar tokens | Convención del proyecto: todos los colores viven en tokens; el grep del criterio de aceptación lo detecta en el futuro. |

---

## What is **not** in this spec

- Sincronización del tema entre dispositivos (backend o cuenta).
- Cuarto estado "reducir contraste" ni acento de color configurable.
- Rediseño de la paleta oscura actual (línea base inmutable).
- Adaptación de logo e imágenes a cada modo.
- Certificación completa de contraste AA de toda la paleta.

Cada uno de esos puntos, si llega, va en su propia spec.
