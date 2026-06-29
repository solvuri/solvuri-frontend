// apps/web/components/TrustedBy.tsx

export const TrustedBy = () => {
  const partners = [
    "Respinar Group",
    "Lorem Ipsum",
    "Lorem Ipsum",
    "Company Name",
    "Tech Partner",
  ];

  return (
    <div className="bg-[#16153D] border border-[#7C6EFF26] py-4 px-20 flex flex-col md:flex-row items-center gap-12 overflow-hidden">
      {/* Label - Fixed on the left */}
      <div className="text-[#5C5A8A] text-[10px] uppercase tracking-widest font-semibold whitespace-nowrap">
        Trusted By
      </div>

      {/* Static Container */}
      <div className="flex-1 w-full">
        <div className="flex items-center justify-between text-[#9896B8] font-medium text-xs">
          {partners.map((partner, index) => (
            <span key={index} className="inline-block">
              {partner}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
