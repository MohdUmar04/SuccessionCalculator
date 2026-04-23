/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        sans: ["'Inter'", "system-ui", "sans-serif"],
      },
      colors: {
        ink: {
          50: "#f5f5f7",
          100: "#e5e6eb",
          200: "#c9cad2",
          300: "#9da0ae",
          400: "#6d7184",
          500: "#474c61",
          600: "#2f3345",
          700: "#1f2233",
          800: "#141726",
          900: "#0a0c17",
        },
        accent: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
        },
      },
      boxShadow: {
        soft: "0 10px 30px -10px rgba(15, 23, 42, 0.15)",
        glow: "0 0 0 1px rgba(249, 115, 22, 0.25), 0 12px 40px -12px rgba(249, 115, 22, 0.35)",
      },
    },
  },
  plugins: [],
};
