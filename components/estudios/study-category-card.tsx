import Link from "next/link";
import { cn } from "@/lib/utils";

type StudyCategoryCardProps = {
  href: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  badge?: string;
  className?: string;
};

export function StudyCategoryCard({ href, title, description, icon, badge, className }: StudyCategoryCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-border-subtle bg-surface p-6 card-shine transition duration-300",
        "touch-manipulation active:scale-[0.99] sm:hover:-translate-y-1 sm:hover:border-accent/30",
        className,
      )}
    >
      {badge ? (
        <span className="mb-4 inline-flex w-fit rounded-lg bg-indigo-50 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-accent">
          {badge}
        </span>
      ) : null}
      <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 text-accent ring-1 ring-inset ring-indigo-100 transition group-hover:from-indigo-100 group-hover:to-violet-100">
        {icon}
      </span>
      <h2 className="mt-5 text-pretty font-heading text-xl font-bold tracking-tight text-ink sm:text-2xl">{title}</h2>
      <p className="mt-3 flex-1 text-pretty text-sm leading-relaxed text-muted sm:text-base">{description}</p>
      <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-accent transition group-hover:gap-3">
        Entrar
        <span aria-hidden className="transition group-hover:translate-x-0.5">
          →
        </span>
      </span>
    </Link>
  );
}
