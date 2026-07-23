import { renderToBuffer } from "@react-pdf/renderer";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ContractDocument } from "@/lib/pdf/contract-document";

export const runtime = "nodejs";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();

  const { data: contract, error } = await supabase
    .from("contracts")
    .select("*, properties(code, title, address), tenants(name, document), owners(name, document)")
    .eq("id", params.id)
    .single();

  if (error || !contract) {
    return NextResponse.json({ error: "Contrato não encontrado" }, { status: 404 });
  }

  const buffer = await renderToBuffer(<ContractDocument contract={contract} />);

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="contrato-${contract.properties?.code ?? contract.id}.pdf"`,
    },
  });
}
