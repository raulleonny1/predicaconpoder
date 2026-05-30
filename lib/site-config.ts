const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://predicaconpoder.vercel.app";

export const siteConfig = {
  name: "Predica con Poder",
  tagline: "Formando líderes, equipando iglesias",
  description:
    "Herramienta para predicar con visor de pantalla grande, Biblia integrada y estudios bíblicos gratuitos para equipar a la iglesia.",
  url: siteUrl,
  locale: "es_ES",
  links: {
    email: "contacto@predicaconpoder.com",
  },
  socials: {
    tiktokUsername: "raull.leonj",
    tiktokVideoIds: [] as string[], // IDs o URLs de tus últimos TikToks
    tiktokPosts: [] as { id: string; caption?: string; publishedAt?: string }[],
  },
  nav: [
    { href: "/", label: "Inicio" },
    { href: "/predicar", label: "Predicar" },
    { href: "/estudios", label: "Estudios bíblicos" },
    { href: "/blog", label: "Blog" },
    { href: "/biblioteca", label: "Biblioteca" },
    { href: "/contacto", label: "Contacto" },
  ] as const,
  donatePath: "/donar" as const,
} as const;
