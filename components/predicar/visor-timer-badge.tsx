"use client";

import { useSermon } from "@/lib/sermon/sermon-context";
import { cn } from "@/lib/utils";

function formatMs(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function VisorTimerBadge() {
  const { timer, timerDisplayMs } = useSermon();

  const targetMs = timer.targetMinutes ? timer.targetMinutes * 60 * 1000 : null;
  const overTarget = targetMs ? timerDisplayMs > targetMs : false;

  return (
    <div
      className={cn(
        "fixed right-[max(1rem,env(safe-area-inset-right))] top-[max(1rem,env(safe-area-inset-top))] z-50 rounded-full px-4 py-2 font-heading text-sm font-bold tabular-nums backdrop-blur-md",
        timer.running ? "bg-accent/80 text-white" : "bg-black/55 text-white/80",
        overTarget && "bg-amber-500/90 text-white",
      )}
      title="Cronómetro (contrólalo en la consola de predicar)"
    >
      {formatMs(timerDisplayMs)}
      {timer.targetMinutes ? (
        <span className="ml-2 text-xs font-semibold opacity-80">/ {timer.targetMinutes}m</span>
      ) : null}
    </div>
  );
}
