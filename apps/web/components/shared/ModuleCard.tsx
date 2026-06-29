import { Button } from "@repo/ui";

interface ModuleCardProps {
  title: string;
  category: string;
  description: string;
  features: string[];
  buttonColor: string;
  categoryTextColor: string;
  categoryBgColor: string;
  image: string;
}

export const ModuleCard = ({ ...props }: ModuleCardProps) => (
  <div className="bg-[#16153D] rounded-2xl flex gap-8  overflow-hidden">
    <div className="w-[27%] shrink-0 flex items-start">
      <img
        src={props.image}
        alt={props.title}
        className="w-full h-auto object-contain"
      />
    </div>

    <div className="flex-1 flex flex-col p-8">
      <div className="mb-3">
        <span
          className={`text-[10px] uppercase tracking-[0.2em] font-bold px-2 py-0.5 rounded-full inline-block ${props.categoryTextColor} ${props.categoryBgColor}`}
        >
          {props.category}
        </span>
      </div>
      <h3 className="font-bebas text-4xl text-white mb-3">{props.title}</h3>
      <p className="text-[#9896B8] text-sm leading-relaxed mb-3">
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
        <Button
          variant="accent"
          className={`text-black cursor-pointer ${props.buttonColor} w-full py-1 rounded-full font-bold transition-transform hover:scale-[1.02]`}
        >
          Explore {props.title}
        </Button>
      </div>
    </div>
  </div>
);
