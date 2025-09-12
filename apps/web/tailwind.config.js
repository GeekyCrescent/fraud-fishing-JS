/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    colors: {
      primary: "#00B5BC", // Turquesa
      dark: "#00204D",    // Azul oscuro
      white: "#ffffff",   // Necesario porque al definir `colors` se borran los default
      black: "#000000",
    },
  },
  plugins: [],
};
