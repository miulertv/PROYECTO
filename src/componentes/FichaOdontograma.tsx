"use client";

import React, { useState, useCallback } from "react";
import {
  Activity,
  CircleAlert,
  ShieldCheck,
  CircleX,
  ShieldPlus,
  Trash2,
  ClipboardList,
  Stethoscope,
  RotateCcw,
  Download,
  Save,
  Search,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  UserPlus,
} from "lucide-react";
import type {
  CaraDiente,
  TipoHallazgo,
  EstadoDienteIndividual,
  EntradaTratamiento,
  ConfiguracionHerramienta,
} from "@/tipos/odontograma";
import {
  CUADRANTES,
  HERRAMIENTAS,
  crearEstadoCarasVacio,
  ETIQUETAS_CARAS,
} from "@/constantes/odontograma";
import DienteSvg from "./DienteSvg";
import { RegistroPacienteModal } from "./RegistroPacienteModal";
import { guardarOdontograma } from "@/acciones/guardarOdontograma";
import { obtenerHistorialPaciente } from "@/acciones/obtenerHistorialPaciente";
import type { RespuestaGuardar } from "@/acciones/guardarOdontograma";
import type { RespuestaHistorial } from "@/acciones/obtenerHistorialPaciente";

// ===== Iconos por tipo de herramienta =====
const ICONOS_HERRAMIENTA: Record<TipoHallazgo, React.ReactNode> = {
  caries: <CircleAlert size={16} />,
  obturacion: <ShieldCheck size={16} />,
  ausente: <CircleX size={16} />,
  sellante: <ShieldPlus size={16} />,
};

// ===== Inicializar estado dental para 32 dientes =====
const crearEstadoDentalInicial = (): EstadoDienteIndividual[] => {
  const todosLosDientes: number[] = [];
  CUADRANTES.forEach((cuadrante) => {
    cuadrante.dientes.forEach((diente) => {
      todosLosDientes.push(diente);
    });
  });
  return todosLosDientes.map((num) => ({
    numeroDiente: num,
    caras: crearEstadoCarasVacio(),
  }));
};

