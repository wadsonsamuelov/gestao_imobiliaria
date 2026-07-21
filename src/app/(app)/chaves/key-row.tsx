"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Tag } from "@/components/ui/tag-stat";
import { IconTrash } from "@/components/icons-extra";
import { deleteKeyMovement } from "./actions";

export function KeyRow({ r }: { r: any }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleDelete() {
    if (confirm("Excluir este registro de movimentação de chave?")) {
      startTransition(async () => {
        await deleteKeyMovement(r.id);
        router.refresh();
      });
    }
  }

  return (
    <tr className="row-hover" style={{ opacity: isPending ? 0.5 : 1 }}>
      <td className="mono">{r.properties?.code}</td>
      <td>{r.event_type === "entrega" ? "Entrega ao inquilino" : "Devolução"}</td>
      <td style={{ fontWeight: 600 }}>{r.person_name}</td>
      <td>{new Date(r.movement_date).toLocaleDateString("pt-BR")}</td>
      <td>{r.status === "entregue" ? <Tag variant="ok">Entregue</Tag> : <Tag>Devolvida</Tag>}</td>
      <td>
        <button onClick={handleDelete} title="Excluir" style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--ink-soft)", padding: 4, display: "flex" }}>
          <IconTrash />
        </button>
      </td>
    </tr>
  );
}
