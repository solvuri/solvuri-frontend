import { Footer as SharedFooter } from "@repo/ui";

const columns = [
  { title: "MODULES", links: ["ClearRack", "Safyri", "Bookr", "Flyr"] },
  { title: "COMPANY", links: ["About", "Careers", "Blog", "Press"] },
  { title: "LEGAL", links: ["Privacy", "Terms", "Security", "Cookies"] },
  {
    title: "CONTACT",
    links: ["Sales", "Support", "Partnerships", "hello@solvuri.com"],
  },
].map((section) => ({
  title: section.title,
  links: section.links.map((label) => ({ label, href: "#" })),
}));

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
