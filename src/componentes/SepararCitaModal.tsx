"use client";

import React, { useState } from "react";
import { X, Calendar, Clock, User, Clipboard, Loader2, Save } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (nuevaCita: any) => void;
}

export const SepararCitaModal: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    pacienteNombre: "",
    fecha: "",
    hora: "09:00",
    motivo: "",
  });

  const [estaCargando, setEstaCargando] = useState(false);

  if (!isOpen) return null;

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const manejarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEstaCargando(true);
    
    // Simulamos la creación de la cita
    setTimeout(() => {
      const nuevaCita = {
        id: Math.random().toString(36).substr(2, 9),
        pacienteNombre: formData.pacienteNombre,
        inicio: `${formData.fecha}T${formData.hora}:00`,
        fin: `${formData.fecha}T${formData.hora.replace(/(\d+)/, (m) => (parseInt(m) + 1).toString().padStart(2, '0'))}:00`,
        estado: "confirmado",
        motivo: formData.motivo,
      };
      
      onSuccess(nuevaCita);
      setEstaCargando(false);
      onClose();
    }, 1000);
  };

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
        <form onSubmit={manejarSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1.5">
              <User size={12} /> Paciente
            </label>
            <input
              required
              name="pacienteNombre"
              value={formData.pacienteNombre}
              onChange={manejarCambio}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0056b3]/20 outline-none text-sm"
              placeholder="Nombre del paciente"
            />
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
                {Array.from({ length: 9 }, (_, i) => i + 9).map(h => (
                  <option key={h} value={`${h.toString().padStart(2, '0')}:00`}>{h}:00 AM</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1.5">
              <Clipboard size={12} /> Motivo
            </label>
            <textarea
              name="motivo"
              value={formData.motivo}
              onChange={manejarCambio}
              rows={3}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0056b3]/20 outline-none text-sm resize-none"
              placeholder="Ej. Limpieza, Curación..."
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
