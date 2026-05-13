import { FichaOdontograma } from "@/componentes/FichaOdontograma";

export default function PaginaOdontograma() {
  return (
    <div className="bg-[#f8f9fa]">
      <div className="bg-white border-b border-gray-200 py-3 px-4 md:px-6">
        <div className="max-w-[1600px] mx-auto flex items-center gap-2">
          <a href="/" className="text-xs font-bold text-[#0056b3] hover:underline">Agenda</a>
          <div className="w-1 h-1 bg-gray-300 rounded-full" />
          <span className="text-sm font-bold text-gray-800">Ficha de Odontograma</span>
        </div>
      </div>
      
      <div className="max-w-[1600px] mx-auto py-6">
        <FichaOdontograma />
      </div>
    </div>
  );
}
