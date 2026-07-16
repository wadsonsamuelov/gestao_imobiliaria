"use client";

import { useState } from "react";
import Link from "next/link";
import { Tag } from "@/components/ui/tag-stat";

const STATUS_LABEL: Record<string, string> = { ocupado: "Ocupado", vago: "Vago", manutencao: "Manutenção" };
const STATUS_VARIANT: Record<string, "ok" | "brass" | "alert"> = { ocupado: "ok", vago: "brass", manutencao: "alert" };
const fmt = (n: number) => Number(n ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const fmtDate = (d: string) => new Date(d).toLocaleDateString("pt-BR");

export function PropertyDetailTabs({
  property,
  documents,
  contract,
  inspections,
  history,
}: {
  property: any;
  documents: any[];
  contract: any;
  inspections: any[];
  history: any[];
}) {
  const [tab, setTab] = useState<"ficha" | "contrato" | "vistoria" | "historico">("ficha");

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
            <div className="form-grid">
              <div className="field"><label>Tipo de imóvel</label><input defaultValue={property.type} readOnly /></div>
              <div className="field"><label>Área</label><input defaultValue={property.area_m2 ? `${property.area_m2} m²` : "—"} readOnly /></div>
              <div className="field"><label>Proprietário</label><input defaultValue={property.owners?.name ?? "—"} readOnly /></div>
              <div className="field"><label>Inquilino atual</label><input defaultValue={contract?.tenants?.name ?? "— vago —"} readOnly /></div>
              <div className="field"><label>Valor de aluguel</label><input defaultValue={fmt(property.rent_value)} readOnly /></div>
              <div className="field"><label>IPTU</label><input defaultValue={fmt(property.iptu_value)} readOnly /></div>
              <div className="field"><label>Condomínio</label><input defaultValue={property.condo_value ? fmt(property.condo_value) : "—"} readOnly /></div>
              <div className="field"><label>Status atual</label><input defaultValue={STATUS_LABEL[property.status]} readOnly /></div>
            </div>
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

      {tab === "contrato" && (
        <div className="plan-card">
          <span className="card-crest" />
          {contract ? (
            <div className="form-grid">
              <div className="field"><label>Locatário</label><input defaultValue={contract.tenants?.name} readOnly /></div>
              <div className="field"><label>Valor mensal</label><input defaultValue={fmt(contract.rent_value)} readOnly /></div>
              <div className="field"><label>Início</label><input defaultValue={fmtDate(contract.start_date)} readOnly /></div>
              <div className="field"><label>Prazo</label><input defaultValue={`${contract.duration_months} meses`} readOnly /></div>
              <div className="field"><label>Dia de vencimento</label><input defaultValue={contract.due_day} readOnly /></div>
              <div className="field"><label>Índice de reajuste</label><input defaultValue={contract.adjustment_index} readOnly /></div>
              <div className="field"><label>Multa por atraso</label><input defaultValue={`${contract.late_fee_pct}%`} readOnly /></div>
              <div className="field"><label>Juros de mora</label><input defaultValue={`${contract.interest_pct_month}% a.m.`} readOnly /></div>
              <div className="field"><label>Garantia</label><input defaultValue={contract.guarantee_type} readOnly /></div>
            </div>
          ) : (
            <p className="muted">Este imóvel não tem contrato ativo no momento.</p>
          )}
        </div>
      )}

      {tab === "vistoria" && (
        <div className="plan-card">
          <span className="card-crest" />
          <div className="small-caps" style={{ fontSize: 11, marginBottom: 14, color: "var(--bronze)" }}>Vistorias registradas</div>
          {inspections.length === 0 && <p className="muted" style={{ fontSize: 13 }}>Nenhuma vistoria registrada ainda.</p>}
          <div className="timeline">
            {inspections.map((v) => (
              <div className="tl-item" key={v.id}>
                <div className="tl-dot" />
                <div className="tl-date">{fmtDate(v.inspection_date)}</div>
                <div className="tl-title">Vistoria de {v.type} — {v.status}</div>
                <div className="tl-desc">{v.inspection_photos?.length ?? 0} foto(s) anexada(s)</div>
              </div>
            ))}
          </div>
        </div>
      )}

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
