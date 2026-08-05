import "dotenv/config";
import { hash } from "bcryptjs";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const [usuario, password] = process.argv.slice(2);

if (!usuario || !password) {
  console.error("Uso: npm run reset-password <usuario> <nueva contraseña>");
  process.exit(1);
}

const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
  }),
});

async function main() {
  const registro = await prisma.usuario.findUnique({ where: { usuario } });
  if (!registro) {
    console.error(`No existe el usuario "${usuario}".`);
    process.exit(1);
  }

  await prisma.usuario.update({
    where: { id: registro.id },
    data: { hash: await hash(password, 10) },
  });

  console.log(`Contraseña de "${usuario}" actualizada correctamente.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
