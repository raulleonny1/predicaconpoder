"use client";

import { type RefObject } from "react";
import {
  RICH_TAGS,
  uppercaseTextSelection,
  wrapTextSelection,
  type RichFormatKey,
} from "@/lib/sermon/rich-text";
import { cn } from "@/lib/utils";

type BlockFormatToolbarProps = {
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

function applyToSelection(
  textarea: HTMLTextAreaElement,
  value: string,
  onChange: (value: string) => void,
  transform: (
    content: string,
    start: number,
    end: number,
  ) => { value: string; selectionStart: number; selectionEnd: number },
) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const result = transform(value, start, end);
  onChange(result.value);
  requestAnimationFrame(() => {
    textarea.focus();
    textarea.setSelectionRange(result.selectionStart, result.selectionEnd);
  });
}

export function BlockFormatToolbar({
  textareaRef,
  value,
  onChange,
  className,
}: BlockFormatToolbarProps) {
  const format = (key: RichFormatKey) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const tag = RICH_TAGS[key];
    applyToSelection(textarea, value, onChange, (content, start, end) =>
      wrapTextSelection(content, start, end, tag.open, tag.close),
    );
  };

  const uppercase = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    applyToSelection(textarea, value, onChange, uppercaseTextSelection);
  };

  return (
    <div className={cn("flex flex-wrap items-center gap-1", className)}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          format("underline");
        }}
        className="rounded-lg px-2 py-1 text-xs font-semibold text-muted underline decoration-2 underline-offset-2 transition hover:bg-canvas hover:text-ink"
        title={RICH_TAGS.underline.label}
      >
        U
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          format("lineBelow");
        }}
        className="rounded-lg border-b-2 border-current px-2 py-1 text-xs font-semibold text-muted transition hover:bg-canvas hover:text-ink"
        title={RICH_TAGS.lineBelow.label}
      >
        L
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          uppercase();
        }}
        className="rounded-lg px-2 py-1 text-xs font-bold tracking-wide text-muted transition hover:bg-canvas hover:text-ink"
        title="Mayúsculas"
      >
        AA
      </button>
    </div>
  );
}