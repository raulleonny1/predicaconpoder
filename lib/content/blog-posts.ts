export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  categories: string[];
  body: string;
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "reflexion-sobre-fe-y-confianza",
    title: "Reflexión sobre fe y confianza",
    excerpt: "Practicar la fe no significa ausencia de dudas, sino elegir confiar en Dios aunque no tengamos todas las respuestas.",
    publishedAt: "2026-05-01",
    categories: ["Fe", "Confianza"],
    body: `
### Fe y confianza

La fe auténtica no lo es todo lo que sentimos; es también todo lo que elegimos hacer aún cuando no entendemos completamente.

- La confianza crece con la práctica.
- La duda puede ser invitación, no escudo.
- El cristiano camina con Dios en la vida cotidiana.

**Toma una decisión sencilla hoy:** ora por alguien con quien aún no has compartido tu fe.
    `.trim(),
  },
  {
    slug: "como-estudiar-la-biblia-con-claridad",
    title: "Cómo estudiar la Biblia con claridad",
    excerpt: "Un método simple de lectura bíblica ayuda a evitar la confusión y hace que cada texto cobre sentido en la vida diaria.",
    publishedAt: "2026-04-18",
    categories: ["Biblia", "Estudio"],
    body: `
### Método práctico

1. Ora antes de leer.
2. Lee el pasaje completo.
3. Pregunta qué dice, qué significa y qué hago.

Esto te ayuda a transformar un texto en una decisión real.
    `.trim(),
  },
  {
    slug: "recurso-para-compartir-la-esperanza",
    title: "Recurso para compartir la esperanza",
    excerpt: "Una guía breve para hablar sobre el amor de Dios con personas que no conocen la Biblia.",
    publishedAt: "2026-04-05",
    categories: ["Evangelismo", "Recursos"],
    body: `
### Compartir la esperanza

- Escucha primero.
- No impongas palabras.
- Invita a una conversación sincera.

Un buen recurso es usar un texto sencillo y una pregunta abierta.
    `.trim(),
  },
];
