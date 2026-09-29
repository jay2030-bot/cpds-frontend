/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#edf7f0",
          100: "#d8ecdf",
          500: "#228653",
          600: "#176c42",
          700: "#125536",
          900: "#123b2d",
        },
        citrus: { 100: "#fff3c4", 400: "#f0c64a", 700: "#8b6811" },
      },
    },
  },
  plugins: [],
};
