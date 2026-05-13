import { Agenda } from "@/componentes/Agenda";

export default function Home() {
  return (
    <div className="bg-[#f8f9fa]">
      {/* Mantenimiento / Contexto */}
      <div className="bg-white border-b border-gray-200 py-3 px-4 md:px-6">
        <div className="max-w-[1600px] mx-auto flex items-center gap-2">
          <span className="text-sm font-bold text-gray-800">Agenda Semanal</span>
          <div className="w-1 h-1 bg-gray-300 rounded-full" />
          <span className="text-xs text-gray-500 font-medium">Gestión de Citas y Pacientes</span>
        </div>
      </div>
      
      <div className="max-w-[1600px] mx-auto">
        <Agenda />
      </div>
    </div>
  );
}
