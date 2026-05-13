import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ficha Odontograma | Sistema Clínica Dental",
  description:
    "Sistema interactivo de odontograma para registro de hallazgos dentales, tratamientos y seguimiento clínico del paciente.",
};

export default function LayoutRaiz({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-[#f0f2f5]">{children}</body>
    </html>
  );
}
