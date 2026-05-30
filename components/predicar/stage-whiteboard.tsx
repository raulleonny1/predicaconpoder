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
  ctx.lineWidth = Math.max(3, size * 0.12);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(x - size * 0.35, y);
  ctx.lineTo(x - size * 0.05, y + size * 0.3);
  ctx.lineTo(x + size * 0.4, y - size * 0.35);
  ctx.stroke();
  ctx.restore();
}

function drawPathOnCanvas(
  ctx: CanvasRenderingContext2D,
  path: DrawPath,
  width: number,
  height: number,
) {
  const hex = getColorHex(path.color);
  if (path.tool === "check" && path.points.length >= 2) {
    drawCheck(ctx, path.points[0] * width, path.points[1] * height, hex, Math.min(width, height) * 0.08);
    return;
  }
  if (path.points.length < 2) return;

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

  ctx.moveTo(path.points[0] * width, path.points[1] * height);
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

type StageCanvasLayerProps = {
  paths: DrawPath[];
  tool: AnnotationTool;
  color: WhiteboardColor;
  enabled: boolean;
  fullscreen?: boolean;
  onAddPath: (path: DrawPath) => void;
  onRemovePaths: (ids: string[]) => void;
};

export function StageCanvasLayer({
  paths,
  tool,
  color,
  enabled,
  fullscreen,
  onAddPath,
  onRemovePaths,
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

  const beginStroke = useCallback(
    (clientX: number, clientY: number) => {
      if (!enabled) return;

      const currentTool = toolRef.current;

      if (currentTool === "check") {
        const { x, y } = norm(clientX, clientY);
        onAddPath({ id: createPathId(), tool: "check", color: colorRef.current, points: [x, y] });
        paint();
        return;
      }

      if (currentTool === "eraser") {
        drawingRef.current = true;
        hitErase(clientX, clientY);
        return;
      }

      drawingRef.current = true;
      liveToolRef.current = currentTool === "highlighter" ? "highlighter" : "pen";
      const { x, y } = norm(clientX, clientY);
      livePointsRef.current = [x, y];
      paint();
    },
    [enabled, hitErase, norm, onAddPath, paint],
  );

  const moveStroke = useCallback(
    (clientX: number, clientY: number) => {
      if (!drawingRef.current) return;

      if (toolRef.current === "eraser") {
        hitErase(clientX, clientY);
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
    [hitErase, norm, paint],
  );

  const endStroke = useCallback(() => {
    if (!drawingRef.current) return;

    if (toolRef.current !== "eraser" && livePointsRef.current.length >= 2) {
      onAddPath({
        id: createPathId(),
        tool: liveToolRef.current,
        color: colorRef.current,
        points: normalizePoints(livePointsRef.current),
      });
    }

    drawingRef.current = false;
    livePointsRef.current = [];
    paint();
  }, [onAddPath, paint]);

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

    const onTouchEnd = () => {
      if (!touchDrawingRef.current) return;
      touchDrawingRef.current = false;
      endStroke();
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
  }, [beginStroke, enabled, endStroke, moveStroke]);

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
    endStroke();
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
