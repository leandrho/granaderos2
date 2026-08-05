# SPEC 06 — Login de administradores (JWT) para el panel /admin

> **Estado:** Implementado
> **Depende de:** SPEC 04 (Panel de Administración)
> **Fecha:** 2026-08-04
> **Objetivo:** Autenticar el acceso al panel de administración agregando una tabla `Usuario` con hash de contraseña, una pantalla de login en `/admin` que emite un JWT de 2 horas en cookie httpOnly, y un middleware que protege todas las rutas `/admin/*` redirigiendo a `/admin` cuando no hay sesión válida.

---

## Scope

**In:**

- Modelo `Usuario` en `prisma/schema.prisma` (usuario único + hash de contraseña) y su migración.
- Seed con el usuario admin inicial (`admin` / `YusGrana2992++!!xE`).
- Dependencias nuevas: `jose` (JWT) y `bcryptjs` (hash); `JWT_SECRET` en `.env`.
- `/admin` pasa a ser la **pantalla de login** (formulario de usuario/contraseña); el dashboard vive en `/admin/dashboard` (ruta ya existente).
- Server action `login` que valida credenciales contra la BD, emite un JWT de **2 horas (fijo)** y lo guarda en cookie `httpOnly`, `Secure`, `SameSite=Lax`.
- Middleware que protege **todas** las rutas `/admin/*` (dashboard, noticias, calendario, equipos): sin token válido → redirect a `/admin`; con sesión válida en `/admin` → redirect a `/admin/dashboard`.
- Botón "Cerrar sesión" en el sidebar del panel (server action que borra la cookie y redirige a `/admin`).
- `/api/imagenes/*` queda **público** (lo consumen las páginas públicas del sitio).

**Out of scope (para futuras specs):**

- CRUD de usuarios ni cambio de contraseña desde el panel (los admins se gestionan por seed/script).
- Recuperación/reseteo de contraseña olvidada.
- Registro público de usuarios.
- Vencimiento deslizante, refresh/rotación de tokens (2 h fijas desde el login).
- Rate limiting ni bloqueo por intentos fallidos.
- Protección de rutas fuera de `/admin/*`.

---

## Data model

Se agrega el modelo `Usuario` a `prisma/schema.prisma` siguiendo la convención de los modelos existentes (`Int` autoincremental, timestamps, `@@map` en plural):

```prisma
model Usuario {
  id        Int      @id @default(autoincrement())
  usuario   String   @unique
  hash      String   // hash bcrypt de la contraseña
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("usuarios")
}
```

Reglas y convenciones:

- JWT firmado con `jose` (HS256) usando `JWT_SECRET` de `.env`; payload `{ sub: <id>, usuario }` con `exp` fijo a **2 horas** desde el login.
- Cookie de sesión: `admin_token`, atributos `httpOnly`, `Secure`, `SameSite=Lax`, `maxAge` 2 h.
- No hay tabla de sesiones: la validez la determina la expiración del JWT.
- Contraseña hasheada con `bcryptjs` (costo 10 por defecto), tanto en el seed como en la verificación del login.

---

## Implementation plan

1. **Dependencias.** Instalar `jose` y `bcryptjs`; agregar `JWT_SECRET` a `.env`.
2. **Modelo y migración.** Agregar `Usuario` a `prisma/schema.prisma` y ejecutar `npx prisma migrate dev --name add_usuario`.
3. **Seed.** En `prisma/seed.ts`, upsert del usuario `admin` con el hash bcrypt de `YusGrana2992++!!xE`; ejecutar `npx prisma db seed`.
4. **Helpers de auth.** Crear `lib/auth/jwt.ts` (`crearToken(usuario)` / `verificarToken(token)` con `jose`, HS256, `exp` 2 h) y `lib/auth/session.ts` (leer/borrar la cookie `admin_token` con `await cookies()`). Solo `jose` interviene acá, así los helpers son importables desde middleware (edge) y server actions (Node).
5. **Server actions.** Crear `app/actions/admin/auth.admin.actions.ts` (misma convención de nombres que los existentes): `loginAction` — valida el usuario y compara el hash con `bcryptjs`, setea la cookie y redirige a `/admin/dashboard`; error genérico "Credenciales inválidas" sin revelar cuál campo falló. `logoutAction` — borra la cookie y redirige a `/admin`.
6. **Pantalla de login.** Convertir `app/admin/page.tsx` en el formulario de login (server action, estilo Pitch Imperial, error inline). Ajustar `app/admin/layout.tsx` para que el sidebar se renderice **solo con sesión válida** (el layout es server component: puede leer la cookie). El dashboard sigue en `/admin/dashboard` sin cambios de URL.
7. **Logout.** Botón "Cerrar sesión" en el sidebar que invoca `logoutAction`.
8. **Middleware.** Crear `middleware.ts` en la raíz, `matcher: ["/admin/:path*"]`: token inválido o expirado en cualquier `/admin/*` → redirect a `/admin`; token válido en `/admin` → redirect a `/admin/dashboard`. Sin acceso a la BD en edge: solo verificación del JWT.
9. **Verificación.** `npm run build`, `npm run lint` y prueba manual: login, acceso a las rutas del panel, redirección con sesión expirada, logout.

