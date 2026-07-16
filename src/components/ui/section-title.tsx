function toRoman(n: number): string {
  const map: [number, string][] = [
    [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"],
    [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
  ];
  let r = "";
  for (const [v, s] of map) while (n >= v) { r += s; n -= v; }
  return r || "—";
}

export function SectionTitle({ children, count }: { children: React.ReactNode; count?: number }) {
  return (
    <div className="section-title">
      <div className="frieze-mini frieze" />
      <h2>{children}</h2>
      <div className="rule" />
      {count !== undefined && <div className="count">Nº {toRoman(count)}</div>}
    </div>
  );
}
