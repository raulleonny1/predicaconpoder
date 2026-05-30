"use client";

import { useEffect } from "react";
import { StageViewer } from "@/components/predicar/stage-viewer";
import { useSermon } from "@/lib/sermon/sermon-context";

function VisorControls() {
  const { goNext, goPrev, toggleBlackScreen, stageBlocks, activeIndex } = useSermon();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
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
          void document.documentElement.requestFullscreen();
        } else {
          void document.exitFullscreen();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev, toggleBlackScreen]);

  useEffect(() => {
    const tryFullscreen = () => {
      if (!document.fullscreenElement) {
        void document.documentElement.requestFullscreen().catch(() => {});
      }
    };
    const t = setTimeout(tryFullscreen, 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <StageViewer />
      <div className="pointer-events-none fixed bottom-0 left-0 right-0 flex justify-center pb-4 opacity-0 transition-opacity hover:opacity-100 focus-within:opacity-100">
        <div className="pointer-events-auto flex items-center gap-3 rounded-full bg-black/60 px-4 py-2 text-xs text-white/70 backdrop-blur-md">
          <span>
            {activeIndex + 1} / {stageBlocks.length}
          </span>
          <span>← → navegar</span>
          <span>B negro</span>
          <span>F pantalla completa</span>
        </div>
      </div>
    </>
  );
}

export function VisorFullscreen() {
  return <VisorControls />;
}
