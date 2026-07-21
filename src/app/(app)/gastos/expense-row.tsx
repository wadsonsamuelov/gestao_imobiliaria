"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Tag } from "@/components/ui/tag-stat";
import { IconTrash } from "@/components/icons-extra";
import { deleteExpense } from "./actions";

const CATEGORY_LABEL: Record<string, string> = {
  manutencao: "Manutenção", reforma: "Reforma", hidraulica: "Hidráulica",
  eletrica: "Elétrica", vidracaria: "Vidraçaria", outros: "Outros",
};
const PAID_BY_LABEL: Record<string, string> = { proprietario: "Proprietário", inquilino: "Inquilino", administradora: "Administradora" };
const fmt = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export function ExpenseRow({ e }: { e: any }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleDelete(ev: React.MouseEvent) {
    ev.stopPropagation();
    if (confirm(`Excluir o gasto "${e.description}"?`)) {
      startTransition(async () => {
        await deleteExpense(e.id);
        router.refresh();
      });
    }
  }

  return (
    <tr className="row-hover" style={{ opacity: isPending ? 0.5 : 1 }}>
      <td className="mono">{e.properties?.code}</td>
      <td style={{ fontWeight: 600 }}>
        <Link href={`/gastos/${e.id}`} style={{ color: "inherit", textDecoration: "none" }}>{e.description}</Link>
      </td>
      <td><Tag>{CATEGORY_LABEL[e.category] ?? e.category}</Tag></td>
      <td className="mono">{fmt(Number(e.value))}</td>
      <td>{new Date(e.expense_date).toLocaleDateString("pt-BR")}</td>
      <td>{PAID_BY_LABEL[e.paid_by] ?? e.paid_by}</td>
      <td>
        <button onClick={handleDelete} title="Excluir" style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--ink-soft)", padding: 4, display: "flex" }}>
          <IconTrash />
        </button>
      </td>
    </tr>
  );
}
