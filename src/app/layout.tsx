import type { Metadata } from "next";
import "./globals.css";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Providers } from "./providers";
import { HeaderWrapper } from "@/componentes/HeaderWrapper";

export const metadata: Metadata = {
  title: "Consul Dent | Gestión Dental Inteligente",
  description:
    "Sistema integral para la gestión de clínicas dentales, agenda, odontograma y pacientes.",
};

export default async function LayoutRaiz({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="es">
      <body className="min-h-screen bg-white">
        <Providers session={session}>
          <HeaderWrapper session={session} />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
