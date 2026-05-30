"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Stethoscope } from "lucide-react";
import { UserMenu } from "./UserMenu";

interface Props {
  session: any;
}

export const HeaderWrapper: React.FC<Props> = ({ session }) => {
  const pathname = usePathname();
  const esAdmin = session?.user?.rol === "ADMIN";

  // No mostrar cabecera en el login ni si no hay sesión
  if (pathname === "/login" || !session) return null;

  return (
    <header className="bg-[#0056b3] text-white shadow-md">
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-white p-1 rounded-lg">
            <Stethoscope size={24} className="text-[#0056b3]" />
          </div>
          <span className="text-xl font-bold tracking-tight">Consul Dent</span>
        </div>
        
        <div className="flex items-center gap-4">
          <UserMenu 
            userEmail={session.user.email} 
            userRol={session.user.rol} 
          />
        </div>
      </div>
      
      {/* Barra de Navegación */}
      <nav className="bg-[#0056b3] border-t border-white/10">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 h-10 flex items-center gap-6 overflow-x-auto no-scrollbar">
          <a href="/" className={`text-sm font-semibold transition-colors h-full flex items-center px-1 ${pathname === "/" ? "text-white border-b-2 border-white" : "text-white/70 hover:text-white"}`}>
            Agenda
          </a>
          <a href="/pacientes" className={`text-sm font-semibold transition-colors h-full flex items-center px-1 ${pathname === "/pacientes" ? "text-white border-b-2 border-white" : "text-white/70 hover:text-white"}`}>
            Pacientes
          </a>
          <a href="#" className="text-sm font-semibold text-white/70 hover:text-white transition-colors h-full flex items-center px-1">
            Caja
          </a>
          <a href="#" className="text-sm font-semibold text-white/70 hover:text-white transition-colors h-full flex items-center px-1">
            Inventario
          </a>
          {esAdmin && (
            <a href="/configuracion" className={`text-sm font-semibold transition-colors h-full flex items-center px-1 ${pathname.startsWith("/configuracion") ? "text-white border-b-2 border-white" : "text-white/70 hover:text-white"}`}>
              Configuración
            </a>
          )}
        </div>
      </nav>
    </header>
  );
};
