"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function addKeyMovement(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("organization_id").eq("id", user!.id).single();

  const propertyId = String(formData.get("property_id") ?? "");
  const personName = String(formData.get("person_name") ?? "").trim();
  if (!propertyId || !personName) return;

  await supabase.from("key_movements").insert({
    organization_id: profile?.organization_id,
    property_id: propertyId,
    event_type: String(formData.get("event_type") ?? "entrega"),
    person_name: personName,
    movement_date: String(formData.get("movement_date") ?? "") || new Date().toISOString().slice(0, 10),
    status: String(formData.get("status") ?? "entregue"),
    notes: String(formData.get("notes") ?? "") || null,
  });

  revalidatePath("/chaves");
}

export async function deleteKeyMovement(id: string) {
  const supabase = createClient();
  await supabase.from("key_movements").delete().eq("id", id);
  revalidatePath("/chaves");
}
