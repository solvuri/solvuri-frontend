// Re-export your existing UI components
export * from "./button";
export * from "./card";
export * from "./input";
export * from "./sidebar";

// Re-export icon libraries
export * as Lucide from "lucide-react";
export * as ReactIcons from "react-icons";

// Explicitly export sub-modules for cleaner imports in apps
export * as FaIcons from "react-icons/fa";
export * as FiIcons from "react-icons/fi";

// Use 'export type' to comply with isolatedModules
import type { LucideIcon } from "lucide-react";
export type { LucideIcon };
