import { createClient } from "@/lib/supabase/server";
import { StatCard } from "@/components/ui/tag-stat";
import { PlanCard } from "@/components/ui/plan-card";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = createClient();
  const todayStr = new Date().toISOString().slice(0, 10);

  const [{ count: totalImoveis }, { count: ocupados }, { count: contratosAtivos }, { data: boletosAtrasados }, { count: vistoriasAgendadas }, { data: recentHistory }] =
    await Promise.all([
      supabase.from("properties").select("*", { count: "exact", head: true }),
      supabase.from("properties").select("*", { count: "exact", head: true }).eq("status", "ocupado"),
      supabase.from("contracts").select("*", { count: "exact", head: true }).eq("status", "ativo"),
      supabase
        .from("boletos")
        .select("value, due_date, contracts(tenant_id, tenants(name), properties(code))")
        .neq("status", "pago")
        .lt("due_date", todayStr),
      supabase.from("inspections").select("*", { count: "exact", head: true }).eq("status", "agendada"),
      supabase
        .from("property_history")
        .select("event_date, title, properties(code)")
        .order("event_date", { ascending: false })
        .limit(3),
    ]);

  const totalAtrasado = (boletosAtrasados ?? []).reduce((s, b: any) => s + Number(b.value), 0);

  return (
    <>
      <div className="pediment">
        <div className="frieze" style={{ width: 220, margin: "0 auto 18px auto" }} />
        <div className="eyebrow">Cadastre &middot; Administração de Bens</div>
        <div className="pediment-title">
          <svg className="laurel" viewBox="0 0 40 60" fill="none" stroke="currentColor" strokeWidth="1.3">
            <path d="M30 4C18 12 12 28 16 52" />
            <ellipse cx="19" cy="14" rx="5" ry="2.6" transform="rotate(-35 19 14)" />
            <ellipse cx="15" cy="24" rx="5.4" ry="2.8" transform="rotate(-52 15 24)" />
            <ellipse cx="13" cy="35" rx="5.6" ry="2.9" transform="rotate(-68 13 35)" />
            <ellipse cx="14" cy="46" rx="5.4" ry="2.8" transform="rotate(-84 14 46)" />
          </svg>
          <h1>Painel Geral</h1>
          <svg className="laurel right" viewBox="0 0 40 60" fill="none" stroke="currentColor" strokeWidth="1.3">
            <path d="M10 4C22 12 28 28 24 52" />
            <ellipse cx="21" cy="14" rx="5" ry="2.6" transform="rotate(35 21 14)" />
            <ellipse cx="25" cy="24" rx="5.4" ry="2.8" transform="rotate(52 25 24)" />
            <ellipse cx="27" cy="35" rx="5.6" ry="2.9" transform="rotate(68 27 35)" />
            <ellipse cx="26" cy="46" rx="5.4" ry="2.8" transform="rotate(84 26 46)" />
          </svg>
        </div>
        <div className="sub">Panorama consolidado do portfólio sob gestão</div>
      </div>

      <div className="grid grid-4">
        <StatCard
          label="Imóveis administrados"
          value={totalImoveis ?? 0}
          delta={`${ocupados ?? 0} ocupados · ${(totalImoveis ?? 0) - (ocupados ?? 0)} disponíveis`}
        />
        <StatCard label="Contratos ativos" value={contratosAtivos ?? 0} />
        <StatCard
          label="Boletos em atraso"
          value={boletosAtrasados?.length ?? 0}
          delta={totalAtrasado > 0 ? totalAtrasado.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : undefined}
          warn
        />
        <StatCard label="Vistorias agendadas" value={vistoriasAgendadas ?? 0} />
      </div>

      <div className="divider" />
      <div className="grid grid-2">
        <PlanCard>
          <div className="section-title" style={{ marginBottom: 18 }}>
            <div className="frieze-mini frieze" style={{ width: 36 }} />
            <h2 style={{ fontSize: 16.5 }}>Boletos em atraso</h2>
          </div>
          {(boletosAtrasados ?? []).length === 0 && <p className="muted" style={{ fontSize: 13 }}>Nenhum boleto em atraso — tudo em dia.</p>}
          <div className="checklist">
            {(boletosAtrasados ?? []).map((b: any, i: number) => (
              <div className="item" key={i}>
                <div className="box" />
                <div className="name">
                  {b.contracts?.tenants?.name ?? "Inquilino"} — {b.contracts?.properties?.code} — vencido em{" "}
                  {new Date(b.due_date).toLocaleDateString("pt-BR")}
                </div>
                <span className="tag alert">Atrasado</span>
              </div>
            ))}
          </div>
        </PlanCard>

        <PlanCard>
          <div className="section-title" style={{ marginBottom: 18 }}>
            <div className="frieze-mini frieze" style={{ width: 36 }} />
            <h2 style={{ fontSize: 16.5 }}>Últimas movimentações</h2>
          </div>
          <div className="timeline">
            {(recentHistory ?? []).map((h: any, i: number) => (
              <div className="tl-item" key={i}>
                <div className="tl-dot" />
                <div className="tl-date">{new Date(h.event_date).toLocaleDateString("pt-BR")}</div>
                <div className="tl-title">
                  {h.title} {h.properties?.code ? `— ${h.properties.code}` : ""}
                </div>
              </div>
            ))}
          </div>
        </PlanCard>
      </div>
    </>
  );
}
