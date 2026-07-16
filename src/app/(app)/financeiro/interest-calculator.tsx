"use client";

import { useState } from "react";

export function InterestCalculator() {
  const [valor, setValor] = useState(4100);
  const [dias, setDias] = useState(9);
  const [multaPct, setMultaPct] = useState(2);
  const [jurosPct, setJurosPct] = useState(1);
  const [result, setResult] = useState<{ multa: number; juros: number; total: number } | null>(null);
  const fmt = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  function calcular() {
    const multa = valor * (multaPct / 100);
    const juros = valor * (jurosPct / 100 / 30) * dias;
    setResult({ multa, juros, total: valor + multa + juros });
  }

  return (
    <div className="plan-card calc-box">
      <span className="card-crest" />
      <div className="form-grid">
        <div className="field"><label>Valor do aluguel</label><input type="number" value={valor} onChange={(e) => setValor(Number(e.target.value))} /></div>
        <div className="field"><label>Dias de atraso</label><input type="number" value={dias} onChange={(e) => setDias(Number(e.target.value))} /></div>
        <div className="field"><label>Multa contratual (%)</label><input type="number" value={multaPct} onChange={(e) => setMultaPct(Number(e.target.value))} /></div>
        <div className="field"><label>Juros de mora (% a.m.)</label><input type="number" value={jurosPct} onChange={(e) => setJurosPct(Number(e.target.value))} /></div>
      </div>
      <button className="btn" style={{ marginTop: 16 }} onClick={calcular}>Calcular valor atualizado</button>
      <div className="calc-result">
        <div><div className="r-label">MULTA</div><div className="r-value mono">{result ? fmt(result.multa) : "—"}</div></div>
        <div><div className="r-label">JUROS</div><div className="r-value mono">{result ? fmt(result.juros) : "—"}</div></div>
        <div><div className="r-label">TOTAL DEVIDO</div><div className="r-value mono">{result ? fmt(result.total) : "—"}</div></div>
      </div>
    </div>
  );
}
