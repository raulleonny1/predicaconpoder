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
  if (path.points.length < 4) return;

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

type StageCanvasLayerProps = {
  paths: DrawPath[];
  tool: AnnotationTool;
  color: WhiteboardColor;
  enabled: boolean;
  onAddPath: (path: DrawPath) => void;
  onRemovePaths: (ids: string[]) => void;
};

export function StageCanvasLayer({
  paths,
  tool,
  color,
  enabled,
  onAddPath,
  onRemovePaths,
}: StageCanvasLayerProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
  const livePointsRef = useRef<number[]>([]);
  const liveToolRef = useRef<"pen" | "highlighter">("pen");

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
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, rect.width, rect.height);

    for (const path of paths) {
      drawPathOnCanvas(ctx, path, rect.width, rect.height);
    }

    if (livePointsRef.current.length >= 4) {
      drawPathOnCanvas(
        ctx,
        {
          id: "live",
          tool: liveToolRef.current,
          color,
          points: livePointsRef.current,
        },
        rect.width,
        rect.height,
      );
    }
  }, [paths, color]);

  useEffect(() => {
    paint();
  }, [paint]);

  useEffect(() => {
    const ro = new ResizeObserver(() => paint());
    if (wrapRef.current) ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, [paint]);

  const hitErase = useCallback(
    (clientX: number, clientY: number) => {
      const { x, y } = norm(clientX, clientY);
      const threshold = 0.04;
      const hit = paths.filter((path) =>
        path.points.some((_, i) => {
          if (i % 2 !== 0) return false;
          const px = path.points[i];
          const py = path.points[i + 1];
          return Math.hypot(px - x, py - y) < threshold;
        }),
      );
      if (hit.length > 0) onRemovePaths(hit.map((p) => p.id));
    },
    [norm, onRemovePaths, paths],
  );

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!enabled) return;
    e.preventDefault();
    e.stopPropagation();

    if (tool === "check") {
      const { x, y } = norm(e.clientX, e.clientY);
      onAddPath({ id: createPathId(), tool: "check", color, points: [x, y] });
      return;
    }

    if (tool === "eraser") {
      e.currentTarget.setPointerCapture(e.pointerId);
      drawingRef.current = true;
      hitErase(e.clientX, e.clientY);
      return;
    }

    e.currentTarget.setPointerCapture(e.pointerId);
    drawingRef.current = true;
    liveToolRef.current = tool === "highlighter" ? "highlighter" : "pen";
    const { x, y } = norm(e.clientX, e.clientY);
    livePointsRef.current = [x, y];
    paint();
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!drawingRef.current) return;
    if (tool === "eraser") {
      hitErase(e.clientX, e.clientY);
      return;
    }
    const { x, y } = norm(e.clientX, e.clientY);
    livePointsRef.current = [...livePointsRef.current, x, y];
    paint();
  };

  const onPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!drawingRef.current) return;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    if (tool !== "eraser" && livePointsRef.current.length >= 4) {
      onAddPath({
        id: createPathId(),
        tool: liveToolRef.current,
        color,
        points: livePointsRef.current,
      });
    }
    drawingRef.current = false;
    livePointsRef.current = [];
    paint();
  };

  return (
    <div
      ref={wrapRef}
      className={cn(
        "absolute inset-0 z-10 touch-none",
        enabled && tool === "pen" && "cursor-crosshair",
        enabled && tool === "highlighter" && "cursor-cell",
        enabled && tool === "check" && "cursor-pointer",
        enabled && tool === "eraser" && "cursor-grab",
        !enabled && "pointer-events-none",
      )}
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
