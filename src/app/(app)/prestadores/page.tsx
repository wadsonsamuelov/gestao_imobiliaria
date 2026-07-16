import { createClient } from "@/lib/supabase/server";
import { SectionTitle } from "@/components/ui/section-title";
import { Tag } from "@/components/ui/tag-stat";
import { IconPhone } from "@/components/icons-extra";
import { addProvider } from "./actions";

export const dynamic = "force-dynamic";

export default async function PrestadoresPage() {
  const supabase = createClient();
  const { data: providers } = await supabase.from("providers").select("*").order("name");
  const list = providers ?? [];

  return (
    <>
      <SectionTitle count={list.length}>Prestadores de serviço</SectionTitle>
      <div className="grid grid-2">
        {list.map((pr) => (
          <div className="plan-card" key={pr.id}>
            <span className="card-crest" />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{pr.name}</div>
                {pr.specialty && <Tag variant="brass">{pr.specialty}</Tag>}
              </div>
              {pr.rating && <div className="mono muted" style={{ fontSize: 12 }}>★ {pr.rating}</div>}
            </div>
            <div className="divider" style={{ margin: "16px 0" }} />
            {pr.phone && (
              <div style={{ display: "flex", gap: 9, alignItems: "center", fontSize: 12.5 }}>
                <IconPhone /> <span className="mono">{pr.phone}</span>
              </div>
            )}
            {pr.document && <div className="muted" style={{ fontSize: 12, marginTop: 7 }}>Documento: {pr.document}</div>}
          </div>
        ))}
        {list.length === 0 && <p className="muted">Nenhum prestador cadastrado ainda.</p>}
      </div>

      <div className="divider" />
      <SectionTitle>Novo prestador</SectionTitle>
      <div className="plan-card">
        <span className="card-crest" />
        <form action={addProvider}>
          <div className="form-grid">
            <div className="field"><label>Nome / Razão social</label><input name="name" placeholder="Nome do prestador" required /></div>
            <div className="field"><label>Especialidade</label><input name="specialty" placeholder="Ex: Encanador, Eletricista…" /></div>
            <div className="field"><label>Telefone</label><input name="phone" placeholder="(00) 0000-0000" /></div>
            <div className="field"><label>CPF / CNPJ</label><input name="document" /></div>
            <div className="field full"><label>Observações</label><textarea name="notes" placeholder="Histórico, condições de pagamento, disponibilidade…" /></div>
          </div>
          <button type="submit" className="btn brass" style={{ marginTop: 16 }}>Salvar prestador</button>
        </form>
      </div>
    </>
  );
}
