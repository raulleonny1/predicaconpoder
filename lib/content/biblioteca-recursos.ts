export type BibliotecaRecurso = {
  title: string;
  description: string;
  type: "PDF" | "Guía" | "Ebook" | "Hoja";
  slug: string;
  fileName: string;
};

export const BIBLIOTECA_RECURSOS: BibliotecaRecurso[] = [
  {
    title: "Guía rápida para estudios bíblicos personales",
    description: "Un PDF diseñado para ayudarte a preparar reuniones breves y efectivas con amigos o familiares.",
    type: "PDF",
    slug: "guia-rapida-para-estudios-biblicos-personales",
    fileName: "guia-rapida-para-estudios-biblicos-personales.pdf",
  },
  {
    title: "Plantilla de seguimiento espiritual",
    description: "Hoja de trabajo para llevar notas, oraciones y decisiones tras cada sesión de estudio.",
    type: "Hoja",
    slug: "plantilla-seguimiento-espiritual",
    fileName: "plantilla-seguimiento-espiritual.pdf",
  },
  {
    title: "Ebook: fundamentos de la fe cristiana",
    description: "Un recurso descargable con enseñanzas clave para quienes comienzan a estudiar la Biblia.",
    type: "Ebook",
    slug: "ebook-fundamentos-de-la-fe",
    fileName: "ebook-fundamentos-de-la-fe.pdf",
  },
];
