// apps/web/postcss.config.mjs
export default {
  plugins: {
    "@tailwindcss/postcss": {
      config: "../../packages/ui/tailwind.config.ts",
    },
  },
};
