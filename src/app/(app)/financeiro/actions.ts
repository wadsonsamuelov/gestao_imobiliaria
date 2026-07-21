"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function markBoletoPaid(id: string) {
  const supabase = createClient();
  await supabase.from("boletos").update({ status: "pago", paid_at: new Date().toISOString().slice(0, 10) }).eq("id", id);
  revalidatePath("/financeiro");
}

export async function addBoleto(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("organization_id").eq("id", user!.id).single();

  const contractId = String(formData.get("contract_id") ?? "");
  const value = parseFloat(String(formData.get("value") ?? "0"));
  const dueDate = String(formData.get("due_date") ?? "");
  if (!contractId || !value || !dueDate) return;

  await supabase.from("boletos").insert({
    organization_id: profile?.organization_id,
    contract_id: contractId,
    value,
    due_date: dueDate,
    status: "a_vencer",
  });

  revalidatePath("/financeiro");
}

export async function updateBoleto(id: string, formData: FormData) {
  const supabase = createClient();
  await supabase
    .from("boletos")
    .update({
      value: parseFloat(String(formData.get("value") ?? "0")),
      due_date: String(formData.get("due_date") ?? ""),
      status: String(formData.get("status") ?? "a_vencer"),
    })
    .eq("id", id);

  revalidatePath("/financeiro");
}

export async function deleteBoleto(id: string) {
  const supabase = createClient();
  await supabase.from("boletos").delete().eq("id", id);
  revalidatePath("/financeiro");
}
