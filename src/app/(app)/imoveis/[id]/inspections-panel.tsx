"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { SubmitButton } from "@/components/submit-button";
import { addInspection, deleteInspection, savePhotoRecord, deletePhoto } from "./inspection-actions";

const fmtDate = (d: string) => new Date(d).toLocaleDateString("pt-BR");

function PhotoUploader({ inspectionId, propertyId }: { inspectionId: string; propertyId: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      const path = `${inspectionId}/${crypto.randomUUID()}-${file.name}`;
      const { error } = await supabase.storage.from("inspection-photos").upload(path, file);
      if (!error) {
        const { data } = supabase.storage.from("inspection-photos").getPublicUrl(path);
        await savePhotoRecord(inspectionId, data.publicUrl, propertyId);
      }
    }
    setUploading(false);
    router.refresh();
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      <input ref={inputRef} type="file" accept="image/*" multiple disabled={uploading} onChange={(e) => handleFiles(e.target.files)} style={{ fontSize: 12 }} />
      {uploading && <span className="muted" style={{ fontSize: 11.5, marginLeft: 8 }}>Enviando…</span>}
    </div>
  );
}

function InspectionCard({ inspection, propertyId }: { inspection: any; propertyId: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleDeletePhoto(photo: any) {
    if (!confirm("Excluir esta foto?")) return;
    const marker = "/inspection-photos/";
    const idx = photo.url.indexOf(marker);
    const storagePath = idx >= 0 ? photo.url.slice(idx + marker.length) : "";
    startTransition(async () => {
      await deletePhoto(photo.id, storagePath, propertyId);
      router.refresh();
    });
  }

  function handleDeleteInspection() {
    if (!confirm("Excluir esta vistoria e todas as fotos associadas?")) return;
    startTransition(async () => {
      await deleteInspection(inspection.id, propertyId);
      router.refresh();
    });
  }

  return (
    <div className="plan-card" style={{ opacity: isPending ? 0.5 : 1 }}>
      <span className="card-crest" />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontWeight: 600 }}>Vistoria de {inspection.type} — {fmtDate(inspection.inspection_date)}</div>
          <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>{inspection.status === "concluida" ? "Concluída" : "Agendada"}{inspection.notes ? ` — ${inspection.notes}` : ""}</div>
        </div>
        <button className="btn secondary" style={{ padding: "5px 10px", fontSize: 10, borderColor: "var(--terracotta)", color: "var(--terracotta)" }} onClick={handleDeleteInspection}>
          Excluir vistoria
        </button>
      </div>

      <div className="photo-grid" style={{ marginTop: 14 }}>
        {(inspection.inspection_photos ?? []).map((p: any) => (
          <div key={p.id} className="photo-slot" style={{ position: "relative", padding: 0, overflow: "hidden", border: "1px solid var(--line)" }}>
            <img src={p.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <button
              onClick={() => handleDeletePhoto(p)}
              title="Excluir foto"
              style={{ position: "absolute", top: 4, right: 4, background: "rgba(20,18,14,.7)", color: "#fff", border: "none", borderRadius: 3, fontSize: 11, padding: "2px 6px", cursor: "pointer" }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 12 }}>
        <PhotoUploader inspectionId={inspection.id} propertyId={propertyId} />
      </div>
    </div>
  );
}

export function InspectionsPanel({ propertyId, inspections }: { propertyId: string; inspections: any[] }) {
  return (
    <>
      <div className="plan-card" style={{ marginBottom: 20 }}>
        <span className="card-crest" />
        <div className="small-caps" style={{ fontSize: 11, marginBottom: 14, color: "var(--bronze)" }}>Registrar nova vistoria</div>
        <form action={addInspection.bind(null, propertyId)}>
          <div className="form-grid">
            <div className="field">
              <label>Tipo</label>
              <select name="type">
                <option value="entrada">Entrada</option>
                <option value="periodica">Periódica</option>
                <option value="saida">Saída</option>
              </select>
            </div>
            <div className="field"><label>Data</label><input name="inspection_date" type="date" /></div>
            <div className="field">
              <label>Situação</label>
              <select name="status">
                <option value="agendada">Agendada</option>
                <option value="concluida">Concluída</option>
              </select>
            </div>
            <div className="field full"><label>Observações</label><textarea name="notes" placeholder="Estado de conservação, ressalvas…" /></div>
          </div>
          <SubmitButton style={{ marginTop: 14 }} pendingText="Registrando…">+ Registrar vistoria</SubmitButton>
        </form>
      </div>

      {inspections.length === 0 && <p className="muted" style={{ fontSize: 13 }}>Nenhuma vistoria registrada ainda.</p>}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {inspections.map((v) => <InspectionCard key={v.id} inspection={v} propertyId={propertyId} />)}
      </div>
    </>
  );
}
