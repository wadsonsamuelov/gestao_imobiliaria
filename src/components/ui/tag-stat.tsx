export function Tag({
  children,
  variant = "neutral",
}: {
  children: React.ReactNode;
  variant?: "ok" | "alert" | "neutral" | "brass";
}) {
  return <span className={`tag ${variant}`}>{children}</span>;
}

export function StatCard({
  label,
  value,
  delta,
  warn = false,
}: {
  label: string;
  value: string | number;
  delta?: string;
  warn?: boolean;
}) {
  return (
    <div className="plan-card stat">
      <span className="card-crest" />
      <div className="label">{label}</div>
      <div className="value">{value}</div>
      {delta && <div className={`delta${warn ? " warn" : ""}`}>{delta}</div>}
    </div>
  );
}
