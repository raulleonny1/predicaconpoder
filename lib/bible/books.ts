export type BibleBook = {
  id: number;
  name: string;
  abbrev: string[];
  chapters: number;
  testament: "OT" | "NT";
};

export const BIBLE_BOOKS: BibleBook[] = [
  { id: 1, name: "Génesis", abbrev: ["gen", "gn"], chapters: 50, testament: "OT" },
  { id: 2, name: "Éxodo", abbrev: ["ex", "exo"], chapters: 40, testament: "OT" },
  { id: 3, name: "Levítico", abbrev: ["lev", "lv"], chapters: 27, testament: "OT" },
  { id: 4, name: "Números", abbrev: ["num", "nm"], chapters: 36, testament: "OT" },
  { id: 5, name: "Deuteronomio", abbrev: ["deut", "dt"], chapters: 34, testament: "OT" },
  { id: 6, name: "Josué", abbrev: ["jos"], chapters: 24, testament: "OT" },
  { id: 7, name: "Jueces", abbrev: ["jue", "juec"], chapters: 21, testament: "OT" },
  { id: 8, name: "Rut", abbrev: ["rt"], chapters: 4, testament: "OT" },
  { id: 9, name: "1 Samuel", abbrev: ["1 sam", "1sam"], chapters: 31, testament: "OT" },
  { id: 10, name: "2 Samuel", abbrev: ["2 sam", "2sam"], chapters: 24, testament: "OT" },
  { id: 11, name: "1 Reyes", abbrev: ["1 re", "1rey"], chapters: 22, testament: "OT" },
  { id: 12, name: "2 Reyes", abbrev: ["2 re", "2rey"], chapters: 25, testament: "OT" },
  { id: 13, name: "1 Crónicas", abbrev: ["1 cr", "1cro"], chapters: 29, testament: "OT" },
  { id: 14, name: "2 Crónicas", abbrev: ["2 cr", "2cro"], chapters: 36, testament: "OT" },
  { id: 15, name: "Esdras", abbrev: ["esd"], chapters: 10, testament: "OT" },
  { id: 16, name: "Nehemías", abbrev: ["neh", "ne"], chapters: 13, testament: "OT" },
  { id: 17, name: "Ester", abbrev: ["est"], chapters: 10, testament: "OT" },
  { id: 18, name: "Job", abbrev: ["job"], chapters: 42, testament: "OT" },
  { id: 19, name: "Salmos", abbrev: ["sal", "ps", "salmo"], chapters: 150, testament: "OT" },
  { id: 20, name: "Proverbios", abbrev: ["prov", "pr"], chapters: 31, testament: "OT" },
  { id: 21, name: "Eclesiastés", abbrev: ["ecl", "ec"], chapters: 12, testament: "OT" },
  { id: 22, name: "Cantares", abbrev: ["cnt", "cant"], chapters: 8, testament: "OT" },
  { id: 23, name: "Isaías", abbrev: ["is", "isa"], chapters: 66, testament: "OT" },
  { id: 24, name: "Jeremías", abbrev: ["jer"], chapters: 52, testament: "OT" },
  { id: 25, name: "Lamentaciones", abbrev: ["lam"], chapters: 5, testament: "OT" },
  { id: 26, name: "Ezequiel", abbrev: ["ez", "eze"], chapters: 48, testament: "OT" },
  { id: 27, name: "Daniel", abbrev: ["dan"], chapters: 12, testament: "OT" },
  { id: 28, name: "Oseas", abbrev: ["os"], chapters: 14, testament: "OT" },
  { id: 29, name: "Joel", abbrev: ["jl"], chapters: 3, testament: "OT" },
  { id: 30, name: "Amós", abbrev: ["am"], chapters: 9, testament: "OT" },
  { id: 31, name: "Abdías", abbrev: ["abd"], chapters: 1, testament: "OT" },
  { id: 32, name: "Jonás", abbrev: ["jon"], chapters: 4, testament: "OT" },
  { id: 33, name: "Miqueas", abbrev: ["miq", "mic"], chapters: 7, testament: "OT" },
  { id: 34, name: "Nahum", abbrev: ["nah"], chapters: 3, testament: "OT" },
  { id: 35, name: "Habacuc", abbrev: ["hab"], chapters: 3, testament: "OT" },
  { id: 36, name: "Sofonías", abbrev: ["sof"], chapters: 3, testament: "OT" },
  { id: 37, name: "Hageo", abbrev: ["hag"], chapters: 2, testament: "OT" },
  { id: 38, name: "Zacarías", abbrev: ["zac"], chapters: 14, testament: "OT" },
  { id: 39, name: "Malaquías", abbrev: ["mal"], chapters: 4, testament: "OT" },
  { id: 40, name: "Mateo", abbrev: ["mt", "mat"], chapters: 28, testament: "NT" },
  { id: 41, name: "Marcos", abbrev: ["mr", "mar"], chapters: 16, testament: "NT" },
  { id: 42, name: "Lucas", abbrev: ["lc", "luc"], chapters: 24, testament: "NT" },
  { id: 43, name: "Juan", abbrev: ["jn", "jua"], chapters: 21, testament: "NT" },
  { id: 44, name: "Hechos", abbrev: ["hch", "hech"], chapters: 28, testament: "NT" },
  { id: 45, name: "Romanos", abbrev: ["rom", "ro"], chapters: 16, testament: "NT" },
  { id: 46, name: "1 Corintios", abbrev: ["1 co", "1cor"], chapters: 16, testament: "NT" },
  { id: 47, name: "2 Corintios", abbrev: ["2 co", "2cor"], chapters: 13, testament: "NT" },
  { id: 48, name: "Gálatas", abbrev: ["gal", "ga"], chapters: 6, testament: "NT" },
  { id: 49, name: "Efesios", abbrev: ["ef", "efe"], chapters: 6, testament: "NT" },
  { id: 50, name: "Filipenses", abbrev: ["flp", "fil"], chapters: 4, testament: "NT" },
  { id: 51, name: "Colosenses", abbrev: ["col"], chapters: 4, testament: "NT" },
  { id: 52, name: "1 Tesalonicenses", abbrev: ["1 ts", "1tes"], chapters: 5, testament: "NT" },
  { id: 53, name: "2 Tesalonicenses", abbrev: ["2 ts", "2tes"], chapters: 3, testament: "NT" },
  { id: 54, name: "1 Timoteo", abbrev: ["1 ti", "1tim"], chapters: 6, testament: "NT" },
  { id: 55, name: "2 Timoteo", abbrev: ["2 ti", "2tim"], chapters: 4, testament: "NT" },
  { id: 56, name: "Tito", abbrev: ["tit"], chapters: 3, testament: "NT" },
  { id: 57, name: "Filemón", abbrev: ["flm", "file"], chapters: 1, testament: "NT" },
  { id: 58, name: "Hebreos", abbrev: ["heb"], chapters: 13, testament: "NT" },
  { id: 59, name: "Santiago", abbrev: ["stg", "san"], chapters: 5, testament: "NT" },
  { id: 60, name: "1 Pedro", abbrev: ["1 pe", "1ped"], chapters: 5, testament: "NT" },
  { id: 61, name: "2 Pedro", abbrev: ["2 pe", "2ped"], chapters: 3, testament: "NT" },
  { id: 62, name: "1 Juan", abbrev: ["1 jn", "1jua"], chapters: 5, testament: "NT" },
  { id: 63, name: "2 Juan", abbrev: ["2 jn", "2jua"], chapters: 1, testament: "NT" },
  { id: 64, name: "3 Juan", abbrev: ["3 jn", "3jua"], chapters: 1, testament: "NT" },
  { id: 65, name: "Judas", abbrev: ["jud"], chapters: 1, testament: "NT" },
  { id: 66, name: "Apocalipsis", abbrev: ["ap", "apo", "rev"], chapters: 22, testament: "NT" },
];

