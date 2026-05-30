"use client";

import React, { useState, useEffect } from "react";
import { UserPlus, X, Loader2, Calendar, CreditCard, User, Phone, Clipboard, Save } from "lucide-react";
import { crearPaciente, actualizarPaciente } from "@/acciones";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  pacienteAEditar?: {
    id: string;
    dni: string;
    nombres: string;
    apellidos: string;
    fecha_nacimiento: string;
    celular: string | null;
    historia_clinica_nro: string;
  } | null;
}

export const RegistroPacienteModal: React.FC<Props> = ({ isOpen, onClose, onSuccess, pacienteAEditar }) => {
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

  useEffect(() => {
    if (pacienteAEditar) {
      setFormData({
        dni: pacienteAEditar.dni,
        nombres: pacienteAEditar.nombres,
        apellidos: pacienteAEditar.apellidos,
        fechaNacimiento: pacienteAEditar.fecha_nacimiento.split("T")[0],
        celular: pacienteAEditar.celular || "",
        genero: "Masculino", // Valor por defecto ya que el modelo lo tiene como opcional
        historiaClinicaNro: pacienteAEditar.historia_clinica_nro,
      });
    } else {
      setFormData({
        dni: "",
        nombres: "",
        apellidos: "",
        fechaNacimiento: "",
        celular: "",
        genero: "Masculino",
        historiaClinicaNro: "",
      });
    }
  }, [pacienteAEditar, isOpen]);

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
      let res;
      if (pacienteAEditar) {
        res = await actualizarPaciente(pacienteAEditar.id, {
          ...formData,
          clinicaId: "975d9ebf-5316-45c3-b44e-7e41bc4d7819",
        });
      } else {
        res = await crearPaciente({
          ...formData,
          clinicaId: "975d9ebf-5316-45c3-b44e-7e41bc4d7819",
        });
      }

      if (res.exito) {
        setMensaje({ tipo: "exito", texto: res.mensaje });
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1000);
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
        <div className={`p-6 flex justify-between items-center text-white ${pacienteAEditar ? 'bg-indigo-600' : 'bg-[#0056b3]'}`}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              {pacienteAEditar ? <Save size={20} /> : <UserPlus size={20} />}
            </div>
            <h2 className="text-xl font-bold">{pacienteAEditar ? 'Modificar Paciente' : 'Registrar Paciente'}</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={manejarSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-2 gap-4">
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
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0056b3]/20 outline-none text-sm"
                placeholder="Ej. 12345678"
              />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1.5">
                <Clipboard size={12} /> N° Historia
              </label>
              <input
                required
                name="historiaClinicaNro"
                value={formData.historiaClinicaNro}
                onChange={manejarCambio}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0056b3]/20 outline-none text-sm"
                placeholder="Ej. HC-001"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1.5">
              <User size={12} /> Nombres
            </label>
            <input
              required
              name="nombres"
              value={formData.nombres}
              onChange={manejarCambio}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0056b3]/20 outline-none text-sm"
              placeholder="Ej. Juan Carlos"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1.5">
              <User size={12} /> Apellidos
            </label>
            <input
              required
              name="apellidos"
              value={formData.apellidos}
              onChange={manejarCambio}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0056b3]/20 outline-none text-sm"
              placeholder="Ej. Pérez Gómez"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
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
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0056b3]/20 outline-none text-sm"
              />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1.5">
                <Phone size={12} /> Celular
              </label>
              <input
                name="celular"
                maxLength={9}
                value={formData.celular}
                onChange={(e) => setFormData(p => ({ ...p, celular: e.target.value.replace(/\D/g, "") }))}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0056b3]/20 outline-none text-sm"
                placeholder="Ej. 987654321"
              />
            </div>
          </div>

          {mensaje && (
            <div className={`p-3 rounded-xl text-sm font-medium border ${mensaje.tipo === "exito" ? "bg-green-50 text-green-700 border-green-100" : "bg-red-50 text-red-700 border-red-100"}`}>
              {mensaje.texto}
            </div>
          )}

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
              className={`flex-2 px-8 py-3 text-white rounded-2xl font-semibold transition-colors shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 ${pacienteAEditar ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20' : 'bg-[#0056b3] hover:bg-[#004a99] shadow-blue-500/20'}`}
            >
              {estaCargando ? <Loader2 size={18} className="animate-spin" /> : (pacienteAEditar ? <Save size={18} /> : <UserPlus size={18} />)}
              {pacienteAEditar ? 'Guardar Cambios' : 'Registrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
