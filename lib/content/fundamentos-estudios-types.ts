export type FundamentosChapterKind = "intro" | "chapter" | "conclusion" | "practica" | "extra";

export type FundamentosChapter = {
  slug: string;
  order: number;
  moduleNumber: number;
  moduleTitle: string;
  kind: FundamentosChapterKind;
  label: string;
  title: string;
  body: string;
};
