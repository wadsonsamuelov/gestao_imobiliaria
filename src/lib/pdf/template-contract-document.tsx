import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 48, fontSize: 10.5, lineHeight: 1.5, fontFamily: "Helvetica", color: "#211E19" },
  paragraph: { marginBottom: 8, textAlign: "justify" },
  heading: { fontFamily: "Helvetica-Bold", marginTop: 10, marginBottom: 4, fontSize: 10.5, textTransform: "uppercase" },
  signatureBlock: { marginTop: 40, flexDirection: "row", justifyContent: "space-between" },
  signatureLine: { width: "45%", borderTopWidth: 1, borderTopColor: "#211E19", paddingTop: 4, textAlign: "center", fontSize: 9 },
  footer: { position: "absolute", bottom: 24, left: 48, right: 48, fontSize: 7.5, color: "#9A9182", textAlign: "center" },
});

// Linhas em CAIXA ALTA curtas (até 40 caracteres) viram títulos de seção;
// o resto vira parágrafo comum. Simples, mas cobre bem o texto jurídico padrão.
function isHeading(line: string) {
  const trimmed = line.trim();
  return trimmed.length > 0 && trimmed.length <= 45 && trimmed === trimmed.toUpperCase() && /[A-ZÀ-Ú]/.test(trimmed);
}

export function TemplateContractDocument({
  filledBody,
  ownerName,
  tenantName,
}: {
  filledBody: string;
  ownerName: string;
  tenantName: string;
}) {
  const blocks = filledBody.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {blocks.map((block, i) =>
          isHeading(block) ? (
            <Text key={i} style={styles.heading}>{block}</Text>
          ) : (
            <Text key={i} style={styles.paragraph}>{block}</Text>
          )
        )}

        <View style={styles.signatureBlock}>
          <Text style={styles.signatureLine}>{ownerName || "Locador(a)"}{"\n"}Locador(a)</Text>
          <Text style={styles.signatureLine}>{tenantName || "Locatário(a)"}{"\n"}Locatário(a)</Text>
        </View>

        <Text style={styles.footer}>
          Documento gerado automaticamente a partir dos dados cadastrados no sistema em {new Date().toLocaleDateString("pt-BR")}.
          Recomenda-se revisão por profissional habilitado antes da assinatura, conforme a Lei do Inquilinato (Lei nº 8.245/1991).
        </Text>
      </Page>
    </Document>
  );
}
