// packages/ui/src/card.tsx
export const Card = ({ title, description, badge, buttonColor }: any) => {
  return (
    <div className="bg-surface p-8 rounded-2xl border border-primary/10">
      <span className="text-xs uppercase tracking-widest text-primary mb-2 block">
        {badge}
      </span>
      <h3 className="text-2xl font-bold text-text mb-4">{title}</h3>
      <p className="text-muted mb-6">{description}</p>

      {/* Small form placeholder */}
      <div className="space-y-3 mb-6">
        <input
          className="w-full bg-inputBg p-3 rounded text-sm text-white"
          placeholder="Your name"
        />
        <input
          className="w-full bg-inputBg p-3 rounded text-sm text-white"
          placeholder="Work email"
        />
      </div>

      <button
        className={`w-full py-3 rounded text-sm font-semibold ${buttonColor}`}
      >
        Get {title}
      </button>
    </div>
  );
};
