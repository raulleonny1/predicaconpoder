/** Marcado inline guardado en el contenido del bloque. */
export const RICH_TAGS = {
  underline: { open: "<u>", close: "</u>", label: "Subrayado" },
  lineBelow: { open: "<l>", close: "</l>", label: "Línea abajo" },
} as const;

export type RichFormatKey = keyof typeof RICH_TAGS;

export function wrapTextSelection(
  content: string,
  selectionStart: number,
  selectionEnd: number,
  open: string,
  close: string,
): { value: string; selectionStart: number; selectionEnd: number } {
  const selected = content.slice(selectionStart, selectionEnd);
  const wrapped = `${open}${selected}${close}`;
  const value = content.slice(0, selectionStart) + wrapped + content.slice(selectionEnd);
  const cursorStart = selectionStart + open.length;
  const cursorEnd = cursorStart + selected.length;
  return { value, selectionStart: cursorStart, selectionEnd: cursorEnd };
}

export function uppercaseTextSelection(
  content: string,
  selectionStart: number,
  selectionEnd: number,
): { value: string; selectionStart: number; selectionEnd: number } {
  const selected = content.slice(selectionStart, selectionEnd);
  const upper = selected.toLocaleUpperCase("es");
  const value = content.slice(0, selectionStart) + upper + content.slice(selectionEnd);
  return {
    value,
    selectionStart,
    selectionEnd: selectionStart + upper.length,
  };
}

export function stripRichTags(text: string): string {
  return text.replace(/<\/?[ul]>/g, "");
}

type RichSegment = {
  text: string;
  underline?: boolean;
  lineBelow?: boolean;
};

export function parseRichText(content: string): RichSegment[] {
  const segments: RichSegment[] = [];
  const pattern = /<(u|l)>([\s\S]*?)<\/\1>/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(content)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ text: content.slice(lastIndex, match.index) });
    }
    const tag = match[1] as "u" | "l";
    segments.push({
      text: match[2],
      underline: tag === "u",
      lineBelow: tag === "l",
    });
    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < content.length) {
    segments.push({ text: content.slice(lastIndex) });
  }

  if (segments.length === 0) {
    segments.push({ text: content });
  }

  return segments;
}
