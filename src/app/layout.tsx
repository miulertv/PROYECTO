import type { Metadata } from "next";
import "./globals.css";
import { Stethoscope } from "lucide-react";

export const metadata: Metadata = {
  title: "Consul Dent | Gestión Dental Inteligente",
  description:
    "Sistema integral para la gestión de clínicas dentales, agenda, odontograma y pacientes.",
};
export default function LayoutRaiz({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-white">
        {/* Cabecera Principal */}
        <header className="bg-[#0056b3] text-white shadow-md">
          <div className="max-w-[1600px] mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-white p-1 rounded-lg">
                <Stethoscope size={24} className="text-[#0056b3]" />
              </div>
              <span className="text-xl font-bold tracking-tight">Consul Dent</span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-1 text-sm font-medium opacity-90">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                Dr. Miuller Trigoso
              </div>
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold text-xs">
                MT
              </div>
            </div>
          </div>
          
          {/* Barra de Mantenimiento / Navegación */}
          <nav className="bg-[#0056b3] border-t border-white/10">
            <div className="max-w-[1600px] mx-auto px-4 md:px-6 h-10 flex items-center gap-6 overflow-x-auto no-scrollbar">
              <a href="/" className="text-sm font-semibold text-white hover:text-white transition-colors h-full flex items-center px-1">
                Agenda
              </a>
              <a href="/pacientes" className="text-sm font-semibold text-white/70 hover:text-white transition-colors h-full flex items-center px-1">
                Pacientes
              </a>
              <a href="#" className="text-sm font-semibold text-white/70 hover:text-white transition-colors h-full flex items-center px-1">
                Caja
              </a>
              <a href="#" className="text-sm font-semibold text-white/70 hover:text-white transition-colors h-full flex items-center px-1">
                Inventario
              </a>
              <a href="#" className="text-sm font-semibold text-white/70 hover:text-white transition-colors h-full flex items-center px-1">
                Configuración
              </a>
            </div>
          </nav>
        </header>

        <main>{children}</main>
      </body>
    </html>
  );
}
