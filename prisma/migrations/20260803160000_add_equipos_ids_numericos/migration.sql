-- CreateTable
CREATE TABLE "equipos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "logo" TEXT,
    "ciudad" TEXT,
    "estadio" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- DropTable
DROP TABLE "calendario";

-- DropTable
DROP TABLE "noticias";

-- CreateTable
CREATE TABLE "calendario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "equipo1Id" INTEGER NOT NULL,
    "equipo2Id" INTEGER NOT NULL,
    "ubicacion" TEXT NOT NULL,
    "descripcionBreve" TEXT,
    "descripcionDetalle" TEXT,
    "imagen" TEXT,
    "categoria" TEXT NOT NULL,
    "publicado" BOOLEAN NOT NULL DEFAULT true,
    "fecha" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "calendario_equipo1Id_fkey" FOREIGN KEY ("equipo1Id") REFERENCES "equipos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "calendario_equipo2Id_fkey" FOREIGN KEY ("equipo2Id") REFERENCES "equipos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "noticias" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
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

-- CreateIndex
CREATE UNIQUE INDEX "noticias_slug_key" ON "noticias"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "equipos_nombre_key" ON "equipos"("nombre");
