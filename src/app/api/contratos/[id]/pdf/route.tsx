import { renderToBuffer } from "@react-pdf/renderer";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { TemplateContractDocument } from "@/lib/pdf/template-contract-document";
import { buildPlaceholderData, fillTemplate, BUILTIN_TEMPLATE_BODY } from "@/lib/pdf/contract-template";

export const runtime = "nodejs";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();

  const { data: contract, error } = await supabase
    .from("contracts")
    .select("*, properties(code, title, address), tenants(name, document), owners(name, document), contract_templates(body)")
    .eq("id", params.id)
    .single();

  if (error || !contract) {
    return NextResponse.json({ error: "Contrato não encontrado" }, { status: 404 });
  }

  let templateBody: string | undefined = (contract as any).contract_templates?.body;

  if (!templateBody) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { data: profile } = await supabase.from("profiles").select("organization_id").eq("id", user!.id).single();
    if (profile?.organization_id) {
      const { data: defaultTemplate } = await supabase
        .from("contract_templates")
        .select("body")
        .eq("organization_id", profile.organization_id)
        .eq("is_default", true)
        .maybeSingle();
      templateBody = defaultTemplate?.body;
    }
  }

  const body = templateBody ?? BUILTIN_TEMPLATE_BODY;
  const data = buildPlaceholderData(contract);
  const filledBody = fillTemplate(body, data);

  const buffer = await renderToBuffer(
    <TemplateContractDocument filledBody={filledBody} ownerName={data.locador_nome} tenantName={data.locatario_nome} />
  );

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="contrato-${contract.properties?.code ?? contract.id}.pdf"`,
    },
  });
}
