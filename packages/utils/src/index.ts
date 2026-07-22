import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Shared Tailwind Helper
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
