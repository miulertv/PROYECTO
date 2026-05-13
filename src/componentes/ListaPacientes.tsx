"use client";

import React, { useState, useEffect } from "react";
import { 
  UserPlus, 
  Search, 
  MoreVertical, 
  User, 
  Calendar as CalendarIcon, 
  Phone, 
  Clipboard,
  Edit2,
  Trash2,
  ExternalLink,
  Loader2
} from "lucide-react";
import { RegistroPacienteModal } from "./RegistroPacienteModal";

interface Paciente {
  id: string;
  dni: string;
  nombres: string;
  apellidos: string;
  fecha_nacimiento: string;
  celular: string | null;
  historia_clinica_nro: string;
}

export const ListaPacientes: React.FC = () => {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [estaCargando, setEstaCargando] = useState(false);

  // Simulación de carga de datos
  useEffect(() => {
    setEstaCargando(true);
    setTimeout(() => {
      setPacientes([
        {
          id: "1",
          dni: "41592870",
          nombres: "Juan Carlos",
          apellidos: "Pérez Gómez",
          fecha_nacimiento: "1985-05-15T00:00:00Z",
          celular: "987654321",
          historia_clinica_nro: "HC-001"
        }
      ]);
      setEstaCargando(false);
    }, 800);
  }, []);

  const pacientesFiltrados = pacientes.filter(p => 
    p.nombres.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.apellidos.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.dni.includes(busqueda)
  );

  return (
    <div className="bg-white min-h-[calc(100vh-140px)] p-4 md:p-6 animar-entrada">
      {/* Encabezado y Herramientas */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <User className="text-[#0056b3]" size={24} />
            Gestión de Pacientes
          </h2>
          <p className="text-xs text-gray-500 font-medium">Visualiza y administra la base de datos de tus pacientes</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text"
              placeholder="Buscar por nombre o DNI..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0056b3]/20 w-64 transition-all"
            />
          </div>
          
          <button 
            onClick={() => setModalAbierto(true)}
            className="flex items-center gap-2 px-5 py-2 bg-[#0056b3] text-white rounded-xl text-sm font-bold hover:bg-[#004a99] transition-all shadow-lg shadow-blue-500/20"
          >
            <UserPlus size={18} />
            NUEVO PACIENTE
          </button>
        </div>
      </div>

      {/* Tabla de Pacientes */}
      <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Paciente</th>
              <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">DNI</th>
              <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">N° Historia</th>
              <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Contacto</th>
              <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {estaCargando ? (
              <tr>
                <td colSpan={5} className="py-12 text-center">
                  <Loader2 size={32} className="animate-spin mx-auto text-gray-300" />
                </td>
              </tr>
            ) : pacientesFiltrados.length > 0 ? (
              pacientesFiltrados.map((p) => (
                <tr key={p.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors group">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-blue-50 rounded-full flex items-center justify-center text-[#0056b3] font-bold text-xs uppercase">
                        {p.nombres[0]}{p.apellidos[0]}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800">{p.nombres} {p.apellidos}</p>
                        <p className="text-[11px] text-gray-400 flex items-center gap-1">
                          <CalendarIcon size={10} /> {new Date(p.fecha_nacimiento).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm font-medium text-gray-600">{p.dni}</td>
                  <td className="px-4 py-4">
                    <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold border border-gray-200">
                      {p.historia_clinica_nro}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm text-gray-600 flex items-center gap-1.5">
                      <Phone size={14} className="text-emerald-500" />
                      {p.celular || "—"}
                    </p>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <a 
                        href={`/odontograma?dni=${p.dni}`}
                        className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Ver Odontograma"
                      >
                        <Clipboard size={18} />
                      </a>
                      <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
                        <Edit2 size={18} />
                      </button>
                      <button className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors" title="Eliminar">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-12 text-center text-gray-500 italic">
                  No se encontraron pacientes.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de Registro */}
      <RegistroPacienteModal 
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        onSuccess={(nuevo) => {
          setPacientes(prev => [...prev, {
            ...nuevo,
            fecha_nacimiento: new Date().toISOString(),
            celular: "—",
            historia_clinica_nro: "HC-NEW"
          } as any]);
        }}
      />
    </div>
  );
};
