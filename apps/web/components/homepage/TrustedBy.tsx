export const TrustedBy = () => {
  const partners = [
    "Respinar Group",
    "Lorem Ipsum",
    "Lorem Ipsum",
    "Company Name",
    "Tech Partner",
  ];

  return (
    <div className="bg-[#16153D] border-y border-[#7C6EFF]/15 py-6 px-6 md:px-20 flex flex-col md:flex-row items-center gap-6 md:gap-12">
      {/* Label - Properly centered on mobile, left-aligned on desktop */}
      <div className="text-[#5C5A8A] text-[10px] uppercase tracking-widest font-semibold whitespace-nowrap">
        Trusted By
      </div>

      {/* Grid for partners: 2 cols on mobile, 5 cols on desktop */}
      <div className="flex-1 w-full grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-8 items-center text-center md:text-left">
        {partners.map((partner, index) => (
          <span
            key={index}
            className="text-[#9896B8] font-medium text-[11px] md:text-xs uppercase tracking-tight"
          >
            {partner}
          </span>
        ))}
      </div>
    </div>
  );
};
