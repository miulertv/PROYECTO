"use client";

import React, { useState } from "react";
import type { PropsDienteSvg, CaraDiente } from "@/tipos/odontograma";
import { COLORES_HALLAZGO, ETIQUETAS_CARAS } from "@/constantes/odontograma";

/**
 * DienteSvg — Componente SVG interactivo de un diente con 5 caras clicables.
 *
 * Distribución visual (vista oclusal):
 *   ┌──────────────────────┐
 *   │     VESTIBULAR       │  (arriba)
 *   │  ┌──┬──────────┬──┐  │
 *   │  │M │  OCLUSAL  │D │  │
 *   │  │E │           │I │  │
 *   │  │S │           │S │  │
 *   │  │  │           │T │  │
 *   │  └──┴──────────┴──┘  │
 *   │     PALATINO         │  (abajo)
 *   └──────────────────────┘
 */
const DienteSvg: React.FC<PropsDienteSvg> = ({
  numeroDiente,
  estadoCaras,
  alHacerClicCara,
  esAusente,
}) => {
  const [caraHover, setCaraHover] = useState<CaraDiente | null>(null);

  const obtenerColorCara = (cara: CaraDiente): string => {
    if (esAusente) return "#d1d5db";
    const hallazgo = estadoCaras[cara];
    if (hallazgo) return COLORES_HALLAZGO[hallazgo];
    return "#ffffff";
  };

  const manejarClicCara = (cara: CaraDiente) => {
    if (esAusente && cara !== "oclusal") return;
    alHacerClicCara(numeroDiente, cara);
  };

  // Dimensiones del SVG
  const ancho = 64;
  const alto = 64;
  const margen = 2;
  const grosorBorde = 14;

  // Coordenadas principales
  const x1 = margen;
  const y1 = margen;
  const x2 = ancho - margen;
  const y2 = alto - margen;
  const ix1 = x1 + grosorBorde;
  const iy1 = y1 + grosorBorde;
  const ix2 = x2 - grosorBorde;
  const iy2 = y2 - grosorBorde;

  // Definiciones de cada cara como polígono
  const carasPoligono: { cara: CaraDiente; puntos: string }[] = [
    {
      // Vestibular (arriba)
      cara: "vestibular",
      puntos: `${x1},${y1} ${x2},${y1} ${ix2},${iy1} ${ix1},${iy1}`,
    },
    {
      // Palatino (abajo)
      cara: "palatino",
      puntos: `${ix1},${iy2} ${ix2},${iy2} ${x2},${y2} ${x1},${y2}`,
    },
    {
      // Mesial (izquierda)
      cara: "mesial",
      puntos: `${x1},${y1} ${ix1},${iy1} ${ix1},${iy2} ${x1},${y2}`,
    },
    {
      // Distal (derecha)
      cara: "distal",
      puntos: `${ix2},${iy1} ${x2},${y1} ${x2},${y2} ${ix2},${iy2}`,
    },
    {
      // Oclusal (centro)
      cara: "oclusal",
      puntos: `${ix1},${iy1} ${ix2},${iy1} ${ix2},${iy2} ${ix1},${iy2}`,
    },
  ];

  return (
    <div className="relative group flex flex-col items-center gap-1">
      {/* Número del diente */}
      <span
        className={`text-[10px] font-bold leading-none tracking-tight ${
          esAusente ? "text-gray-400 line-through" : "text-clinica-primario"
        }`}
      >
        {numeroDiente}
      </span>

      {/* SVG del diente */}
      <svg
        width={ancho}
        height={alto}
        viewBox={`0 0 ${ancho} ${alto}`}
        className={`drop-shadow-sm transition-transform duration-150 ${
          esAusente ? "opacity-40" : "hover:scale-110"
        }`}
      >
        {/* Fondo redondeado */}
        <rect
          x={x1}
          y={y1}
          width={x2 - x1}
          height={y2 - y1}
          rx={4}
          ry={4}
          fill="#f1f5f9"
          stroke="#cbd5e1"
          strokeWidth={0.5}
        />

        {carasPoligono.map(({ cara, puntos }) => (
          <polygon
            key={cara}
            points={puntos}
            fill={obtenerColorCara(cara)}
            className={`cara-diente ${estadoCaras[cara] ? "activa" : ""}`}
            onClick={() => manejarClicCara(cara)}
            onMouseEnter={() => setCaraHover(cara)}
            onMouseLeave={() => setCaraHover(null)}
          />
        ))}

        {/* Marca de ausente */}
        {esAusente && (
          <>
            <line
              x1={x1 + 6}
              y1={y1 + 6}
              x2={x2 - 6}
              y2={y2 - 6}
              stroke="#ef4444"
              strokeWidth={2}
              strokeLinecap="round"
            />
            <line
              x1={x2 - 6}
              y1={y1 + 6}
              x2={x1 + 6}
              y2={y2 - 6}
              stroke="#ef4444"
              strokeWidth={2}
              strokeLinecap="round"
            />
          </>
        )}
      </svg>

      {/* Tooltip */}
      {caraHover && !esAusente && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 tooltip-diente opacity-100">
          {ETIQUETAS_CARAS[caraHover]}
        </div>
      )}
    </div>
  );
};

export default DienteSvg;
