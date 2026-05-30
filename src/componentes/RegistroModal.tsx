"use client";

import React, { useState } from "react";
import { X, User, Mail, Lock, Loader2, CheckCircle2 } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const RegistroModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [estaCargando, setEstaCargando] = useState(false);
  const [exito, setExito] = useState(false);

  const manejarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEstaCargando(true);
    // Simular creación
    await new Promise(r => setTimeout(r, 1500));
    setEstaCargando(false);
    setExito(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animar-entrada">
        {/* Encabezado */}
        <div className="bg-[#0056b3] p-6 flex justify-between items-center text-white">
          <h2 className="text-xl font-bold">Registro de Usuario</h2>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {exito ? (
          <div className="p-10 text-center space-y-4">
            <div className="flex justify-center">
              <div className="bg-emerald-100 p-4 rounded-full text-emerald-600">
                <CheckCircle2 size={48} />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900">¡Registro Exitoso!</h3>
            <p className="text-sm text-gray-500">Tu cuenta ha sido creada. Un administrador debe activarla.</p>
            <button 
              onClick={onClose}
              className="w-full bg-[#0056b3] text-white py-3 rounded-2xl font-bold text-sm"
            >
              Cerrar
            </button>
          </div>
        ) : (
          <form onSubmit={manejarSubmit} className="p-6 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                <User size={12} /> Nombre Completo
              </label>
              <input required type="text" placeholder="Dr. Miuller Trigoso" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:border-[#0056b3] outline-none text-sm" />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                <Mail size={12} /> Correo Electrónico
              </label>
              <input required type="email" placeholder="ejemplo@clinicadental.com" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:border-[#0056b3] outline-none text-sm" />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                <Lock size={12} /> Contraseña
              </label>
              <input required type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:border-[#0056b3] outline-none text-sm" />
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                disabled={estaCargando}
                className="w-full bg-[#0056b3] text-white py-4 rounded-2xl font-bold text-sm shadow-xl shadow-blue-500/20 hover:bg-[#004a99] transition-all flex items-center justify-center gap-2"
              >
                {estaCargando ? <Loader2 size={18} className="animate-spin" /> : "Crear Cuenta"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
