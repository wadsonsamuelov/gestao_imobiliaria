import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SectionTitle } from "@/components/ui/section-title";
import { SubmitButton } from "@/components/submit-button";
import { updateTemplate } from "../actions";
import { CONTRACT_PLACEHOLDERS } from "@/lib/pdf/contract-template";

export const dynamic = "force-dynamic";

export default async function EditarModeloPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: template } = await supabase.from("contract_templates").select("*").eq("id", params.id).single();
  if (!template) notFound();

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <SectionTitle>Editar modelo</SectionTitle>
        <Link href="/modelos-contrato" className="btn secondary">&larr; Voltar</Link>
      </div>
      <div className="grid grid-2">
        <div className="plan-card">
          <span className="card-crest" />
          <form action={updateTemplate.bind(null, template.id)}>
            <div className="form-grid">
              <div className="field full"><label>Nome do modelo</label><input name="name" defaultValue={template.name} required /></div>
              <div className="field full">
                <label>Texto do contrato</label>
                <textarea name="body" defaultValue={template.body} style={{ minHeight: 460, fontFamily: "'IBM Plex Mono', monospace", fontSize: 12 }} />
              </div>
            </div>
            <SubmitButton style={{ marginTop: 16 }} pendingText="Salvando…">Salvar alterações</SubmitButton>
          </form>
        </div>

        <div className="plan-card">
          <span className="card-crest" />
          <div className="small-caps" style={{ fontSize: 11, marginBottom: 14, color: "var(--bronze)" }}>Campos disponíveis</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {CONTRACT_PLACEHOLDERS.map((p) => (
              <div key={p.token} style={{ fontSize: 11.5 }}>
                <span className="mono" style={{ color: "var(--bronze)" }}>{p.token}</span>
                <div className="muted" style={{ fontSize: 11 }}>{p.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
