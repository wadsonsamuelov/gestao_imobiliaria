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
  const diasAtraso =
    boleto.status === "atrasado" ? Math.floor((Date.now() - new Date(boleto.due_date).getTime()) / 86400000) : 0;

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
        {boleto.status === "pago" && <span className="tag ok">Pago</span>}
        {boleto.status === "atrasado" && <span className="tag alert">Atrasado · {diasAtraso}d</span>}
        {boleto.status === "a_vencer" && <span className="tag neutral">A vencer</span>}
      </td>
      <td className="muted" style={{ display: "flex", gap: 10, alignItems: "center" }}>
        {boleto.status !== "pago" && (
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
