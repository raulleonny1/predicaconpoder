export type WhiteboardColor = "yellow" | "green" | "pink" | "white" | "orange";

export type AnnotationTool = "pen" | "highlighter" | "check" | "eraser";

export type DrawPath = {
  id: string;
  tool: "pen" | "highlighter" | "check";
  color: WhiteboardColor;
  /** Puntos normalizados [x, y, x, y, …] entre 0 y 1 */
  points: number[];
};

export type SlideAnnotations = {
  paths: DrawPath[];
};

export type StageAnnotationsState = {
  sermonId: string;
  byBlockId: Record<string, SlideAnnotations>;
  whiteboardMode: boolean;
  activeTool: AnnotationTool;
  activeColor: WhiteboardColor;
};

export const WHITEBOARD_COLORS: { id: WhiteboardColor; hex: string; label: string }[] = [
  { id: "yellow", hex: "#fbbf24", label: "Amarillo" },
  { id: "green", hex: "#34d399", label: "Verde" },
  { id: "pink", hex: "#f472b6", label: "Rosa" },
  { id: "white", hex: "#ffffff", label: "Blanco" },
  { id: "orange", hex: "#fb923c", label: "Naranja" },
];

export function createEmptySlideAnnotations(): SlideAnnotations {
  return { paths: [] };
}

export function createDefaultAnnotationsState(sermonId: string): StageAnnotationsState {
  return {
    sermonId,
    byBlockId: {},
    whiteboardMode: true,
    activeTool: "pen",
    activeColor: "yellow",
  };
}

export function createPathId(): string {
  return `path_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export function normalizeSlideAnnotations(raw: unknown): SlideAnnotations {
  if (raw && typeof raw === "object" && "paths" in raw) {
    const paths = (raw as SlideAnnotations).paths;
    if (Array.isArray(paths)) return { paths };
  }
  return createEmptySlideAnnotations();
}

export function getColorHex(color: WhiteboardColor): string {
  return WHITEBOARD_COLORS.find((c) => c.id === color)?.hex ?? "#fbbf24";
}
