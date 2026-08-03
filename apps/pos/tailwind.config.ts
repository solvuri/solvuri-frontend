import sharedConfig from "../../packages/ui/tailwind.config";
import type { Config } from "tailwindcss";

const config: Pick<Config, "presets" | "content"> = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
  ],
  presets: [sharedConfig],
};

export default config;
