import axios from "axios";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Shared Axios Instance
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export * from "./constants"; // This tells the monorepo to expose everything in constants.ts

// Shared Tailwind Helper
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
