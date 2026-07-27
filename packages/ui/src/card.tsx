// packages/ui/src/card.tsx
import type { ReactNode } from "react";

export interface CardProps {
  title: string;
  value: string;
  icon?: ReactNode;
}

export const Card = ({ title, value, icon }: CardProps) => {
  return (
    <div className="bg-surface p-8 rounded-2xl border border-primary/10">
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs uppercase tracking-widest text-muted block">
          {title}
        </span>
        {icon && <span className="text-primary">{icon}</span>}
      </div>
      <p className="text-2xl font-bold text-text">{value}</p>
    </div>
  );
};
