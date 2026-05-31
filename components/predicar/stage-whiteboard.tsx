"use client";

import { useCallback, useEffect, useRef, type PointerEvent as ReactPointerEvent } from "react";
import type {
  AnnotationTool,
  DrawPath,
  WhiteboardColor,
} from "@/lib/sermon/stage-annotations";
import {
  WHITEBOARD_COLORS,
  createPathId,
  getColorHex,
} from "@/lib/sermon/stage-annotations";
import { cn } from "@/lib/utils";

function drawCheck(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: string,
  size: number,
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(2, size * 0.1);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(x - size * 0.35, y);
  ctx.lineTo(x - size * 0.05, y + size * 0.3);
  ctx.lineTo(x + size * 0.4, y - size * 0.35);
  ctx.stroke();
  ctx.restore();
}

function isDotPath(points: number[]): boolean {
  if (points.length < 2) return false;
  const x0 = points[0];
  const y0 = points[1];
  for (let i = 2; i < points.length; i += 2) {
    const px = points[i];
    const py = points[i + 1];
    if (px === undefined || py === undefined) continue;
    if (Math.hypot(px - x0, py - y0) > 0.001) return false;
  }
  return true;
}

function drawDot(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  tool: DrawPath["tool"],
  hex: string,
) {
  const base = Math.min(width, height);
  ctx.beginPath();
  if (tool === "highlighter") {
    ctx.fillStyle = hex + "55";
    ctx.arc(x, y, Math.max(8, base * 0.016), 0, Math.PI * 2);
  } else {
    ctx.fillStyle = hex;
    ctx.arc(x, y, Math.max(4, base * 0.004), 0, Math.PI * 2);
  }
  ctx.fill();
}

function drawPathOnCanvas(
  ctx: CanvasRenderingContext2D,
  path: DrawPath,
  width: number,
  height: number,
) {
  const hex = getColorHex(path.color);
  if (path.tool === "check" && path.points.length >= 2) {
    drawCheck(ctx, path.points[0] * width, path.points[1] * height, hex, Math.min(width, height) * 0.055);
    return;
  }
  if (path.points.length < 2) return;

  const x0 = path.points[0] * width;
  const y0 = path.points[1] * height;

  if (isDotPath(path.points)) {
    drawDot(ctx, x0, y0, width, height, path.tool, hex);
    return;
  }

  ctx.beginPath();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  if (path.tool === "highlighter") {
    ctx.strokeStyle = hex + "55";
    ctx.lineWidth = Math.max(14, Math.min(width, height) * 0.028);
  } else {
    ctx.strokeStyle = hex;
    ctx.lineWidth = Math.max(3, Math.min(width, height) * 0.005);
  }

  ctx.moveTo(x0, y0);
  for (let i = 2; i < path.points.length; i += 2) {
    ctx.lineTo(path.points[i] * width, path.points[i + 1] * height);
  }
  ctx.stroke();
}

function normalizePoints(points: number[]): number[] {
  if (points.length >= 4) return points;
  if (points.length === 2) return [points[0], points[1], points[0], points[1]];
  return points;
}

/** Longitud del trazo en coordenadas normalizadas (0–1) */
function pathStrokeLengthNorm(points: number[]): number {
  let len = 0;
  for (let i = 2; i < points.length; i += 2) {
    const dx = points[i]! - points[i - 2]!;
    const dy = points[i + 1]! - points[i - 1]!;
    len += Math.hypot(dx, dy);
  }
  return len;
}

const HOLD_NAV_MS = 1000;
const HOLD_MOVE_PX = 28;
/** Borde izquierdo/derecho: mantener ~1 s para cambiar diapositiva */
const HOLD_EDGE_RATIO = 0.22;

function getHoldNavZone(clientX: number, rect: DOMRect): "prev" | "next" | null {
  const ratio = (clientX - rect.left) / rect.width;
  if (ratio < HOLD_EDGE_RATIO) return "prev";
  if (ratio > 1 - HOLD_EDGE_RATIO) return "next";
  return null;
}

type StageCanvasLayerProps = {
  paths: DrawPath[];
  tool: AnnotationTool;
  color: WhiteboardColor;
  enabled: boolean;
  fullscreen?: boolean;
  onAddPath: (path: DrawPath) => void;
  onRemovePaths: (ids: string[]) => void;
  onSwipePrev?: () => void;
  onSwipeNext?: () => void;
};

