"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { IconTrash } from "@/components/icons-extra";
import { deleteOwner } from "./actions";

export function OwnerRow({ owner, propertyCodes }: { owner: any; propertyCodes: string[] }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    if (confirm(`Excluir "${owner.name}"? Isso só é possível se não houver imóvel vinculado a ele.`)) {
      startTransition(async () => {
        await deleteOwner(owner.id);
        router.refresh();
      });
    }
  }

  return (
    <tr className="row-hover" style={{ opacity: isPending ? 0.5 : 1 }}>
      <td style={{ fontWeight: 600 }}>
        <Link href={`/proprietarios/${owner.id}`} style={{ color: "inherit", textDecoration: "none" }}>{owner.name}</Link>
      </td>
      <td className="mono muted">{owner.document ?? "—"}</td>
      <td>{owner.phone ?? "—"}</td>
      <td className="mono">{propertyCodes.length > 0 ? propertyCodes.join(", ") : "—"}</td>
      <td>
        <button onClick={handleDelete} title="Excluir" style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--ink-soft)", padding: 4, display: "flex" }}>
          <IconTrash />
        </button>
      </td>
    </tr>
  );
}
