"use client";

import React, { useState } from "react";
import { Stethoscope, Mail, Lock, User, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";

export default function RegistroPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Aquí iría la lógica de creación de usuario (Server Action)
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-4">
        <div className="w-full max-w-[450px] text-center space-y-6 p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex justify-center">
            <div className="bg-emerald-100 p-4 rounded-full text-emerald-600">
              <CheckCircle2 size={48} />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">¡Registro Exitoso!</h2>
          <p className="text-gray-500 font-medium">Tu cuenta ha sido creada. Ahora puedes iniciar sesión para comenzar.</p>
          <a href="/login" className="block w-full bg-[#0056b3] text-white py-4 rounded-2xl font-bold text-sm shadow-xl shadow-blue-500/20 hover:bg-[#004a99] transition-all">
            Ir al Inicio de Sesión
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-[450px] space-y-8 p-8 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-gray-100">
        
        <button onClick={() => window.history.back()} className="flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors text-sm font-bold uppercase tracking-wider">
          <ArrowLeft size={16} /> Volver
        </button>

        <div className="flex flex-col items-center gap-4">
          <div className="bg-[#0056b3] p-3 rounded-2xl">
            <Stethoscope size={32} className="text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Crear Cuenta</h1>
            <p className="text-sm text-gray-400 font-medium">Únete a la gestión dental inteligente</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1 flex items-center gap-2">
              <User size={12} /> Nombre Completo
            </label>
            <input required type="text" placeholder="Dr. Miuller Trigoso" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-[#0056b3] outline-none transition-all text-sm" />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1 flex items-center gap-2">
              <Mail size={12} /> Correo Electrónico
            </label>
            <input required type="email" placeholder="ejemplo@clinicadental.com" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-[#0056b3] outline-none transition-all text-sm" />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1 flex items-center gap-2">
              <Lock size={12} /> Contraseña
            </label>
            <input required type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-[#0056b3] outline-none transition-all text-sm" />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-[#0056b3] text-white py-4 rounded-2xl font-bold text-sm shadow-xl shadow-blue-500/20 hover:bg-[#004a99] transition-all flex items-center justify-center gap-2">
            {loading ? <Loader2 size={18} className="animate-spin" /> : "Crear mi cuenta"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500">
          ¿Ya tienes una cuenta?{" "}
          <a href="/login" className="text-[#0056b3] font-bold hover:underline">Inicia sesión</a>
        </p>
      </div>
    </div>
  );
}
