"use client";

import React, { useState } from "react";
import { signOut } from "next-auth/react";
import { LogOut, User, Settings, ChevronDown } from "lucide-react";

interface Props {
  userEmail: string;
  userRol: string;
}

export const UserMenu: React.FC<Props> = ({ userEmail, userRol }) => {
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setMenuAbierto(!menuAbierto)}
        className="flex items-center gap-3 hover:bg-white/10 p-1.5 rounded-2xl transition-all"
      >
        <div className="hidden md:flex flex-col items-end">
          <span className="text-xs font-bold text-white">{userEmail}</span>
          <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full uppercase tracking-tighter">
            {userRol}
          </span>
        </div>
        <div className="w-9 h-9 bg-white text-[#0056b3] rounded-xl flex items-center justify-center font-bold text-sm shadow-sm">
          {userEmail.substring(0, 2).toUpperCase()}
        </div>
        <ChevronDown size={14} className={`transition-transform ${menuAbierto ? 'rotate-180' : ''}`} />
      </button>

      {menuAbierto && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setMenuAbierto(false)} />
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animar-entrada">
            <div className="px-4 py-2 border-b border-gray-50 mb-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Mi Cuenta</p>
            </div>
            
            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors font-medium">
              <User size={18} className="text-blue-500" />
              Ver Perfil
            </button>
            
            {userRol === "ADMIN" && (
              <a href="/configuracion" className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors font-medium">
                <Settings size={18} className="text-gray-400" />
                Configuración
              </a>
            )}

            <div className="my-1 border-t border-gray-50" />
            
            <button 
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-500 hover:bg-rose-50 transition-colors font-bold"
            >
              <LogOut size={18} />
              Cerrar Sesión
            </button>
          </div>
        </>
      )}
    </div>
  );
};
