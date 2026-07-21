import { createClient } from "@/lib/supabase/server";
import { SectionTitle } from "@/components/ui/section-title";
import { addExpense } from "./actions";
import { SubmitButton } from "@/components/submit-button";
import { ExpenseRow } from "./expense-row";

export const dynamic = "force-dynamic";

const CATEGORY_LABEL: Record<string, string> = {
  manutencao: "Manutenção", reforma: "Reforma", hidraulica: "Hidráulica",
  eletrica: "Elétrica", vidracaria: "Vidraçaria", outros: "Outros",
};
const PAID_BY_LABEL: Record<string, string> = { proprietario: "Proprietário", inquilino: "Inquilino", administradora: "Administradora" };

export default async function GastosPage() {
  const supabase = createClient();
  const [{ data: expenses }, { data: properties }] = await Promise.all([
    supabase.from("expenses").select("*, properties(code)").order("expense_date", { ascending: false }),
    supabase.from("properties").select("id, code, title").order("code"),
  ]);

  const list = expenses ?? [];
  const total = list.reduce((s, e) => s + Number(e.value), 0);
  const porProprietario = list.filter((e) => e.paid_by === "proprietario").reduce((s, e) => s + Number(e.value), 0);
  const porAdministradora = list.filter((e) => e.paid_by === "administradora").reduce((s, e) => s + Number(e.value), 0);
  const fmt = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <>
      <SectionTitle count={list.length}>Controle de gastos por imóvel</SectionTitle>
      <div className="plan-card" style={{ padding: 0 }}>
        <span className="card-crest" />
        <table>
          <thead>
            <tr><th>Imóvel</th><th>Descrição</th><th>Categoria</th><th>Valor</th><th>Data</th><th>Pago por</th><th></th></tr>
          </thead>
          <tbody>
            {list.map((e: any) => <ExpenseRow key={e.id} e={e} />)}
          </tbody>
        </table>
        {list.length === 0 && <p className="muted" style={{ padding: 18, fontSize: 13 }}>Nenhum gasto lançado ainda.</p>}
      </div>

      <div className="divider" />
      <div className="grid grid-3">
        <div className="plan-card stat"><span className="card-crest" /><div className="label">Total no período</div><div className="value">{fmt(total)}</div><div className="delta">{list.length} lançamentos</div></div>
        <div className="plan-card stat"><span className="card-crest" /><div className="label">Custeado pelo proprietário</div><div className="value">{fmt(porProprietario)}</div></div>
        <div className="plan-card stat"><span className="card-crest" /><div className="label">Custeado pela administradora</div><div className="value">{fmt(porAdministradora)}</div></div>
      </div>

      <div className="divider" />
      <SectionTitle>Lançar novo gasto</SectionTitle>
      <div className="plan-card">
        <span className="card-crest" />
        <form action={addExpense}>
          <div className="form-grid">
            <div className="field">
              <label>Imóvel</label>
              <select name="property_id" required>
                {(properties ?? []).map((p) => <option key={p.id} value={p.id}>{p.code} — {p.title}</option>)}
              </select>
            </div>
            <div className="field"><label>Descrição</label><input name="description" placeholder="Ex: Reparo de vazamento" required /></div>
            <div className="field">
              <label>Categoria</label>
              <select name="category">
                {Object.entries(CATEGORY_LABEL).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div className="field"><label>Valor</label><input name="value" type="number" step="0.01" required /></div>
            <div className="field"><label>Data</label><input name="expense_date" type="date" /></div>
            <div className="field">
              <label>Pago por</label>
              <select name="paid_by">
                {Object.entries(PAID_BY_LABEL).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
          </div>
          <SubmitButton variant="secondary" style={{ marginTop: 16 }} pendingText="Lançando…">+ Lançar novo gasto</SubmitButton>
        </form>
      </div>
    </>
  );
}
