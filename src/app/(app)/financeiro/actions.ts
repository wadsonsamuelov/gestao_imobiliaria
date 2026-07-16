"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function markBoletoPaid(id: string) {
  const supabase = createClient();
  await supabase.from("boletos").update({ status: "pago", paid_at: new Date().toISOString().slice(0, 10) }).eq("id", id);
  revalidatePath("/financeiro");
}
