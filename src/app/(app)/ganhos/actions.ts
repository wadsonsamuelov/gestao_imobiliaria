"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function addEarning(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("organization_id").eq("id", user!.id).single();

  const description = String(formData.get("description") ?? "").trim();
  const value = parseFloat(String(formData.get("value") ?? "0"));
  const eventDate = String(formData.get("event_date") ?? "") || new Date().toISOString().slice(0, 10);

  if (!description || !value) return;

  await supabase.from("earnings").insert({
    organization_id: profile?.organization_id,
    profile_id: user!.id,
    description,
    value,
    event_date: eventDate,
    status: "recebido",
  });

  revalidatePath("/ganhos");
}

export async function toggleEarning(id: string, currentStatus: "recebido" | "pendente") {
  const supabase = createClient();
  await supabase
    .from("earnings")
    .update({ status: currentStatus === "recebido" ? "pendente" : "recebido" })
    .eq("id", id);

  revalidatePath("/ganhos");
}

export async function deleteEarning(id: string) {
  const supabase = createClient();
  await supabase.from("earnings").delete().eq("id", id);
  revalidatePath("/ganhos");
}
