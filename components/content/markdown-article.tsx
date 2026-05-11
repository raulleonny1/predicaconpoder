import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type MarkdownArticleProps = {
  markdown: string;
  className?: string;
};

const components: Components = {
  h1: ({ children, ...props }) => (
    <h1 className="mt-10 text-2xl font-extrabold tracking-tight text-ink first:mt-0 sm:text-3xl" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2 className="mt-10 border-b border-border-subtle pb-2 text-xl font-bold text-ink sm:text-2xl" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 className="mt-8 text-lg font-bold text-ink sm:text-xl" {...props}>
      {children}
    </h3>
  ),
  p: ({ children, ...props }) => (
    <p className="mt-4 text-base leading-relaxed text-muted first:mt-0 sm:text-[1.05rem]" {...props}>
      {children}
    </p>
  ),
  ul: ({ children, ...props }) => (
    <ul className="mt-4 list-disc space-y-2 pl-5 text-muted marker:text-accent" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol className="mt-4 list-decimal space-y-2 pl-5 text-muted marker:font-semibold marker:text-accent" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li className="leading-relaxed" {...props}>
      {children}
    </li>
  ),
  strong: ({ children, ...props }) => (
    <strong className="font-semibold text-ink" {...props}>
      {children}
    </strong>
  ),
  hr: () => <hr className="my-10 border-border-subtle" />,
  blockquote: ({ children, ...props }) => (
    <blockquote
      className="mt-4 border-l-4 border-accent/40 bg-indigo-50/50 py-3 pl-4 pr-4 text-muted italic sm:rounded-r-lg"
      {...props}
    >
      {children}
    </blockquote>
  ),
  img: ({ alt, ...props }) => (
    <span className="mt-8 block overflow-hidden rounded-2xl border border-border-subtle shadow-sm">
      <img alt={alt ?? ""} className="w-full object-cover" loading="lazy" {...props} />
    </span>
  ),
};

export function MarkdownArticle({ markdown, className }: MarkdownArticleProps) {
  return (
    <div className={className}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
