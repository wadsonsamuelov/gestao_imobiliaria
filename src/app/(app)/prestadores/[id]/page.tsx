import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SectionTitle } from "@/components/ui/section-title";
import { SubmitButton } from "@/components/submit-button";
import { updateProvider } from "../actions";

export const dynamic = "force-dynamic";

export default async function EditarPrestadorPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: provider } = await supabase.from("providers").select("*").eq("id", params.id).single();
  if (!provider) notFound();

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <SectionTitle>Editar prestador</SectionTitle>
        <Link href="/prestadores" className="btn secondary">&larr; Voltar</Link>
      </div>
      <div className="plan-card">
        <span className="card-crest" />
        <form action={updateProvider.bind(null, provider.id)}>
          <div className="form-grid">
            <div className="field"><label>Nome / Razão social</label><input name="name" defaultValue={provider.name} required /></div>
            <div className="field"><label>Especialidade</label><input name="specialty" defaultValue={provider.specialty ?? ""} /></div>
            <div className="field"><label>Telefone</label><input name="phone" defaultValue={provider.phone ?? ""} /></div>
            <div className="field"><label>CPF / CNPJ</label><input name="document" defaultValue={provider.document ?? ""} /></div>
            <div className="field full"><label>Observações</label><textarea name="notes" defaultValue={provider.notes ?? ""} /></div>
          </div>
          <SubmitButton style={{ marginTop: 16 }} pendingText="Salvando…">Salvar alterações</SubmitButton>
        </form>
      </div>
    </>
  );
}
