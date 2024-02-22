import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: "#115e59",
        primaryFocusLight: "#134e4a",
        primaryFocusDark: "#0f766e",
        secondary: "#85FFC7",
        neutralLight: "#f5f5f5",
        neutralDark: "#0F172A",
        layoutLight: "#e2e8f0",
        layoutDark: "#020617",
        contrastLight: "#cbd5e1",
        contrastDark: "#1e293b",
      },
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/container-queries"),
    // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-call
    require("tailwind-scrollbar")({
      preferredStrategy: "pseudoelements",
      nocompatible: true,
    }),
  ],
};

export default config;
