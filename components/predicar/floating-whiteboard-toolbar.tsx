"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { WhiteboardToolbar } from "@/components/predicar/stage-whiteboard";
import { getColorHex, type AnnotationTool, type WhiteboardColor } from "@/lib/sermon/stage-annotations";
import { cn } from "@/lib/utils";

const POS_KEY = "pcp:wb-toolbar-pos";
const ANCHOR_KEY = "pcp:wb-toolbar-anchor";
const COLLAPSED_KEY = "pcp:wb-toolbar-collapsed";
const DRAG_THRESHOLD_PX = 8;
const BUBBLE_SIZE = 56;

type NormalizedPos = { x: number; y: number };

type FloatingWhiteboardToolbarProps = {
  activeTool: AnnotationTool;
  activeColor: WhiteboardColor;
  whiteboardMode: boolean;
  onToolChange: (tool: AnnotationTool) => void;
  onColorChange: (color: WhiteboardColor) => void;
  onToggleMode: () => void;
  onClearSlide: () => void;
  /** Espacio inferior reservado (p. ej. botones de diapositiva) */
  bottomReserve?: number;
};

function clampPos(
  x: number,
  y: number,
  panelW: number,
  panelH: number,
  bottomReserve = 80,
): NormalizedPos {
  if (typeof window === "undefined") return { x, y };
  const pad = 12;
  const top = 56;
  const maxX = window.innerWidth - panelW - pad;
  const maxY = window.innerHeight - panelH - bottomReserve;
  return {
    x: Math.min(Math.max(pad, x), Math.max(pad, maxX)),
    y: Math.min(Math.max(top, y), Math.max(top, maxY)),
  };
}

function loadAnchor(bottomReserve: number): NormalizedPos {
  if (typeof window === "undefined") return { x: 16, y: 72 };
  try {
    const raw = sessionStorage.getItem(ANCHOR_KEY) ?? sessionStorage.getItem(POS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as NormalizedPos;
      if (typeof parsed.x === "number" && typeof parsed.y === "number") {
        return clampPos(parsed.x, parsed.y, BUBBLE_SIZE, BUBBLE_SIZE, bottomReserve);
      }
    }
  } catch {
    /* ignore */
  }
  return clampPos(window.innerWidth - BUBBLE_SIZE - 16, 72, BUBBLE_SIZE, BUBBLE_SIZE, bottomReserve);
}

function saveAnchor(anchor: NormalizedPos) {
  try {
    sessionStorage.setItem(ANCHOR_KEY, JSON.stringify(anchor));
    sessionStorage.setItem(POS_KEY, JSON.stringify(anchor));
  } catch {
    /* ignore */
  }
}

function loadCollapsed(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return sessionStorage.getItem(COLLAPSED_KEY) !== "0";
  } catch {
    return true;
  }
}

