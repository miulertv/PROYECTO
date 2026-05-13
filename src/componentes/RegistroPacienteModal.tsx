"use client";

import React, { useState } from "react";
import { UserPlus, X, Loader2, Calendar, CreditCard, User, Phone, Clipboard } from "lucide-react";
import { crearPaciente } from "@/acciones";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (paciente: { id: string; dni: string; nombres: string; apellidos: string }) => void;
}

export const RegistroPacienteModal: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    dni: "",
    nombres: "",
    apellidos: "",
    fechaNacimiento: "",
    celular: "",
    genero: "Masculino" as "Masculino" | "Femenino" | "Otro",
    historiaClinicaNro: "",
  });

  const [estaCargando, setEstaCargando] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: "exito" | "error"; texto: string } | null>(null);

  if (!isOpen) return null;

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const manejarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEstaCargando(true);
    setMensaje(null);

    try {
      const res = await crearPaciente({
        ...formData,
        clinicaId: "975d9ebf-5316-45c3-b44e-7e41bc4d7819", // ID de la clínica por defecto
      });

      if (res.exito) {
        setMensaje({ tipo: "exito", texto: res.mensaje });
        setTimeout(() => {
          onSuccess(res.paciente);
          onClose();
        }, 1500);
      } else {
        setMensaje({ tipo: "error", texto: res.mensaje });
      }
    } catch (err) {
      setMensaje({ tipo: "error", texto: "Error de conexión al servidor." });
    } finally {
      setEstaCargando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animar-entrada border border-gray-100">
        {/* Encabezado */}
        <div className="bg-clinica-primario p-6 flex justify-between items-center text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <UserPlus size={20} />
            </div>
            <h2 className="text-xl font-bold">Registrar Paciente</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={manejarSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* DNI */}
            <div className="col-span-2 sm:col-span-1">
              <label className="text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1.5">
                <CreditCard size={12} /> DNI
              </label>
              <input
                required
                name="dni"
                maxLength={8}
                value={formData.dni}
                onChange={(e) => setFormData(p => ({ ...p, dni: e.target.value.replace(/\D/g, "") }))}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-clinica-primario/20 focus:border-clinica-primario outline-none transition-all text-sm"
                placeholder="Ej. 12345678"
              />
            </div>

            {/* Historia Clínica */}
            <div className="col-span-2 sm:col-span-1">
              <label className="text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1.5">
                <Clipboard size={12} /> N° Historia
              </label>
              <input
                required
                name="historiaClinicaNro"
                value={formData.historiaClinicaNro}
                onChange={manejarCambio}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-clinica-primario/20 focus:border-clinica-primario outline-none transition-all text-sm"
                placeholder="Ej. HC-001"
              />
            </div>
          </div>

          {/* Nombres */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1.5">
              <User size={12} /> Nombres
            </label>
            <input
              required
              name="nombres"
              value={formData.nombres}
              onChange={manejarCambio}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-clinica-primario/20 focus:border-clinica-primario outline-none transition-all text-sm"
              placeholder="Ej. Juan Carlos"
            />
          </div>

          {/* Apellidos */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1.5">
              <User size={12} /> Apellidos
            </label>
            <input
              required
              name="apellidos"
              value={formData.apellidos}
              onChange={manejarCambio}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-clinica-primario/20 focus:border-clinica-primario outline-none transition-all text-sm"
              placeholder="Ej. Pérez Gómez"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Fecha Nacimiento */}
            <div className="col-span-2 sm:col-span-1">
              <label className="text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1.5">
                <Calendar size={12} /> F. Nacimiento
              </label>
              <input
                required
                type="date"
                name="fechaNacimiento"
                value={formData.fechaNacimiento}
                onChange={manejarCambio}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-clinica-primario/20 focus:border-clinica-primario outline-none transition-all text-sm"
              />
            </div>

            {/* Celular */}
            <div className="col-span-2 sm:col-span-1">
              <label className="text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1.5">
                <Phone size={12} /> Celular
              </label>
              <input
                name="celular"
                maxLength={9}
                value={formData.celular}
                onChange={(e) => setFormData(p => ({ ...p, celular: e.target.value.replace(/\D/g, "") }))}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-clinica-primario/20 focus:border-clinica-primario outline-none transition-all text-sm"
                placeholder="Ej. 987654321"
              />
            </div>
          </div>

          {/* Mensajes */}
          {mensaje && (
            <div className={`p-3 rounded-xl text-sm font-medium ${mensaje.tipo === "exito" ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-700 border border-red-100"}`}>
              {mensaje.texto}
            </div>
          )}

          {/* Botones */}
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
              className="flex-2 px-8 py-3 bg-clinica-primario text-white rounded-2xl font-semibold hover:bg-clinica-primarioOscuro transition-colors shadow-lg shadow-blue-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {estaCargando ? <Loader2 size={18} className="animate-spin" /> : <UserPlus size={18} />}
              Registrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
