"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Tag } from "@/components/ui/tag-stat";
import { IconPhone, IconTrash } from "@/components/icons-extra";
import { deleteProvider } from "./actions";

export function ProviderCard({ pr }: { pr: any }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleDelete() {
    if (confirm(`Excluir "${pr.name}"?`)) {
      startTransition(async () => {
        await deleteProvider(pr.id);
        router.refresh();
      });
    }
  }

  return (
    <div className="plan-card" style={{ opacity: isPending ? 0.5 : 1 }}>
      <span className="card-crest" />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <Link href={`/prestadores/${pr.id}`} style={{ color: "inherit", textDecoration: "none" }}>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{pr.name}</div>
          </Link>
          {pr.specialty && <Tag variant="brass">{pr.specialty}</Tag>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {pr.rating && <div className="mono muted" style={{ fontSize: 12 }}>★ {pr.rating}</div>}
          <button onClick={handleDelete} title="Excluir" style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--ink-soft)", padding: 4, display: "flex" }}>
            <IconTrash />
          </button>
        </div>
      </div>
      <div className="divider" style={{ margin: "16px 0" }} />
      {pr.phone && (
        <div style={{ display: "flex", gap: 9, alignItems: "center", fontSize: 12.5 }}>
          <IconPhone /> <span className="mono">{pr.phone}</span>
        </div>
      )}
      {pr.document && <div className="muted" style={{ fontSize: 12, marginTop: 7 }}>Documento: {pr.document}</div>}
    </div>
  );
}
