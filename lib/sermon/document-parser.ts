import { looksLikeReference } from "@/lib/bible/parse-reference";
import type { SermonBlockType } from "@/lib/sermon/types";

export type SectionRole =
  | "title"
  | "intro"
  | "body"
  | "point"
  | "conclusion"
  | "application"
  | "scripture"
  | "note";

export type ParsedBlockDraft = {
  type: SermonBlockType;
  content: string;
  showOnStage: boolean;
  sectionRole: SectionRole;
  sectionLabel: string;
};

export type ParsedDocument = {
  title: string;
  blocks: ParsedBlockDraft[];
  summary: { role: SectionRole; label: string; count: number }[];
};

const SECTION_KEYWORDS: { pattern: RegExp; role: SectionRole; label: string }[] = [
  { pattern: /^(introducci[oó]n|intro|apertura|saludo|bienvenida)\b/i, role: "intro", label: "Introducción" },
  { pattern: /^(conclusi[oó]n|cierre|final|invitaci[oó]n|llamado)\b/i, role: "conclusion", label: "Conclusión" },
  { pattern: /^(aplicaci[oó]n|respuesta|decisi[oó]n)\b/i, role: "application", label: "Aplicación" },
  {
    pattern: /^(desarrollo|cuerpo|mensaje(\s+principal)?|exposici[oó]n|ense[nñ]anza)\b/i,
    role: "body",
    label: "Desarrollo",
  },
  { pattern: /^(texto|lectura|pasaje|escritura)\b/i, role: "scripture", label: "Texto bíblico" },
  { pattern: /^(nota|notas|recordatorio)\b/i, role: "note", label: "Nota" },
];

const NUMBERED_HEADING = /^(\d+[\.\):\-–]\s*|[IVXLC]+[\.\):\-–]\s*|punto\s+\d+\s*[-–:]?\s*)/i;

const SCRIPTURE_LINE =
  /^["«"]?(\s*[1-3]?\s*)?[A-Za-zÁÉÍÓÚáéíóúñü.]+(\s+\d+)?\s*:\s*\d+(\s*[-–]\s*\d+)?["»"]?\.?\s*$/;

