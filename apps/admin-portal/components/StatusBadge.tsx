const STATUS_STYLES: Record<string, string> = {
  active: "bg-emerald-500/15 text-emerald-400",
  inactive: "bg-rose-500/15 text-rose-400",
  confirmed: "bg-emerald-500/15 text-emerald-400",
  delivered: "bg-emerald-500/15 text-emerald-400",
  trial: "bg-amber-500/15 text-amber-400",
  pending: "bg-amber-500/15 text-amber-400",
  suspended: "bg-rose-500/15 text-rose-400",
  cancelled: "bg-rose-500/15 text-rose-400",
  cash: "bg-emerald-500/15 text-emerald-400",
  card: "bg-sky-500/15 text-sky-400",
  mpesa: "bg-amber-500/15 text-amber-400",
  mpesastk: "bg-amber-500/15 text-amber-400",
  bankdeposit: "bg-sky-500/15 text-sky-400",
  paybill: "bg-amber-500/15 text-amber-400",
  till: "bg-amber-500/15 text-amber-400",
  verified: "bg-emerald-500/15 text-emerald-400",
  unverified: "bg-amber-500/15 text-amber-400",
  enabled: "bg-emerald-500/15 text-emerald-400",
  disabled: "bg-muted/15 text-muted",
};

const DEFAULT_STYLE = "bg-muted/15 text-muted";

export function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status.toLowerCase()] ?? DEFAULT_STYLE;

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize ${style}`}
    >
      {status}
    </span>
  );
}
