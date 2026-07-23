import { createClient } from "@/lib/supabase/server";
import { SectionTitle } from "@/components/ui/section-title";
import { SubmitButton } from "@/components/submit-button";
import { addTemplate } from "./actions";
import { TemplateRow } from "./template-row";
import { CONTRACT_PLACEHOLDERS, BUILTIN_TEMPLATE_BODY } from "@/lib/pdf/contract-template";

export const dynamic = "force-dynamic";

export default async function ModelosContratoPage() {
  const supabase = createClient();
  const { data: templates } = await supabase.from("contract_templates").select("*").order("name");
  const list = templates ?? [];

  return (
    <>
      <SectionTitle count={list.length}>Modelos de contrato</SectionTitle>

      {list.length === 0 && (
        <p className="muted" style={{ marginBottom: 16, fontSize: 12.5 }}>
          Nenhum modelo próprio criado ainda — o botão "Gerar contrato em PDF" usa o modelo embutido do sistema até
          que você crie o primeiro.
        </p>
      )}

      <div className="plan-card" style={{ padding: 0 }}>
        <span className="card-crest" />
        <table>
          <thead>
            <tr><th>Nome</th><th>Situação</th><th>Atualizado em</th><th></th></tr>
          </thead>
          <tbody>
            {list.map((t) => <TemplateRow key={t.id} template={t} />)}
          </tbody>
        </table>
        {list.length === 0 && <p className="muted" style={{ padding: 18, fontSize: 13 }}>Nenhum modelo cadastrado ainda.</p>}
      </div>

      <div className="divider" />
      <SectionTitle>Novo modelo</SectionTitle>
      <div className="grid grid-2">
        <div className="plan-card">
          <span className="card-crest" />
          <form action={addTemplate}>
            <div className="form-grid">
              <div className="field full"><label>Nome do modelo</label><input name="name" placeholder="Ex: Contrato residencial padrão" required /></div>
              <div className="field full">
                <label>Texto do contrato</label>
                <textarea name="body" defaultValue={BUILTIN_TEMPLATE_BODY} style={{ minHeight: 380, fontFamily: "'IBM Plex Mono', monospace", fontSize: 12 }} />
              </div>
            </div>
            <SubmitButton style={{ marginTop: 16 }} pendingText="Salvando…">Criar modelo</SubmitButton>
          </form>
        </div>

        <div className="plan-card">
          <span className="card-crest" />
          <div className="small-caps" style={{ fontSize: 11, marginBottom: 14, color: "var(--bronze)" }}>Campos disponíveis</div>
          <p className="muted" style={{ fontSize: 12, marginBottom: 12 }}>
            Use estes códigos em qualquer parte do texto — na hora de gerar o PDF, cada um vira o dado real do contrato.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {CONTRACT_PLACEHOLDERS.map((p) => (
              <div key={p.token} style={{ fontSize: 11.5 }}>
                <span className="mono" style={{ color: "var(--bronze)" }}>{p.token}</span>
                <div className="muted" style={{ fontSize: 11 }}>{p.description}</div>
              </div>
            ))}
          </div>
          <p className="muted" style={{ fontSize: 11, marginTop: 14 }}>
            Linhas curtas em CAIXA ALTA (até ~45 caracteres) viram títulos de seção no PDF automaticamente.
            A assinatura e o aviso legal no rodapé são adicionados por último, não precisam estar no texto.
          </p>
        </div>
      </div>
    </>
  );
}
