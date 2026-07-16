import { createClient } from "@/lib/supabase/server";
import { SectionTitle } from "@/components/ui/section-title";
import { BoletoRow } from "./boleto-row";
import { InterestCalculator } from "./interest-calculator";

export const dynamic = "force-dynamic";

export default async function FinanceiroPage() {
  const supabase = createClient();
  const { data: boletos } = await supabase
    .from("boletos")
    .select("*, contracts(tenants(name), properties(code))")
    .order("due_date", { ascending: false });

  const list = boletos ?? [];

  return (
    <>
      <SectionTitle count={list.length}>Boletos emitidos</SectionTitle>
      <div className="plan-card" style={{ padding: 0 }}>
        <span className="card-crest" />
        <table>
          <thead>
            <tr><th>Inquilino</th><th>Imóvel</th><th>Valor</th><th>Vencimento</th><th>Situação</th><th></th></tr>
          </thead>
          <tbody>
            {list.map((b) => <BoletoRow key={b.id} boleto={b} />)}
          </tbody>
        </table>
        {list.length === 0 && <p className="muted" style={{ padding: 18, fontSize: 13 }}>Nenhum boleto lançado ainda.</p>}
      </div>

      <div className="divider" />
      <SectionTitle>Calculadora de juros e multa por atraso</SectionTitle>
      <div className="grid grid-2">
        <InterestCalculator />
        <div className="plan-card">
          <span className="card-crest" />
          <div className="small-caps" style={{ fontSize: 11, marginBottom: 12, color: "var(--bronze)" }}>Como é calculado</div>
          <p className="muted" style={{ fontSize: 12.5, lineHeight: 1.75 }}>
            Multa fixa aplicada uma única vez sobre o valor do aluguel no momento do inadimplemento, somada aos juros
            de mora calculados proporcionalmente aos dias corridos de atraso. Os percentuais seguem o que foi
            pactuado na cláusula de mora do contrato (campos <code>late_fee_pct</code> e{" "}
            <code>interest_pct_month</code> na tabela <code>contracts</code>).
          </p>
        </div>
      </div>
    </>
  );
}
