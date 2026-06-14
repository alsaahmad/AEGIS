import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./hooks/**/*.{js,ts,jsx,tsx}", "./lib/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        lifeline: {
          red: "#E63946",
          green: "#22C55E",
          slate: {
            50: "#F8F9FB",
            100: "#F2F4F7",
            200: "#E2E8F0",
            300: "#CBD5E1",
            500: "#6B7280",
            700: "#334155",
            950: "#0F172A",
          },
        },
      },
      boxShadow: {
        soft: "0 24px 80px rgba(15, 23, 42, 0.08)",
      },
    },
  },
  plugins: [],
};
export default config;
