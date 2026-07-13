// packages/types/src/modules.ts
export interface ModuleInfo {
  title: string;
  description: string;
  longDescription: string;
  image: string;
  faqs: { q: string; a: string }[];
}
