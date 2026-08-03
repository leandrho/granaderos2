# SPECIFICATION: Database Integration & Hexagonal Architecture Migration

> **Estado:** Implementado
> **Depende de:** SPEC 03
> **Fecha:** 2026-08-03

## 1. Overview & Context
This document specifies the technical requirements for integrating a relational database (PostgreSQL or SQLite) into the existing Next.js 16.2 project. 
The application currently displays hardcoded data for **Noticias** (News) and **Calendario** (Match/Event Schedule). This migration will replace hardcoded values with dynamic data fetching using **Prisma ORM**, **Zod** for validation, and a clean **Hexagonal Architecture (Ports and Adapters)**.

---

## 2. Core Technical Stack
- **Framework:** Next.js 16.2 (App Router & Server Actions)
- **Language:** TypeScript (Strict mode)
- **ORM:** Prisma
- **Validation:** Zod
- **Database Support:** PostgreSQL / SQLite (Configurable via `.env`)

---

## 3. Data Model & Database Schema

### 3.1 Proposed Model Enhancements
To support production-ready features, the following fields are added beyond the basic requirements:
- `id`: Unique identifier (UUID v4)
- `slug`: Human-readable URL identifier (indexed for fast queries)
- `publicado`: Boolean flag to support draft/published states
- `createdAt` / `updatedAt`: Automatic timestamp auditing
- `descripcionBreve` vs `descripcionDetalle`: Clear separation of list summary vs full article/event content
- Optional fields for `EventoCalendario`: `descripcionBreve`, `descripcionDetalle`, `imagen`

### 3.2 Prisma Schema (`prisma/schema.prisma`)

```prisma
datasource db {
  provider = env("DATABASE_PROVIDER")
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Noticia {
  id                 String   @id @default(uuid())
  titulo             String
  slug               String   @unique
  descripcionBreve   String
  descripcionDetalle String
  imagen             String
  categoria          String   // Tag or category name
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
  ubicacion          String   // Match/Event venue
  descripcionBreve   String?
  descripcionDetalle String?
  imagen             String?
  categoria          String   // Tag or competition type
  publicado          Boolean  @default(true)
  fecha              DateTime
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt

  @@map("calendario")
}
```

---

## 4. Architecture & Directory Structure

Follow Hexagonal Architecture principles strictly. Do not import framework or ORM dependencies inside the domain layer.

```text
src/
├── domain/                      # DOMAIN LAYER (Pure TypeScript, Zero External Dependencies)
│   ├── entities/
│   │   ├── Noticia.ts
│   │   └── EventoCalendario.ts
│   └── repositories/
│       ├── NoticiaRepository.ts
│       └── EventoCalendarioRepository.ts
│
├── application/                 # APPLICATION LAYER (Use Cases & DTO Validation)
│   ├── dtos/
│   │   ├── noticia.dto.ts
│   │   └── calendario.dto.ts
│   └── use-cases/
│       ├── ObtenerNoticias.ts
│       ├── ObtenerNoticiaPorSlug.ts
│       ├── ObtenerCalendario.ts
│       └── ObtenerProximosEventos.ts
│
├── infrastructure/              # INFRASTRUCTURE LAYER (Prisma, Database, External APIs)
│   ├── db/
│   │   └── prisma.ts
│   └── repositories/
│       ├── PrismaNoticiaRepository.ts
│       └── PrismaEventoCalendarioRepository.ts
│
└── app/                         # ADAPTERS / PRESENTATION LAYER (Next.js App Router)
    ├── noticias/
    │   ├── page.tsx
    │   └── [slug]/page.tsx
    ├── calendario/
    │   └── page.tsx
    └── actions/                 # Next.js Server Actions
        ├── noticias.actions.ts
        └── calendario.actions.ts
```

---

## 5. Component Specifications & Code Templates

### 5.1 Domain Layer

