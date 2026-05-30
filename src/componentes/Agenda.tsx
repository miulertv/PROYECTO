"use client";

import React, { useState, useEffect } from "react";
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
  MessageSquare,
  Loader2
} from "lucide-react";
import { SepararCitaModal } from "./SepararCitaModal";
import { actualizarEstadoCita, obtenerCitas, moverCita } from "@/acciones";

interface Cita {
  id: string;
  pacienteNombre: string;
  inicio: string; // ISO string
  fin: string; // ISO string
  estado: string; // confirmado, cancelado, atendido
  motivo: string;
  doctor?: string;
  nota?: string;
}

const DIAS_SEMANA = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const HORAS = Array.from({ length: 13 }, (_, i) => i + 9); // 9 AM a 9 PM

export const Agenda: React.FC = () => {
  const [fechaBase, setFechaBase] = useState(new Date("2026-05-11"));
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [citas, setCitas] = useState<Cita[]>([]);
  const [estaCargando, setEstaCargando] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      setEstaCargando(true);
      const res = await obtenerCitas();
      setCitas(res);
      setEstaCargando(false);
    };
    cargarDatos();
  }, []);

  const [citaSeleccionada, setCitaSeleccionada] = useState<Cita | null>(null);
  const [posicionSubmenu, setPosicionSubmenu] = useState({ x: 0, y: 0 });
  const [modalCitaAbierto, setModalCitaAbierto] = useState(false);
  const [datosPrellenados, setDatosPrellenados] = useState<{fecha: string, hora: string} | null>(null);

  const manejarClicCita = (e: React.MouseEvent, cita: Cita) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setPosicionSubmenu({ x: rect.left, y: rect.bottom });
    setCitaSeleccionada(cita);
  };

  const manejarClicSlotVacio = (fecha: string, hora: string) => {
    setDatosPrellenados({ fecha, hora });
    setModalCitaAbierto(true);
  };

  const cambiarSemana = (offset: number) => {
    const nuevaFecha = new Date(fechaBase);
    nuevaFecha.setDate(nuevaFecha.getDate() + offset * 7);
    setFechaBase(nuevaFecha);
  };

  const manejarCambioEstado = async (id: string, nuevoEstado: string) => {
    // Optimistic update
    setCitas(prev => prev.map(c => c.id === id ? { ...c, estado: nuevoEstado } : c));
    setCitaSeleccionada(null);

    // Persistencia
    const res = await actualizarEstadoCita(id, nuevoEstado);
    if (!res.exito) {
      console.error(res.mensaje);
      // Podríamos revertir el cambio aquí si falla
    }
  };

  const manejarMoverCita = async (id: string, nuevaFecha: string, nuevaHora: string) => {
    setEstaCargando(true);
    const res = await moverCita(id, nuevaFecha, nuevaHora);
    if (res.exito) {
      const actualizadas = await obtenerCitas();
      setCitas(actualizadas);
    } else {
      alert(res.mensaje);
    }
    setEstaCargando(false);
  };

  const formatearFechaCabecera = () => {
    const fin = new Date(fechaBase);
    fin.setDate(fin.getDate() + 5);
    const opciones: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
    return `${fechaBase.toLocaleDateString('es-ES', opciones)} - ${fin.toLocaleDateString('es-ES', opciones)} ${fechaBase.getFullYear()}`;
  };

  const citasFiltradas = citas.filter(c => 
    filtroEstado === "Todos" || c.estado.toLowerCase() === filtroEstado.toLowerCase()
  );

  return (
    <div className="bg-white min-h-[calc(100vh-96px)] p-4 md:p-6 animar-entrada">
      {/* Controles de la Agenda */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button onClick={() => cambiarSemana(-1)} className="p-1.5 hover:bg-white hover:shadow-sm rounded-md transition-all text-gray-600">
              <ChevronLeft size={18} />
            </button>
            <div className="px-2">
              <CalendarIcon size={18} className="text-gray-500" />
            </div>
            <button onClick={() => cambiarSemana(1)} className="p-1.5 hover:bg-white hover:shadow-sm rounded-md transition-all text-gray-600">
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
            <select 
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#0056b3]/20 font-bold text-[#0056b3]"
            >
              <option value="Todos">ESTADO: Todos</option>
              <option value="CONFIRMADO">Confirmado</option>
              <option value="ATENDIDO">Atendido</option>
              <option value="CANCELADO">Cancelado</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <ChevronRight size={14} className="rotate-90" />
            </div>
          </div>
          
          <button 
            onClick={() => {
              setDatosPrellenados(null);
              setModalCitaAbierto(true);
            }}
            className="flex items-center gap-2 px-5 py-2 bg-[#0056b3] text-white rounded-xl text-sm font-bold hover:bg-[#004a99] transition-all shadow-lg shadow-blue-500/20"
          >
            <Plus size={18} />
            Separar Cita
          </button>
        </div>
      </div>

      {/* Grid de la Agenda */}
      <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm overflow-x-auto">
        <div className="min-w-[800px]">
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
                  const fStr = `${fechaDia.getFullYear()}-${(fechaDia.getMonth() + 1).toString().padStart(2, "0")}-${fechaDia.getDate().toString().padStart(2, "0")}`;
                  const hStr = hora.toString().padStart(2, "0");
                  
                  // Encontrar todas las citas en este slot horario
                  const citasEnSlot = citasFiltradas.filter(c => {
                    const d = new Date(c.inicio);
                    return d.getFullYear() === fechaDia.getFullYear() &&
                           d.getMonth() === fechaDia.getMonth() &&
                           d.getDate() === fechaDia.getDate() &&
                           d.getHours() === hora;
                  });

                  return (
                    <div 
                      key={i} 
                      onClick={() => citasEnSlot.length === 0 && manejarClicSlotVacio(fStr, `${hStr}:00`)}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.add('bg-blue-100/50');
                      }}
                      onDragLeave={(e) => {
                        e.currentTarget.classList.remove('bg-blue-100/50');
                      }}
                      onDrop={async (e) => {
                        e.preventDefault();
                        e.currentTarget.classList.remove('bg-blue-100/50');
                        const citaId = e.dataTransfer.getData("citaId");
                        if (citaId) {
                          manejarMoverCita(citaId, fStr, `${hStr}:00`);
                        }
                      }}
                      className={`border-r border-gray-100 last:border-r-0 p-1 flex flex-col gap-1 relative group transition-colors min-h-[80px] ${citasEnSlot.length === 0 ? 'cursor-pointer hover:bg-blue-50/30' : ''}`}
                    >
                      {citasEnSlot.length === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Plus size={16} className="text-blue-200" />
                        </div>
                      )}
                      
                      {citasEnSlot.map(cita => (
                        <div 
                          key={cita.id}
                          onClick={(e) => manejarClicCita(e, cita)}
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.setData("citaId", cita.id);
                            e.currentTarget.classList.add('opacity-50');
                          }}
                          onDragEnd={(e) => {
                            e.currentTarget.classList.remove('opacity-50');
                          }}
                          className={`
                            flex-1 w-full rounded-lg p-2 text-white text-[10px] font-bold cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] min-h-[36px]
                            ${cita.estado === "CONFIRMADO" ? "bg-blue-500 shadow-md" : ""}
                            ${cita.estado === "ATENDIDO" ? "bg-emerald-500 shadow-md" : ""}
                            ${cita.estado === "CANCELADO" ? "bg-rose-500 shadow-md" : ""}
                          `}
                        >
                          <div className="flex justify-between items-start">
                            <span className="truncate">{cita.pacienteNombre}</span>
                            {cita.estado === "ATENDIDO" && <CheckCircle2 size={10} />}
                          </div>
                          <div className="mt-0.5 opacity-90 font-medium truncate flex items-center gap-1">
                            <Clock size={8} /> {new Date(cita.inicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
            {estaCargando && (
              <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center z-20">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="animate-spin text-[#0056b3]" size={32} />
                  <span className="text-xs font-bold text-gray-500">Cargando agenda...</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Submenú de Cita */}
      {citaSeleccionada && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setCitaSeleccionada(null)} />
          <div 
            className="fixed z-50 bg-white rounded-2xl shadow-2xl border border-gray-100 w-64 overflow-hidden animar-entrada"
            style={{ 
              top: `${Math.min(posicionSubmenu.y, window.innerHeight - 450)}px`, 
              left: `${Math.min(posicionSubmenu.x, window.innerWidth - 270)}px` 
            }}
          >
            <div className="p-4 bg-gray-50 border-b border-gray-100">
              <div className="flex gap-2 mb-3">
                <button 
                  onClick={() => manejarCambioEstado(citaSeleccionada.id, "CONFIRMADO")}
                  className={`flex-1 flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${citaSeleccionada.estado === 'CONFIRMADO' ? 'bg-blue-500 text-white shadow-md' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                >
                  <CheckCircle2 size={16} />
                  <span className="text-[10px] font-bold">Confirmar</span>
                </button>
                <button 
                  onClick={() => manejarCambioEstado(citaSeleccionada.id, "CANCELADO")}
                  className={`flex-1 flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${citaSeleccionada.estado === 'CANCELADO' ? 'bg-rose-500 text-white shadow-md' : 'bg-rose-50 text-rose-600 hover:bg-rose-100'}`}
                >
                  <XCircle size={16} />
                  <span className="text-[10px] font-bold">Cancelar</span>
                </button>
                <button 
                  onClick={() => manejarCambioEstado(citaSeleccionada.id, "ATENDIDO")}
                  className={`flex-1 flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${citaSeleccionada.estado === 'ATENDIDO' ? 'bg-emerald-500 text-white shadow-md' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}
                >
                  <CheckCircle2 size={16} />
                  <span className="text-[10px] font-bold">Atendido</span>
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-800">{citaSeleccionada.pacienteNombre}</p>
                  <p className="text-[10px] text-[#0056b3] font-bold">{citaSeleccionada.doctor}</p>
                  <p className="text-[10px] text-gray-400 mt-1">{citaSeleccionada.nota || "Sin notas"}</p>
                </div>
              </div>
            </div>

            <div className="p-2">
              <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50 rounded-xl transition-colors group">
                <MessageSquare size={18} className="text-emerald-500" />
                <span className="flex-1 text-left font-medium">Enviar WhatsApp</span>
              </button>
              <a href="/pacientes" className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50 rounded-xl transition-colors group">
                <User size={18} className="text-blue-500" />
                <span className="flex-1 text-left font-medium">Datos del paciente</span>
              </a>
              <a href="/odontograma" className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50 rounded-xl transition-colors group">
                <ClipboardList size={18} className="text-indigo-500" />
                <span className="flex-1 text-left font-medium">Ficha médica</span>
              </a>
              <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50 rounded-xl transition-colors group">
                <Wallet size={18} className="text-amber-500" />
                <span className="flex-1 text-left font-medium">Realizar cobro</span>
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
        onClose={() => {
          setModalCitaAbierto(false);
          setDatosPrellenados(null);
        }}
        fechaInicial={datosPrellenados?.fecha}
        horaInicial={datosPrellenados?.hora}
        onSuccess={() => {
          const cargarDatos = async () => {
            setEstaCargando(true);
            const res = await obtenerCitas();
            setCitas(res);
            setEstaCargando(false);
          };
          cargarDatos();
        }}
      />
    </div>
  );
};
