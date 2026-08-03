-- CreateTable
CREATE TABLE "noticias" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "titulo" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "descripcionBreve" TEXT NOT NULL,
    "descripcionDetalle" TEXT NOT NULL,
    "imagen" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "publicado" BOOLEAN NOT NULL DEFAULT true,
    "fecha" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "calendario" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "equipo1" TEXT NOT NULL,
    "equipo2" TEXT NOT NULL,
    "ubicacion" TEXT NOT NULL,
    "descripcionBreve" TEXT,
    "descripcionDetalle" TEXT,
    "imagen" TEXT,
    "categoria" TEXT NOT NULL,
    "publicado" BOOLEAN NOT NULL DEFAULT true,
    "fecha" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "noticias_slug_key" ON "noticias"("slug");
