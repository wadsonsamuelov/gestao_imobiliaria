"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BUILTIN_TEMPLATE_BODY } from "@/lib/pdf/contract-template";

async function orgId(supabase: ReturnType<typeof createClient>) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("organization_id").eq("id", user!.id).single();
  return profile?.organization_id;
}

export async function addTemplate(formData: FormData) {
  const supabase = createClient();
  const organization_id = await orgId(supabase);

  const name = String(formData.get("name") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim() || BUILTIN_TEMPLATE_BODY;
  if (!name) return;

  const { data: created } = await supabase
    .from("contract_templates")
    .insert({ organization_id, name, body })
    .select("id")
    .single();

  revalidatePath("/modelos-contrato");
  if (created) redirect(`/modelos-contrato/${created.id}`);
}

export async function updateTemplate(id: string, formData: FormData) {
  const supabase = createClient();
  await supabase
    .from("contract_templates")
    .update({
      name: String(formData.get("name") ?? "").trim(),
      body: String(formData.get("body") ?? ""),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  revalidatePath("/modelos-contrato");
  revalidatePath(`/modelos-contrato/${id}`);
}

export async function setDefaultTemplate(id: string) {
  const supabase = createClient();
  const organization_id = await orgId(supabase);

  // tira o padrão de todos os outros da mesma organização, depois marca este —
  // em duas etapas para nunca violar o índice de "só 1 padrão por organização"
  await supabase.from("contract_templates").update({ is_default: false }).eq("organization_id", organization_id);
  await supabase.from("contract_templates").update({ is_default: true }).eq("id", id);

  revalidatePath("/modelos-contrato");
}

export async function deleteTemplate(id: string) {
  const supabase = createClient();
  await supabase.from("contract_templates").delete().eq("id", id);
  revalidatePath("/modelos-contrato");
  redirect("/modelos-contrato");
}
