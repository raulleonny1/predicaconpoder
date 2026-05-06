import Link from "next/link";

type Crumb = { href: string; label: string };

type EstudiosBreadcrumbProps = {
  items: Crumb[];
};

export function EstudiosBreadcrumb({ items }: EstudiosBreadcrumbProps) {
  return (
    <nav aria-label="Migas de pan" className="text-sm text-muted">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, i) => (
          <li key={item.href} className="flex items-center gap-1.5">
            {i > 0 ? <span className="text-border-subtle" aria-hidden>/</span> : null}
            {i === items.length - 1 ? (
              <span className="font-medium text-ink">{item.label}</span>
            ) : (
              <Link href={item.href} className="font-medium text-accent transition hover:text-accent-hover">
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