#### Entity: `src/domain/entities/Noticia.ts`
```typescript
export interface NoticiaProps {
  id: string;
  titulo: string;
  slug: string;
  descripcionBreve: string;
  descripcionDetalle: string;
  imagen: string;
  categoria: string;
  publicado: boolean;
  fecha: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class Noticia {
  constructor(private readonly props: NoticiaProps) {}

  get id(): string { return this.props.id; }
  get titulo(): string { return this.props.titulo; }
  get slug(): string { return this.props.slug; }
  get descripcionBreve(): string { return this.props.descripcionBreve; }
  get descripcionDetalle(): string { return this.props.descripcionDetalle; }
  get imagen(): string { return this.props.imagen; }
  get categoria(): string { return this.props.categoria; }
  get publicado(): boolean { return this.props.publicado; }
  get fecha(): Date { return this.props.fecha; }

  public toJSON(): NoticiaProps {
    return { ...this.props };
  }
}
```

#### Entity: `src/domain/entities/EventoCalendario.ts`
```typescript
export interface EventoCalendarioProps {
  id: string;
  equipo1: string;
  equipo2: string;
  ubicacion: string;
  descripcionBreve?: string | null;
  descripcionDetalle?: string | null;
  imagen?: string | null;
  categoria: string;
  publicado: boolean;
  fecha: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class EventoCalendario {
  constructor(private readonly props: EventoCalendarioProps) {}

  get id(): string { return this.props.id; }
  get equipo1(): string { return this.props.equipo1; }
  get equipo2(): string { return this.props.equipo2; }
  get ubicacion(): string { return this.props.ubicacion; }
  get descripcionBreve(): string | undefined | null { return this.props.descripcionBreve; }
  get descripcionDetalle(): string | undefined | null { return this.props.descripcionDetalle; }
  get imagen(): string | undefined | null { return this.props.imagen; }
  get categoria(): string { return this.props.categoria; }
  get publicado(): boolean { return this.props.publicado; }
  get fecha(): Date { return this.props.fecha; }

  public toJSON(): EventoCalendarioProps {
    return { ...this.props };
  }
}
```

#### Repository Interfaces
- `src/domain/repositories/NoticiaRepository.ts`:
  ```typescript
  import { Noticia } from "../entities/Noticia";

  export interface NoticiaRepository {
    obtenerTodas(soloPublicadas?: boolean): Promise<Noticia[]>;
    obtenerPorSlug(slug: string): Promise<Noticia | null>;
    guardar(noticia: Noticia): Promise<void>;
  }
  ```
- `src/domain/repositories/EventoCalendarioRepository.ts`:
  ```typescript
  import { EventoCalendario } from "../entities/EventoCalendario";

  export interface EventoCalendarioRepository {
    obtenerTodos(soloPublicados?: boolean): Promise<EventoCalendario[]>;
    obtenerPorId(id: string): Promise<EventoCalendario | null>;
    guardar(evento: EventoCalendario): Promise<void>;
  }
  ```

---

### 5.2 Application Layer

#### DTOs & Validation Schemas (`src/application/dtos/noticia.dto.ts`)
```typescript
import { z } from "zod";

export const CrearNoticiaSchema = z.object({
  titulo: z.string().min(3, "El título debe tener al menos 3 caracteres"),
  slug: z.string().min(3),
  descripcionBreve: z.string().max(250, "Máximo 250 caracteres"),
  descripcionDetalle: z.string().min(10),
  imagen: z.string().url("Debe ser una URL válida"),
  categoria: z.string().min(1, "La categoría es requerida"),
  fecha: z.coerce.date(),
  publicado: z.boolean().default(true),
});

export type CrearNoticiaDTO = z.infer<typeof CrearNoticiaSchema>;
```

