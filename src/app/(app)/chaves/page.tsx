import { createClient } from "@/lib/supabase/server";
import { SectionTitle } from "@/components/ui/section-title";
import { SubmitButton } from "@/components/submit-button";
import { addKeyMovement } from "./actions";
import { KeyRow } from "./key-row";

export const dynamic = "force-dynamic";

export default async function ChavesPage() {
  const supabase = createClient();
  const [{ data: movements }, { data: properties }] = await Promise.all([
    supabase.from("key_movements").select("*, properties(code)").order("movement_date", { ascending: false }),
    supabase.from("properties").select("id, code, title").order("code"),
  ]);

  const list = movements ?? [];

  return (
    <>
      <SectionTitle count={list.length}>Controle de entrega de chaves</SectionTitle>
      <div className="plan-card" style={{ padding: 0 }}>
        <span className="card-crest" />
        <table>
          <thead>
            <tr><th>Imóvel</th><th>Evento</th><th>Responsável</th><th>Data</th><th>Situação</th><th></th></tr>
          </thead>
          <tbody>
            {list.map((r: any) => <KeyRow key={r.id} r={r} />)}
          </tbody>
        </table>
        {list.length === 0 && <p className="muted" style={{ padding: 18, fontSize: 13 }}>Nenhuma movimentação de chave registrada ainda.</p>}
      </div>

      <div className="divider" />
      <SectionTitle>Registrar movimentação</SectionTitle>
      <div className="plan-card">
        <span className="card-crest" />
        <form action={addKeyMovement}>
          <div className="form-grid">
            <div className="field">
              <label>Imóvel</label>
              <select name="property_id" required>
                {(properties ?? []).map((p) => <option key={p.id} value={p.id}>{p.code} — {p.title}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Evento</label>
              <select name="event_type">
                <option value="entrega">Entrega ao inquilino</option>
                <option value="devolucao">Devolução</option>
              </select>
            </div>
            <div className="field"><label>Responsável</label><input name="person_name" placeholder="Nome de quem recebeu/devolveu" required /></div>
            <div className="field"><label>Data</label><input name="movement_date" type="date" /></div>
            <div className="field">
              <label>Situação</label>
              <select name="status">
                <option value="entregue">Entregue</option>
                <option value="devolvida">Devolvida</option>
              </select>
            </div>
            <div className="field full"><label>Observações</label><input name="notes" /></div>
          </div>
          <SubmitButton variant="secondary" style={{ marginTop: 16 }} pendingText="Registrando…">+ Registrar movimentação</SubmitButton>
        </form>
      </div>
    </>
  );
}
