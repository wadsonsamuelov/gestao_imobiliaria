"use client";

import { useTransition } from "react";
import { toggleEarning, deleteEarning } from "./actions";
import { IconTrash } from "@/components/icons-extra";

export function EarningRow({ earning }: { earning: any }) {
  const [isPending, startTransition] = useTransition();
  const [isDeleting, startDelete] = useTransition();
  const fmt = (n: number) => Number(n).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    if (confirm(`Excluir o lançamento "${earning.description}"? Essa ação não pode ser desfeita.`)) {
      startDelete(() => deleteEarning(earning.id));
    }
  }

  return (
    <tr
      className="row-hover"
      style={{ opacity: isPending || isDeleting ? 0.5 : 1 }}
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
      <td>
        <button
          onClick={handleDelete}
          title="Excluir lançamento"
          aria-label="Excluir lançamento"
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "var(--ink-soft)",
            padding: 4,
            display: "flex",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--terracotta)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--ink-soft)")}
        >
          <IconTrash />
        </button>
      </td>
    </tr>
  );
}
