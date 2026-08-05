import Link from "next/link";
import { LoginForm } from "@/components/admin/LoginForm";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 py-16">
      <div className="fixed right-6 top-6">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-sm">
        <p className="mb-10 text-center font-headline text-3xl uppercase leading-none tracking-wide text-on-surface">
          Granaderos<span className="text-secondary"> Admin</span>
        </p>

        <div className="border border-line/10 bg-primary p-8">
          <p className="font-label text-sm uppercase tracking-[0.1em] text-gold-glimmer">
            Acceso restringido
          </p>
          <h1 className="mt-3 font-headline text-3xl uppercase leading-none tracking-wide text-on-navy">
            Iniciar sesión
          </h1>
          <p className="mt-3 text-sm text-on-navy/60">
            Ingresá tus credenciales de administrador.
          </p>
          <div className="mt-6">
            <LoginForm />
          </div>
        </div>

        <Link
          href="/"
          className="mt-8 block text-center font-label text-xs uppercase tracking-[0.1em] text-on-surface/40 transition-colors hover:text-gold"
        >
          ← Volver al sitio
        </Link>
      </div>
    </div>
  );
}
