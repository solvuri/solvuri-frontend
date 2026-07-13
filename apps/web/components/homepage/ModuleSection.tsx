import { ModuleCard } from "../shared/ModuleCard";

export const ModulesSection = () => {
  const modules = [
    {
      title: "CLEARRACK",
      category: "Ecommerce",
      description: "White-label e-commerce storefront...",
      features: ["Storefront + headless API", "Inventory, orders & fulfilment"],
      buttonColor: "bg-[#FF8C69]",
      categoryTextColor: "text-[#FF8C69]",
      categoryBgColor: "bg-[#332443]",
      image: "/images/clearrack.png",
      href: "https://clearrack.xyz",
    },
    {
      title: "SAFYRI",
      category: "Travel Booking",
      description: "White-label ecommerce...",
      features: ["Storefront + headless API", "Inventory, orders & fulfilment"],
      buttonColor: "bg-[#60A5FA]",
      categoryTextColor: "text-[#60A5FA]",
      categoryBgColor: "bg-[#1F2755]",
      image: "/images/safyri.png",
      href: "/modules",
    },
    {
      title: "RESERVR",
      category: "Ecommerce",
      description: "White-label e-commerce...",
      features: ["Storefront + headless API", "Inventory, orders & fulfilment"],
      buttonColor: "bg-[#00D4AA]",
      categoryTextColor: "text-[#00D4AA]",
      categoryBgColor: "bg-[#132D4B]",
      image: "/images/reservr.png",
      href: "/modules",
    },
    {
      title: "MASTER",
      category: "Travel Booking",
      description: "White-label ecommerce...",
      features: ["Storefront + headless API", "Inventory, orders & fulfilment"],
      buttonColor: "bg-[#C8D400]",
      categoryTextColor: "text-[#C8D400]",
      categoryBgColor: "bg-[#252525]",
      image: "/images/master.png",
      href: "/modules",
    },
  ];

  return (
    <section className="bg-[#0F0E2A] py-16 md:py-24 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 md:mb-16">
          {/* Label */}
          <div className="flex items-center justify-center md:justify-start gap-3 mb-6 md:mb-8 text-[#C8D400] font-medium text-xs tracking-widest uppercase">
            <span>02</span>
            <div className="h-px w-8 bg-[#C8D400]"></div>
            <span className="text-[#9896B8]">The Modules</span>
          </div>

          {/* Heading and Description: Switch from flex to grid on mobile */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-12">
            <h2 className="font-bebas text-[48px] md:text-[72px] text-[#E2E0FF] leading-[0.9] text-center md:text-left w-full md:w-auto">
              FOUR PRODUCTS.{" "}
              <span className="text-[#C8D400] block md:inline">
                ONE PLATFORM.
              </span>
            </h2>
            <p className="text-[#9896B8] max-w-sm text-center md:text-right leading-relaxed text-sm md:text-base mx-auto md:mx-0">
              Each module ships as a complete, white-label product ready to sell
              under your name. Deploy one or run them all.
            </p>
          </div>
        </div>

        {/* Module Grid: Remains grid md:grid-cols-2 */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {modules.map((m) => (
            <ModuleCard key={m.title} {...m} />
          ))}
        </div>
      </div>
    </section>
  );
};
