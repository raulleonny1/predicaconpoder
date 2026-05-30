import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";

const MAX_BYTES = 12 * 1024 * 1024;

export type SupportedImportType = "docx" | "pdf";

export function detectImportType(fileName: string, mimeType: string): SupportedImportType | null {
  const lower = fileName.toLowerCase();
  if (lower.endsWith(".docx") || mimeType.includes("wordprocessingml")) return "docx";
  if (lower.endsWith(".pdf") || mimeType === "application/pdf") return "pdf";
  if (lower.endsWith(".doc")) return null;
  return null;
}

export async function extractTextFromBuffer(
  buffer: Buffer,
  type: SupportedImportType,
): Promise<string> {
  if (buffer.length > MAX_BYTES) {
    throw new Error("El archivo supera el límite de 12 MB.");
  }

  if (type === "docx") {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  const parser = new PDFParse({ data: buffer });
  try {
    const result = await parser.getText();
    return result.text;
  } finally {
    await parser.destroy();
  }
}