export function normalizeDocumentText(raw: string): string {
  return raw
    .replace(/\r\n/g, "\n")
    .replace(/\u00a0/g, " ")
    .replace(/\t/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function splitParagraphs(text: string): string[] {
  const chunks = text.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
  const result: string[] = [];

  for (const chunk of chunks) {
    const lines = chunk.split("\n").map((l) => l.trim()).filter(Boolean);
    if (lines.length <= 1) {
      result.push(chunk);
      continue;
    }

    let buffer: string[] = [];
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const next = lines[i + 1];
      buffer.push(line);

      const lineIsHeading = isHeadingLike(line, line);
      const nextIsHeading = next ? isHeadingLike(next, next) : false;

      if (lineIsHeading && buffer.length === 1) {
        result.push(line);
        buffer = [];
        continue;
      }

      if (nextIsHeading && buffer.length > 0) {
        const body = buffer.join("\n").trim();
        if (body.length > line.length) {
          result.push(body);
        }
        buffer = [];
      }
    }
    if (buffer.length) result.push(buffer.join("\n").trim());
  }

  return result.filter((p) => p.length > 1);
}

function isMostlyUppercase(s: string): boolean {
  const letters = s.replace(/[^a-zA-ZÁÉÍÓÚáéíóúñÑ]/g, "");
  if (letters.length < 4) return false;
  const upper = letters.replace(/[^A-ZÁÉÍÓÚÑ]/g, "").length;
  return upper / letters.length >= 0.75;
}

function isHeadingLike(paragraph: string, firstLine: string): boolean {
  const line = firstLine.trim();
  if (line.length < 3 || line.length > 120) return false;
  if (line.endsWith(".") && line.length > 60) return false;
  if (line.split(/\s+/).length > 14) return false;

  if (SECTION_KEYWORDS.some((s) => s.pattern.test(line))) return true;
  if (NUMBERED_HEADING.test(line)) return true;
  if (isMostlyUppercase(line)) return true;
  if (paragraph === line && !line.endsWith(".") && !line.endsWith(",") && line.length < 70) return true;

  return false;
}

function detectSectionMeta(firstLine: string): { role: SectionRole; label: string } | null {
  for (const s of SECTION_KEYWORDS) {
    if (s.pattern.test(firstLine)) return { role: s.role, label: s.label };
  }
  const numMatch = firstLine.match(NUMBERED_HEADING);
  if (numMatch) {
    const cleaned = firstLine.replace(NUMBERED_HEADING, "").trim() || firstLine;
    return { role: "point", label: cleaned.slice(0, 60) || "Punto" };
  }
  return null;
}

function isNoteParagraph(p: string): boolean {
  const first = p.split("\n")[0].trim();
  return /^(nota|notas|nb|recordatorio)\s*:/i.test(first) || (/^\([\s\S]*\)$/.test(p) && p.length < 300);
}

function isScriptureParagraph(p: string): boolean {
  const first = p.split("\n")[0].trim();
  if (SCRIPTURE_LINE.test(first)) return true;
  if (looksLikeReference(first) && first.length < 80) return true;
  return false;
}

function guessTitle(text: string, paragraphs: string[]): string {
  const first = paragraphs[0];
  if (!first) return "Mensaje importado";

  const firstLine = first.split("\n")[0].trim();
  if (isHeadingLike(first, firstLine) && firstLine.length < 100 && !SECTION_KEYWORDS.some((s) => s.pattern.test(firstLine))) {
    return firstLine;
  }

  const short = firstLine.length < 80 ? firstLine : firstLine.slice(0, 77) + "…";
  return short || "Mensaje importado";
}

function inferIntroEndIndex(paragraphs: string[]): number {
  if (paragraphs.length <= 2) return Math.min(1, paragraphs.length);

  const totalChars = paragraphs.reduce((n, p) => n + p.length, 0);
  let chars = 0;
  let introEnd = 0;

  for (let i = 0; i < paragraphs.length; i++) {
    const p = paragraphs[i];
    const firstLine = p.split("\n")[0].trim();

    if (i > 0 && (detectSectionMeta(firstLine) || NUMBERED_HEADING.test(firstLine) || isHeadingLike(p, firstLine))) {
      break;
    }

    chars += p.length;
    introEnd = i + 1;
    if (chars >= totalChars * 0.22 && i >= 1) break;
    if (i >= 2 && chars >= totalChars * 0.15) break;
  }

  return Math.min(introEnd, 3);
}

function inferConclusionStart(paragraphs: string[], introEnd: number): number {
  if (paragraphs.length < 4) return paragraphs.length;

  const tailStart = Math.floor(paragraphs.length * 0.78);
  for (let i = tailStart; i < paragraphs.length; i++) {
    const firstLine = paragraphs[i].split("\n")[0].trim();
    const meta = detectSectionMeta(firstLine);
    if (meta?.role === "conclusion" || meta?.role === "application") return i;
  }

  const last = paragraphs.length - 1;
  const lastFirst = paragraphs[last].split("\n")[0].trim();
  if (last > introEnd + 2 && paragraphs[last].length < 600 && !NUMBERED_HEADING.test(lastFirst)) {
    return last;
  }

  return paragraphs.length;
}

export function structureTextIntoBlocks(rawText: string, fileName?: string): ParsedDocument {
  const text = normalizeDocumentText(rawText);
  const paragraphs = splitParagraphs(text);
  const titleFromFile = fileName?.replace(/\.(docx?|pdf)$/i, "").replace(/[_-]+/g, " ").trim();

  let title = guessTitle(text, paragraphs);
  if (titleFromFile && titleFromFile.length > 3 && title === paragraphs[0]?.split("\n")[0]?.slice(0, 80)) {
    title = titleFromFile;
  } else if (titleFromFile && title.length < 10) {
    title = titleFromFile;
  }

  const introEnd = inferIntroEndIndex(paragraphs);
  const conclusionStart = inferConclusionStart(paragraphs, introEnd);

  const blocks: ParsedBlockDraft[] = [];
  let currentRole: SectionRole = "intro";
  let pointCounter = 0;

  const pushHeading = (content: string, role: SectionRole, label: string) => {
    blocks.push({
      type: "heading",
      content,
      showOnStage: role !== "note",
      sectionRole: role,
      sectionLabel: label,
    });
  };

  const pushText = (content: string, role: SectionRole, label: string, onStage = true) => {
    blocks.push({
      type: role === "note" ? "note" : "text",
      content,
      showOnStage: onStage && role !== "note",
      sectionRole: role,
      sectionLabel: label,
    });
  };

  if (introEnd > 0) {
    pushHeading("Introducción", "intro", "Introducción");
    for (let i = 0; i < introEnd; i++) {
      const p = paragraphs[i];
      const firstLine = p.split("\n")[0].trim();
      if (i === 0 && firstLine === title && p === firstLine) continue;
      if (isNoteParagraph(p)) {
        pushText(p.replace(/^(nota|notas)\s*:\s*/i, ""), "note", "Nota", false);
      } else if (isScriptureParagraph(p)) {
        pushHeading("Texto bíblico", "scripture", "Escritura");
        pushText(p, "scripture", "Escritura");
      } else {
        pushText(p, "intro", "Introducción");
      }
    }
  }

  for (let i = introEnd; i < conclusionStart; i++) {
    const p = paragraphs[i];
    const firstLine = p.split("\n")[0].trim();
    const rest = p.slice(firstLine.length).trim();

    if (isNoteParagraph(p)) {
      pushText(p.replace(/^(nota|notas)\s*:\s*/i, ""), "note", "Nota", false);
      continue;
    }

    const meta = detectSectionMeta(firstLine);
    if (meta) {
      currentRole = meta.role;
      if (meta.role === "point") pointCounter++;
      const headingText = firstLine.replace(NUMBERED_HEADING, "").trim() || meta.label;
      pushHeading(headingText, meta.role, meta.label);
      if (rest) pushText(rest, meta.role, meta.label, meta.role !== "note");
      continue;
    }

    if (isHeadingLike(p, firstLine)) {
      pointCounter++;
      currentRole = "point";
      pushHeading(firstLine.replace(NUMBERED_HEADING, "").trim() || `Punto ${pointCounter}`, "point", `Punto ${pointCounter}`);
      if (rest) pushText(rest, "body", "Desarrollo");
      else currentRole = "body";
      continue;
    }

    if (isScriptureParagraph(p)) {
      pushHeading("Texto bíblico", "scripture", "Escritura");
      pushText(p, "scripture", "Escritura");
      continue;
    }

    if (currentRole === "intro") currentRole = "body";
    if (blocks.length === 0 || blocks[blocks.length - 1].sectionRole !== "body") {
      const hasBodyHeading = blocks.some((b) => b.sectionRole === "body" && b.type === "heading");
      if (!hasBodyHeading && i >= introEnd) {
        pushHeading("Desarrollo", "body", "Desarrollo");
      }
    }
    pushText(p, currentRole === "point" ? "point" : "body", currentRole === "point" ? `Punto ${pointCounter}` : "Desarrollo");
  }

  if (conclusionStart < paragraphs.length) {
    const firstTail = paragraphs[conclusionStart].split("\n")[0].trim();
    const tailMeta = detectSectionMeta(firstTail);
    const conclusionLabel = tailMeta?.label ?? "Conclusión";

    if (!tailMeta || tailMeta.role === "conclusion" || tailMeta.role === "application") {
      pushHeading(conclusionLabel, tailMeta?.role ?? "conclusion", conclusionLabel);
    }

    for (let i = conclusionStart; i < paragraphs.length; i++) {
      const p = paragraphs[i];
      const firstLine = p.split("\n")[0].trim();
      const rest = p.slice(firstLine.length).trim();

      if (i === conclusionStart && tailMeta && isHeadingLike(p, firstLine)) {
        if (rest) pushText(rest, tailMeta.role, conclusionLabel);
        continue;
      }

      if (isNoteParagraph(p)) {
        pushText(p.replace(/^(nota|notas)\s*:\s*/i, ""), "note", "Nota", false);
        continue;
      }

      pushText(p, "conclusion", conclusionLabel);
    }
  }

  if (blocks.length === 0) {
    blocks.push({
      type: "text",
      content: text.slice(0, 8000) || "Documento vacío",
      showOnStage: true,
      sectionRole: "body",
      sectionLabel: "Contenido",
    });
  }

  const summaryMap = new Map<string, { role: SectionRole; label: string; count: number }>();
  for (const b of blocks) {
    const key = `${b.sectionRole}:${b.sectionLabel}`;
    const prev = summaryMap.get(key);
    if (prev) prev.count++;
    else summaryMap.set(key, { role: b.sectionRole, label: b.sectionLabel, count: 1 });
  }

  return {
    title,
    blocks,
    summary: Array.from(summaryMap.values()),
  };
}
