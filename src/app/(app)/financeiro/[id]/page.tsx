import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SectionTitle } from "@/components/ui/section-title";
import { SubmitButton } from "@/components/submit-button";
import { updateBoleto } from "../actions";

export const dynamic = "force-dynamic";

export default async function EditarBoletoPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: boleto } = await supabase
    .from("boletos")
    .select("*, contracts(tenants(name), properties(code))")
    .eq("id", params.id)
    .single();
  if (!boleto) notFound();

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <SectionTitle>Editar boleto</SectionTitle>
        <Link href="/financeiro" className="btn secondary">&larr; Voltar</Link>
      </div>
      <div className="plan-card">
        <span className="card-crest" />
        <p className="muted" style={{ fontSize: 12.5, marginBottom: 16 }}>
          {boleto.contracts?.tenants?.name} — <span className="mono">{boleto.contracts?.properties?.code}</span>
        </p>
        <form action={updateBoleto.bind(null, boleto.id)}>
          <div className="form-grid">
            <div className="field"><label>Valor</label><input name="value" type="number" step="0.01" defaultValue={boleto.value} required /></div>
            <div className="field"><label>Vencimento</label><input name="due_date" type="date" defaultValue={boleto.due_date} required /></div>
            <div className="field">
              <label>Situação</label>
              <select name="status" defaultValue={boleto.status}>
                <option value="a_vencer">A vencer</option>
                <option value="atrasado">Atrasado</option>
                <option value="pago">Pago</option>
              </select>
            </div>
          </div>
          <SubmitButton style={{ marginTop: 16 }} pendingText="Salvando…">Salvar alterações</SubmitButton>
        </form>
      </div>
    </>
  );
}
