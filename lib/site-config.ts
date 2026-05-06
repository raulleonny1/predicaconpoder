const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://predicaconpoder.vercel.app";

export const siteConfig = {
  name: "Predicar con Poder",
  tagline: "Formación cristiana y devocional para la vida diaria",
  description:
    "Plataforma cristiana con devocionales, estudios bíblicos gratuitos, reflexiones y recursos digitales para crecer en la fe.",
  url: siteUrl,
  locale: "es_ES",
  links: {
    email: "contacto@predicaconpoder.com",
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
