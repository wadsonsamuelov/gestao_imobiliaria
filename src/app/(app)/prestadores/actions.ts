"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function addProvider(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("organization_id").eq("id", user!.id).single();

  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;

  await supabase.from("providers").insert({
    organization_id: profile?.organization_id,
    name,
    specialty: String(formData.get("specialty") ?? "") || null,
    phone: String(formData.get("phone") ?? "") || null,
    document: String(formData.get("document") ?? "") || null,
    notes: String(formData.get("notes") ?? "") || null,
  });

  revalidatePath("/prestadores");
}
