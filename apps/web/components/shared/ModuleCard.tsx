import Image from "next/image";
import { Button } from "@repo/ui";
import Link from "next/link";

interface ModuleCardProps {
  title: string;
  category: string;
  description: string;
  features: string[];
  buttonColor: string;
  categoryTextColor: string;
  categoryBgColor: string;
  image: string;
  href: string;
}

export const ModuleCard = ({ href, ...props }: ModuleCardProps) => (
  <div className="bg-[#16153D] rounded-2xl flex flex-col md:flex-row overflow-hidden border border-[#7C6EFF]/10 transition-all hover:border-[#7C6EFF]/30">
    {/* Image container: Full width on mobile, 35% on desktop */}
    <div className="w-full md:w-[35%] bg-[#1E1D4A] p-6 flex items-center justify-center">
      <Image
        src={props.image}
        alt={props.title}
        width={210}
        height={420}
        className="w-full max-w-37.5 md:max-w-full h-auto object-contain"
      />
    </div>

    {/* Content container */}
    <div className="flex-1 flex flex-col p-6 md:p-8">
      <div className="mb-3">
        <span
          className={`text-[10px] uppercase tracking-[0.2em] font-bold px-3 py-1 rounded-full inline-block ${props.categoryTextColor} ${props.categoryBgColor}`}
        >
          {props.category}
        </span>
      </div>
      <h3 className="font-bebas text-3xl md:text-4xl text-white mb-3">
        {props.title}
      </h3>
      <p className="text-[#9896B8] text-sm leading-relaxed mb-4">
        {props.description}
      </p>

      <ul className="text-[#9896B8] text-xs space-y-2 mb-6">
        {props.features.map((f, i) => (
          <li key={i} className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-[#7C6EFF] shrink-0" />
            {f}
          </li>
        ))}
      </ul>

      <div className="mt-auto">
        <Link href={href} target="_blank" rel="noopener noreferrer">
          {" "}
          <Button
            variant="accent"
            className={`text-[#0F0E2A] cursor-pointer ${props.buttonColor} w-full py-2.5 rounded-full font-bold transition-transform hover:scale-[1.02]`}
          >
            Explore {props.title}
          </Button>
        </Link>
      </div>
    </div>
  </div>
);
