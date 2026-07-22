import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SectionTitle } from "@/components/ui/section-title";
import { SubmitButton } from "@/components/submit-button";
import { updateOwner } from "../actions";

export const dynamic = "force-dynamic";

export default async function EditarProprietarioPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: owner } = await supabase.from("owners").select("*").eq("id", params.id).single();
  if (!owner) notFound();

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <SectionTitle>Editar proprietário</SectionTitle>
        <Link href="/proprietarios" className="btn secondary">&larr; Voltar</Link>
      </div>
      <div className="plan-card">
        <span className="card-crest" />
        <form action={updateOwner.bind(null, owner.id)}>
          <div className="form-grid">
            <div className="field"><label>Nome / Razão social</label><input name="name" defaultValue={owner.name} required /></div>
            <div className="field"><label>CPF / CNPJ</label><input name="document" defaultValue={owner.document ?? ""} /></div>
            <div className="field"><label>Telefone</label><input name="phone" defaultValue={owner.phone ?? ""} /></div>
            <div className="field"><label>E-mail</label><input name="email" type="email" defaultValue={owner.email ?? ""} /></div>
            <div className="field full"><label>Observações</label><textarea name="notes" defaultValue={owner.notes ?? ""} /></div>
          </div>
          <SubmitButton style={{ marginTop: 16 }} pendingText="Salvando…">Salvar alterações</SubmitButton>
        </form>
      </div>
    </>
  );
}
