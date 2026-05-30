import { NextRequest, NextResponse } from "next/server";
import { structureTextIntoBlocks } from "@/lib/sermon/document-parser";
import { detectImportType, extractTextFromBuffer } from "@/lib/sermon/extract-document-text";
import { createBlockId } from "@/lib/sermon/types";
import type { SermonBlock } from "@/lib/sermon/types";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: "No se recibió ningún archivo." }, { status: 400 });
    }

    const fileName = "name" in file && typeof file.name === "string" ? file.name : "documento";
    const mimeType = file.type || "";
    const type = detectImportType(fileName, mimeType);

    if (!type) {
      return NextResponse.json(
        {
          error:
            "Formato no soportado. Usa .docx o .pdf (.doc antiguo: guárdalo como .docx en Word).",
        },
        { status: 400 },
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const rawText = await extractTextFromBuffer(buffer, type);

    if (!rawText.trim()) {
      return NextResponse.json(
        { error: "No se extrajo texto. Prueba otro archivo o exporta el PDF con texto seleccionable." },
        { status: 422 },
      );
    }

    const parsed = structureTextIntoBlocks(rawText, fileName);
    const blocks: SermonBlock[] = parsed.blocks.map((draft) => ({
      id: createBlockId(),
      type: draft.type,
      content: draft.content,
      showOnStage: draft.showOnStage,
    }));

    return NextResponse.json({
      title: parsed.title,
      blocks,
      summary: parsed.summary,
      charCount: rawText.length,
      paragraphCount: parsed.blocks.filter((b) => b.type === "text" || b.type === "note").length,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Error al procesar el archivo.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
