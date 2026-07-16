import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SectionTitle } from "@/components/ui/section-title";

export const dynamic = "force-dynamic";

export default async function VistoriasPage() {
  const supabase = createClient();
  const { data: properties } = await supabase
    .from("properties")
    .select("id, code, title, inspections(id, inspection_date, status, inspection_photos(id))")
    .order("code");

  const list = properties ?? [];

  return (
    <>
      <SectionTitle count={list.length}>Vistorias por imóvel</SectionTitle>
      <div className="grid grid-3">
        {list.map((p: any) => {
          const sorted = [...(p.inspections ?? [])].sort((a, b) => (a.inspection_date < b.inspection_date ? 1 : -1));
          const last = sorted[0];
          const totalPhotos = (p.inspections ?? []).reduce((s: number, v: any) => s + (v.inspection_photos?.length ?? 0), 0);
          return (
            <Link key={p.id} href={`/imoveis/${p.id}`} className="plan-card" style={{ display: "block", textDecoration: "none", color: "inherit" }}>
              <span className="card-crest" />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13.5 }}>{p.title}</div>
                  <div className="muted" style={{ fontSize: 11.5, marginTop: 2 }}>{p.code}</div>
                </div>
              </div>
              <div className="divider" style={{ margin: "16px 0" }} />
              <div className="muted" style={{ fontSize: 12 }}>
                {last ? `Última vistoria: ${new Date(last.inspection_date).toLocaleDateString("pt-BR")}` : "Nenhuma vistoria registrada"}
              </div>
              <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>{totalPhotos} foto(s) registrada(s)</div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
