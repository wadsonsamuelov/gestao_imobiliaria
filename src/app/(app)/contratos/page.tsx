import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SectionTitle } from "@/components/ui/section-title";
import { Tag } from "@/components/ui/tag-stat";

export const dynamic = "force-dynamic";

export default async function ContratosPage() {
  const supabase = createClient();
  const { data: contracts } = await supabase
    .from("contracts")
    .select("*, properties(id, code, title), tenants(name)")
    .order("start_date", { ascending: false });

  const list = contracts ?? [];

  return (
    <>
      <SectionTitle count={list.length}>Contratos</SectionTitle>
      <div className="plan-card" style={{ padding: 0 }}>
        <span className="card-crest" />
        <table>
          <thead>
            <tr><th>Imóvel</th><th>Inquilino</th><th>Valor</th><th>Início</th><th>Reajuste</th><th>Situação</th></tr>
          </thead>
          <tbody>
            {list.map((c: any) => (
              <tr key={c.id} className="row-hover">
                <td style={{ fontWeight: 600 }}>
                  <Link href={`/imoveis/${c.properties?.id}`} style={{ color: "inherit", textDecoration: "none" }}>
                    {c.properties?.title}
                  </Link>
                </td>
                <td>{c.tenants?.name}</td>
                <td className="mono">{Number(c.rent_value).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</td>
                <td>{new Date(c.start_date).toLocaleDateString("pt-BR")}</td>
                <td><Tag>{c.adjustment_index}</Tag></td>
                <td>
                  {c.status === "ativo" ? <Tag variant="ok">Ativo</Tag> : c.status === "encerrado" ? <Tag variant="neutral">Encerrado</Tag> : <Tag variant="brass">Renovação</Tag>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {list.length === 0 && <p className="muted" style={{ padding: 18, fontSize: 13 }}>Nenhum contrato cadastrado ainda.</p>}
      </div>
      <p className="muted" style={{ marginTop: 16, fontSize: 12.5 }}>
        Clique em um imóvel na tela de <Link href="/imoveis" style={{ color: "var(--bronze)" }}>Imóveis</Link> para ver ou
        preencher o contrato completo (aba "Contrato").
      </p>
    </>
  );
}
