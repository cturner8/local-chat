import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Lato", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: "#297373",
        secondary: "#85FFC7",
        neutral: "#0F172A",
        layout: "#020617",
        contrast: "#1e293b",
      },
    },
  },
  plugins: [],
};

export default config;
