import sharedConfig from "../../packages/ui/tailwind.config";
import type { Config } from "tailwindcss";

const config: Pick<Config, "prefix" | "presets"> = {
  prefix: "", // Optional: only add if you need a class prefix
  presets: [sharedConfig],
};

export default config;
