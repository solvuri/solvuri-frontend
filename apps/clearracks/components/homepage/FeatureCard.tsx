import { LucideIcon } from "@repo/ui"; // Now import the type directly

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export default function FeatureCard({
  icon: Icon,
  title,
  description,
}: FeatureCardProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 text-brand-primary">
        <Icon className="h-4 w-4" />
        <h4 className="text-xs font-black uppercase tracking-wider text-stone-900">
          {title}
        </h4>
      </div>
      <p className="text-[12px] text-brand-muted font-medium leading-normal">
        {description}
      </p>
    </div>
  );
}
