import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SectionTitle } from "@/components/ui/section-title";
import { Tag } from "@/components/ui/tag-stat";

export const dynamic = "force-dynamic";

const STATUS_VARIANT: Record<string, "ok" | "brass" | "alert"> = {
  ocupado: "ok",
  vago: "brass",
  manutencao: "alert",
};
const STATUS_LABEL: Record<string, string> = { ocupado: "Ocupado", vago: "Vago", manutencao: "Manutenção" };

export default async function ImoveisPage() {
  const supabase = createClient();
  const { data: properties, error } = await supabase
    .from("properties")
    .select("id, code, title, address, status, rent_value")
    .order("code");

  return (
    <>
      <SectionTitle count={properties?.length}>Imóveis administrados</SectionTitle>

      {error && <p style={{ color: "var(--terracotta)" }}>Erro ao carregar imóveis: {error.message}</p>}

      <div className="grid grid-3">
        {(properties ?? []).map((p) => (
          <Link key={p.id} href={`/imoveis/${p.id}`} className="plan-card prop-card" style={{ display: "block", padding: 0, textDecoration: "none", color: "inherit" }}>
            <span className="card-crest" />
            <div className="prop-photo" />
            <div className="prop-body">
              <div className="prop-title">{p.title}</div>
              <div className="prop-addr">{p.address}</div>
              <div className="prop-meta">
                <Tag variant={STATUS_VARIANT[p.status] ?? "neutral"}>{STATUS_LABEL[p.status] ?? p.status}</Tag>
                <div className="prop-rent mono">
                  {Number(p.rent_value ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {(properties ?? []).length === 0 && !error && (
        <p className="muted" style={{ marginTop: 16 }}>
          Nenhum imóvel cadastrado ainda. Rode o seed (<code>0002_seed.sql</code>) ou cadastre um pelo Supabase Table Editor
          por enquanto — o formulário de cadastro é o próximo passo natural aqui.
        </p>
      )}
    </>
  );
}
