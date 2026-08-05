# SPEC 07 — Endurecimiento de seguridad del login del panel /admin

> **Estado:** Implementado
> **Depende de:** SPEC 06 (Login JWT), SPEC 04/05 (server actions de admin)
> **Fecha:** 2026-08-04
> **Objetivo:** Endurecer la seguridad del acceso al panel /admin con bloqueo escalonado de intentos fallidos por IP (5 intentos → espera de 5 min → 5 más → bloqueo de 24 h), guard de sesión en todas las server actions de admin, auditoría de intentos, headers de seguridad y script de reset de contraseña.

---

## Scope

**In:**

- Tabla `IntentoLogin` en SQLite (auditoría de intentos fallidos + estado de bloqueo por IP).
- Algoritmo escalonado acumulativo en `loginAction`: 5 intentos libres → bloqueo parcial de 5 min → 5 intentos más → bloqueo de 24 h; contador nunca decae solo; login exitoso resetea; al vencer el bloqueo de 24 h el contador vuelve a 0.
- Conteo por **IP del cliente** (header `x-forwarded-for`, con fallback a `request.ip`).
- Mensajes de bloqueo en el formulario de login ("Demasiados intentos. Intentá de nuevo en X min") con el tiempo restante; las credenciales incorrectas siguen mostrando el error genérico actual.
- Guard `requiereSesion()` ejecutado en **todas** las server actions de admin (`noticias`, `equipos`, `calendario`, `auth`): sin token JWT válido en la cookie → error y rechazo de la operación.
- Headers de seguridad en `next.config.ts` (CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy).
- Script `reset-admin-password` (CLI) que regenera el hash bcrypt del usuario admin sin tocar la BD a mano.

**Out of scope (para futuras specs):**

- Registro público de usuarios, recuperación de contraseña olvidada, 2FA, CRUD de usuarios desde el panel.
- Rotación de tokens ni vencimiento deslizante (2 h fijas se mantienen).
- Rate limiting en rutas públicas (solo aplica al login).
- Proteger `/api/imagenes/*` (queda público, lo consumen las páginas públicas).
- Captcha o pruebas de verificación.
- Estado distribuido (Redis/externo): SQLite basta para un solo admin.
- Notificaciones (email) al bloquear una IP.

---

## Data model

Se agregan dos tablas a `prisma/schema.prisma` (misma convención: `Int` autoincremental, timestamps, `@@map` en plural, nombres en español):

```prisma
// Auditoría: una fila por intento fallido (append-only)
model IntentoLogin {
  id        Int      @id @default(autoincrement())
  ip        String
  usuario   String   // usuario intentado
  createdAt DateTime @default(now())

  @@map("intentos_login")
}

// Estado de bloqueo: una fila por IP
model BloqueoLogin {
  ip            String    @id
  conteoFallas  Int       @default(0)
  bloqueadoHasta DateTime? // null = sin bloqueo activo
  actualizadoEn DateTime  @updatedAt

  @@map("bloqueo_login")
}
```

Reglas del algoritmo (escalonado acumulativo, por IP):

- **1–5:** cada fallo hace `conteoFallas+1` (upsert por IP) e inserta una fila en `IntentoLogin`.
- **Al llegar a 5:** `bloqueadoHasta = ahora + 5 min`. Los intentos rechazados por bloqueo **no incrementan ni auditan** (solo cuentan los fallos de credenciales).
- **Vencido el bloqueo parcial:** se limpia `bloqueadoHasta` y los intentos 6–10 quedan libres (el contador **no** se reinicia).
- **Al llegar a 10:** `bloqueadoHasta = ahora + 24 h`.
- **Vencido el bloqueo largo:** `conteoFallas` vuelve a **0** y se limpia `bloqueadoHasta` (se vuelve al estado inicial). Distinción por el valor de `conteoFallas` al vencer: `>= 10` → reset; `5` → solo limpiar.
- **Login exitoso:** se **elimina** la fila de `BloqueoLogin` de esa IP (reset completo).
- El contador nunca decae solo; los únicos resets son login exitoso y vencimiento del bloqueo de 24 h.
- IP del cliente: `x-forwarded-for` (primer valor) con fallback a `request.ip` (en dev será `::1`).
- Sin purga automática de la auditoría (volumen bajo con un solo admin); se agrega en una spec futura si hace falta.

---

## Implementation plan

