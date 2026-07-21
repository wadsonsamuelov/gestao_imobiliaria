"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function orgId(supabase: ReturnType<typeof createClient>) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("organization_id").eq("id", user!.id).single();
  return profile?.organization_id;
}

export async function addProperty(formData: FormData) {
  const supabase = createClient();
  const organization_id = await orgId(supabase);

  const code = String(formData.get("code") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  if (!code || !title) return;

  let ownerId: string | null = String(formData.get("owner_id") ?? "") || null;
  const newOwnerName = String(formData.get("new_owner_name") ?? "").trim();
  if (!ownerId && newOwnerName) {
    const { data: owner } = await supabase
      .from("owners")
      .insert({ organization_id, name: newOwnerName })
      .select("id")
      .single();
    ownerId = owner?.id ?? null;
  }

  const { data: created } = await supabase
    .from("properties")
    .insert({
      organization_id,
      code,
      title,
      address: String(formData.get("address") ?? ""),
      type: String(formData.get("type") ?? "apartamento"),
      area_m2: formData.get("area_m2") ? parseFloat(String(formData.get("area_m2"))) : null,
      owner_id: ownerId,
      status: String(formData.get("status") ?? "vago"),
      rent_value: formData.get("rent_value") ? parseFloat(String(formData.get("rent_value"))) : null,
      iptu_value: formData.get("iptu_value") ? parseFloat(String(formData.get("iptu_value"))) : null,
      condo_value: formData.get("condo_value") ? parseFloat(String(formData.get("condo_value"))) : null,
    })
    .select("id")
    .single();

  revalidatePath("/imoveis");
  if (created) redirect(`/imoveis/${created.id}`);
}

export async function updateProperty(id: string, formData: FormData) {
  const supabase = createClient();

  await supabase
    .from("properties")
    .update({
      title: String(formData.get("title") ?? ""),
      address: String(formData.get("address") ?? ""),
      type: String(formData.get("type") ?? "apartamento"),
      area_m2: formData.get("area_m2") ? parseFloat(String(formData.get("area_m2"))) : null,
      status: String(formData.get("status") ?? "vago"),
      rent_value: formData.get("rent_value") ? parseFloat(String(formData.get("rent_value"))) : null,
      iptu_value: formData.get("iptu_value") ? parseFloat(String(formData.get("iptu_value"))) : null,
      condo_value: formData.get("condo_value") ? parseFloat(String(formData.get("condo_value"))) : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  revalidatePath(`/imoveis/${id}`);
  revalidatePath("/imoveis");
}

export async function deleteProperty(id: string) {
  const supabase = createClient();
  await supabase.from("properties").delete().eq("id", id);
  revalidatePath("/imoveis");
  redirect("/imoveis");
}
