import { createClient } from "@/lib/supabase/server";
import { SectionTitle } from "@/components/ui/section-title";
import { Tag } from "@/components/ui/tag-stat";

export const dynamic = "force-dynamic";

export default async function ChavesPage() {
  const supabase = createClient();
  const { data: movements } = await supabase
    .from("key_movements")
    .select("*, properties(code)")
    .order("movement_date", { ascending: false });

  const list = movements ?? [];

  return (
    <>
      <SectionTitle count={list.length}>Controle de entrega de chaves</SectionTitle>
      <div className="plan-card" style={{ padding: 0 }}>
        <span className="card-crest" />
        <table>
          <thead>
            <tr><th>Imóvel</th><th>Evento</th><th>Responsável</th><th>Data</th><th>Situação</th></tr>
          </thead>
          <tbody>
            {list.map((r: any) => (
              <tr key={r.id} className="row-hover">
                <td className="mono">{r.properties?.code}</td>
                <td>{r.event_type === "entrega" ? "Entrega ao inquilino" : "Devolução"}</td>
                <td style={{ fontWeight: 600 }}>{r.person_name}</td>
                <td>{new Date(r.movement_date).toLocaleDateString("pt-BR")}</td>
                <td>{r.status === "entregue" ? <Tag variant="ok">Entregue</Tag> : <Tag>Devolvida</Tag>}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {list.length === 0 && <p className="muted" style={{ padding: 18, fontSize: 13 }}>Nenhuma movimentação de chave registrada ainda.</p>}
      </div>
    </>
  );
}
