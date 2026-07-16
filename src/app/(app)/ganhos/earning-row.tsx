"use client";

import { useTransition } from "react";
import { toggleEarning } from "./actions";

export function EarningRow({ earning }: { earning: any }) {
  const [isPending, startTransition] = useTransition();
  const fmt = (n: number) => Number(n).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <tr
      className="row-hover"
      style={{ opacity: isPending ? 0.5 : 1 }}
      onClick={() => startTransition(() => toggleEarning(earning.id, earning.status))}
    >
      <td>
        <div
          style={{
            width: 16,
            height: 16,
            borderRadius: 3,
            border: "1.3px solid var(--bronze)",
            position: "relative",
            ...(earning.status === "recebido" ? { background: "#5F7A66", borderColor: "#5F7A66" } : {}),
          }}
        >
          {earning.status === "recebido" && (
            <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 11 }}>
              ✓
            </span>
          )}
        </div>
      </td>
      <td style={{ fontWeight: 600 }}>{earning.description}</td>
      <td>{new Date(earning.event_date).toLocaleDateString("pt-BR")}</td>
      <td className="mono">{fmt(earning.value)}</td>
      <td>
        {earning.status === "recebido" ? <span className="tag ok">Recebido</span> : <span className="tag neutral">Pendente</span>}
      </td>
    </tr>
  );
}
