import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SectionTitle } from "@/components/ui/section-title";
import { SubmitButton } from "@/components/submit-button";
import { updateTenant } from "../actions";

export const dynamic = "force-dynamic";

export default async function EditarInquilinoPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: tenant } = await supabase.from("tenants").select("*").eq("id", params.id).single();
  if (!tenant) notFound();

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <SectionTitle>Editar inquilino</SectionTitle>
        <Link href="/inquilinos" className="btn secondary">&larr; Voltar</Link>
      </div>
      <div className="plan-card">
        <span className="card-crest" />
        <form action={updateTenant.bind(null, tenant.id)}>
          <div className="form-grid">
            <div className="field"><label>Nome completo</label><input name="name" defaultValue={tenant.name} required /></div>
            <div className="field"><label>CPF / CNPJ</label><input name="document" defaultValue={tenant.document ?? ""} /></div>
            <div className="field"><label>Telefone</label><input name="phone" defaultValue={tenant.phone ?? ""} /></div>
            <div className="field"><label>E-mail</label><input name="email" type="email" defaultValue={tenant.email ?? ""} /></div>
            <div className="field"><label>Profissão / Atividade</label><input name="profession" defaultValue={tenant.profession ?? ""} /></div>
            <div className="field"><label>Renda comprovada</label><input name="income" type="number" step="0.01" defaultValue={tenant.income ?? ""} /></div>
          </div>
          <SubmitButton style={{ marginTop: 16 }} pendingText="Salvando…">Salvar alterações</SubmitButton>
        </form>
      </div>
    </>
  );
}
