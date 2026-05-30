"use client";

import React from "react";
import { Users, ShieldCheck, Key, Settings, ArrowRight } from "lucide-react";

const MODULOS = [
  {
    titulo: "Gestión de Usuarios",
    descripcion: "Crea, edita y elimina las cuentas de acceso del personal.",
    icon: <Users className="text-blue-500" />,
    link: "/configuracion/usuarios",
  },
  {
    titulo: "Roles y Permisos",
    descripcion: "Configura qué acciones puede realizar cada tipo de usuario.",
    icon: <ShieldCheck className="text-indigo-500" />,
    link: "/configuracion/roles",
  },
  {
    titulo: "Seguridad y Accesos",
    descripcion: "Auditoría de inicios de sesión y políticas de contraseñas.",
    icon: <Key className="text-amber-500" />,
    link: "/configuracion/seguridad",
  },
  {
    titulo: "General de la Clínica",
    descripcion: "Datos básicos, logo y configuración del sistema.",
    icon: <Settings className="text-gray-500" />,
    link: "/configuracion/general",
  },
];

export default function ConfiguracionPage() {
  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10 animar-entrada">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Configuración del Sistema</h1>
        <p className="text-gray-500 font-medium">Administra los accesos y parámetros globales de Consul Dent.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MODULOS.map((modulo) => (
          <a 
            key={modulo.titulo}
            href={modulo.link}
            className="group p-6 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-xl hover:border-blue-100 transition-all flex items-start gap-5"
          >
            <div className="p-4 bg-gray-50 rounded-2xl group-hover:bg-blue-50 transition-colors">
              {React.cloneElement(modulo.icon as React.ReactElement, { size: 28 })}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">
                {modulo.titulo}
              </h3>
              <p className="text-sm text-gray-400 font-medium leading-relaxed">
                {modulo.descripcion}
              </p>
            </div>
            <div className="self-center p-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowRight className="text-blue-500" size={20} />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
