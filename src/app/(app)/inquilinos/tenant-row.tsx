"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { deleteTenant } from "./actions";
import { IconTrash } from "@/components/icons-extra";

export function TenantRow({ tenant, propertyCode }: { tenant: any; propertyCode: string | null }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    if (confirm(`Excluir "${tenant.name}"? Isso só é possível se não houver contrato vinculado a este inquilino.`)) {
      startTransition(async () => {
        await deleteTenant(tenant.id);
        router.refresh();
      });
    }
  }

  return (
    <tr className="row-hover" style={{ opacity: isPending ? 0.5 : 1 }}>
      <td style={{ fontWeight: 600 }}>
        <Link href={`/inquilinos/${tenant.id}`} style={{ color: "inherit", textDecoration: "none" }}>{tenant.name}</Link>
      </td>
      <td className="mono muted">{tenant.document ?? "—"}</td>
      <td>{tenant.phone ?? "—"}</td>
      <td className="mono">{propertyCode ?? "—"}</td>
      <td className="mono">{tenant.income ? Number(tenant.income).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : "—"}</td>
      <td>
        <button onClick={handleDelete} title="Excluir" style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--ink-soft)", padding: 4, display: "flex" }}>
          <IconTrash />
        </button>
      </td>
    </tr>
  );
}
