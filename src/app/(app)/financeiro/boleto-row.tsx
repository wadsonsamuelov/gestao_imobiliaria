"use client";

import { useTransition } from "react";
import { markBoletoPaid } from "./actions";

export function BoletoRow({ boleto }: { boleto: any }) {
  const [isPending, startTransition] = useTransition();
  const fmt = (n: number) => Number(n).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const diasAtraso =
    boleto.status === "atrasado" ? Math.floor((Date.now() - new Date(boleto.due_date).getTime()) / 86400000) : 0;

  return (
    <tr className="row-hover" style={{ opacity: isPending ? 0.5 : 1 }}>
      <td style={{ fontWeight: 600 }}>{boleto.contracts?.tenants?.name ?? "—"}</td>
      <td className="mono">{boleto.contracts?.properties?.code ?? "—"}</td>
      <td className="mono">{fmt(boleto.value)}</td>
      <td>{new Date(boleto.due_date).toLocaleDateString("pt-BR")}</td>
      <td>
        {boleto.status === "pago" && <span className="tag ok">Pago</span>}
        {boleto.status === "atrasado" && <span className="tag alert">Atrasado · {diasAtraso}d</span>}
        {boleto.status === "a_vencer" && <span className="tag neutral">A vencer</span>}
      </td>
      <td className="muted">
        {boleto.status !== "pago" && (
          <button className="btn secondary" style={{ padding: "5px 10px", fontSize: 10 }} onClick={() => startTransition(() => markBoletoPaid(boleto.id))}>
            Marcar como pago
          </button>
        )}
      </td>
    </tr>
  );
}
