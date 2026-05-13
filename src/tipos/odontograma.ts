// ===== Tipos para el Odontograma =====

/** Caras de un diente */
export type CaraDiente = "vestibular" | "palatino" | "mesial" | "distal" | "oclusal";

/** Herramientas / hallazgos disponibles */
export type TipoHallazgo = "caries" | "obturacion" | "ausente" | "sellante";

/** Estado de las caras de un diente individual */
export interface EstadoCaras {
  vestibular: TipoHallazgo | null;
  palatino: TipoHallazgo | null;
  mesial: TipoHallazgo | null;
  distal: TipoHallazgo | null;
  oclusal: TipoHallazgo | null;
}

/** Estado completo de un diente */
export interface EstadoDienteIndividual {
  numeroDiente: number;
  caras: EstadoCaras;
}

/** Una entrada en la tabla de tratamientos sugeridos */
export interface EntradaTratamiento {
  id: string;
  numeroDiente: number;
  cara: CaraDiente;
  hallazgo: TipoHallazgo;
  tratamientoSugerido: string;
  precioEstimado: number;
  fechaRegistro: Date;
}

/** Configuración de una herramienta */
export interface ConfiguracionHerramienta {
  tipo: TipoHallazgo;
  etiqueta: string;
  color: string;
  colorFondo: string;
  colorBorde: string;
  icono: string;
  tratamiento: string;
  precioBase: number;
}

/** Props del componente DienteSvg */
export interface PropsDienteSvg {
  numeroDiente: number;
  estadoCaras: EstadoCaras;
  alHacerClicCara: (numeroDiente: number, cara: CaraDiente) => void;
  esAusente: boolean;
}

/** Cuadrantes dentales */
export interface Cuadrante {
  nombre: string;
  dientes: number[];
  posicion: "superior" | "inferior";
}
