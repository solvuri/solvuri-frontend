import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export * from "./constants"; // This tells the monorepo to expose everything in constants.ts

// Shared Tailwind Helper
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