Constantes del esquema (exportadas en `lib/auth/rate-limit.ts` para poder reducirlas en el test manual, como se hizo con el `exp` del JWT en SPEC 06): `MAX_PRIMER_ESCALON = 5`, `ESPERA_PARCIAAL = 5 min`, `MAX_SEGUNDO_ESCALON = 10`, `ESPERA_LARGA = 24 h`.

1. **Migración de esquema.** Agregar `IntentoLogin` y `BloqueoLogin` a `prisma/schema.prisma` (con índice en `IntentoLogin.ip`) y ejecutar `npx prisma migrate dev --name bloqueo_login`. No requiere cambios de seed.
2. **Helper de rate limiting.** Crear `lib/auth/rate-limit.ts` con: `obtenerIpCliente()` (primer valor de `x-forwarded-for`, fallback `request.ip`), `minutosRestantesDeBloqueo(ip)` (lee `BloqueoLogin`; si `bloqueadoHasta` venció: reset a 0 si `conteoFallas >= 10`, si no limpia el bloqueo y devuelve null), `registrarFallo(ip, usuario)` (upsert `conteoFallas+1` + fila en `IntentoLogin`; setea `bloqueadoHasta` al llegar a 5 o 10) y `limpiarBloqueo(ip)` (elimina la fila). Toda la lógica del escalonado vive acá.
3. **Integrar en `loginAction`.** En `app/actions/admin/auth.admin.actions.ts`: al inicio, si hay bloqueo activo → devolver error con los minutos restantes (sin consultar credenciales ni emitir cookie); tras fallo de credenciales → `registrarFallo`; en éxito → `limpiarBloqueo` antes del `redirect`. Los intentos rechazados por bloqueo no incrementan el contador (regla ya definida).
4. **Guard `requiereSesion()`.** En `lib/auth/session.ts`: helper que lee la cookie y verifica el JWT, devolviendo `DatosSesion | null`. Aplicarlo como primera línea de **todas** las server actions de admin (`noticias`, `equipos`, `calendario`, y `logoutAction`): sin sesión → retornar error (sin `redirect` ni efectos secundarios). `loginAction` queda exenta (es el punto de entrada).
5. **Mensaje de bloqueo en el login.** En `app/admin/page.tsx`, mostrar el error de bloqueo con tiempo restante en minutos (estilo Pitch Imperial, misma presentación que el error de credenciales).
6. **Headers de seguridad.** En `next.config.ts`, agregar `headers()` globales: `Content-Security-Policy` (default-src 'self', img-src 'self' data:, style-src 'self' 'unsafe-inline' por next/font y Tailwind, script-src 'self'), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` restrictiva. Verificar en dev que no rompe nada (fuentes, imágenes de `/api/imagenes`, SVGs de sponsors).
7. **Script de reset de contraseña.** Crear `scripts/reset-admin-password.ts` + script npm `reset-password`: toma el usuario y la nueva contraseña (argumentos CLI), hashea con `bcryptjs` (costo 10, igual que el seed) y actualiza `Usuario`; imprime confirmación. Evita editar la BD a mano.
8. **Verificación.** `npm run build`, `npm run lint` y prueba manual: 5 fallos → mensaje de bloqueo con cuenta regresiva; con constantes reducidas a segundos, verificar el vencimiento del bloqueo parcial (intentos 6–10) y del de 24 h (reset a 0); login exitoso resetea; guard rechaza acciones admin sin sesión (invocar con cookie borrada); `curl -I` muestra los headers; `npm run reset-password` actualiza y permite el login con la nueva contraseña.

---

## Acceptance criteria

- [ ] Existen las tablas `intentos_login` y `bloqueo_login` tras la migración.
- [ ] Con credenciales incorrectas (fallos 1–5) se muestra "Credenciales inválidas", se inserta una fila en `IntentoLogin` y `conteoFallas` de la IP sube de 1 en 1.
- [ ] Tras el 5º fallo, el intento siguiente dentro de la espera devuelve el mensaje de bloqueo con minutos restantes, sin validar credenciales ni emitir cookie.
- [ ] Vencido el bloqueo parcial, los fallos 6–10 vuelven a evaluarse e incrementan el conteo (no se reinicia).
- [ ] Tras el 10º fallo, el login queda bloqueado por 24 h (verificable reduciendo las constantes a segundos).
- [ ] Al vencer el bloqueo de 24 h, el contador de la IP vuelve a 0 y el flujo empieza de nuevo.
- [ ] Un login exitoso elimina la fila de `BloqueoLogin` de la IP (contador en 0).
- [ ] Los intentos rechazados por bloqueo no incrementan el contador ni crean filas en `IntentoLogin`.
- [ ] Ninguna server action de admin (`noticias`, `equipos`, `calendario`, `logout`) sin token válido produce efectos: retorna error y no modifica datos.
- [ ] Todas las respuestas HTTP incluyen los headers de seguridad (CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy).
- [ ] El sitio público sigue funcionando con el CSP activo: fuentes, imágenes de `/api/imagenes/*` y SVGs de sponsors se renderizan sin bloqueos.
- [ ] `npm run reset-password <usuario> <nueva>` actualiza el hash y el login funciona con la nueva contraseña.
- [ ] `npm run build` y `npm run lint` pasan sin errores.

---

## Decisions

- **Sí: estado en SQLite** (`BloqueoLogin` + `IntentoLogin`) en vez de en memoria. Persiste reinicios y es coherente con el stack Prisma/SQLite; un Map se perdería al reiniciar el server.
- **Sí: esquema escalonado acumulativo literal** (5 → espera 5 min → 5 → bloqueo 24 h) tal como lo definió el usuario, en vez de ventana deslizante (descartada por el usuario en fase de definición).
- **Sí: conteo por IP** (elegido por el usuario). Con un solo admin basta y bloquea fuerza bruta distribuida; el costo es que una red compartida (NAT) puede quedar bloqueada en conjunto — aceptado.
- **Sí: dos tablas separadas** (auditoría append-only + estado por IP) en vez de derivar el estado contando filas del log. El estado se actualiza con un upsert simple y la auditoría no se contamina con resets ni logins exitosos.
- **Sí: guard `requiereSesion()` en todas las server actions de admin.** Cierra el hueco real de SPEC 06: las server actions se invocan sin pasar por `proxy.ts`, así que el middleware no las protege.
- **Sí: headers de seguridad en `next.config.ts` (`headers()`)** en vez de middleware/proxy. Declarativo, sin código y se aplica a todas las rutas.
- **Sí: script CLI `reset-admin-password`.** Resuelve el riesgo anotado en SPEC 06 (olvido de la contraseña del seed) sin CRUD de usuarios en el panel; reutiliza `bcryptjs` con costo 10.
- **Sí: constantes del esquema exportadas y reducibles a segundos para el test manual.** Misma técnica del `exp` del JWT en SPEC 06.
- **Sí: mensaje de bloqueo con tiempo restante.** UX clara; el tiempo de espera no filtra información útil al atacante.
- **No: contar ni auditar los intentos rechazados por bloqueo.** Evita que el spam de requests escale el bloqueo de 5 min a 24 h por inercia.
- **No: ventana deslizante.** Descartada por el usuario en definición; el escalonado literal es más simple y suficiente para un único admin.
- **No: 2FA, captcha, registro público, recuperación de contraseña.** Fuera de alcance; posibles specs futuras.
- **No: estado distribuido (Redis/externo).** Un solo admin; SQLite alcanza.
- **No: notificaciones por email al bloquear, ni purga automática de la auditoría.** Volumen bajo; se agregan en una spec futura si hace falta.

---

## Risks

| Risk | Mitigation |
| ---- | ---------- |
| `x-forwarded-for` falsificable si el proxy no lo pisa | En deploy la plataforma pisa el header; tomar el primer valor y documentar que el conteo vale solo si el proxy es de confianza. |
| Red NAT compartida: varias personas quedan bloqueadas juntas | Decisión aceptada (conteo por IP); el bloqueo afecta solo el login del panel y dura como máximo 24 h. |
| El CSP rompe partes del sitio (inline styles de next/font, SVGs, imágenes de `/api/imagenes`) | Verificar en dev tras aplicar headers y ajustar directivas antes de cerrar la spec; `style-src 'unsafe-inline'` cubre next/font y los assets son todos `'self'`. |
| Concurrencia en el conteo (requests simultáneos) | SQLite serializa escrituras; el incremento se hace con un único upsert atómico. |
| Quedarse con las constantes reducidas a segundos tras el test | Restaurarlas antes de terminar; viven en un solo lugar (`lib/auth/rate-limit.ts`) y se anota en el paso de verificación. |
| Una server action admin nueva se agregue sin el guard | Convención del proyecto: `requiereSesion()` como primera línea de toda action admin; se revisa en code review. |
| En dev todo el tráfico viene de `::1` | Sin impacto real (un solo desarrollador); el conteo por loopback es consistente. |
