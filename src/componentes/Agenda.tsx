"use client";

import React, { useState } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Plus, 
  MoreVertical,
  Phone,
  ClipboardList,
  Wallet,
  Trash2,
  CheckCircle2,
  XCircle,
  MessageSquare
} from "lucide-react";
import { SepararCitaModal } from "./SepararCitaModal";

interface Cita {
  id: string;
  pacienteNombre: string;
  inicio: string; // ISO string
  fin: string; // ISO string
  estado: "confirmado" | "cancelado" | "atendido";
  motivo: string;
}

const DIAS_SEMANA = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const HORAS = Array.from({ length: 13 }, (_, i) => i + 9); // 9 AM a 9 PM

export const Agenda: React.FC = () => {
  const [fechaBase, setFechaBase] = useState(new Date("2026-05-11"));
  const [citas, setCitas] = useState<Cita[]>([
    {
      id: "1",
      pacienteNombre: "Romeo Prueba",
      inicio: "2026-05-11T09:00:00",
      fin: "2026-05-11T09:30:00",
      estado: "confirmado",
      motivo: "Consulta General"
    },
    {
      id: "2",
      pacienteNombre: "Homero Prueba",
      inicio: "2026-05-11T11:00:00",
      fin: "2026-05-11T11:30:00",
      estado: "atendido",
      motivo: "Limpieza"
    },
    {
      id: "3",
      pacienteNombre: "Homero Prueba",
      inicio: "2026-05-12T11:00:00",
      fin: "2026-05-12T11:30:00",
      estado: "confirmado",
      motivo: "Control"
    }
  ]);

  const [citaSeleccionada, setCitaSeleccionada] = useState<Cita | null>(null);
  const [posicionSubmenu, setPosicionSubmenu] = useState({ x: 0, y: 0 });
  const [modalCitaAbierto, setModalCitaAbierto] = useState(false);

  const manejarClicCita = (e: React.MouseEvent, cita: Cita) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setPosicionSubmenu({ x: rect.left, y: rect.bottom });
    setCitaSeleccionada(cita);
  };

  const cambiarSemana = (offset: number) => {
    const nuevaFecha = new Date(fechaBase);
    nuevaFecha.setDate(nuevaFecha.getDate() + offset * 7);
    setFechaBase(nuevaFecha);
  };

  const actualizarEstadoCita = (id: string, nuevoEstado: Cita["estado"]) => {
    setCitas(prev => prev.map(c => c.id === id ? { ...c, estado: nuevoEstado } : c));
    setCitaSeleccionada(null);
  };

  const formatearFechaCabecera = () => {
    const fin = new Date(fechaBase);
    fin.setDate(fin.getDate() + 5);
    const opciones: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
    return `${fechaBase.toLocaleDateString('es-ES', opciones)} - ${fin.toLocaleDateString('es-ES', opciones)} ${fechaBase.getFullYear()}`;
  };

  return (
    <div className="bg-white min-h-[calc(100vh-96px)] p-4 md:p-6 animar-entrada">
      {/* Controles de la Agenda */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button 
              onClick={() => cambiarSemana(-1)}
              className="p-1.5 hover:bg-white hover:shadow-sm rounded-md transition-all text-gray-600"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="px-2">
              <CalendarIcon size={18} className="text-gray-500" />
            </div>
            <button 
              onClick={() => cambiarSemana(1)}
              className="p-1.5 hover:bg-white hover:shadow-sm rounded-md transition-all text-gray-600"
            >
              <ChevronRight size={18} />
            </button>
          </div>
          
          <button 
            onClick={() => setFechaBase(new Date())}
            className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors"
          >
            Hoy
          </button>
          
          <h2 className="text-lg font-bold text-gray-800">{formatearFechaCabecera()}</h2>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <select className="appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#0056b3]/20">
              <option>Estado: Todos</option>
              <option>Confirmado</option>
              <option>Atendido</option>
              <option>Cancelado</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <ChevronRight size={14} className="rotate-90" />
            </div>
          </div>
          
          <button 
            onClick={() => setModalCitaAbierto(true)}
            className="flex items-center gap-2 px-5 py-2 bg-[#0056b3] text-white rounded-xl text-sm font-bold hover:bg-[#004a99] transition-all shadow-lg shadow-blue-500/20"
          >
            <Plus size={18} />
            Separar Cita
          </button>
        </div>
      </div>

      {/* Grid de la Agenda */}
      <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="grid grid-cols-[80px_repeat(6,1fr)] bg-gray-50 border-b border-gray-200">
          <div className="p-3 border-r border-gray-200"></div>
          {DIAS_SEMANA.map((dia, i) => {
            const fechaDia = new Date(fechaBase);
            fechaDia.setDate(fechaBase.getDate() + i);
            return (
              <div key={dia} className="p-3 border-r border-gray-200 text-center last:border-r-0">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{dia}</p>
                <p className="text-sm font-bold text-gray-700">{fechaDia.getDate()}</p>
              </div>
            );
          })}
        </div>

        <div className="relative">
          {HORAS.map((hora) => (
            <div key={hora} className="grid grid-cols-[80px_repeat(6,1fr)] border-b border-gray-100 last:border-b-0 min-h-[80px]">
              <div className="p-3 border-r border-gray-200 text-right">
                <span className="text-xs font-semibold text-gray-400">
                  {hora > 12 ? `${hora - 12} p. m.` : hora === 12 ? "12 p. m." : `${hora} a. m.`}
                </span>
              </div>
              {DIAS_SEMANA.map((_, i) => {
                const fechaDia = new Date(fechaBase);
                fechaDia.setDate(fechaBase.getDate() + i);
                const fechaStr = `${fechaDia.getFullYear()}-${(fechaDia.getMonth() + 1).toString().padStart(2, "0")}-${fechaDia.getDate().toString().padStart(2, "0")}T${hora.toString().padStart(2, "0")}:00:00`;
                const citaEnSlot = citas.find(c => c.inicio.startsWith(fechaStr.substring(0, 13)));

                return (
                  <div key={i} className="border-r border-gray-100 last:border-r-0 p-1 relative group hover:bg-blue-50/30 transition-colors">
                    {citaEnSlot && (
                      <div 
                        onClick={(e) => manejarClicCita(e, citaEnSlot)}
                        className={`
                          h-full w-full rounded-lg p-2 text-white text-xs font-bold cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]
                          ${citaEnSlot.estado === "confirmado" ? "bg-blue-500 shadow-md" : ""}
                          ${citaEnSlot.estado === "atendido" ? "bg-emerald-500 shadow-md" : ""}
                          ${citaEnSlot.estado === "cancelado" ? "bg-rose-500 shadow-md" : ""}
                        `}
                      >
                        <div className="flex justify-between items-start">
                          <span className="truncate">{citaEnSlot.pacienteNombre}</span>
                          {citaEnSlot.estado === "atendido" && <CheckCircle2 size={12} />}
                        </div>
                        <div className="mt-1 opacity-80 font-normal flex items-center gap-1">
                          <Clock size={10} />
                          {hora}:00
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
          
          {/* Línea de hora actual (simulada) */}
          <div className="absolute top-[25%] left-[80px] right-0 border-t-2 border-rose-400 z-10 pointer-events-none">
             <div className="absolute -left-1 -top-[5px] w-2 h-2 rounded-full bg-rose-400 shadow-sm" />
          </div>
        </div>
      </div>

      {/* Submenú de Cita (Pop-over) */}
      {citaSeleccionada && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setCitaSeleccionada(null)} />
          <div 
            className="fixed z-50 bg-white rounded-2xl shadow-2xl border border-gray-100 w-64 overflow-hidden animar-entrada"
            style={{ 
              top: `${Math.min(posicionSubmenu.y, window.innerHeight - 400)}px`, 
              left: `${Math.min(posicionSubmenu.x, window.innerWidth - 270)}px` 
            }}
          >
            <div className="p-4 bg-gray-50 border-b border-gray-100">
              <div className="flex gap-2 mb-3">
                <button 
                  onClick={() => actualizarEstadoCita(citaSeleccionada.id, "confirmado")}
                  className={`flex-1 flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${citaSeleccionada.estado === 'confirmado' ? 'bg-blue-500 text-white' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                >
                  <CheckCircle2 size={16} />
                  <span className="text-[10px] font-bold">Confirmar</span>
                </button>
                <button 
                  onClick={() => actualizarEstadoCita(citaSeleccionada.id, "cancelado")}
                  className={`flex-1 flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${citaSeleccionada.estado === 'cancelado' ? 'bg-rose-500 text-white' : 'bg-rose-50 text-rose-600 hover:bg-rose-100'}`}
                >
                  <XCircle size={16} />
                  <span className="text-[10px] font-bold">Cancelar</span>
                </button>
                <button 
                  onClick={() => actualizarEstadoCita(citaSeleccionada.id, "atendido")}
                  className={`flex-1 flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${citaSeleccionada.estado === 'atendido' ? 'bg-emerald-500 text-white' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}
                >
                  <CheckCircle2 size={16} />
                  <span className="text-[10px] font-bold">Atendido</span>
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-800">{citaSeleccionada.pacienteNombre}</p>
                  <p className="text-[10px] text-gray-500 font-medium">{citaSeleccionada.motivo}</p>
                </div>
                <button className="p-1.5 text-gray-400 hover:text-gray-600">
                  <CalendarIcon size={16} />
                </button>
              </div>
            </div>

            <div className="p-2">
              <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50 rounded-xl transition-colors group">
                <MessageSquare size={18} className="text-emerald-500" />
                <span className="flex-1 text-left font-medium">Enviar WhatsApp</span>
                <ChevronRight size={14} className="text-gray-300 group-hover:text-gray-400" />
              </button>
              
              <a href="/pacientes" className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50 rounded-xl transition-colors group">
                <User size={18} className="text-blue-500" />
                <span className="flex-1 text-left font-medium">Datos del paciente</span>
                <ChevronRight size={14} className="text-gray-300 group-hover:text-gray-400" />
              </a>

              <a href="/odontograma" className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50 rounded-xl transition-colors group">
                <ClipboardList size={18} className="text-indigo-500" />
                <span className="flex-1 text-left font-medium">Ficha médica</span>
                <ChevronRight size={14} className="text-gray-300 group-hover:text-gray-400" />
              </a>

              <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50 rounded-xl transition-colors group">
                <Wallet size={18} className="text-amber-500" />
                <span className="flex-1 text-left font-medium">Realizar cobro</span>
                <ChevronRight size={14} className="text-gray-300 group-hover:text-gray-400" />
              </button>

              <div className="my-1 border-t border-gray-100" />

              <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-rose-500 hover:bg-rose-50 rounded-xl transition-colors font-medium">
                <Trash2 size={18} />
                Eliminar cita
              </button>
            </div>
          </div>
        </>
      )}

      {/* Modal para Separar Cita */}
      <SepararCitaModal
        isOpen={modalCitaAbierto}
        onClose={() => setModalCitaAbierto(false)}
        onSuccess={(nuevaCita) => {
          setCitas(prev => [...prev, nuevaCita]);
        }}
      />
    </div>
  );
};
