import { createClient } from "@/lib/supabase/server";
import { SectionTitle } from "@/components/ui/section-title";
import { SubmitButton } from "@/components/submit-button";
import { addProperty } from "../actions";

export const dynamic = "force-dynamic";

export default async function NovoImovelPage() {
  const supabase = createClient();
  const { data: owners } = await supabase.from("owners").select("id, name").order("name");

  return (
    <>
      <SectionTitle>Novo imóvel</SectionTitle>
      <div className="plan-card">
        <span className="card-crest" />
        <form action={addProperty}>
          <div className="form-grid">
            <div className="field"><label>Código</label><input name="code" placeholder="Ex: IM-020" required /></div>
            <div className="field"><label>Nome / Título</label><input name="title" placeholder="Ex: Edifício Aurora, Apto 302" required /></div>
            <div className="field full"><label>Endereço</label><input name="address" placeholder="Endereço completo" /></div>
            <div className="field">
              <label>Tipo</label>
              <select name="type">
                <option value="apartamento">Apartamento</option>
                <option value="casa">Casa</option>
                <option value="comercial">Comercial</option>
                <option value="industrial">Industrial</option>
                <option value="terreno">Terreno</option>
              </select>
            </div>
            <div className="field"><label>Área (m²)</label><input name="area_m2" type="number" step="0.01" /></div>
            <div className="field">
              <label>Status</label>
              <select name="status">
                <option value="vago">Vago</option>
                <option value="ocupado">Ocupado</option>
                <option value="manutencao">Manutenção</option>
              </select>
            </div>
            <div className="field">
              <label>Proprietário existente</label>
              <select name="owner_id">
                <option value="">— nenhum / novo abaixo —</option>
                {(owners ?? []).map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
              </select>
            </div>
            <div className="field"><label>Ou cadastrar novo proprietário</label><input name="new_owner_name" placeholder="Nome do proprietário" /></div>
            <div className="field"><label>Valor de aluguel</label><input name="rent_value" type="number" step="0.01" /></div>
            <div className="field"><label>IPTU (mensal)</label><input name="iptu_value" type="number" step="0.01" /></div>
            <div className="field"><label>Condomínio (mensal)</label><input name="condo_value" type="number" step="0.01" /></div>
          </div>
          <SubmitButton style={{ marginTop: 16 }} pendingText="Salvando…">Salvar imóvel</SubmitButton>
        </form>
      </div>
    </>
  );
}
