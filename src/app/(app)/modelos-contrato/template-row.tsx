"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Tag } from "@/components/ui/tag-stat";
import { IconTrash } from "@/components/icons-extra";
import { deleteTemplate, setDefaultTemplate } from "./actions";

export function TemplateRow({ template }: { template: any }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    if (confirm(`Excluir o modelo "${template.name}"?`)) {
      startTransition(async () => {
        await deleteTemplate(template.id);
        router.refresh();
      });
    }
  }

  function handleSetDefault(e: React.MouseEvent) {
    e.stopPropagation();
    startTransition(async () => {
      await setDefaultTemplate(template.id);
      router.refresh();
    });
  }

  return (
    <tr className="row-hover" style={{ opacity: isPending ? 0.5 : 1 }}>
      <td style={{ fontWeight: 600 }}>
        <Link href={`/modelos-contrato/${template.id}`} style={{ color: "inherit", textDecoration: "none" }}>{template.name}</Link>
      </td>
      <td>{template.is_default ? <Tag variant="ok">Padrão</Tag> : (
        <button onClick={handleSetDefault} className="btn secondary" style={{ padding: "5px 10px", fontSize: 10 }}>Marcar como padrão</button>
      )}</td>
      <td>{new Date(template.updated_at).toLocaleDateString("pt-BR")}</td>
      <td>
        <button onClick={handleDelete} title="Excluir" style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--ink-soft)", padding: 4, display: "flex" }}>
          <IconTrash />
        </button>
      </td>
    </tr>
  );
}
