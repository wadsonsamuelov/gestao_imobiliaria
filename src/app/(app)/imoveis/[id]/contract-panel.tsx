"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { SubmitButton } from "@/components/submit-button";
import { addContract, updateContract, endContract } from "./contract-actions";

export function ContractPanel({ propertyId, contract, tenants }: { propertyId: string; contract: any; tenants: any[] }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleEnd() {
    if (!confirm("Encerrar este contrato? O imóvel volta a ficar como vago.")) return;
    startTransition(async () => {
      await endContract(contract.id, propertyId);
      router.refresh();
    });
  }

  if (!contract) {
    return (
      <div className="plan-card">
        <span className="card-crest" />
        <div className="small-caps" style={{ fontSize: 11, marginBottom: 14, color: "var(--bronze)" }}>Novo contrato — este imóvel está sem contrato ativo</div>
        <form action={addContract.bind(null, propertyId)}>
          <div className="form-grid">
            <div className="field">
              <label>Inquilino existente</label>
              <select name="tenant_id">
                <option value="">— nenhum / novo abaixo —</option>
                {tenants.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div className="field"><label>Ou cadastrar novo inquilino</label><input name="new_tenant_name" placeholder="Nome completo" /></div>
            <div className="field"><label>Valor mensal</label><input name="rent_value" type="number" step="0.01" required /></div>
            <div className="field"><label>Data de início</label><input name="start_date" type="date" required /></div>
            <div className="field"><label>Prazo (meses)</label><input name="duration_months" type="number" defaultValue={30} /></div>
            <div className="field"><label>Dia de vencimento</label><input name="due_day" type="number" defaultValue={10} /></div>
            <div className="field">
              <label>Índice de reajuste</label>
              <select name="adjustment_index"><option>IGPM</option><option>IPCA</option><option>INPC</option></select>
            </div>
            <div className="field"><label>Multa por atraso (%)</label><input name="late_fee_pct" type="number" step="0.01" defaultValue={2} /></div>
            <div className="field"><label>Juros de mora (% a.m.)</label><input name="interest_pct_month" type="number" step="0.01" defaultValue={1} /></div>
            <div className="field">
              <label>Garantia locatícia</label>
              <select name="guarantee_type">
                <option value="caucao">Caução</option>
                <option value="fiador">Fiador</option>
                <option value="seguro_fianca">Seguro-fiança</option>
                <option value="titulo_capitalizacao">Título de capitalização</option>
              </select>
            </div>
            <div className="field"><label>Fiador (se aplicável)</label><input name="guarantor_name" /></div>
            <div className="field full"><label>Cláusulas particulares</label><textarea name="special_clauses" /></div>
          </div>
          <SubmitButton style={{ marginTop: 16 }} pendingText="Salvando…">Gerar contrato</SubmitButton>
        </form>
      </div>
    );
  }

  return (
    <div className="plan-card" style={{ opacity: isPending ? 0.5 : 1 }}>
      <span className="card-crest" />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div className="small-caps" style={{ fontSize: 11, color: "var(--bronze)" }}>Contrato com {contract.tenants?.name}</div>
        <a href={`/api/contratos/${contract.id}/pdf`} target="_blank" rel="noopener noreferrer" className="btn brass" style={{ fontSize: 10.5, padding: "8px 14px" }}>
          Gerar contrato em PDF
        </a>
      </div>
      <form action={updateContract.bind(null, contract.id, propertyId)}>
        <div className="form-grid">
          <div className="field"><label>Valor mensal</label><input name="rent_value" type="number" step="0.01" defaultValue={contract.rent_value} /></div>
          <div className="field"><label>Dia de vencimento</label><input name="due_day" type="number" defaultValue={contract.due_day} /></div>
          <div className="field">
            <label>Índice de reajuste</label>
            <select name="adjustment_index" defaultValue={contract.adjustment_index}><option>IGPM</option><option>IPCA</option><option>INPC</option></select>
          </div>
          <div className="field"><label>Multa por atraso (%)</label><input name="late_fee_pct" type="number" step="0.01" defaultValue={contract.late_fee_pct} /></div>
          <div className="field"><label>Juros de mora (% a.m.)</label><input name="interest_pct_month" type="number" step="0.01" defaultValue={contract.interest_pct_month} /></div>
          <div className="field">
            <label>Garantia</label>
            <select name="guarantee_type" defaultValue={contract.guarantee_type}>
              <option value="caucao">Caução</option>
              <option value="fiador">Fiador</option>
              <option value="seguro_fianca">Seguro-fiança</option>
              <option value="titulo_capitalizacao">Título de capitalização</option>
            </select>
          </div>
          <div className="field"><label>Fiador</label><input name="guarantor_name" defaultValue={contract.guarantor_name ?? ""} /></div>
          <div className="field">
            <label>Situação</label>
            <select name="status" defaultValue={contract.status}>
              <option value="ativo">Ativo</option>
              <option value="renovacao">Renovação</option>
              <option value="encerrado">Encerrado</option>
            </select>
          </div>
          <div className="field full"><label>Cláusulas particulares</label><textarea name="special_clauses" defaultValue={contract.special_clauses ?? ""} /></div>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <SubmitButton pendingText="Salvando…">Salvar alterações</SubmitButton>
          <button type="button" className="btn secondary" style={{ borderColor: "var(--terracotta)", color: "var(--terracotta)" }} onClick={handleEnd}>
            Encerrar contrato
          </button>
        </div>
      </form>
    </div>
  );
}
