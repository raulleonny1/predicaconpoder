const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://predicaconpoder.vercel.app";

export const siteConfig = {
  name: "Predica con Poder",
  tagline: "Formando líderes, equipando iglesias",
  description:
    "Plataforma cristiana con devocionales, estudios bíblicos gratuitos, reflexiones y recursos digitales para crecer en la fe.",
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
    { href: "/estudios", label: "Estudios bíblicos" },
    { href: "/blog", label: "Blog" },
    { href: "/biblioteca", label: "Biblioteca" },
    { href: "/contacto", label: "Contacto" },
  ] as const,
  donatePath: "/donar" as const,
} as const;
