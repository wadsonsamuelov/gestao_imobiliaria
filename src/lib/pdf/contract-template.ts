// Lista de placeholders disponíveis para quem for escrever um modelo de contrato.
// Mostrada na tela de edição, e usada aqui mesmo para substituir pelos dados reais.
export const CONTRACT_PLACEHOLDERS: { token: string; description: string }[] = [
  { token: "{{locador_nome}}", description: "Nome do proprietário" },
  { token: "{{locador_documento}}", description: "CPF/CNPJ do proprietário" },
  { token: "{{locatario_nome}}", description: "Nome do inquilino" },
  { token: "{{locatario_documento}}", description: "CPF/CNPJ do inquilino" },
  { token: "{{fiador_bloco}}", description: "Linha do fiador (some sozinha se não houver fiador)" },
  { token: "{{imovel_titulo}}", description: "Nome/título do imóvel" },
  { token: "{{imovel_codigo}}", description: "Código do imóvel" },
  { token: "{{imovel_endereco}}", description: "Endereço do imóvel" },
  { token: "{{valor_aluguel}}", description: "Valor mensal do aluguel, formatado (R$)" },
  { token: "{{dia_vencimento}}", description: "Dia do vencimento" },
  { token: "{{data_inicio}}", description: "Data de início da locação" },
  { token: "{{prazo_meses}}", description: "Prazo do contrato em meses" },
  { token: "{{indice_reajuste}}", description: "Índice de reajuste (IGPM, IPCA…)" },
  { token: "{{multa_atraso}}", description: "Percentual de multa por atraso" },
  { token: "{{juros_mora}}", description: "Percentual de juros de mora ao mês" },
  { token: "{{garantia}}", description: "Tipo de garantia locatícia" },
  { token: "{{clausulas_particulares_bloco}}", description: "Cláusulas particulares (some sozinha se não houver)" },
  { token: "{{data_hoje}}", description: "Data de hoje, por extenso curto" },
];

const GUARANTEE_LABEL: Record<string, string> = {
  caucao: "Caução",
  fiador: "Fiador",
  seguro_fianca: "Seguro-fiança",
  titulo_capitalizacao: "Título de capitalização",
};

function fmtBRL(n: number) {
  return Number(n ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
function fmtDate(d: string) {
  return new Date(d + "T00:00:00").toLocaleDateString("pt-BR");
}

export function buildPlaceholderData(contract: any): Record<string, string> {
  const property = contract.properties;
  const tenant = contract.tenants;
  const owner = contract.owners;

  return {
    locador_nome: owner?.name ?? "—",
    locador_documento: owner?.document ? `— CPF/CNPJ ${owner.document}` : "",
    locatario_nome: tenant?.name ?? "—",
    locatario_documento: tenant?.document ? `— CPF/CNPJ ${tenant.document}` : "",
    fiador_bloco:
      contract.guarantee_type === "fiador" && contract.guarantor_name
        ? `Fiador: ${contract.guarantor_name}`
        : "",
    imovel_titulo: property?.title ?? "—",
    imovel_codigo: property?.code ?? "—",
    imovel_endereco: property?.address ?? "—",
    valor_aluguel: fmtBRL(contract.rent_value),
    dia_vencimento: String(contract.due_day ?? "—"),
    data_inicio: contract.start_date ? fmtDate(contract.start_date) : "—",
    prazo_meses: String(contract.duration_months ?? "—"),
    indice_reajuste: contract.adjustment_index ?? "—",
    multa_atraso: `${contract.late_fee_pct ?? 0}%`,
    juros_mora: `${contract.interest_pct_month ?? 0}% ao mês`,
    garantia: GUARANTEE_LABEL[contract.guarantee_type] ?? contract.guarantee_type ?? "—",
    clausulas_particulares_bloco: contract.special_clauses ? `Cláusulas particulares: ${contract.special_clauses}` : "",
    data_hoje: new Date().toLocaleDateString("pt-BR"),
  };
}

export function fillTemplate(body: string, data: Record<string, string>): string {
  return body.replace(/\{\{(\w+)\}\}/g, (match, key) => (key in data ? data[key] : match));
}

// Texto usado quando a organização ainda não criou nenhum modelo próprio —
// garante que "Gerar PDF" sempre funciona, mesmo sem configuração prévia.
export const BUILTIN_TEMPLATE_BODY = `CONTRATO DE LOCAÇÃO

PARTES
Locador(a): {{locador_nome}} {{locador_documento}}
Locatário(a): {{locatario_nome}} {{locatario_documento}}
{{fiador_bloco}}

IMÓVEL OBJETO DO CONTRATO
Identificação: {{imovel_titulo}} ({{imovel_codigo}})
Endereço: {{imovel_endereco}}

CONDIÇÕES FINANCEIRAS
Valor do aluguel: {{valor_aluguel}} mensais
Dia de vencimento: dia {{dia_vencimento}} de cada mês
Início da locação: {{data_inicio}}
Prazo: {{prazo_meses}} meses
Índice de reajuste: {{indice_reajuste}}
Multa por atraso: {{multa_atraso}} sobre o valor do aluguel
Juros de mora: {{juros_mora}}, pro rata die
Garantia locatícia: {{garantia}}

CLÁUSULAS GERAIS
1. O(a) LOCATÁRIO(A) obriga-se a pagar pontualmente o aluguel e encargos até a data de vencimento estipulada, sob pena de incidência da multa e dos juros de mora indicados acima.
2. O(a) LOCATÁRIO(A) obriga-se a zelar pela conservação do imóvel, respondendo por danos que não decorram do uso normal.
3. Quaisquer avarias, sinistros ou necessidades de reparo deverão ser comunicados ao(à) LOCADOR(A) ou à administradora imediatamente.
4. É vedada a sublocação, cessão ou empréstimo do imóvel, no todo ou em parte, sem autorização expressa e por escrito do(a) LOCADOR(A).
5. O imóvel poderá ser vistoriado periodicamente pelo(a) LOCADOR(A) ou pela administradora, mediante aviso prévio razoável.
6. Ao término da locação, o imóvel deverá ser devolvido nas mesmas condições registradas no laudo de vistoria de entrada, ressalvado o desgaste natural pelo uso regular.
{{clausulas_particulares_bloco}}

E, por estarem assim justas e contratadas, as partes assinam o presente instrumento em duas vias de igual teor.`;
