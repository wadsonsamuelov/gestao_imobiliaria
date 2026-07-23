import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PropertyDetailTabs } from "./tabs";

export const dynamic = "force-dynamic";

export default async function PropertyDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const { data: property } = await supabase
    .from("properties")
    .select("*, owners(name)")
    .eq("id", params.id)
    .single();

  if (!property) notFound();

  const [{ data: documents }, { data: contract }, { data: inspections }, { data: history }, { data: tenants }, { data: templates }] = await Promise.all([
    supabase.from("property_documents").select("*").eq("property_id", params.id),
    supabase
      .from("contracts")
      .select("*, tenants(name)")
      .eq("property_id", params.id)
      .eq("status", "ativo")
      .maybeSingle(),
    supabase.from("inspections").select("*, inspection_photos(id, url)").eq("property_id", params.id).order("inspection_date", { ascending: false }),
    supabase.from("property_history").select("*").eq("property_id", params.id).order("event_date", { ascending: false }),
    supabase.from("tenants").select("id, name").order("name"),
    supabase.from("contract_templates").select("id, name").order("name"),
  ]);

  return (
    <PropertyDetailTabs
      property={property}
      documents={documents ?? []}
      contract={contract}
      inspections={inspections ?? []}
      history={history ?? []}
      tenants={tenants ?? []}
      templates={templates ?? []}
    />
  );
}
