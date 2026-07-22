"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { markBoletoPaid, deleteBoleto } from "./actions";
import { IconTrash } from "@/components/icons-extra";

export function BoletoRow({ boleto }: { boleto: any }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const fmt = (n: number) => Number(n).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  // O campo "status" salvo no banco não se atualiza sozinho com o passar do tempo —
  // por isso calculamos aqui, comparando a data de vencimento com hoje, se o boleto
  // está realmente atrasado, em vez de confiar cegamente no valor gravado.
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const dueDate = new Date(boleto.due_date + "T00:00:00");
  const diasAtraso = Math.floor((today.getTime() - dueDate.getTime()) / 86400000);
  const effectiveStatus = boleto.status === "pago" ? "pago" : diasAtraso > 0 ? "atrasado" : "a_vencer";

  function handleDelete() {
    if (confirm("Excluir este boleto?")) {
      startTransition(async () => {
        await deleteBoleto(boleto.id);
        router.refresh();
      });
    }
  }

  return (
    <tr className="row-hover" style={{ opacity: isPending ? 0.5 : 1 }}>
      <td style={{ fontWeight: 600 }}>
        <Link href={`/financeiro/${boleto.id}`} style={{ color: "inherit", textDecoration: "none" }}>
          {boleto.contracts?.tenants?.name ?? "—"}
        </Link>
      </td>
      <td className="mono">{boleto.contracts?.properties?.code ?? "—"}</td>
      <td className="mono">{fmt(boleto.value)}</td>
      <td>{new Date(boleto.due_date).toLocaleDateString("pt-BR")}</td>
      <td>
        {effectiveStatus === "pago" && <span className="tag ok">Pago</span>}
        {effectiveStatus === "atrasado" && <span className="tag alert">Atrasado · {diasAtraso}d</span>}
        {effectiveStatus === "a_vencer" && <span className="tag neutral">A vencer</span>}
      </td>
      <td className="muted" style={{ display: "flex", gap: 10, alignItems: "center" }}>
        {effectiveStatus !== "pago" && (
          <button className="btn secondary" style={{ padding: "5px 10px", fontSize: 10 }} onClick={() => startTransition(() => markBoletoPaid(boleto.id))}>
            Marcar como pago
          </button>
        )}
        <button onClick={handleDelete} title="Excluir" style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--ink-soft)", padding: 4, display: "flex" }}>
          <IconTrash />
        </button>
      </td>
    </tr>
  );
}
