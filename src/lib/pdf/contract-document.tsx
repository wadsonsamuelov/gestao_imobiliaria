import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 48, fontSize: 10.5, lineHeight: 1.5, fontFamily: "Helvetica", color: "#211E19" },
  title: { fontSize: 15, fontFamily: "Helvetica-Bold", textAlign: "center", marginBottom: 4, textTransform: "uppercase" },
  subtitle: { fontSize: 9, textAlign: "center", marginBottom: 20, color: "#6B6252" },
  sectionTitle: { fontSize: 10.5, fontFamily: "Helvetica-Bold", marginTop: 16, marginBottom: 6, textTransform: "uppercase" },
  row: { flexDirection: "row", marginBottom: 3 },
  label: { fontFamily: "Helvetica-Bold", width: 140 },
  value: { flex: 1 },
  paragraph: { marginBottom: 8, textAlign: "justify" },
  clause: { marginBottom: 6, textAlign: "justify" },
  clauseNumber: { fontFamily: "Helvetica-Bold" },
  signatureBlock: { marginTop: 56, flexDirection: "row", justifyContent: "space-between" },
  signatureLine: { width: "45%", borderTopWidth: 1, borderTopColor: "#211E19", paddingTop: 4, textAlign: "center", fontSize: 9 },
  footer: { position: "absolute", bottom: 24, left: 48, right: 48, fontSize: 7.5, color: "#9A9182", textAlign: "center" },
});

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

export function ContractDocument({ contract }: { contract: any }) {
  const property = contract.properties;
  const tenant = contract.tenants;
  const owner = contract.owners;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Contrato de Locação</Text>
        <Text style={styles.subtitle}>Gerado automaticamente pelo Cadastre — Administração Imobiliária</Text>

        <Text style={styles.sectionTitle}>Partes</Text>
        <View style={styles.row}><Text style={styles.label}>Locador(a)</Text><Text style={styles.value}>{owner?.name ?? "—"}{owner?.document ? ` — CPF/CNPJ ${owner.document}` : ""}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Locatário(a)</Text><Text style={styles.value}>{tenant?.name ?? "—"}{tenant?.document ? ` — CPF/CNPJ ${tenant.document}` : ""}</Text></View>
        {contract.guarantee_type === "fiador" && contract.guarantor_name && (
          <View style={styles.row}><Text style={styles.label}>Fiador</Text><Text style={styles.value}>{contract.guarantor_name}</Text></View>
        )}

        <Text style={styles.sectionTitle}>Imóvel objeto do contrato</Text>
        <View style={styles.row}><Text style={styles.label}>Identificação</Text><Text style={styles.value}>{property?.title} ({property?.code})</Text></View>
        <View style={styles.row}><Text style={styles.label}>Endereço</Text><Text style={styles.value}>{property?.address}</Text></View>

        <Text style={styles.sectionTitle}>Condições financeiras</Text>
        <View style={styles.row}><Text style={styles.label}>Valor do aluguel</Text><Text style={styles.value}>{fmtBRL(contract.rent_value)} mensais</Text></View>
        <View style={styles.row}><Text style={styles.label}>Dia de vencimento</Text><Text style={styles.value}>Dia {contract.due_day} de cada mês</Text></View>
        <View style={styles.row}><Text style={styles.label}>Início da locação</Text><Text style={styles.value}>{fmtDate(contract.start_date)}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Prazo</Text><Text style={styles.value}>{contract.duration_months} meses</Text></View>
        <View style={styles.row}><Text style={styles.label}>Índice de reajuste</Text><Text style={styles.value}>{contract.adjustment_index}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Multa por atraso</Text><Text style={styles.value}>{contract.late_fee_pct}% sobre o valor do aluguel</Text></View>
        <View style={styles.row}><Text style={styles.label}>Juros de mora</Text><Text style={styles.value}>{contract.interest_pct_month}% ao mês, pro rata die</Text></View>
        <View style={styles.row}><Text style={styles.label}>Garantia locatícia</Text><Text style={styles.value}>{GUARANTEE_LABEL[contract.guarantee_type] ?? contract.guarantee_type}</Text></View>

        <Text style={styles.sectionTitle}>Cláusulas gerais</Text>
        <Text style={styles.clause}><Text style={styles.clauseNumber}>1. </Text>O(a) LOCATÁRIO(A) obriga-se a pagar pontualmente o aluguel e encargos até a data de vencimento estipulada, sob pena de incidência da multa e dos juros de mora indicados acima.</Text>
        <Text style={styles.clause}><Text style={styles.clauseNumber}>2. </Text>O(a) LOCATÁRIO(A) obriga-se a zelar pela conservação do imóvel, respondendo por danos que não decorram do uso normal.</Text>
        <Text style={styles.clause}><Text style={styles.clauseNumber}>3. </Text>Quaisquer avarias, sinistros ou necessidades de reparo deverão ser comunicados ao(à) LOCADOR(A) ou à administradora imediatamente.</Text>
        <Text style={styles.clause}><Text style={styles.clauseNumber}>4. </Text>É vedada a sublocação, cessão ou empréstimo do imóvel, no todo ou em parte, sem autorização expressa e por escrito do(a) LOCADOR(A).</Text>
        <Text style={styles.clause}><Text style={styles.clauseNumber}>5. </Text>O imóvel poderá ser vistoriado periodicamente pelo(a) LOCADOR(A) ou pela administradora, mediante aviso prévio razoável.</Text>
        <Text style={styles.clause}><Text style={styles.clauseNumber}>6. </Text>Ao término da locação, o imóvel deverá ser devolvido nas mesmas condições registradas no laudo de vistoria de entrada, ressalvado o desgaste natural pelo uso regular.</Text>
        {contract.special_clauses && (
          <Text style={styles.clause}><Text style={styles.clauseNumber}>7. </Text>Cláusulas particulares: {contract.special_clauses}</Text>
        )}

        <Text style={styles.paragraph}>
          E, por estarem assim justas e contratadas, as partes assinam o presente instrumento em duas vias de igual teor.
        </Text>

        <View style={styles.signatureBlock}>
          <Text style={styles.signatureLine}>{owner?.name ?? "Locador(a)"}{"\n"}Locador(a)</Text>
          <Text style={styles.signatureLine}>{tenant?.name ?? "Locatário(a)"}{"\n"}Locatário(a)</Text>
        </View>

        <Text style={styles.footer}>
          Documento gerado automaticamente a partir dos dados cadastrados no sistema em {new Date().toLocaleDateString("pt-BR")}.
          Recomenda-se revisão por profissional habilitado antes da assinatura, conforme a Lei do Inquilinato (Lei nº 8.245/1991).
        </Text>
      </Page>
    </Document>
  );
}
