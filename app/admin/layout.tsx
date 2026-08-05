import type { Metadata } from "next";
import { Sidebar } from "@/components/admin/Sidebar";
import { verificarToken } from "@/lib/auth/jwt";
import { leerCookieSesion } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: {
    default: "Dashboard",
    template: `%s | Panel`,
  },
  description: "Panel de administración del Club Deportivo Granaderos de Koslay.",
};

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const token = await leerCookieSesion();
  const sesion = token ? await verificarToken(token) : null;

  if (!sesion) {
    // El proxy (proxy.ts) ya redirige /admin/* no autenticado a /admin.
    // Sin sesión solo llegamos acá desde /admin (login): render sin Sidebar.
    return <main className="min-h-full bg-surface">{children}</main>;
  }

  return (
    <div className="flex min-h-full flex-col lg:flex-row">
      <Sidebar />
      <main className="min-w-0 flex-1 bg-surface px-6 py-8 md:px-12">
        {children}
      </main>
    </div>
  );
}
