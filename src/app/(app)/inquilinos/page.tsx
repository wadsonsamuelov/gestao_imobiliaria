import { createClient } from "@/lib/supabase/server";
import { SectionTitle } from "@/components/ui/section-title";
import { addTenant } from "./actions";
import { SubmitButton } from "@/components/submit-button";

export const dynamic = "force-dynamic";

export default async function InquilinosPage() {
  const supabase = createClient();
  const { data: tenants } = await supabase
    .from("tenants")
    .select("*, contracts(status, properties(code))")
    .order("name");

  const list = tenants ?? [];

  return (
    <>
      <SectionTitle count={list.length}>Inquilinos cadastrados</SectionTitle>
      <div className="plan-card" style={{ padding: 0 }}>
        <span className="card-crest" />
        <table>
          <thead>
            <tr><th>Nome</th><th>CPF/CNPJ</th><th>Telefone</th><th>Imóvel</th><th>Renda</th></tr>
          </thead>
          <tbody>
            {list.map((t: any) => {
              const activeContract = t.contracts?.find((c: any) => c.status === "ativo");
              return (
                <tr key={t.id} className="row-hover">
                  <td style={{ fontWeight: 600 }}>{t.name}</td>
                  <td className="mono muted">{t.document ?? "—"}</td>
                  <td>{t.phone ?? "—"}</td>
                  <td className="mono">{activeContract?.properties?.code ?? "—"}</td>
                  <td className="mono">{t.income ? Number(t.income).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {list.length === 0 && <p className="muted" style={{ padding: 18, fontSize: 13 }}>Nenhum inquilino cadastrado ainda.</p>}
      </div>

      <div className="divider" />
      <SectionTitle>Nova ficha cadastral</SectionTitle>
      <div className="plan-card">
        <span className="card-crest" />
        <form action={addTenant}>
          <div className="form-grid">
            <div className="field"><label>Nome completo</label><input name="name" placeholder="Nome do inquilino" required /></div>
            <div className="field"><label>CPF / CNPJ</label><input name="document" placeholder="000.000.000-00" /></div>
            <div className="field"><label>Telefone</label><input name="phone" placeholder="(00) 0000-0000" /></div>
            <div className="field"><label>E-mail</label><input name="email" type="email" placeholder="email@exemplo.com" /></div>
            <div className="field"><label>Profissão / Atividade</label><input name="profession" /></div>
            <div className="field"><label>Renda comprovada</label><input name="income" type="number" step="0.01" placeholder="R$" /></div>
          </div>
          <SubmitButton style={{ marginTop: 16 }}>Salvar ficha</SubmitButton>
        </form>
      </div>
    </>
  );
}
