"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function addOwner(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("organization_id").eq("id", user!.id).single();

  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;

  await supabase.from("owners").insert({
    organization_id: profile?.organization_id,
    name,
    document: String(formData.get("document") ?? "") || null,
    phone: String(formData.get("phone") ?? "") || null,
    email: String(formData.get("email") ?? "") || null,
    notes: String(formData.get("notes") ?? "") || null,
  });

  revalidatePath("/proprietarios");
}

export async function updateOwner(id: string, formData: FormData) {
  const supabase = createClient();
  await supabase
    .from("owners")
    .update({
      name: String(formData.get("name") ?? "").trim(),
      document: String(formData.get("document") ?? "") || null,
      phone: String(formData.get("phone") ?? "") || null,
      email: String(formData.get("email") ?? "") || null,
      notes: String(formData.get("notes") ?? "") || null,
    })
    .eq("id", id);

  revalidatePath("/proprietarios");
}

export async function deleteOwner(id: string) {
  const supabase = createClient();
  await supabase.from("owners").delete().eq("id", id);
  revalidatePath("/proprietarios");
}
