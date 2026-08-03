# SPEC-PANEL-ADMINISTRACION.md

> **Estado:** Aprobado
> **Depende de:** SPEC 04
> **Fecha:** 2026-08-03

```markdown
# Especificación Técnica: Panel de Administración (CRUD Core)

## 1. Visión General
Implementación de un Panel de Administración (`/admin`) para la gestión de contenidos del sistema: **Noticias**, **Calendario de Eventos** y **Equipos**. 

El sistema utiliza **Prisma ORM** y **SQLite**. Todas las operaciones deben persistir directamente en la base de datos a través de Prisma Client.

---

## 2. Actualización de Modelo de Datos (`prisma/schema.prisma`)

Agregar el modelo `Equipo` al archivo `prisma/schema.prisma` manteniendo los modelos existentes (`Noticia` y `EventoCalendario`).

```prisma
model Noticia {
  id                 String   @id @default(uuid())
  titulo             String
  slug               String   @unique
  descripcionBreve   String
  descripcionDetalle String
  imagen             String
  categoria          String
  publicado          Boolean  @default(true)
  fecha              DateTime
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt

  @@map("noticias")
}

model EventoCalendario {
  id                 String   @id @default(uuid())
  equipo1            String
  equipo2            String
  ubicacion          String
  descripcionBreve   String?
  descripcionDetalle String?
  imagen             String?
  categoria          String
  publicado          Boolean  @default(true)
  fecha              DateTime
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt

  @@map("calendario")
}

model Equipo {
  id        String   @id @default(uuid())
  nombre    String
  direccion String
  logo      String
  ciudad    String
  estadio   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("equipos")
}

```

> **Nota para la IA de ejecución:** Ejecutar `npx prisma migrate dev --name add_equipo_model` o `npx prisma db push` para actualizar la base de datos tras modificar el esquema.

---

## 3. Estructura de Rutas y Layout

Crear un módulo bajo el prefijo `/admin` con un **Layout base** que incluya una barra lateral (*Sidebar*) con links de navegación activa hacia los tres módulos.

```text
/admin
├── /dashboard               --> Vista principal / resumen de totales
├── /noticias
│   ├── page.tsx             --> Listado / Tabla general de noticias
│   ├── /crear               --> Formulario de creación
│   └── /[id]/editar         --> Formulario de edición
├── /calendario
│   ├── page.tsx             --> Listado de eventos de calendario
│   ├── /crear               --> Formulario de creación
│   └── /[id]/editar         --> Formulario de edición
└── /equipos
    ├── page.tsx             --> Listado de equipos
    ├── /crear               --> Formulario de creación
    └── /[id]/editar         --> Formulario de edición

```

---

## 4. Requerimientos Funcionales por Módulo

### 4.1 Módulo: Noticias (`/admin/noticias`)

* **Listado (`GET`):**
* Mostrar tabla con columnas: `Imagen` (miniatura), `Título`, `Categoría`, `Estado` (`Publicado` / `Borrador`), `Fecha`, `Acciones` (Editar / Eliminar).
* Ordenar por `fecha` de manera descendente.
* Búsqueda/Filtro por título o categoría.


* **Crear (`POST`):**
* Campo `titulo`: Al escribir, generar automáticamente el `slug` en formato normalizado (ej. "Nueva Noticia" -> "nueva-noticia").
* Campo `slug`: Editable manualmente, pero validado como único.
* Campo `categoria`, `descripcionBreve`, `descripcionDetalle`.
* Campo `imagen`: String con ruta relativa (ej. `/news/imagen.jpg`).
* Campo `fecha`: Input de fecha/hora.
* Campo `publicado`: Checkbox/Switch booleano (default: `true`).


* **Editar (`PUT` / `PATCH`):** Cargar valores del registro por `id` y permitir actualizar cualquier campo.
* **Eliminar (`DELETE`):** Modal de confirmación previa y eliminación física del registro.

---

### 4.2 Módulo: Calendario de Eventos (`/admin/calendario`)

* **Listado (`GET`):**
* Mostrar tabla con columnas: `Encuentro` (`equipo1` vs `equipo2`), `Categoría`, `Ubicación`, `Fecha del Evento`, `Publicado`, `Acciones`.
* Ordenar por `fecha` descendente.


* **Crear / Editar (`POST` / `PUT`):**
* Campos `equipo1` y `equipo2`: Text inputs o Select desplegable.
* Campos `ubicacion`, `categoria`, `fecha` (datetime picker).
* Campos opcionales: `descripcionBreve`, `descripcionDetalle`, `imagen`.
* Campo `publicado`: Checkbox/Switch booleano (default: `true`).


* **Eliminar (`DELETE`):** Borrado físico con confirmación previa.

---

### 4.3 Módulo: Equipos (`/admin/equipos`)

* **Listado (`GET`):**
* Mostrar tabla con columnas: `Logo` (miniatura), `Nombre`, `Estadio`, `Ciudad`, `Dirección`, `Acciones`.
* Ordenar por `nombre` ascendente.


* **Crear / Editar (`POST` / `PUT`):**
* Campos requeridos: `nombre`, `direccion`, `logo` (ruta `/logos/equipo.png`), `ciudad`, `estadio`.


* **Eliminar (`DELETE`):** Borrado físico con confirmación previa.

---

## 5. Capa de Servicios / API (Prisma Actions)

Implementar funciones de acceso a datos utilizando Prisma Client (`@prisma/client`):

### 5.1 Noticias

* `getNoticias()`: Trae todas las noticias ordenadas por `fecha: 'desc'`.
* `getNoticiaById(id: string)`: Retorna una noticia por su ID.
* `createNoticia(data)`: Crea un registro.
* `updateNoticia(id: string, data)`: Actualiza por ID.
* `deleteNoticia(id: string)`: Elimina el registro por ID.

### 5.2 Calendario

* `getEventos()`: Trae todos los eventos del calendario ordenados por `fecha: 'desc'`.
* `getEventoById(id: string)`: Retorna un evento por su ID.
* `createEvento(data)`: Crea un registro.
* `updateEvento(id: string, data)`: Actualiza por ID.
* `deleteEvento(id: string)`: Elimina por ID.

### 5.3 Equipos

* `getEquipos()`: Trae todos los equipos ordenados por `nombre: 'asc'`.
* `getEquipoById(id: string)`: Retorna un equipo por su ID.
* `createEquipo(data)`: Crea un registro.
* `updateEquipo(id: string, data)`: Actualiza por ID.
* `deleteEquipo(id: string)`: Elimina por ID.

---

## 6. Criterios de Aceptación (DoD)

1. El modelo `Equipo` está añadido al esquema de Prisma y migrado a SQLite.
2. Todas las operaciones CRUD (Crear, Leer, Editar, Eliminar) funcionan y persisten los cambios correctamente en la base de datos.
3. Se incluyen validaciones básicas para evitar campos vacíos o slugs duplicados.
4. Las eliminaciones requieren confirmación explícita del usuario mediante un diálogo modal o alerta.
5. La interfaz renderiza correctamente los estados de carga y error durante la interacción con la base de datos.

```

```