#### DTOs & Validation Schemas (`src/application/dtos/calendario.dto.ts`)
```typescript
import { z } from "zod";

export const CrearEventoSchema = z.object({
  equipo1: z.string().min(1, "Equipo 1 es requerido"),
  equipo2: z.string().min(1, "Equipo 2 es requerido"),
  ubicacion: z.string().min(1, "La ubicación es requerida"),
  descripcionBreve: z.string().optional(),
  descripcionDetalle: z.string().optional(),
  imagen: z.string().url().optional().or(z.literal("")),
  categoria: z.string().min(1, "La categoría es requerida"),
  fecha: z.coerce.date(),
  publicado: z.boolean().default(true),
});

export type CrearEventoDTO = z.infer<typeof CrearEventoSchema>;
```

#### Use Cases
- `src/application/use-cases/ObtenerNoticias.ts`
- `src/application/use-cases/ObtenerCalendario.ts`

---

### 5.3 Infrastructure Layer

#### Database Singleton (`src/infrastructure/db/prisma.ts`)
```typescript
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

#### Prisma Repository Implementation (`src/infrastructure/repositories/PrismaNoticiaRepository.ts`)
```typescript
import { NoticiaRepository } from "@/domain/repositories/NoticiaRepository";
import { Noticia } from "@/domain/entities/Noticia";
import { prisma } from "../db/prisma";

export class PrismaNoticiaRepository implements NoticiaRepository {
  async obtenerTodas(soloPublicadas = true): Promise<Noticia[]> {
    const registros = await prisma.noticia.findMany({
      where: soloPublicadas ? { publicado: true } : undefined,
      orderBy: { fecha: "desc" },
    });

    return registros.map(
      (r) =>
        new Noticia({
          id: r.id,
          titulo: r.titulo,
          slug: r.slug,
          descripcionBreve: r.descripcionBreve,
          descripcionDetalle: r.descripcionDetalle,
          imagen: r.imagen,
          categoria: r.categoria,
          publicado: r.publicado,
          fecha: r.fecha,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt,
        })
    );
  }

  async obtenerPorSlug(slug: string): Promise<Noticia | null> {
    const r = await prisma.noticia.findUnique({ where: { slug } });
    if (!r) return null;

    return new Noticia({
      id: r.id,
      titulo: r.titulo,
      slug: r.slug,
      descripcionBreve: r.descripcionBreve,
      descripcionDetalle: r.descripcionDetalle,
      imagen: r.imagen,
      categoria: r.categoria,
      publicado: r.publicado,
      fecha: r.fecha,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    });
  }

  async guardar(noticia: Noticia): Promise<void> {
    const data = noticia.toJSON();
    await prisma.noticia.upsert({
      where: { id: data.id },
      update: data,
      create: data,
    });
  }
}
```

---

### 5.4 Presentation Layer (Next.js 16.2 App Router)

#### Server Action (`src/app/actions/noticias.actions.ts`)
```typescript
"use server";

import { PrismaNoticiaRepository } from "@/infrastructure/repositories/PrismaNoticiaRepository";
import { ObtenerNoticiasUseCase } from "@/application/use-cases/ObtenerNoticias";

export async function getNoticiasAction() {
  const repository = new PrismaNoticiaRepository();
  const useCase = new ObtenerNoticiasUseCase(repository);
  return await useCase.execute();
}
```

---

## 6. Implementation Checklist for AI Agent / Developer

- [ ] Install dependencies: `npm install @prisma/client zod` and `npm install -D prisma ts-node`
- [ ] Initialize Prisma: `npx prisma init`
- [ ] Configure `.env` with `DATABASE_PROVIDER` and `DATABASE_URL`
- [ ] Add the schema to `prisma/schema.prisma`
- [ ] Create folder structure under `src/` (`domain`, `application`, `infrastructure`)
- [ ] Implement Domain Entities and Repository Interfaces
- [ ] Implement Application Use Cases and Zod DTOs
- [ ] Implement Prisma Repositories in Infrastructure
- [ ] Replace hardcoded data in `src/app/noticias` and `src/app/calendario` with Server Actions / Use Cases
- [ ] Create a seed script in `prisma/seed.ts` to populate initial data based on current hardcoded records
- [ ] Run migration: `npx prisma migrate dev --name init_noticias_calendario`
- [ ] Execute seed: `npx prisma db seed`