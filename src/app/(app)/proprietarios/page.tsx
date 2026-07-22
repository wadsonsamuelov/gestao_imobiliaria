import { createClient } from "@/lib/supabase/server";
import { SectionTitle } from "@/components/ui/section-title";
import { SubmitButton } from "@/components/submit-button";
import { addOwner } from "./actions";
import { OwnerRow } from "./owner-row";

export const dynamic = "force-dynamic";

export default async function ProprietariosPage() {
  const supabase = createClient();
  const { data: owners } = await supabase
    .from("owners")
    .select("*, properties(code)")
    .order("name");

  const list = owners ?? [];

  return (
    <>
      <SectionTitle count={list.length}>Proprietários cadastrados</SectionTitle>
      <div className="plan-card" style={{ padding: 0 }}>
        <span className="card-crest" />
        <table>
          <thead>
            <tr><th>Nome</th><th>CPF/CNPJ</th><th>Telefone</th><th>Imóveis</th><th></th></tr>
          </thead>
          <tbody>
            {list.map((o: any) => (
              <OwnerRow key={o.id} owner={o} propertyCodes={(o.properties ?? []).map((p: any) => p.code)} />
            ))}
          </tbody>
        </table>
        {list.length === 0 && <p className="muted" style={{ padding: 18, fontSize: 13 }}>Nenhum proprietário cadastrado ainda.</p>}
      </div>

      <div className="divider" />
      <SectionTitle>Novo proprietário</SectionTitle>
      <div className="plan-card">
        <span className="card-crest" />
        <form action={addOwner}>
          <div className="form-grid">
            <div className="field"><label>Nome / Razão social</label><input name="name" placeholder="Nome do proprietário" required /></div>
            <div className="field"><label>CPF / CNPJ</label><input name="document" /></div>
            <div className="field"><label>Telefone</label><input name="phone" placeholder="(00) 0000-0000" /></div>
            <div className="field"><label>E-mail</label><input name="email" type="email" /></div>
            <div className="field full"><label>Observações</label><textarea name="notes" /></div>
          </div>
          <SubmitButton style={{ marginTop: 16 }} pendingText="Salvando…">Salvar proprietário</SubmitButton>
        </form>
      </div>
    </>
  );
}
