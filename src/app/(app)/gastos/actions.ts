"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function addExpense(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("organization_id").eq("id", user!.id).single();

  const propertyId = String(formData.get("property_id") ?? "");
  const description = String(formData.get("description") ?? "").trim();
  const value = parseFloat(String(formData.get("value") ?? "0"));
  if (!propertyId || !description || !value) return;

  await supabase.from("expenses").insert({
    organization_id: profile?.organization_id,
    property_id: propertyId,
    description,
    category: String(formData.get("category") ?? "outros"),
    value,
    expense_date: String(formData.get("expense_date") ?? "") || new Date().toISOString().slice(0, 10),
    paid_by: String(formData.get("paid_by") ?? "administradora"),
  });

  revalidatePath("/gastos");
}

export async function updateExpense(id: string, formData: FormData) {
  const supabase = createClient();
  await supabase
    .from("expenses")
    .update({
      description: String(formData.get("description") ?? "").trim(),
      category: String(formData.get("category") ?? "outros"),
      value: parseFloat(String(formData.get("value") ?? "0")),
      expense_date: String(formData.get("expense_date") ?? ""),
      paid_by: String(formData.get("paid_by") ?? "administradora"),
    })
    .eq("id", id);

  revalidatePath("/gastos");
}

export async function deleteExpense(id: string) {
  const supabase = createClient();
  await supabase.from("expenses").delete().eq("id", id);
  revalidatePath("/gastos");
}
