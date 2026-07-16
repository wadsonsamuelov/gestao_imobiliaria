import { createClient } from "@/lib/supabase/server";
import { SectionTitle } from "@/components/ui/section-title";
import { StatCard } from "@/components/ui/tag-stat";
import { addEarning } from "./actions";
import { EarningRow } from "./earning-row";

export const dynamic = "force-dynamic";
const fmt = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default async function GanhosPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: earnings } = await supabase
    .from("earnings")
    .select("*")
    .eq("profile_id", user!.id)
    .order("event_date", { ascending: false });

  const list = earnings ?? [];
  const recebido = list.filter((e) => e.status === "recebido").reduce((s, e) => s + Number(e.value), 0);
  const pendente = list.filter((e) => e.status === "pendente").reduce((s, e) => s + Number(e.value), 0);

  return (
    <>
      <SectionTitle count={list.length}>Controle de ganhos pessoais</SectionTitle>

      <div className="grid grid-3">
        <StatCard label="Recebido no período" value={fmt(recebido)} delta={`${list.filter((e) => e.status === "recebido").length} lançamentos`} />
        <StatCard label="A receber" value={fmt(pendente)} delta={`${list.filter((e) => e.status === "pendente").length} pendente(s)`} warn={pendente > 0} />
        <StatCard label="Total acumulado" value={fmt(recebido + pendente)} />
      </div>

      <div className="divider" />
      <SectionTitle>Lançamentos</SectionTitle>
      <div className="plan-card" style={{ padding: 0 }}>
        <span className="card-crest" />
        <table>
          <thead>
            <tr><th style={{ width: 36 }}></th><th>Descrição</th><th>Data</th><th>Valor</th><th>Situação</th></tr>
          </thead>
          <tbody>
            {list.map((e) => (
              <EarningRow key={e.id} earning={e} />
            ))}
          </tbody>
        </table>
        {list.length === 0 && <p className="muted" style={{ padding: 18, fontSize: 13 }}>Nenhum ganho registrado ainda.</p>}
        <div className="muted" style={{ padding: "0 18px 16px 18px", fontSize: 11.5 }}>Clique em um lançamento para marcar como recebido / pendente.</div>
      </div>

      <div className="divider" />
      <SectionTitle>Registrar novo ganho</SectionTitle>
      <div className="plan-card">
        <span className="card-crest" />
        <form action={addEarning}>
          <div className="form-grid">
            <div className="field full">
              <label>Descrição</label>
              <input name="description" placeholder="Ex: Taxa de administração — IM-014 (agosto)" required />
            </div>
            <div className="field">
              <label>Valor recebido</label>
              <input name="value" type="number" step="0.01" placeholder="2500" required />
            </div>
            <div className="field">
              <label>Data</label>
              <input name="event_date" type="date" />
            </div>
          </div>
          <button type="submit" className="btn brass" style={{ marginTop: 16 }}>+ Marcar ganho recebido</button>
        </form>
      </div>
    </>
  );
}
