import { createClient } from "@/lib/supabase/server";
import { SectionTitle } from "@/components/ui/section-title";
import { addProvider } from "./actions";
import { SubmitButton } from "@/components/submit-button";
import { ProviderCard } from "./provider-card";

export const dynamic = "force-dynamic";

export default async function PrestadoresPage() {
  const supabase = createClient();
  const { data: providers } = await supabase.from("providers").select("*").order("name");
  const list = providers ?? [];

  return (
    <>
      <SectionTitle count={list.length}>Prestadores de serviço</SectionTitle>
      <div className="grid grid-2">
        {list.map((pr) => <ProviderCard key={pr.id} pr={pr} />)}
        {list.length === 0 && <p className="muted">Nenhum prestador cadastrado ainda.</p>}
      </div>

      <div className="divider" />
      <SectionTitle>Novo prestador</SectionTitle>
      <div className="plan-card">
        <span className="card-crest" />
        <form action={addProvider}>
          <div className="form-grid">
            <div className="field"><label>Nome / Razão social</label><input name="name" placeholder="Nome do prestador" required /></div>
            <div className="field"><label>Especialidade</label><input name="specialty" placeholder="Ex: Encanador, Eletricista…" /></div>
            <div className="field"><label>Telefone</label><input name="phone" placeholder="(00) 0000-0000" /></div>
            <div className="field"><label>CPF / CNPJ</label><input name="document" /></div>
            <div className="field full"><label>Observações</label><textarea name="notes" placeholder="Histórico, condições de pagamento, disponibilidade…" /></div>
          </div>
          <SubmitButton style={{ marginTop: 16 }}>Salvar prestador</SubmitButton>
        </form>
      </div>
    </>
  );
}