export function FloatingWhiteboardToolbar({
  bottomReserve = 80,
  ...props
}: FloatingWhiteboardToolbarProps) {
  const { activeTool, activeColor, whiteboardMode } = props;
  const [pos, setPos] = useState<NormalizedPos>({ x: 16, y: 72 });
  const [collapsed, setCollapsed] = useState(true);
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
    moved: boolean;
  } | null>(null);
  const suppressTapRef = useRef(false);
  const bubbleAnchorRef = useRef<NormalizedPos>({ x: 16, y: 72 });

  useEffect(() => {
    const anchor = loadAnchor(bottomReserve);
    bubbleAnchorRef.current = anchor;
    setPos(anchor);
    setCollapsed(loadCollapsed());
    setMounted(true);
  }, [bottomReserve]);

  const persistPos = useCallback((next: NormalizedPos) => {
    setPos(next);
    try {
      sessionStorage.setItem(POS_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, []);

  const persistBubbleAnchor = useCallback(
    (next: NormalizedPos) => {
      bubbleAnchorRef.current = next;
      saveAnchor(next);
      persistPos(next);
    },
    [persistPos],
  );

  const persistCollapsed = useCallback((next: boolean) => {
    setCollapsed(next);
    try {
      sessionStorage.setItem(COLLAPSED_KEY, next ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, []);

  const minimizeToolbar = useCallback(() => {
    const anchor = clampPos(
      bubbleAnchorRef.current.x,
      bubbleAnchorRef.current.y,
      BUBBLE_SIZE,
      BUBBLE_SIZE,
      bottomReserve,
    );
    persistPos(anchor);
    persistCollapsed(true);
  }, [bottomReserve, persistCollapsed, persistPos]);

  const getPanelSize = useCallback(() => {
    const el = panelRef.current;
    if (el) {
      return { w: el.offsetWidth, h: el.offsetHeight };
    }
    return collapsed
      ? { w: BUBBLE_SIZE, h: BUBBLE_SIZE }
      : { w: Math.min(window.innerWidth - 24, 640), h: 160 };
  }, [collapsed]);

  const onDragStart = useCallback(
    (e: ReactPointerEvent, fromHandle: boolean) => {
      e.stopPropagation();
      e.currentTarget.setPointerCapture(e.pointerId);
      dragRef.current = {
        pointerId: e.pointerId,
        startX: e.clientX,
        startY: e.clientY,
        origX: pos.x,
        origY: pos.y,
        moved: fromHandle,
      };
    },
    [pos.x, pos.y],
  );

  const onDragMove = useCallback(
    (e: ReactPointerEvent) => {
      const drag = dragRef.current;
      if (!drag || drag.pointerId !== e.pointerId) return;

      const dx = e.clientX - drag.startX;
      const dy = e.clientY - drag.startY;
      if (!drag.moved && Math.hypot(dx, dy) > DRAG_THRESHOLD_PX) {
        drag.moved = true;
      }
      if (!drag.moved) return;

      e.preventDefault();
      const { w, h } = getPanelSize();
      persistPos(clampPos(drag.origX + dx, drag.origY + dy, w, h, bottomReserve));
    },
    [bottomReserve, getPanelSize, persistPos],
  );

  const onDragEnd = useCallback(
    (e: ReactPointerEvent) => {
      const drag = dragRef.current;
      if (!drag || drag.pointerId !== e.pointerId) return;

      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }

      if (!drag.moved && collapsed) {
        persistCollapsed(false);
      } else if (drag.moved) {
        suppressTapRef.current = true;
        if (collapsed) {
          const anchor = clampPos(
            drag.origX + (e.clientX - drag.startX),
            drag.origY + (e.clientY - drag.startY),
            BUBBLE_SIZE,
            BUBBLE_SIZE,
            bottomReserve,
          );
          persistBubbleAnchor(anchor);
        }
      }

      dragRef.current = null;
    },
    [bottomReserve, collapsed, persistBubbleAnchor, persistCollapsed],
  );

  if (!mounted) return null;

  const colorHex = getColorHex(activeColor);
  const toolIcon =
    activeTool === "highlighter"
      ? "🖍"
      : activeTool === "check"
        ? "✓"
        : activeTool === "eraser"
          ? "🧹"
          : "✏️";

  return (
    <div
      ref={panelRef}
      data-pcp-overlay
      className="fixed z-[60] max-w-[min(calc(100vw-1.5rem),40rem)] select-none transition-[left,top] duration-200 ease-out"
      style={{
        left: pos.x,
        top: pos.y,
      }}
    >
      {collapsed ? (
        <button
          type="button"
          aria-label="Abrir herramientas de pizarra"
          aria-expanded={false}
          className={cn(
            "relative flex h-14 w-14 items-center justify-center rounded-full border-2 shadow-2xl backdrop-blur-md transition touch-none",
            whiteboardMode
              ? "border-accent/80 bg-accent/90 text-white"
              : "border-white/25 bg-black/75 text-white/80",
          )}
          style={{ touchAction: "manipulation" }}
          onClick={() => {
            if (suppressTapRef.current) {
              suppressTapRef.current = false;
              return;
            }
            persistCollapsed(false);
          }}
          onPointerDown={(e) => {
            if (e.pointerType === "touch") e.preventDefault();
            e.stopPropagation();
            onDragStart(e, false);
          }}
          onPointerMove={onDragMove}
          onPointerUp={onDragEnd}
          onPointerCancel={onDragEnd}
        >
          <span className="text-xl" aria-hidden>
            {toolIcon}
          </span>
          {whiteboardMode ? (
            <span
              className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full border-2 border-white/90"
              style={{ backgroundColor: colorHex }}
              aria-hidden
            />
          ) : null}
        </button>
      ) : (
        <div className="w-[min(calc(100vw-1.5rem),40rem)] animate-in fade-in zoom-in-95 duration-200">
          <div
            className="mb-1 flex cursor-grab items-center justify-between gap-2 rounded-full border border-white/15 bg-black/80 px-3 py-1.5 text-xs text-white/70 backdrop-blur-md active:cursor-grabbing touch-none"
            onPointerDown={(e) => {
              if ((e.target as HTMLElement).closest("button")) return;
              onDragStart(e, true);
            }}
            onPointerMove={onDragMove}
            onPointerUp={onDragEnd}
            onPointerCancel={onDragEnd}
          >
            <span className="flex items-center gap-1.5 font-semibold pointer-events-none">
              <span aria-hidden>⠿</span>
              Arrastra para mover
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                minimizeToolbar();
              }}
              onPointerDown={(e) => e.stopPropagation()}
              className="min-h-8 min-w-8 rounded-full bg-white/10 px-3 py-1 font-bold text-white hover:bg-white/20"
              style={{ touchAction: "manipulation" }}
              aria-label="Minimizar pizarra"
            >
              −
            </button>
          </div>
          <div style={{ touchAction: "manipulation" }} onPointerDown={(e) => e.stopPropagation()}>
            <WhiteboardToolbar {...props} />
          </div>
        </div>
      )}
    </div>
  );
}
