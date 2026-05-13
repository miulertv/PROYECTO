import type {
  Cuadrante,
  ConfiguracionHerramienta,
  EstadoCaras,
  CaraDiente,
} from "@/tipos/odontograma";

// ===== Cuadrantes dentales (Notación FDI) =====
export const CUADRANTES: Cuadrante[] = [
  {
    nombre: "Cuadrante I - Superior Derecho",
    dientes: [18, 17, 16, 15, 14, 13, 12, 11],
    posicion: "superior",
  },
  {
    nombre: "Cuadrante II - Superior Izquierdo",
    dientes: [21, 22, 23, 24, 25, 26, 27, 28],
    posicion: "superior",
  },
  {
    nombre: "Cuadrante IV - Inferior Derecho",
    dientes: [48, 47, 46, 45, 44, 43, 42, 41],
    posicion: "inferior",
  },
  {
    nombre: "Cuadrante III - Inferior Izquierdo",
    dientes: [31, 32, 33, 34, 35, 36, 37, 38],
    posicion: "inferior",
  },
];

// ===== Configuración de herramientas =====
export const HERRAMIENTAS: ConfiguracionHerramienta[] = [
  {
    tipo: "caries",
    etiqueta: "Caries",
    color: "#dc3545",
    colorFondo: "#fef2f2",
    colorBorde: "#fca5a5",
    icono: "circle-alert",
    tratamiento: "Restauración / Resina",
    precioBase: 80,
  },
  {
    tipo: "obturacion",
    etiqueta: "Obturación",
    color: "#0d6efd",
    colorFondo: "#eff6ff",
    colorBorde: "#93c5fd",
    icono: "shield-check",
    tratamiento: "Obturación existente",
    precioBase: 0,
  },
  {
    tipo: "ausente",
    etiqueta: "Ausente",
    color: "#6c757d",
    colorFondo: "#f9fafb",
    colorBorde: "#d1d5db",
    icono: "circle-x",
    tratamiento: "Prótesis / Implante",
    precioBase: 350,
  },
  {
    tipo: "sellante",
    etiqueta: "Sellante",
    color: "#198754",
    colorFondo: "#f0fdf4",
    colorBorde: "#86efac",
    icono: "shield-plus",
    tratamiento: "Aplicación de sellante",
    precioBase: 45,
  },
];

// ===== Colores por hallazgo (para el SVG) =====
export const COLORES_HALLAZGO: Record<string, string> = {
  caries: "#dc3545",
  obturacion: "#0d6efd",
  ausente: "#9ca3af",
  sellante: "#198754",
};

// ===== Estado inicial vacío para caras =====
export const crearEstadoCarasVacio = (): EstadoCaras => ({
  vestibular: null,
  palatino: null,
  mesial: null,
  distal: null,
  oclusal: null,
});

// ===== Etiquetas legibles para las caras =====
export const ETIQUETAS_CARAS: Record<CaraDiente, string> = {
  vestibular: "Vestibular",
  palatino: "Palatino/Lingual",
  mesial: "Mesial",
  distal: "Distal",
  oclusal: "Oclusal/Incisal",
};
