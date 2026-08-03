import type { Metadata } from "next";
import { Sidebar } from "@/components/admin/Sidebar";

export const metadata: Metadata = {
  title: {
    default: "Dashboard",
    template: `%s | Panel`,
  },
  description: "Panel de administración del Club Deportivo Granaderos de Koslay.",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-full flex-col lg:flex-row">
      <Sidebar />
      <main className="min-w-0 flex-1 bg-surface px-6 py-8 md:px-12">
        {children}
      </main>
    </div>
  );
}
