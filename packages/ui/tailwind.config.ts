import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      colors: {
        // Core Brand
        background: "#0F0E2A",
        surface: "#16153D",
        primary: "#7C6EFF",
        primaryHover: "#5B4FD6",
        primaryLight: "#E2E0FF",

        // Accents
        accent: "#C8D400", // C8D400EF
        accentMuted: "#BCC803",
        ecommerce: "#FF8C69",
        travel: "#60A5FA",
        reservations: "#00D4AA",

        // Text & UI
        text: "#FFFFFF",
        muted: "#9896B8",
        inputBg: "#252525",
        highlight: "#7C6EFF26",
      },
    },
  },
  plugins: [],
};

export default config;