export function StageCanvasLayer({
  paths,
  tool,
  color,
  enabled,
  fullscreen,
  onAddPath,
  onRemovePaths,
  onSwipePrev,
  onSwipeNext,
}: StageCanvasLayerProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
  const livePointsRef = useRef<number[]>([]);
  const liveToolRef = useRef<"pen" | "highlighter">("pen");
  const toolRef = useRef(tool);
  const colorRef = useRef(color);
  const pathsRef = useRef(paths);
  const touchDrawingRef = useRef(false);
  const gestureStartRef = useRef<{ x: number; y: number; t: number } | null>(null);
  const pendingCheckRef = useRef<{ x: number; y: number } | null>(null);
  const swipeRef = useRef({ onSwipePrev, onSwipeNext });
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const holdNavFiredRef = useRef(false);
  const lastClientRef = useRef({ x: 0, y: 0 });
  swipeRef.current = { onSwipePrev, onSwipeNext };
  toolRef.current = tool;
  colorRef.current = color;
  pathsRef.current = paths;

  const norm = useCallback((clientX: number, clientY: number) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect?.width || !rect?.height) return { x: 0, y: 0 };
    return {
      x: Math.min(1, Math.max(0, (clientX - rect.left) / rect.width)),
      y: Math.min(1, Math.max(0, (clientY - rect.top) / rect.height)),
    };
  }, []);

  const paint = useCallback(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const rect = wrap.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, rect.width, rect.height);

    for (const path of pathsRef.current) {
      drawPathOnCanvas(ctx, path, rect.width, rect.height);
    }

    if (livePointsRef.current.length >= 2) {
      drawPathOnCanvas(
        ctx,
        {
          id: "live",
          tool: liveToolRef.current,
          color: colorRef.current,
          points: livePointsRef.current,
        },
        rect.width,
        rect.height,
      );
    }
  }, []);

  useEffect(() => {
    paint();
  }, [paint, paths, color]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const ro = new ResizeObserver(() => paint());
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [paint]);

  const hitErase = useCallback(
    (clientX: number, clientY: number) => {
      const { x, y } = norm(clientX, clientY);
      const threshold = 0.04;
      const hit = pathsRef.current.filter((path) =>
        path.points.some((_, i) => {
          if (i % 2 !== 0) return false;
          const px = path.points[i];
          const py = path.points[i + 1];
          return Math.hypot(px - x, py - y) < threshold;
        }),
      );
      if (hit.length > 0) onRemovePaths(hit.map((p) => p.id));
    },
    [norm, onRemovePaths],
  );

  const cancelStroke = useCallback(() => {
    drawingRef.current = false;
    livePointsRef.current = [];
    pendingCheckRef.current = null;
    paint();
  }, [paint]);

  const clearHoldTimer = useCallback(() => {
    if (holdTimerRef.current !== null) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  }, []);

  const armHoldNav = useCallback(
    (clientX: number, clientY: number) => {
      clearHoldTimer();
      holdNavFiredRef.current = false;

      const { onSwipePrev, onSwipeNext } = swipeRef.current;
      const rect = wrapRef.current?.getBoundingClientRect();
      if (!onSwipePrev || !onSwipeNext || !rect?.width) return;

      const zone = getHoldNavZone(clientX, rect);
      if (!zone) return;

      lastClientRef.current = { x: clientX, y: clientY };

      holdTimerRef.current = setTimeout(() => {
        holdTimerRef.current = null;
        const start = gestureStartRef.current;
        if (!start || holdNavFiredRef.current) return;

        const moved = Math.hypot(
          lastClientRef.current.x - start.x,
          lastClientRef.current.y - start.y,
        );
        if (moved > HOLD_MOVE_PX) return;

        holdNavFiredRef.current = true;
        cancelStroke();
        gestureStartRef.current = null;
        if (zone === "prev") onSwipePrev();
        else onSwipeNext();
      }, HOLD_NAV_MS);
    },
    [cancelStroke, clearHoldTimer],
  );

  const trackHoldMovement = useCallback(
    (clientX: number, clientY: number) => {
      lastClientRef.current = { x: clientX, y: clientY };
      const start = gestureStartRef.current;
      if (!start || holdTimerRef.current === null) return;
      if (Math.hypot(clientX - start.x, clientY - start.y) > HOLD_MOVE_PX) {
        clearHoldTimer();
      }
    },
    [clearHoldTimer],
  );

  const trySwipeNav = useCallback((clientX: number, clientY: number): boolean => {
    const { onSwipePrev, onSwipeNext } = swipeRef.current;
    if (!onSwipePrev || !onSwipeNext) return false;

    const start = gestureStartRef.current;
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!start || !rect?.width) return false;

    const dx = clientX - start.x;
    const dy = clientY - start.y;
    const dt = Date.now() - start.t;
    const minSwipe = Math.max(48, rect.width * 0.08);

    if (dt > 700 || Math.abs(dx) < minSwipe) return false;
    if (Math.abs(dy) > Math.abs(dx) * 0.65) return false;

    const currentTool = toolRef.current;
    const strokeLen = pathStrokeLengthNorm(livePointsRef.current);

    if (currentTool === "pen" || currentTool === "highlighter") {
      if (strokeLen > 0.045 || livePointsRef.current.length > 10) return false;
    }
    if (currentTool === "eraser" && strokeLen > 0.025) return false;

    cancelStroke();
    gestureStartRef.current = null;
    if (dx < 0) onSwipeNext();
    else onSwipePrev();
    return true;
  }, [cancelStroke]);

  const beginStroke = useCallback(
    (clientX: number, clientY: number) => {
      if (!enabled) return;

      gestureStartRef.current = { x: clientX, y: clientY, t: Date.now() };
      lastClientRef.current = { x: clientX, y: clientY };
      armHoldNav(clientX, clientY);

      const currentTool = toolRef.current;

      if (currentTool === "check") {
        const { x, y } = norm(clientX, clientY);
        pendingCheckRef.current = { x, y };
        drawingRef.current = true;
        livePointsRef.current = [x, y];
        return;
      }

      if (currentTool === "eraser") {
        drawingRef.current = true;
        livePointsRef.current = [];
        hitErase(clientX, clientY);
        return;
      }

      drawingRef.current = true;
      liveToolRef.current = currentTool === "highlighter" ? "highlighter" : "pen";
      const { x, y } = norm(clientX, clientY);
      livePointsRef.current = [x, y];
      paint();
    },
    [enabled, armHoldNav, hitErase, norm, paint],
  );

  const moveStroke = useCallback(
    (clientX: number, clientY: number) => {
      trackHoldMovement(clientX, clientY);
      if (!drawingRef.current) return;

      if (toolRef.current === "eraser") {
        hitErase(clientX, clientY);
        const { x, y } = norm(clientX, clientY);
        livePointsRef.current = [...livePointsRef.current, x, y];
        return;
      }

      if (toolRef.current === "check") {
        const { x, y } = norm(clientX, clientY);
        livePointsRef.current = [...livePointsRef.current, x, y];
        return;
      }

      const { x, y } = norm(clientX, clientY);
      const pts = livePointsRef.current;
      const lastX = pts[pts.length - 2];
      const lastY = pts[pts.length - 1];
      if (lastX !== undefined && Math.hypot(x - lastX, y - lastY) < 0.002) return;
      livePointsRef.current = [...pts, x, y];
      paint();
    },
    [hitErase, norm, paint, trackHoldMovement],
  );

  const commitStroke = useCallback(() => {
    if (!drawingRef.current) return;

    if (toolRef.current === "check" && pendingCheckRef.current) {
      const { x, y } = pendingCheckRef.current;
      onAddPath({ id: createPathId(), tool: "check", color: colorRef.current, points: [x, y] });
      cancelStroke();
      return;
    }

    if (toolRef.current === "eraser") {
      cancelStroke();
      return;
    }

    if (livePointsRef.current.length >= 2) {
      onAddPath({
        id: createPathId(),
        tool: liveToolRef.current,
        color: colorRef.current,
        points: normalizePoints(livePointsRef.current),
      });
    }

    cancelStroke();
  }, [cancelStroke, onAddPath]);

  const finishInteraction = useCallback(
    (clientX: number, clientY: number) => {
      clearHoldTimer();

      if (holdNavFiredRef.current) {
        holdNavFiredRef.current = false;
        gestureStartRef.current = null;
        cancelStroke();
        return;
      }

      if (!drawingRef.current && !pendingCheckRef.current) return;

      if (trySwipeNav(clientX, clientY)) return;

      commitStroke();
      gestureStartRef.current = null;
    },
    [clearHoldTimer, cancelStroke, commitStroke, trySwipeNav],
  );

  useEffect(() => () => clearHoldTimer(), [clearHoldTimer]);

  /* iPad/iOS: touch nativo + bloquear scroll/bounce mientras se dibuja */
  useEffect(() => {
    const el = wrapRef.current;
    if (!el || !enabled) return;

    const stopScroll = (e: TouchEvent) => {
      if (e.touches.length > 1) return;
      e.preventDefault();
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      e.preventDefault();
      touchDrawingRef.current = true;
      const touch = e.touches[0];
      beginStroke(touch.clientX, touch.clientY);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!touchDrawingRef.current || e.touches.length !== 1) return;
      e.preventDefault();
      const touch = e.touches[0];
      moveStroke(touch.clientX, touch.clientY);
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (!touchDrawingRef.current) return;
      touchDrawingRef.current = false;
      const touch = e.changedTouches[0];
      if (touch) finishInteraction(touch.clientX, touch.clientY);
    };

    el.addEventListener("touchstart", onTouchStart, { passive: false });
    el.addEventListener("touchmove", stopScroll, { passive: false });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd);
    el.addEventListener("touchcancel", onTouchEnd);

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", stopScroll);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [beginStroke, enabled, finishInteraction, moveStroke]);

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!enabled || e.pointerType === "touch") return;
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    beginStroke(e.clientX, e.clientY);
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!drawingRef.current || e.pointerType === "touch") return;
    e.preventDefault();
    e.stopPropagation();
    moveStroke(e.clientX, e.clientY);
  };

  const onPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch") return;
    e.preventDefault();
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    finishInteraction(e.clientX, e.clientY);
  };

  return (
    <div
      ref={wrapRef}
      className={cn(
        "z-30 touch-none select-none",
        fullscreen ? "fixed inset-0" : "absolute inset-0",
        enabled && tool === "pen" && "cursor-crosshair",
        enabled && tool === "highlighter" && "cursor-cell",
        enabled && tool === "check" && "cursor-pointer",
        enabled && tool === "eraser" && "cursor-grab",
        !enabled && "pointer-events-none",
      )}
      style={{
        touchAction: "none",
        WebkitUserSelect: "none",
        WebkitTouchCallout: "none",
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden />
    </div>
  );
}

type WhiteboardToolbarProps = {
  activeTool: AnnotationTool;
  activeColor: WhiteboardColor;
  whiteboardMode: boolean;
  onToolChange: (tool: AnnotationTool) => void;
  onColorChange: (color: WhiteboardColor) => void;
  onToggleMode: () => void;
  onClearSlide: () => void;
  compact?: boolean;
};

export function WhiteboardToolbar({
  activeTool,
  activeColor,
  whiteboardMode,
  onToolChange,
  onColorChange,
  onToggleMode,
  onClearSlide,
  compact,
}: WhiteboardToolbarProps) {
  const tools: { id: AnnotationTool; label: string }[] = [
    { id: "pen", label: "✏️ Lápiz" },
    { id: "highlighter", label: "🖍 Resaltar" },
    { id: "check", label: "✓ Visto" },
    { id: "eraser", label: "🧹 Borrar" },
  ];

  return (
    <div
      className={cn(
        "rounded-2xl border border-white/15 bg-black/75 p-2 backdrop-blur-md",
        compact ? "text-xs" : "text-sm",
      )}
      style={{ touchAction: "manipulation" }}
    >
      <div className="flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          onClick={onToggleMode}
          className={cn(
            "min-h-10 rounded-xl px-3 font-bold transition",
            whiteboardMode ? "bg-accent text-white" : "bg-white/10 text-white/70",
          )}
        >
          Pizarra {whiteboardMode ? "ON" : "OFF"}
        </button>
        {whiteboardMode ? (
          <>
            {tools.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => onToolChange(t.id)}
                className={cn(
                  "min-h-10 rounded-xl px-2.5 font-semibold transition sm:px-3",
                  activeTool === t.id ? "bg-white text-void" : "bg-white/10 text-white/80",
                )}
              >
                {t.label}
              </button>
            ))}
            <button
              type="button"
              onClick={onClearSlide}
              className="min-h-10 rounded-xl bg-white/10 px-3 font-semibold text-white/60 hover:bg-red-500/20 hover:text-red-200"
            >
              Limpiar
            </button>
          </>
        ) : null}
      </div>
      {whiteboardMode && activeTool !== "eraser" ? (
        <div className="mt-2 flex flex-wrap items-center gap-2 px-1">
          <span className="text-xs text-white/45">Color</span>
          {WHITEBOARD_COLORS.map((c) => (
            <button
              key={c.id}
              type="button"
              title={c.label}
              onClick={() => onColorChange(c.id)}
              className={cn(
                "h-8 w-8 rounded-full border-2 transition",
                activeColor === c.id ? "border-white scale-110" : "border-white/25",
              )}
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
