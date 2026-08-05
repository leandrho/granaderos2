-- CreateTable
CREATE TABLE "intentos_login" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ip" TEXT NOT NULL,
    "usuario" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "bloqueo_login" (
    "ip" TEXT NOT NULL PRIMARY KEY,
    "conteoFallas" INTEGER NOT NULL DEFAULT 0,
    "bloqueadoHasta" DATETIME,
    "actualizadoEn" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "intentos_login_ip_idx" ON "intentos_login"("ip");
