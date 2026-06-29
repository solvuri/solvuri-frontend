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
    },
  ];

  return (
    <section className="bg-[#0F0E2A] py-24 px-10">
      <div className="max-w-300 mx-auto">
        <div className="mb-16">
          {/* The "02 — THE MODULES" Label */}
          <div className="flex items-center gap-3 mb-8 text-[#C8D400] font-medium text-xs tracking-widest uppercase">
            <span>02</span>
            <div className="h-px w-8 bg-[#C8D400]"></div>
            <span className="text-[#9896B8]">The Modules</span>
          </div>

          {/* The Main Heading and Description Grid */}
          <div className="flex justify-between items-end">
            <h2 className="font-bebas text-[72px] text-[#E2E0FF] leading-none">
              FOUR PRODUCTS.
              <br />
              <span className="text-[#C8D400]">ONE PLATFORM.</span>
            </h2>
            <p className="text-[#9896B8] max-w-sm text-right leading-relaxed">
              Each module ships as a complete, white-label product ready to sell
              under your name. Deploy one or run them all.
            </p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {modules.map((m) => (
            <ModuleCard key={m.title} {...m} />
          ))}
        </div>
      </div>
    </section>
  );
};
