"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Calendar, Clock, User, Clipboard, Loader2, Save, Search, UserCheck } from "lucide-react";
import { buscarPacientes, guardarCita } from "@/acciones";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (nuevaCita: any) => void;
  fechaInicial?: string; // Formato YYYY-MM-DD
  horaInicial?: string; // Formato HH:mm
}

const DOCTORES = ["Dr. Miuller Trigoso", "Dra. Ana García", "Dr. Roberto Sánchez"];
const MOTIVOS = ["Consulta General", "Limpieza Dental", "Curación", "Extracción", "Ortodoncia", "Prótesis", "Otro"];

export const SepararCitaModal: React.FC<Props> = ({ 
  isOpen, 
  onClose, 
  onSuccess,
  fechaInicial,
  horaInicial 
}) => {
  const [formData, setFormData] = useState({
    pacienteId: "",
    pacienteNombre: "",
    fecha: fechaInicial || "",
    hora: horaInicial || "09:00",
    motivo: "Consulta General",
    doctor: DOCTORES[0],
    nota: "",
  });

  const [busquedaPaciente, setBusquedaPaciente] = useState("");
  const [sugerencias, setSugerencias] = useState<any[]>([]);
  const [buscandoSugerencias, setBuscandoSugerencias] = useState(false);
  const [estaCargando, setEstaCargando] = useState(false);
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  
  const timerBusqueda = useRef<any>(null);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        pacienteId: "",
        pacienteNombre: "",
        fecha: fechaInicial || "",
        hora: horaInicial || "09:00",
        motivo: "Consulta General",
        doctor: DOCTORES[0],
        nota: "",
      });
      setBusquedaPaciente("");
      setSugerencias([]);
      setMostrarSugerencias(false);
    }
  }, [isOpen, fechaInicial, horaInicial]);

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const manejarBusquedaPaciente = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    setBusquedaPaciente(valor);
    setFormData(p => ({ ...p, pacienteNombre: valor, pacienteId: "" }));

    if (timerBusqueda.current) clearTimeout(timerBusqueda.current);

    if (valor.length >= 2) {
      setBuscandoSugerencias(true);
      timerBusqueda.current = setTimeout(async () => {
        const res = await buscarPacientes(valor);
        setSugerencias(res);
        setBuscandoSugerencias(false);
        setMostrarSugerencias(true);
      }, 500);
    } else {
      setSugerencias([]);
      setMostrarSugerencias(false);
    }
  };

  const seleccionarPaciente = (p: any) => {
    setFormData(prev => ({ 
      ...prev, 
      pacienteId: p.id, 
      pacienteNombre: `${p.nombres} ${p.apellidos}` 
    }));
    setBusquedaPaciente(`${p.nombres} ${p.apellidos}`);
    setMostrarSugerencias(false);
  };

  const manejarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.pacienteId) {
      alert("Por favor selecciona un paciente de la lista.");
      return;
    }
    setEstaCargando(true);
    
    try {
      const res = await guardarCita({
        ...formData,
        clinicaId: "975d9ebf-5316-45c3-b44e-7e41bc4d7819", // ID de clínica por defecto
        odontologoId: "b866a278-26c9-44b8-912e-566f66855d76", // ID de odontólogo por defecto
      });

      if (res.exito) {
        onSuccess({
          ...res.cita,
          pacienteNombre: formData.pacienteNombre,
          inicio: res.cita.fecha_hora_inicio.toISOString(),
          fin: res.cita.fecha_hora_fin.toISOString(),
        });
        onClose();
      } else {
        alert(res.mensaje);
      }
    } catch (err) {
      alert("Error al guardar la cita.");
    } finally {
      setEstaCargando(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animar-entrada">
        {/* Encabezado */}
        <div className="bg-[#0056b3] p-6 flex justify-between items-center text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Calendar size={20} />
            </div>
            <h2 className="text-xl font-bold">Separar Cita</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={manejarSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
          {/* Paciente con Autocomplete */}
          <div className="relative">
            <label className="text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1.5">
              <User size={12} /> Paciente
            </label>
            <div className="relative">
              <input
                required
                name="pacienteNombre"
                value={busquedaPaciente}
                onChange={manejarBusquedaPaciente}
                onFocus={() => busquedaPaciente.length >= 2 && setMostrarSugerencias(true)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0056b3]/20 outline-none text-sm pr-10"
                placeholder="Buscar por nombre o DNI..."
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {buscandoSugerencias ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
              </div>
            </div>

            {/* Lista de sugerencias */}
            {mostrarSugerencias && sugerencias.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-gray-100 rounded-xl shadow-xl max-h-48 overflow-y-auto">
                {sugerencias.map((p) => (
                  <div 
                    key={p.id}
                    onClick={() => seleccionarPaciente(p)}
                    className="px-4 py-2 hover:bg-blue-50 cursor-pointer transition-colors border-b border-gray-50 last:border-0"
                  >
                    <p className="text-sm font-bold text-gray-800">{p.nombres} {p.apellidos}</p>
                    <p className="text-[10px] text-gray-400">DNI: {p.dni}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1.5">
                <Calendar size={12} /> Fecha
              </label>
              <input
                required
                type="date"
                name="fecha"
                value={formData.fecha}
                onChange={manejarCambio}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0056b3]/20 outline-none text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1.5">
                <Clock size={12} /> Hora
              </label>
              <select
                name="hora"
                value={formData.hora}
                onChange={manejarCambio}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0056b3]/20 outline-none text-sm"
              >
                {Array.from({ length: 13 }, (_, i) => i + 9).map(h => {
                  const hStr = h.toString().padStart(2, '0');
                  const label = h > 12 ? `${h - 12}:00 PM` : h === 12 ? "12:00 PM" : `${h}:00 AM`;
                  return (
                    <React.Fragment key={h}>
                      <option value={`${hStr}:00`}>{label}</option>
                      <option value={`${hStr}:30`}>{h > 12 ? `${h - 12}:30 PM` : h === 12 ? "12:30 PM" : `${h}:30 AM`}</option>
                    </React.Fragment>
                  );
                })}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1.5">
              <UserCheck size={12} /> Doctor
            </label>
            <select
              name="doctor"
              value={formData.doctor}
              onChange={manejarCambio}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0056b3]/20 outline-none text-sm"
            >
              {DOCTORES.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1.5">
              <Clipboard size={12} /> Motivo
            </label>
            <select
              name="motivo"
              value={formData.motivo}
              onChange={manejarCambio}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0056b3]/20 outline-none text-sm"
            >
              {MOTIVOS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1.5">
              <Clipboard size={12} /> Nota de Cita
            </label>
            <textarea
              name="nota"
              value={formData.nota}
              onChange={manejarCambio}
              rows={2}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0056b3]/20 outline-none text-sm resize-none"
              placeholder="Escribe alguna nota importante..."
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-200 text-gray-600 rounded-2xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={estaCargando}
              className="flex-2 px-8 py-3 bg-[#0056b3] text-white rounded-2xl font-semibold hover:bg-[#004a99] transition-colors shadow-lg shadow-blue-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {estaCargando ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              Guardar Cita
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
