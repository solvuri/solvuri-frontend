// apps/web/components/Footer.tsx
export const Footer = () => {
  const footerLinks = [
    {
      title: "MODULES",
      links: ["ClearRack", "Safyri", "Bookr", "Flyr"],
    },
    {
      title: "COMPANY",
      links: ["About", "Careers", "Blog", "Press"],
    },
    {
      title: "LEGAL",
      links: ["Privacy", "Terms", "Security", "Cookies"],
    },
    {
      title: "CONTACT",
      links: ["Sales", "Support", "Partnerships", "hello@solvuri.com"],
    },
  ];

  return (
    <footer className="bg-[#0F0E2A] px-10 pt-24 pb-12 border-t border-[#1D1C45]">
      <div className="max-w-300 mx-auto">
        <div className="grid md:grid-cols-5 gap-12 mb-24">
          {/* Brand Column */}
          <div className="col-span-1">
            <h2 className="text-[#C8D400] font-bold text-xl mb-6">SOLVURI</h2>
            <p className="text-[#5C5A8A] text-sm leading-relaxed max-w-50">
              Modular white-label software for businesses who build under their
              own brand.
            </p>
          </div>

          {/* Links Grid */}
          <div className="col-span-4 grid grid-cols-2 md:grid-cols-4 gap-8">
            {footerLinks.map((section) => (
              <div key={section.title}>
                <h3 className="text-[#E2E0FF] font-bold text-xs tracking-widest mb-6">
                  {section.title}
                </h3>
                <ul className="space-y-4">
                  {section.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-[#9896B8] text-sm hover:text-white transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex justify-between items-center pt-8 border-t border-[#1D1C45]">
          <p className="text-[#9896B8] text-xs">
            © {new Date().getFullYear()} Solvuri Ltd. All rights reserved.
          </p>
          <p className="text-[#9896B8] text-xs">Built for builders.</p>
        </div>
      </div>
    </footer>
  );
};
