"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Tag } from "@/components/ui/tag-stat";
import { SubmitButton } from "@/components/submit-button";
import { updateProperty, deleteProperty } from "../actions";
import { InspectionsPanel } from "./inspections-panel";
import { ContractPanel } from "./contract-panel";

const STATUS_LABEL: Record<string, string> = { ocupado: "Ocupado", vago: "Vago", manutencao: "Manutenção" };
const STATUS_VARIANT: Record<string, "ok" | "brass" | "alert"> = { ocupado: "ok", vago: "brass", manutencao: "alert" };
const fmtDate = (d: string) => new Date(d).toLocaleDateString("pt-BR");

export function PropertyDetailTabs({
  property,
  documents,
  contract,
  inspections,
  history,
  tenants,
}: {
  property: any;
  documents: any[];
  contract: any;
  inspections: any[];
  history: any[];
  tenants: any[];
}) {
  const [tab, setTab] = useState<"ficha" | "contrato" | "vistoria" | "historico">("ficha");
  const [isDeleting, startDelete] = useTransition();
  const router = useRouter();

  function handleDelete() {
    if (confirm(`Excluir o imóvel "${property.title}"? Isso remove também contratos, boletos e histórico ligados a ele. Essa ação não pode ser desfeita.`)) {
      startDelete(() => deleteProperty(property.id));
    }
  }

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 10 }}>
        <div>
          <div className="mono muted" style={{ fontSize: 11 }}>{property.code}</div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontStyle: "italic", fontSize: 27, fontWeight: 600, marginTop: 3 }}>
            {property.title}
          </div>
          <div className="muted" style={{ marginTop: 5 }}>{property.address}</div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <Tag variant={STATUS_VARIANT[property.status] ?? "neutral"}>{STATUS_LABEL[property.status] ?? property.status}</Tag>
          <Link href="/imoveis" className="btn secondary">&larr; Voltar</Link>
          <button className="btn secondary" style={{ borderColor: "var(--terracotta)", color: "var(--terracotta)" }} disabled={isDeleting} onClick={handleDelete}>
            {isDeleting ? "Excluindo…" : "Excluir imóvel"}
          </button>
        </div>
      </div>

      <div className="tabs">
        {(["ficha", "contrato", "vistoria", "historico"] as const).map((t) => (
          <div key={t} className={`tab${tab === t ? " active" : ""}`} onClick={() => setTab(t)}>
            {{ ficha: "Ficha do imóvel", contrato: "Contrato", vistoria: "Vistoria", historico: "Histórico" }[t]}
          </div>
        ))}
      </div>

      {tab === "ficha" && (
        <div className="grid grid-2">
          <div className="plan-card">
            <span className="card-crest" />
            <form action={updateProperty.bind(null, property.id)}>
              <div className="form-grid">
                <div className="field">
                  <label>Tipo de imóvel</label>
                  <select name="type" defaultValue={property.type}>
                    <option value="apartamento">Apartamento</option>
                    <option value="casa">Casa</option>
                    <option value="comercial">Comercial</option>
                    <option value="industrial">Industrial</option>
                    <option value="terreno">Terreno</option>
                  </select>
                </div>
                <div className="field"><label>Área (m²)</label><input name="area_m2" type="number" step="0.01" defaultValue={property.area_m2 ?? ""} /></div>
                <div className="field full"><label>Título</label><input name="title" defaultValue={property.title} required /></div>
                <div className="field full"><label>Endereço</label><input name="address" defaultValue={property.address} /></div>
                <div className="field">
                  <label>Status atual</label>
                  <select name="status" defaultValue={property.status}>
                    <option value="vago">Vago</option>
                    <option value="ocupado">Ocupado</option>
                    <option value="manutencao">Manutenção</option>
                  </select>
                </div>
                <div className="field"><label>Valor de aluguel</label><input name="rent_value" type="number" step="0.01" defaultValue={property.rent_value ?? ""} /></div>
                <div className="field"><label>IPTU</label><input name="iptu_value" type="number" step="0.01" defaultValue={property.iptu_value ?? ""} /></div>
                <div className="field"><label>Condomínio</label><input name="condo_value" type="number" step="0.01" defaultValue={property.condo_value ?? ""} /></div>
              </div>
              <p className="muted" style={{ fontSize: 11.5, marginTop: 10 }}>Proprietário: {property.owners?.name ?? "—"} · Inquilino atual: {contract?.tenants?.name ?? "— vago —"}</p>
              <SubmitButton style={{ marginTop: 14 }} pendingText="Salvando…">Salvar alterações</SubmitButton>
            </form>
          </div>
          <div className="plan-card">
            <span className="card-crest" />
            <div className="small-caps" style={{ fontSize: 11, marginBottom: 14, color: "var(--bronze)" }}>Documentos do imóvel</div>
            <div className="checklist">
              {documents.map((d) => (
                <div className="item" key={d.id}>
                  <div className={`box${d.received ? " checked" : ""}`} />
                  <div className="name">{d.name}</div>
                  <span className="req">{d.required ? "obrigatório" : "opcional"}</span>
                </div>
              ))}
              {documents.length === 0 && <p className="muted" style={{ fontSize: 12.5 }}>Nenhum documento cadastrado para este imóvel.</p>}
            </div>
          </div>
        </div>
      )}

      {tab === "contrato" && <ContractPanel propertyId={property.id} contract={contract} tenants={tenants} />}

      {tab === "vistoria" && <InspectionsPanel propertyId={property.id} inspections={inspections} />}

      {tab === "historico" && (
        <div className="plan-card">
          <span className="card-crest" />
          <div className="small-caps" style={{ fontSize: 11, marginBottom: 14, color: "var(--bronze)" }}>Linha do tempo do imóvel</div>
          {history.length === 0 && <p className="muted" style={{ fontSize: 13 }}>Sem eventos registrados ainda.</p>}
          <div className="timeline">
            {history.map((h) => (
              <div className="tl-item" key={h.id}>
                <div className="tl-dot" />
                <div className="tl-date">{fmtDate(h.event_date)}</div>
                <div className="tl-title">{h.title}</div>
                {h.description && <div className="tl-desc">{h.description}</div>}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
