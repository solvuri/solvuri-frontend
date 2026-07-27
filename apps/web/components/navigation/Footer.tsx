import { Footer as SharedFooter } from "@repo/ui";
import { MODULES_DATA } from "../../utils/modulesData";

const columns = [
  {
    title: "MODULES",
    links: MODULES_DATA.map((m) => ({
      label: m.title,
      href: m.href,
    })),
  },
  {
    title: "COMPANY",
    links: [
      { label: "About", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Blog", href: "/blog" },
      { label: "Press", href: "/press" },
    ],
  },
  {
    title: "LEGAL",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Security", href: "/security" },
      { label: "Cookies", href: "/cookies" },
    ],
  },
  {
    title: "CONTACT",
    links: [
      { label: "Sales", href: "mailto:sales@solvuri.com" },
      { label: "Support", href: "mailto:support@solvuri.com" },
      { label: "Partnerships", href: "mailto:partnerships@solvuri.com" },
      { label: "hello@solvuri.com", href: "mailto:hello@solvuri.com" },
    ],
  },
];

export const Footer = () => (
  <SharedFooter
    variant="floating"
    brand={{
      name: "SOLVURI",
      description:
        "Modular white-label software for businesses who build under their own brand.",
    }}
    columns={columns}
  />
);