// ===== Componente Principal: FichaOdontograma =====
export const FichaOdontograma: React.FC = () => {
  // --- Estado ---
  const [estadoDental, setEstadoDental] = useState<EstadoDienteIndividual[]>(
    crearEstadoDentalInicial()
  );
  const [listaTratamientos, setListaTratamientos] = useState<
    EntradaTratamiento[]
  >([]);
  const [herramientaActiva, setHerramientaActiva] =
    useState<TipoHallazgo | null>(null);

  // --- Estado para Server Actions ---
  const [estaGuardando, setEstaGuardando] = useState(false);
  const [estaBuscando, setEstaBuscando] = useState(false);
  const [dniBusqueda, setDniBusqueda] = useState("");
  const [mensajeEstado, setMensajeEstado] = useState<{
    tipo: "exito" | "error";
    texto: string;
  } | null>(null);
  const [historialPaciente, setHistorialPaciente] =
    useState<RespuestaHistorial | null>(null);
  const [modalRegistroAbierto, setModalRegistroAbierto] = useState(false);

  // IDs del paciente y odontólogo seleccionados
  const [pacienteIdActual, setPacienteIdActual] = useState("");
  const [odontologoIdActual, setOdontologoIdActual] = useState("");

  // --- Obtener configuración de herramienta activa ---
  const configHerramientaActiva: ConfiguracionHerramienta | undefined =
    HERRAMIENTAS.find((h) => h.tipo === herramientaActiva);

  // --- Obtener estado de un diente por número ---
  const obtenerEstadoDiente = useCallback(
    (numeroDiente: number): EstadoDienteIndividual => {
      return (
        estadoDental.find((d) => d.numeroDiente === numeroDiente) ?? {
          numeroDiente,
          caras: crearEstadoCarasVacio(),
        }
      );
    },
    [estadoDental]
  );

  // --- Verificar si un diente está marcado como ausente ---
  const dienteEsAusente = useCallback(
    (numeroDiente: number): boolean => {
      const diente = obtenerEstadoDiente(numeroDiente);
      return Object.values(diente.caras).some((v) => v === "ausente");
    },
    [obtenerEstadoDiente]
  );

  // --- Manejar clic en una cara del diente ---
  const manejarClicCara = useCallback(
    (numeroDiente: number, cara: CaraDiente) => {
      if (!herramientaActiva) return;

      const configHerramienta = HERRAMIENTAS.find(
        (h) => h.tipo === herramientaActiva
      );
      if (!configHerramienta) return;

      setEstadoDental((prevEstado) =>
        prevEstado.map((diente) => {
          if (diente.numeroDiente !== numeroDiente) return diente;

          const nuevoEstadoCaras = { ...diente.caras };

          if (herramientaActiva === "ausente") {
            // Si es "ausente", marcar TODAS las caras
            const yaEsAusente = Object.values(nuevoEstadoCaras).some(
              (v) => v === "ausente"
            );
            if (yaEsAusente) {
              // Desmarcar ausente
              (Object.keys(nuevoEstadoCaras) as CaraDiente[]).forEach((c) => {
                if (nuevoEstadoCaras[c] === "ausente") {
                  nuevoEstadoCaras[c] = null;
                }
              });
            } else {
              (Object.keys(nuevoEstadoCaras) as CaraDiente[]).forEach((c) => {
                nuevoEstadoCaras[c] = "ausente";
              });
            }
          } else {
            // Toggle: si la cara ya tiene el mismo hallazgo, quitar; sino, aplicar
            if (nuevoEstadoCaras[cara] === herramientaActiva) {
              nuevoEstadoCaras[cara] = null;
            } else {
              nuevoEstadoCaras[cara] = herramientaActiva;
            }
          }

          return { ...diente, caras: nuevoEstadoCaras };
        })
      );

      // Agregar tratamiento a la lista
      const nuevaEntrada: EntradaTratamiento = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        numeroDiente,
        cara,
        hallazgo: herramientaActiva,
        tratamientoSugerido: configHerramienta.tratamiento,
        precioEstimado: configHerramienta.precioBase,
        fechaRegistro: new Date(),
      };
      setListaTratamientos((prev) => [nuevaEntrada, ...prev]);
    },
    [herramientaActiva]
  );

  // --- Eliminar un tratamiento ---
  const eliminarTratamiento = (id: string) => {
    setListaTratamientos((prev) => prev.filter((t) => t.id !== id));
  };

  // --- Reiniciar todo ---
  const reiniciarOdontograma = () => {
    setEstadoDental(crearEstadoDentalInicial());
    setListaTratamientos([]);
    setHerramientaActiva(null);
    setMensajeEstado(null);
    setHistorialPaciente(null);
  };

  // --- Calcular total ---
  const totalEstimado = listaTratamientos.reduce(
    (acc, t) => acc + t.precioEstimado,
    0
  );

  // --- Guardar odontograma en la DB ---
  const manejarGuardar = async () => {
    if (!pacienteIdActual || !odontologoIdActual) {
      setMensajeEstado({
        tipo: "error",
        texto: "Debe seleccionar un paciente y odontólogo antes de guardar.",
      });
      return;
    }
    setEstaGuardando(true);
    setMensajeEstado(null);
    try {
      const respuesta: RespuestaGuardar = await guardarOdontograma({
        pacienteId: pacienteIdActual,
        odontologoId: odontologoIdActual,
        estadoDentalJson: estadoDental,
      });
      if (respuesta.exito) {
        setMensajeEstado({ tipo: "exito", texto: respuesta.mensaje });
      } else {
        setMensajeEstado({ tipo: "error", texto: respuesta.mensaje });
      }
    } catch {
      setMensajeEstado({
        tipo: "error",
        texto: "Error de conexión al guardar el odontograma.",
      });
    } finally {
      setEstaGuardando(false);
    }
  };

  // --- Buscar historial por DNI ---
  const manejarBuscarHistorial = async () => {
    if (dniBusqueda.length !== 8) {
      setMensajeEstado({
        tipo: "error",
        texto: "El DNI debe tener exactamente 8 dígitos.",
      });
      return;
    }
    setEstaBuscando(true);
    setMensajeEstado(null);
    try {
      const respuesta: RespuestaHistorial = await obtenerHistorialPaciente({
        dni: dniBusqueda,
      });
      setHistorialPaciente(respuesta);
      if (respuesta.exito) {
        setPacienteIdActual(respuesta.paciente.id);
        setOdontologoIdActual("b866a278-26c9-44b8-912e-566f66855d76");

        if (respuesta.odontogramas.length > 0) {
          const ultimoOdontograma = respuesta.odontogramas[0];
          setEstadoDental(ultimoOdontograma.estadoDentalJson as any);
        }
        
        setMensajeEstado({
          tipo: "exito",
          texto: `Paciente encontrado: ${respuesta.paciente.nombres} ${respuesta.paciente.apellidos} — ${respuesta.totalRegistros} registro(s).`,
        });
      } else {
        setMensajeEstado({ tipo: "error", texto: respuesta.mensaje });
      }
    } catch {
      setMensajeEstado({
        tipo: "error",
        texto: "Error de conexión al buscar historial.",
      });
    } finally {
      setEstaBuscando(false);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8 animar-entrada">
      {/* ===== ENCABEZADO ===== */}
      <header className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-clinica-primario rounded-xl shadow-lg shadow-blue-500/20">
            <Stethoscope size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-clinica-texto tracking-tight">
              Clínica Dental - Ficha de Odontograma
            </h1>
            <p className="text-sm text-clinica-textoSecundario">
              Registro interactivo de hallazgos dentales
            </p>
          </div>
        </div>

        {/* Buscador por DNI */}
        <div className="flex items-center gap-2 mt-3">
          <input
            type="text"
            maxLength={8}
            value={dniBusqueda}
            onChange={(e) => setDniBusqueda(e.target.value.replace(/\D/g, ""))}
            placeholder="Buscar por DNI (8 dígitos)"
            className="px-3 py-2 border border-clinica-borde rounded-xl text-sm w-48 focus:outline-none focus:ring-2 focus:ring-clinica-primario/30"
          />
          <button
            onClick={manejarBuscarHistorial}
            disabled={estaBuscando || dniBusqueda.length !== 8}
            className="flex items-center gap-2 px-4 py-2 bg-clinica-primario text-white rounded-xl text-sm font-medium hover:bg-clinica-primarioOscuro transition-colors disabled:opacity-50"
          >
            {estaBuscando ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
            Buscar
          </button>

          <div className="w-px h-8 bg-gray-200 mx-2" />

          <button
            onClick={() => setModalRegistroAbierto(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white text-clinica-primario border-2 border-clinica-primario rounded-xl text-sm font-bold hover:bg-clinica-primarioClaro transition-colors"
          >
            <UserPlus size={16} />
            Nuevo Paciente
          </button>
        </div>

        {/* Mensaje de estado */}
        {mensajeEstado && (
          <div
            className={`mt-3 flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium animar-entrada ${
              mensajeEstado.tipo === "exito"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {mensajeEstado.tipo === "exito" ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
            {mensajeEstado.texto}
          </div>
        )}
      </header>

      {/* ===== PALETA DE HERRAMIENTAS ===== */}
      <section className="mb-6 bg-white rounded-2xl shadow-sm border border-clinica-borde p-4 md:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-clinica-textoSecundario shrink-0">
            <Activity size={16} />
            <span>Herramientas:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {HERRAMIENTAS.map((herramienta) => {
              const estaSeleccionada = herramientaActiva === herramienta.tipo;
              return (
                <button
                  key={herramienta.tipo}
                  onClick={() =>
                    setHerramientaActiva(
                      estaSeleccionada ? null : herramienta.tipo
                    )
                  }
                  className={`herramienta-btn flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${
                    estaSeleccionada
                      ? "seleccionada text-white"
                      : "hover:shadow-md"
                  }`}
                  style={
                    estaSeleccionada
                      ? {
                          backgroundColor: herramienta.color,
                          borderColor: herramienta.color,
                        }
                      : {
                          backgroundColor: herramienta.colorFondo,
                          borderColor: herramienta.colorBorde,
                          color: herramienta.color,
                        }
                  }
                >
                  {ICONOS_HERRAMIENTA[herramienta.tipo]}
                  {herramienta.etiqueta}
                </button>
              );
            })}
          </div>

          {/* Botón reiniciar */}
          <button
            onClick={reiniciarOdontograma}
            className="ml-auto flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-clinica-textoSecundario bg-gray-100 border border-gray-200 hover:bg-gray-200 hover:text-red-600 transition-all"
          >
            <RotateCcw size={15} />
            Reiniciar
          </button>
        </div>

        {/* Indicador de herramienta activa */}
        {configHerramientaActiva && (
          <div
            className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium animar-entrada"
            style={{
              backgroundColor: configHerramientaActiva.colorFondo,
              color: configHerramientaActiva.color,
              borderLeft: `3px solid ${configHerramientaActiva.color}`,
            }}
          >
            <span className="inline-block w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: configHerramientaActiva.color }}
            />
            Herramienta activa: <strong>{configHerramientaActiva.etiqueta}</strong> — Haz clic en una cara del diente para registrar el hallazgo.
          </div>
        )}

        {!herramientaActiva && (
          <div className="mt-3 px-3 py-2 rounded-lg text-xs text-amber-700 bg-amber-50 border-l-3 border-amber-400 font-medium">
            ⚠️ Selecciona una herramienta para comenzar a registrar hallazgos.
          </div>
        )}
      </section>

      {/* ===== CONTENIDO PRINCIPAL: 2 COLUMNAS ===== */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* --- Columna Izquierda: Odontograma --- */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-clinica-borde p-5 md:p-6">
            <h2 className="text-lg font-bold text-clinica-texto mb-5 flex items-center gap-2">
              <div className="w-1.5 h-6 bg-clinica-primario rounded-full" />
              Mapa Dental
            </h2>

            {/* Leyenda de caras */}
            <div className="flex flex-wrap gap-x-5 gap-y-1 mb-5 text-[11px] text-clinica-textoSecundario">
              <span>↑ Vestibular</span>
              <span>↓ Palatino</span>
              <span>← Mesial</span>
              <span>→ Distal</span>
              <span>▣ Oclusal</span>
            </div>

            {/* Arcada Superior */}
            <div className="mb-3">
              <p className="text-xs font-semibold text-clinica-textoSecundario mb-2 uppercase tracking-wider">
                Arcada Superior
              </p>
              <div className="flex justify-center">
                <div className="inline-flex gap-1 flex-wrap justify-center">
                  {/* Cuadrante I + II */}
                  {CUADRANTES.filter((c) => c.posicion === "superior").map(
                    (cuadrante) =>
                      cuadrante.dientes.map((numDiente) => {
                        const estado = obtenerEstadoDiente(numDiente);
                        return (
                          <DienteSvg
                            key={numDiente}
                            numeroDiente={numDiente}
                            estadoCaras={estado.caras}
                            alHacerClicCara={manejarClicCara}
                            esAusente={dienteEsAusente(numDiente)}
                          />
                        );
                      })
                  )}
                </div>
              </div>
              {/* Línea divisoria central */}
              <div className="flex justify-center my-1">
                <div className="w-full max-w-[540px] h-px bg-gradient-to-r from-transparent via-clinica-primario/30 to-transparent" />
              </div>
            </div>

            {/* Arcada Inferior */}
            <div>
              <p className="text-xs font-semibold text-clinica-textoSecundario mb-2 uppercase tracking-wider">
                Arcada Inferior
              </p>
              <div className="flex justify-center">
                <div className="inline-flex gap-1 flex-wrap justify-center">
                  {/* Cuadrante IV + III */}
                  {CUADRANTES.filter((c) => c.posicion === "inferior").map(
                    (cuadrante) =>
                      cuadrante.dientes.map((numDiente) => {
                        const estado = obtenerEstadoDiente(numDiente);
                        return (
                          <DienteSvg
                            key={numDiente}
                            numeroDiente={numDiente}
                            estadoCaras={estado.caras}
                            alHacerClicCara={manejarClicCara}
                            esAusente={dienteEsAusente(numDiente)}
                          />
                        );
                      })
                  )}
                </div>
              </div>
            </div>

            {/* Leyenda de colores */}
            <div className="mt-6 pt-4 border-t border-gray-100">
              <p className="text-xs font-semibold text-clinica-textoSecundario mb-2">
                Leyenda de colores:
              </p>
              <div className="flex flex-wrap gap-3">
                {HERRAMIENTAS.map((h) => (
                  <div key={h.tipo} className="flex items-center gap-1.5">
                    <span
                      className="w-3 h-3 rounded-sm border"
                      style={{
                        backgroundColor: h.color,
                        borderColor: h.color,
                      }}
                    />
                    <span className="text-[11px] text-clinica-textoSecundario font-medium">
                      {h.etiqueta}
                    </span>
                  </div>
                ))}
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-white border border-gray-300" />
                  <span className="text-[11px] text-clinica-textoSecundario font-medium">
                    Sano
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- Columna Derecha: Tratamientos Sugeridos --- */}
        <div className="xl:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-clinica-borde p-5 md:p-6 sticky top-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-clinica-texto flex items-center gap-2">
                <ClipboardList size={20} className="text-clinica-primario" />
                Tratamientos Sugeridos
              </h2>
              <span className="text-xs font-semibold text-white bg-clinica-primario px-2.5 py-1 rounded-full">
                {listaTratamientos.length}
              </span>
            </div>

            {listaTratamientos.length === 0 ? (
              <div className="text-center py-12 text-clinica-textoSecundario">
                <ClipboardList size={40} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm font-medium">Sin registros aún</p>
                <p className="text-xs mt-1">
                  Selecciona una herramienta y haz clic en un diente
                </p>
              </div>
            ) : (
              <>
                {/* Tabla de tratamientos */}
                <div className="max-h-[420px] overflow-y-auto -mx-1 px-1">
                  <div className="space-y-2">
                    {listaTratamientos.map((tratamiento, indice) => {
                      const configH = HERRAMIENTAS.find(
                        (h) => h.tipo === tratamiento.hallazgo
                      );
                      return (
                        <div
                          key={tratamiento.id}
                          className="animar-fila flex items-start gap-3 p-3 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50/50 transition-all group"
                          style={{ animationDelay: `${indice * 30}ms` }}
                        >
                          {/* Indicador de color */}
                          <div
                            className="w-2 h-full min-h-[40px] rounded-full shrink-0 mt-0.5"
                            style={{
                              backgroundColor: configH?.color ?? "#6c757d",
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-sm font-bold text-clinica-texto">
                                Diente {tratamiento.numeroDiente}
                              </span>
                              <span
                                className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                                style={{
                                  backgroundColor: configH?.colorFondo,
                                  color: configH?.color,
                                }}
                              >
                                {configH?.etiqueta}
                              </span>
                            </div>
                            <p className="text-xs text-clinica-textoSecundario">
                              Cara:{" "}
                              <span className="font-medium">
                                {ETIQUETAS_CARAS[tratamiento.cara]}
                              </span>
                            </p>
                            <p className="text-xs text-clinica-textoSecundario">
                              {tratamiento.tratamientoSugerido}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-1 shrink-0">
                            <span className="text-sm font-bold text-clinica-texto">
                              {tratamiento.precioEstimado > 0
                                ? `S/ ${tratamiento.precioEstimado.toFixed(2)}`
                                : "—"}
                            </span>
                            <button
                              onClick={() =>
                                eliminarTratamiento(tratamiento.id)
                              }
                              className="p-1 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                              title="Eliminar"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Resumen Total */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-clinica-textoSecundario">
                      Total Estimado:
                    </span>
                    <span className="text-xl font-bold text-clinica-primario">
                      S/ {totalEstimado.toFixed(2)}
                    </span>
                  </div>
                  <button
                    onClick={manejarGuardar}
                    disabled={estaGuardando || listaTratamientos.length === 0}
                    className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-clinica-primario text-white rounded-xl text-sm font-semibold hover:bg-clinica-primarioOscuro transition-colors shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {estaGuardando ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Save size={16} />
                    )}
                    {estaGuardando ? "Guardando..." : "Guardar Odontograma"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Registro */}
      <RegistroPacienteModal
        isOpen={modalRegistroAbierto}
        onClose={() => setModalRegistroAbierto(false)}
        onSuccess={(paciente) => {
          setDniBusqueda(paciente.dni);
          setPacienteIdActual(paciente.id);
          setOdontologoIdActual("b866a278-26c9-44b8-912e-566f66855d76");
          setMensajeEstado({
            tipo: "exito",
            texto: `Paciente registrado y seleccionado: ${paciente.nombres} ${paciente.apellidos}`,
          });
        }}
      />
    </div>
  );
};