---

## Acceptance criteria

- [ ] Existe la tabla `usuarios` con el usuario `admin` cuyo hash bcrypt verifica la contraseña `YusGrana2992++!!xE`.
- [ ] Al ingresar a `/admin` sin sesión se muestra el formulario de login, sin sidebar.
- [ ] Con credenciales correctas se setea la cookie `admin_token` (httpOnly, Secure, SameSite=Lax, maxAge 2 h) y se redirige a `/admin/dashboard`.
- [ ] Con credenciales incorrectas se muestra "Credenciales inválidas" y no se setea ninguna cookie.
- [ ] Sin token válido, `/admin/dashboard`, `/admin/noticias`, `/admin/calendario` y `/admin/equipos` redirigen a `/admin`.
- [ ] Con token válido, `/admin` redirige a `/admin/dashboard`.
- [ ] Un JWT vencido deja de ser válido y redirige a `/admin` (verificable reduciendo temporalmente el `exp` a segundos).
- [ ] El botón "Cerrar sesión" borra la cookie y redirige a `/admin`.
- [ ] El sidebar del panel se renderiza solo con sesión activa.
- [ ] `/api/imagenes/*` sigue accesible sin autenticación.
- [ ] `npm run build` y `npm run lint` pasan sin errores.

---

## Decisions

- **Sí: `jose` en vez de `jsonwebtoken`.** Es la única opción que corre en middleware (edge), lo que permite proteger `/admin/*` a nivel de request sin tocar la BD.
- **Sí: `bcryptjs` en vez de `bcrypt`.** Cero dependencias nativas, evita problemas de build; el costo 10 es suficiente para un panel admin.
- **Sí: cookie `httpOnly` + `Secure` + `SameSite=Lax`.** No expuesta a XSS y el navegador la envía sola; sin header `Authorization` manual.
- **Sí: vencimiento fijo de 2 h.** Declarado por el usuario; simple de testear; sin renovación deslizante.
- **Sí: sin tabla de sesiones.** La expiración del JWT basta; menos superficie en la BD.
- **Sí: `/admin` como login y dashboard en `/admin/dashboard`.** Cumple el flujo pedido sin rutas extra.
- **Sí: sidebar condicional en el layout** (leer la cookie) en vez de reestructurar rutas en un route group. Menos refactor; el middleware ya impide ver el panel sin sesión.
- **Sí: seed con credenciales por defecto.** Consistente con el flujo de seeds existente; la contraseña elegida es fuerte.
- **Sí: error genérico "Credenciales inválidas".** No revela qué campo falló (evita enumeración de usuarios).
- **Sí: `/api/imagenes/*` público.** Lo consumen las páginas públicas del sitio; no es contenido sensible.
- **No: CRUD de usuarios ni cambio de contraseña en el panel.** Spec futura; los admins se gestionan por seed.
- **No: rate limiting ni bloqueo por intentos fallidos.** Fuera de alcance; queda anotado como riesgo.
- **No: `jsonwebtoken` + `bcrypt`.** Nativo, corre solo en Node; bloquearía el middleware.

---

## Risks

| Risk | Mitigation |
| ---- | ---------- |
| Verificar la expiración de 2 h exige esperar | Reducir temporalmente el `exp` a segundos durante el test manual (criterio ya incluido). |
| `JWT_SECRET` ausente o débil | El helper de firma lanza error si falta el secret; generar un valor aleatorio largo en `.env`. |
| El middleware (edge) no puede consultar la BD | Solo se valida la firma y expiración del JWT; un usuario dado de baja mantiene validez hasta expirar (≤ 2 h) — aceptado por diseño, sin tabla de sesiones. |
| Importar `bcryptjs` o Prisma en el middleware | No se importan: el middleware solo usa `jose`; el acceso a BD queda en server actions (Node). |
| Cookie `Secure` en desarrollo (`http://localhost`) | Los navegadores tratan `localhost` como contexto seguro y la aceptan; si algún entorno la rechaza, condicionar `Secure` a `NODE_ENV === "production"`. |
| Olvido de la contraseña del seed (sin CRUD de usuarios) | Anotado como mejora futura: script de reset de contraseña admin. |

---

## What is **not** in this spec

- CRUD de usuarios ni cambio de contraseña desde el panel.
- Recuperación/reseteo de contraseña olvidada.
- Registro público de usuarios.
- Vencimiento deslizante, refresh/rotación de tokens.
- Rate limiting ni bloqueo por intentos fallidos.
- Protección de rutas fuera de `/admin/*`.
