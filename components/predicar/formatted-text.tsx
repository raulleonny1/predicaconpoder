import { Fragment } from "react";
import { parseRichText } from "@/lib/sermon/rich-text";
import { cn } from "@/lib/utils";

export function FormattedText({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  const segments = parseRichText(content);

  return (
    <span className={className}>
      {segments.map((segment, i) => {
        if (!segment.text) return null;

        const lines = segment.text.split("\n");
        return (
          <Fragment key={i}>
            {lines.map((line, lineIndex) => (
              <Fragment key={lineIndex}>
                {lineIndex > 0 ? <br /> : null}
                <span
                  className={cn(
                    segment.underline && "underline decoration-2 underline-offset-[0.15em]",
                    segment.lineBelow && "border-b-[0.12em] border-current pb-[0.08em]",
                  )}
                >
                  {line}
                </span>
              </Fragment>
            ))}
          </Fragment>
        );
      })}
    </span>
  );
}
