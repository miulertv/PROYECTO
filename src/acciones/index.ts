/**
 * Barrel export para todas las Server Actions del odontograma.
 * Importa desde aquí para acceder a todas las acciones en un solo lugar.
 *
 * Uso en componentes:
 *   import { guardarOdontograma, obtenerHistorialPaciente } from "@/acciones";
 */
export { guardarOdontograma } from "./guardarOdontograma";
export type { RespuestaGuardar } from "./guardarOdontograma";

export { obtenerHistorialPaciente } from "./obtenerHistorialPaciente";
export type {
  RespuestaHistorial,
  RegistroOdontogramaHistorial,
  PlanTratamientoHistorial,
  DatosPaciente,
} from "./obtenerHistorialPaciente";

export {
  calcularPresupuesto,
  calcularPresupuestoDesdeEstadoDental,
} from "./calcularPresupuesto";
export type {
  ItemPresupuesto,
  ResultadoPresupuesto,
} from "./calcularPresupuesto";
export { crearPaciente } from "./crearPaciente";
export type { RespuestaPaciente } from "./crearPaciente";
