import { Container } from "@/components/ui/container";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: React.ReactNode;
  children?: React.ReactNode;
};

export function PageHeader({ eyebrow, title, description, children }: PageHeaderProps) {
  return (
    <div className="relative overflow-hidden border-b border-border-subtle bg-surface">
      <div className="pointer-events-none absolute inset-0 bg-dot-grid opacity-50" aria-hidden />
      <div
        className="pointer-events-none absolute -right-24 top-0 h-56 w-56 rounded-full bg-accent/15 blur-3xl max-sm:h-44 max-sm:w-44"
        aria-hidden
      />
      <Container className="relative py-10 sm:py-14 lg:py-20">
        <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-accent sm:text-xs">{eyebrow}</p>
        <h1 className="mt-2 text-pretty font-heading text-3xl font-extrabold tracking-tight text-ink sm:mt-3 sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        <div className="mt-3 max-w-2xl text-pretty text-base leading-relaxed text-muted sm:mt-4 sm:text-lg">
          {description}
        </div>
        {children}
      </Container>
    </div>
  );
}
