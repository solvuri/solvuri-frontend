// packages/ui/src/card.tsx
export interface CardProps {
  title: string;
  value: string;
}

export const Card = ({ title, value }: CardProps) => {
  return (
    <div className="bg-surface p-8 rounded-2xl border border-primary/10">
      <span className="text-xs uppercase tracking-widest text-muted mb-2 block">
        {title}
      </span>
      <p className="text-2xl font-bold text-text">{value}</p>
    </div>
  );
};
