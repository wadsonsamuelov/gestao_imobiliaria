import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SectionTitle } from "@/components/ui/section-title";
import { SubmitButton } from "@/components/submit-button";
import { updateExpense } from "../actions";

export const dynamic = "force-dynamic";

const CATEGORY_LABEL: Record<string, string> = {
  manutencao: "Manutenção", reforma: "Reforma", hidraulica: "Hidráulica",
  eletrica: "Elétrica", vidracaria: "Vidraçaria", outros: "Outros",
};
const PAID_BY_LABEL: Record<string, string> = { proprietario: "Proprietário", inquilino: "Inquilino", administradora: "Administradora" };

export default async function EditarGastoPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: expense } = await supabase.from("expenses").select("*, properties(code, title)").eq("id", params.id).single();
  if (!expense) notFound();

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <SectionTitle>Editar gasto</SectionTitle>
        <Link href="/gastos" className="btn secondary">&larr; Voltar</Link>
      </div>
      <div className="plan-card">
        <span className="card-crest" />
        <p className="muted" style={{ fontSize: 12.5, marginBottom: 16 }}>Imóvel: <span className="mono">{expense.properties?.code}</span> — {expense.properties?.title}</p>
        <form action={updateExpense.bind(null, expense.id)}>
          <div className="form-grid">
            <div className="field"><label>Descrição</label><input name="description" defaultValue={expense.description} required /></div>
            <div className="field">
              <label>Categoria</label>
              <select name="category" defaultValue={expense.category}>
                {Object.entries(CATEGORY_LABEL).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div className="field"><label>Valor</label><input name="value" type="number" step="0.01" defaultValue={expense.value} required /></div>
            <div className="field"><label>Data</label><input name="expense_date" type="date" defaultValue={expense.expense_date} /></div>
            <div className="field">
              <label>Pago por</label>
              <select name="paid_by" defaultValue={expense.paid_by}>
                {Object.entries(PAID_BY_LABEL).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
          </div>
          <SubmitButton style={{ marginTop: 16 }} pendingText="Salvando…">Salvar alterações</SubmitButton>
        </form>
      </div>
    </>
  );
}
