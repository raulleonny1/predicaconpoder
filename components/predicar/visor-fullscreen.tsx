"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { StageViewer } from "@/components/predicar/stage-viewer";
import { FloatingWhiteboardToolbar } from "@/components/predicar/floating-whiteboard-toolbar";
import { VisorTimerBadge } from "@/components/predicar/visor-timer-badge";
import { useSermon } from "@/lib/sermon/sermon-context";

function exitVisor(router: ReturnType<typeof useRouter>) {
  if (document.fullscreenElement) {
    void document.exitFullscreen();
  }
  router.push("/predicar");
}

function VisorControls() {
  const router = useRouter();
  const {
    goNext,
    goPrev,
    toggleBlackScreen,
    stageBlocks,
    activeIndex,
    activeStageBlock,
    whiteboardMode,
    annotationTool,
    annotationColor,
    setWhiteboardMode,
    setAnnotationTool,
    setAnnotationColor,
    clearBlockAnnotations,
  } = useSermon();
  const [showGuide, setShowGuide] = useState(true);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("pcp:visor-guide-dismissed");
    if (dismissed) setShowGuide(false);
  }, []);

  /* Bloquear scroll del navegador en iPad mientras se usa el visor */
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const scrollY = window.scrollY;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    const prevHtmlHeight = html.style.height;
    const prevBodyHeight = body.style.height;
    const prevHtmlOverscroll = html.style.overscrollBehavior;
    const prevBodyOverscroll = body.style.overscrollBehavior;
    const prevBodyPosition = body.style.position;
    const prevBodyTop = body.style.top;
    const prevBodyLeft = body.style.left;
    const prevBodyRight = body.style.right;
    const prevBodyWidth = body.style.width;

    html.style.overflow = "hidden";
    html.style.height = "100%";
    html.style.overscrollBehavior = "none";
    body.style.overflow = "hidden";
    body.style.height = "100%";
    body.style.overscrollBehavior = "none";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";

    return () => {
      html.style.overflow = prevHtmlOverflow;
      html.style.height = prevHtmlHeight;
      html.style.overscrollBehavior = prevHtmlOverscroll;
      body.style.overflow = prevBodyOverflow;
      body.style.height = prevBodyHeight;
      body.style.overscrollBehavior = prevBodyOverscroll;
      body.style.position = prevBodyPosition;
      body.style.top = prevBodyTop;
      body.style.left = prevBodyLeft;
      body.style.right = prevBodyRight;
      body.style.width = prevBodyWidth;
      window.scrollTo(0, scrollY);
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        exitVisor(router);
        return;
      }
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "b" || e.key === "B") {
        toggleBlackScreen();
      } else if (e.key === "f" || e.key === "F") {
        if (!document.fullscreenElement) {
          void document.documentElement.requestFullscreen().catch(() => {});
        } else {
          void document.exitFullscreen();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev, toggleBlackScreen, router]);

  const dismissGuide = () => {
    setShowGuide(false);
    sessionStorage.setItem("pcp:visor-guide-dismissed", "1");
  };

  return (
    <div className="fixed inset-0 overflow-hidden overscroll-none bg-void">
      <StageViewer whiteboard />

      {!whiteboardMode ? (
        <div className="fixed inset-0 z-20 flex pointer-events-none">
          <button
            type="button"
            aria-label="Diapositiva anterior"
            onClick={goPrev}
            className="pointer-events-auto h-full w-[18%] max-w-[100px] touch-target"
          />
          <div className="flex-1" aria-hidden />
          <button
            type="button"
            aria-label="Siguiente diapositiva"
            onClick={goNext}
            className="pointer-events-auto h-full w-[18%] max-w-[100px] touch-target"
          />
        </div>
      ) : null}

      <Link
        href="/predicar"
        data-pcp-overlay
        onClick={() => {
          if (document.fullscreenElement) void document.exitFullscreen();
        }}
        className="fixed left-[max(1rem,env(safe-area-inset-left))] top-[max(1rem,env(safe-area-inset-top))] z-50 inline-flex min-h-11 items-center gap-2 rounded-full bg-black/60 px-4 py-2.5 text-sm font-semibold text-white shadow-lg backdrop-blur-md transition hover:bg-black/80"
      >
        ← Volver
      </Link>

      <FloatingWhiteboardToolbar
        bottomReserve={120}
        activeTool={annotationTool}
        activeColor={annotationColor}
        whiteboardMode={whiteboardMode}
        onToolChange={setAnnotationTool}
        onColorChange={setAnnotationColor}
        onToggleMode={() => setWhiteboardMode(!whiteboardMode)}
        onClearSlide={() => {
          if (activeStageBlock) clearBlockAnnotations(activeStageBlock.id);
        }}
      />

      <VisorTimerBadge />

      {showGuide ? (
        <div className="fixed inset-x-[max(1rem,env(safe-area-inset-left))] top-[max(9rem,env(safe-area-inset-top))] z-50 mx-auto max-w-lg rounded-2xl border border-white/15 bg-black/85 p-4 text-white shadow-2xl backdrop-blur-md sm:inset-x-auto">
          <p className="font-heading text-sm font-bold">Pizarra en el visor</p>
          <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-white/80">
            <li>
              <strong className="text-white">Burbuja ✏️</strong>: arrástrala a cualquier borde; tócala para abrir herramientas
              o pulsa <strong className="text-white">−</strong> para minimizar.
            </li>
            <li>
              <strong className="text-white">🖍 Resaltar</strong>: trazo grueso para encerrar o subrayar.
            </li>
            <li>
              <strong className="text-white">✓ Visto</strong>: toca donde quieras poner un check.
            </li>
            <li>
              <strong className="text-white">Mantén ~1 s</strong> el dedo en el{" "}
              <strong className="text-white">borde izquierdo</strong> (anterior) o{" "}
              <strong className="text-white">derecho</strong> (siguiente), sin moverlo.
            </li>
            <li>
              También puedes <strong className="text-white">deslizar</strong> horizontalmente o usar los botones ← →
              abajo.
            </li>
          </ul>
          <button
            type="button"
            onClick={dismissGuide}
            className="mt-4 min-h-12 w-full rounded-xl bg-accent py-2.5 text-sm font-bold text-white hover:brightness-110"
          >
            Entendido
          </button>
        </div>
      ) : null}

      <div
        data-pcp-overlay
        className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 z-50 flex -translate-x-1/2 flex-col items-center gap-2 px-4"
      >
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goPrev}
            disabled={activeIndex <= 0}
            className="flex h-12 min-w-12 items-center justify-center rounded-full bg-black/75 text-lg font-bold text-white shadow-lg backdrop-blur-md disabled:opacity-30"
            aria-label="Anterior"
          >
            ←
          </button>
          <button
            type="button"
            onClick={goNext}
            disabled={activeIndex >= stageBlocks.length - 1}
            className="flex h-12 min-w-12 items-center justify-center rounded-full bg-accent text-lg font-bold text-white shadow-lg backdrop-blur-md disabled:opacity-30"
            aria-label="Siguiente"
          >
            →
          </button>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2 rounded-full bg-black/55 px-4 py-2.5 text-xs text-white/75 backdrop-blur-md">
          <span>
            {activeIndex + 1} / {stageBlocks.length}
          </span>
          <span className="hidden sm:inline">← → · bordes 1 s · deslizar</span>
          <button
            type="button"
            onClick={toggleBlackScreen}
            className="min-h-8 rounded-full bg-white/10 px-3 py-1 font-semibold"
          >
            Negro
          </button>
        </div>
      </div>
    </div>
  );
}

export function VisorFullscreen() {
  return <VisorControls />;
}