export function getBookById(id: number): BibleBook | undefined {
  return BIBLE_BOOKS.find((b) => b.id === id);
}

export function findBookByName(query: string): BibleBook | undefined {
  const q = normalizeBookQuery(query);
  if (!q) return undefined;

  const numbered = q.match(/^(\d)\s*(.+)$/);
  if (numbered) {
    const num = numbered[1];
    const rest = numbered[2];
    const match = BIBLE_BOOKS.find(
      (b) =>
        b.name.toLowerCase().startsWith(`${num} `) &&
        (b.name.toLowerCase().includes(rest) || b.abbrev.some((a) => a === rest || rest.startsWith(a))),
    );
    if (match) return match;
  }

  return BIBLE_BOOKS.find(
    (b) =>
      b.name.toLowerCase() === q ||
      b.name.toLowerCase().startsWith(q) ||
      b.abbrev.some((a) => a === q || q.startsWith(a)),
  );
}

function normalizeBookQuery(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .trim();
}

export function formatReference(bookId: number, chapter: number, verseStart: number, verseEnd?: number): string {
  const book = getBookById(bookId);
  if (!book) return "";
  const verses =
    verseEnd && verseEnd > verseStart ? `${verseStart}-${verseEnd}` : `${verseStart}`;
  return `${book.name} ${chapter}:${verses}`;
}
