"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function addTenant(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("organization_id").eq("id", user!.id).single();

  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;

  await supabase.from("tenants").insert({
    organization_id: profile?.organization_id,
    name,
    document: String(formData.get("document") ?? "") || null,
    phone: String(formData.get("phone") ?? "") || null,
    email: String(formData.get("email") ?? "") || null,
    profession: String(formData.get("profession") ?? "") || null,
    income: formData.get("income") ? parseFloat(String(formData.get("income"))) : null,
  });

  revalidatePath("/inquilinos");
}

export async function updateTenant(id: string, formData: FormData) {
  const supabase = createClient();
  await supabase
    .from("tenants")
    .update({
      name: String(formData.get("name") ?? "").trim(),
      document: String(formData.get("document") ?? "") || null,
      phone: String(formData.get("phone") ?? "") || null,
      email: String(formData.get("email") ?? "") || null,
      profession: String(formData.get("profession") ?? "") || null,
      income: formData.get("income") ? parseFloat(String(formData.get("income"))) : null,
    })
    .eq("id", id);

  revalidatePath("/inquilinos");
  revalidatePath(`/inquilinos/${id}`);
}

export async function deleteTenant(id: string) {
  const supabase = createClient();
  await supabase.from("tenants").delete().eq("id", id);
  revalidatePath("/inquilinos");
}
