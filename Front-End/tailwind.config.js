/** @type {import('tailwindcss').Config} */
// tailwind.config.js
module.exports = {
  darkMode: "class", // ou 'media'
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        heartbeat: "heartbeat 1.5s ease-in-out infinite",
      },
      keyframes: {
        heartbeat: {
          "0%": { transform: "scale(1)", transformOrigin: "center" },
          "10%": { transform: "scale(0.91)" },
          "17%": { transform: "scale(0.98)" },
          "33%": { transform: "scale(0.87)" },
          "45%": { transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};
