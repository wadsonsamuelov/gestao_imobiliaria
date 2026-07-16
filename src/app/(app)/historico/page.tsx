import { createClient } from "@/lib/supabase/server";
import { SectionTitle } from "@/components/ui/section-title";

export const dynamic = "force-dynamic";

export default async function HistoricoPage() {
  const supabase = createClient();
  const { data: history } = await supabase
    .from("property_history")
    .select("*, properties(code, title)")
    .order("event_date", { ascending: false })
    .limit(50);

  const list = history ?? [];

  return (
    <>
      <SectionTitle>Histórico consolidado</SectionTitle>
      <div className="plan-card">
        <span className="card-crest" />
        {list.length === 0 && <p className="muted">Nenhum evento registrado ainda.</p>}
        <div className="timeline">
          {list.map((h: any) => (
            <div className="tl-item" key={h.id}>
              <div className="tl-dot" />
              <div className="tl-date">{new Date(h.event_date).toLocaleDateString("pt-BR")}</div>
              <div className="tl-title">{h.title} — <span className="mono">{h.properties?.code}</span></div>
              {h.description && <div className="tl-desc">{h.description}</div>}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
