import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/componentes/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        clinica: {
          primario: "#0056b3",
          primarioOscuro: "#003d82",
          primarioClaro: "#e8f0fe",
          fondo: "#f8f9fa",
          borde: "#dee2e6",
          texto: "#212529",
          textoSecundario: "#6c757d",
          caries: "#dc3545",
          obturacion: "#0d6efd",
          ausente: "#6c757d",
          sellante: "#198754",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
