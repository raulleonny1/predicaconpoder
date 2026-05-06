export type LeccionSerie = {
  slug: string;
  order: number;
  title: string;
  body: string;
};

export type SerieBiblica = {
  slug: string;
  order: number;
  emoji: string;
  title: string;
  subtitle: string;
  description: string;
  notaParaElMaestro?: string;
  lecciones: LeccionSerie[];
};
