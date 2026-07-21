"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function addInspection(propertyId: string, formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("organization_id").eq("id", user!.id).single();

  await supabase.from("inspections").insert({
    organization_id: profile?.organization_id,
    property_id: propertyId,
    type: String(formData.get("type") ?? "periodica"),
    inspection_date: String(formData.get("inspection_date") ?? "") || new Date().toISOString().slice(0, 10),
    status: String(formData.get("status") ?? "agendada"),
    notes: String(formData.get("notes") ?? "") || null,
  });

  revalidatePath(`/imoveis/${propertyId}`);
}

export async function deleteInspection(id: string, propertyId: string) {
  const supabase = createClient();
  await supabase.from("inspections").delete().eq("id", id);
  revalidatePath(`/imoveis/${propertyId}`);
}

export async function savePhotoRecord(inspectionId: string, url: string, propertyId: string) {
  const supabase = createClient();
  await supabase.from("inspection_photos").insert({ inspection_id: inspectionId, url });
  revalidatePath(`/imoveis/${propertyId}`);
}

export async function deletePhoto(photoId: string, storagePath: string, propertyId: string) {
  const supabase = createClient();
  await supabase.storage.from("inspection-photos").remove([storagePath]);
  await supabase.from("inspection_photos").delete().eq("id", photoId);
  revalidatePath(`/imoveis/${propertyId}`);
}
