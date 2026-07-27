// packages/types/src/modules.ts
export interface ModuleInfo {
  title: string;
  slug: string;
  category: string;
  description: string;
  longDescription: string;
  features: string[];
  accentColor: string;
  image: string;
  href: string;
  faqs: { q: string; a: string }[];
}
