// O cartão com o "prego decorativo" no topo — usado em quase toda página.
// Trocar esse componente muda a aparência de TODOS os cartões do sistema de uma vez.
export function PlanCard({
  children,
  noPadding = false,
  style,
}: {
  children: React.ReactNode;
  noPadding?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <div className="plan-card" style={{ ...(noPadding ? { padding: 0 } : {}), ...style }}>
      <span className="card-crest" />
      {children}
    </div>
  );
}
