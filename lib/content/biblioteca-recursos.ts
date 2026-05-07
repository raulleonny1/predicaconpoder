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
    title: "Ideas prácticas para un seguimiento espiritual",
    description: "El seguimiento eficaz que te ayudará fortalecer a los nuevos conversos..",
    type: "PDF",
    slug: "ideas-practicas-seguimiento-espiritual",
    fileName: "Seguimiento_Espiritual_Nuevos_Creyentes.pdf",
  },
  {
    title: "pdf: fundamentos de la fe cristiana",
    description: "Un recurso descargable con enseñanzas clave para quienes comienzan a estudiar la Biblia.",
    type: "PDF",
    slug: "ebook-fundamentos-de-la-fe",
    fileName: "ebook-fundamentos-de-la-fe.pdf",
  },
  {
    title: "Restauración espiritual",
    description: "Estrategias efectivas para el retorno de los que un día se fueron de la iglesia.",
    type: "PDF",
    slug: "restauracion_espiritual",
    fileName: "Restauracion_espiritual.pdf",
  },
];
