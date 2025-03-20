import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{html,js,svelte,ts}"],
  safelist: [
    "dark",
    {
      pattern: /^text-http-.*/, 
    },
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        primary: "#c53076",
        delete: "#e53e3e",
        backgroundMain: "#f9f9f9",
      },
    
    },
  },
};

export default config;
