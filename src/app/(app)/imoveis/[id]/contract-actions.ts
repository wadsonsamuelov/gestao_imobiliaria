"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

async function orgId(supabase: ReturnType<typeof createClient>) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("organization_id").eq("id", user!.id).single();
  return profile?.organization_id;
}

export async function addContract(propertyId: string, formData: FormData) {
  const supabase = createClient();
  const organization_id = await orgId(supabase);

  let tenantId = String(formData.get("tenant_id") ?? "") || null;
  const newTenantName = String(formData.get("new_tenant_name") ?? "").trim();
  if (!tenantId && newTenantName) {
    const { data: tenant } = await supabase.from("tenants").insert({ organization_id, name: newTenantName }).select("id").single();
    tenantId = tenant?.id ?? null;
  }
  if (!tenantId) return;

  const { data: property } = await supabase.from("properties").select("owner_id").eq("id", propertyId).single();

  await supabase.from("contracts").insert({
    organization_id,
    property_id: propertyId,
    tenant_id: tenantId,
    owner_id: property?.owner_id ?? null,
    rent_value: parseFloat(String(formData.get("rent_value") ?? "0")),
    start_date: String(formData.get("start_date") ?? new Date().toISOString().slice(0, 10)),
    duration_months: parseInt(String(formData.get("duration_months") ?? "30")),
    due_day: parseInt(String(formData.get("due_day") ?? "10")),
    adjustment_index: String(formData.get("adjustment_index") ?? "IGPM"),
    late_fee_pct: parseFloat(String(formData.get("late_fee_pct") ?? "2")),
    interest_pct_month: parseFloat(String(formData.get("interest_pct_month") ?? "1")),
    guarantee_type: String(formData.get("guarantee_type") ?? "caucao"),
    guarantor_name: String(formData.get("guarantor_name") ?? "") || null,
    special_clauses: String(formData.get("special_clauses") ?? "") || null,
    template_id: String(formData.get("template_id") ?? "") || null,
    status: "ativo",
  });

  await supabase.from("properties").update({ status: "ocupado" }).eq("id", propertyId);

  revalidatePath(`/imoveis/${propertyId}`);
}

export async function updateContract(id: string, propertyId: string, formData: FormData) {
  const supabase = createClient();
  await supabase
    .from("contracts")
    .update({
      rent_value: parseFloat(String(formData.get("rent_value") ?? "0")),
      due_day: parseInt(String(formData.get("due_day") ?? "10")),
      adjustment_index: String(formData.get("adjustment_index") ?? "IGPM"),
      late_fee_pct: parseFloat(String(formData.get("late_fee_pct") ?? "2")),
      interest_pct_month: parseFloat(String(formData.get("interest_pct_month") ?? "1")),
      guarantee_type: String(formData.get("guarantee_type") ?? "caucao"),
      guarantor_name: String(formData.get("guarantor_name") ?? "") || null,
      special_clauses: String(formData.get("special_clauses") ?? "") || null,
      template_id: String(formData.get("template_id") ?? "") || null,
      status: String(formData.get("status") ?? "ativo"),
    })
    .eq("id", id);

  revalidatePath(`/imoveis/${propertyId}`);
}

export async function endContract(id: string, propertyId: string) {
  const supabase = createClient();
  await supabase.from("contracts").update({ status: "encerrado" }).eq("id", id);
  await supabase.from("properties").update({ status: "vago" }).eq("id", propertyId);
  revalidatePath(`/imoveis/${propertyId}`);
}
